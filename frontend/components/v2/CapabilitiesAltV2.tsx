"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { getLenis } from "../../lib/v2/useLenis";
import "./capabilities-alt.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, Observer);
}

interface Pillar {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  tag?: string;
}

interface CapabilitiesAltV2Props {
  data?: { pillars: Record<string, Pillar> };
}

/** Static art per pillar, by position: the static content uses semantic keys
 *  (digital, identity…) while the CMS uses service_1..N, so a name-keyed map
 *  matches neither reliably. Order follows the pillars' own id sort.
 *
 *  Each slab is a two-layer background — the capability's own photograph on top
 *  of a brand gradient. A background layer that 404s simply doesn't paint, so
 *  the gradient shows only while a file is missing. */
const PILLAR_ART = [
  { src: "/images/capabilities/capability-1.png", fallback: "linear-gradient(125deg,#501EBD 0%,#100A1E 100%)" },
  { src: "/images/capabilities/capability-2.png", fallback: "linear-gradient(125deg,#9A78F5 0%,#2B1B4D 100%)" },
  { src: "/images/capabilities/capability-3.png", fallback: "linear-gradient(125deg,#3A1590 0%,#0E0E0E 100%)" },
  { src: "/images/capabilities/capability-4.png", fallback: "linear-gradient(125deg,#6B4BD8 0%,#140F26 100%)" },
  { src: "/images/capabilities/capability-5.png", fallback: "linear-gradient(125deg,#2B1B4D 0%,#501EBD 100%)" },
];

/** Split a title across two lines the way the source's markup does — its
 *  content titles are always two stacked spans, offset from each other. */
function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title, ""];
  let best = 1;
  let bestDelta = Infinity;
  for (let i = 1; i < words.length; i++) {
    const delta = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

const ArrowSVG = () => (
  <svg width="100" height="267" viewBox="0 0 100 267" fill="none" aria-hidden="true">
    <path d="M49.894 2.766v262.979" strokeLinecap="square" />
    <path fill="none" d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596" />
  </svg>
);

/**
 * Capabilities, alternate treatment — Codrops' Content Layout Transition,
 * ported as-is with the pillars in place of the photo series.
 *
 * The stack of thin slabs unfolds into 50vh plates on the right while the
 * pillar's copy masks in on the left and the section title masks out. See
 * capabilities-alt.css for the two deliberate departures from the source.
 */
export default function CapabilitiesAltV2({ data }: CapabilitiesAltV2Props) {
  const pillars = Object.entries(data?.pillars || {})
    .filter(([, p]) => p && (p.title || p.label))
    .sort(([, a], [, b]) => {
      const na = parseInt(a.id || "", 10);
      const nb = parseInt(b.id || "", 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return (a.id || "").localeCompare(b.id || "");
    });

  const [current, setCurrent] = useState(-1);
  const busy = useRef(false);
  const openRef = useRef(false);

  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const observer = useRef<Observer | null>(null);

  const total = pillars.length;

  /** Offset that puts item `i` on the viewport's centre line. */
  const centreY = useCallback((i: number) => {
    const el = itemRefs.current[i];
    if (!el) return 0;
    return window.innerHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
  }, []);

  const texts = useCallback(
    (i: number) => contentRefs.current[i]?.querySelectorAll<HTMLElement>(".oh__inner") ?? [],
    []
  );
  const titleTexts = useCallback(
    () => titleRef.current?.querySelectorAll<HTMLElement>(".oh > .oh__inner") ?? [],
    []
  );

  const close = useCallback(() => {
    const root = rootRef.current;
    const stack = stackRef.current;
    if (!root || !stack || busy.current || !openRef.current) return;
    busy.current = true;
    observer.current?.disable();

    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    const state = Flip.getState(items, { props: "opacity" });

    root.classList.remove("capalt--open");
    gsap.set(stack, { y: 0 });

    getLenis()?.start();

    Flip.from(state, {
      duration: 1,
      ease: "expo",
      absoluteOnLeave: true,
      onComplete: () => {
        // The height lock can only come off once the stack is back in flow,
        // or the section would collapse mid-animation.
        root.style.minHeight = "";
        openRef.current = false;
        busy.current = false;
        setCurrent(-1);
      },
    })
      .to(backdropRef.current, { duration: 1, ease: "expo", opacity: 0 }, 0)
      .to(titleTexts(), { duration: 0.9, ease: "expo", startAt: { yPercent: 101 }, yPercent: 0 }, 0)
      .to(texts(current), { duration: 1, ease: "expo", yPercent: -101 }, 0)
      .to(backRef.current, { duration: 1, ease: "expo", opacity: 0 }, 0)
      .to(
        [prevRef.current, nextRef.current],
        { duration: 1, ease: "expo", y: (pos: number) => (pos ? 100 : -100), opacity: 0 },
        0
      );
  }, [current, texts, titleTexts]);

  const open = useCallback(
    (index: number) => {
      const root = rootRef.current;
      const stack = stackRef.current;
      if (!root || !stack || busy.current || openRef.current) return;
      busy.current = true;

      // The stack is what gives this section its height; going fixed takes it
      // out of flow and the section would collapse from ~1050px to nothing,
      // yanking the rest of the page upward behind the overlay. Lock the height
      // before the class flip.
      root.style.minHeight = `${root.offsetHeight}px`;

      const items = itemRefs.current.filter(Boolean) as HTMLElement[];
      const state = Flip.getState(items, { props: "opacity" });

      setCurrent(index);
      root.classList.add("capalt--open");
      gsap.set(stack, { y: centreY(index) });

      // Lenis keeps easing window.scrollY behind a fixed overlay, so it has to
      // be stopped outright rather than merely ignored.
      getLenis()?.stop();

      Flip.from(state, {
        duration: 1,
        ease: "expo",
        absoluteOnLeave: true,
        onComplete: () => {
          openRef.current = true;
          busy.current = false;
          observer.current?.enable();
        },
      })
        .to(backdropRef.current, { duration: 1, ease: "expo", startAt: { opacity: 0 }, opacity: 1 }, 0)
        .to(titleTexts(), { duration: 0.9, ease: "expo", yPercent: -101 }, 0)
        .to(texts(index), { duration: 1, ease: "expo", startAt: { yPercent: 101 }, yPercent: 0 }, 0)
        .to(backRef.current, { duration: 1, ease: "expo", startAt: { opacity: 0 }, opacity: 1 }, 0)
        .to(
          [prevRef.current, nextRef.current],
          {
            duration: 1,
            ease: "expo",
            startAt: { opacity: 0, y: (pos: number) => (pos ? -150 : 150) },
            y: 0,
            opacity: (pos: number) =>
              (index === 0 && !pos) || (index === total - 1 && pos) ? 0 : 1,
          },
          0
        );
    },
    [centreY, texts, titleTexts, total]
  );

  const navigate = useCallback(
    (dir: number) => {
      const stack = stackRef.current;
      if (!stack || busy.current || !openRef.current) return;
      const next = current + dir;
      if (next < 0 || next > total - 1) return;
      busy.current = true;

      const outgoing = current;
      setCurrent(next);

      gsap.set(prevRef.current, { opacity: next > 0 ? 1 : 0 });
      gsap.set(nextRef.current, { opacity: next < total - 1 ? 1 : 0 });

      gsap
        .timeline({ onComplete: () => { busy.current = false; } })
        .to(stack, { duration: 1, ease: "expo", y: centreY(next) }, 0)
        .to(texts(outgoing), { duration: 0.2, ease: "power1", yPercent: dir > 0 ? 101 : -101 }, 0)
        .to(
          texts(next),
          { duration: 0.9, ease: "expo", startAt: { yPercent: dir > 0 ? -101 : 101 }, yPercent: 0 },
          0.2
        );
    },
    [current, total, centreY, texts]
  );

  // Any scroll gesture closes the slideshow, as in the source — but WITHOUT
  // its "pointer" type. Combined with preventDefault, observing pointer events
  // cancels pointerdown, and with it the click event, which left every control
  // in the overlay — Back included — completely dead.
  useEffect(() => {
    const obs = Observer.create({
      type: "wheel,touch",
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onDown: () => close(),
      onUp: () => close(),
    });
    obs.disable();
    observer.current = obs;
    return () => obs.kill();
  }, [close]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!openRef.current) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, navigate]);

  // Unmounting mid-slideshow must not strand Lenis in a stopped state.
  useEffect(() => () => { getLenis()?.start(); }, []);

  if (!total) return null;

  return (
    <section
      id="capabilities-alt"
      ref={rootRef}
      className="capalt"
      data-screen-label="Capabilities (alt)"
      data-nav-tone="dark"
    >
      {/* Clicking off is the escape hatch people reach for first, ahead of the
          Back control or a scroll. */}
      <div ref={backdropRef} className="capalt__backdrop" onClick={close} />

      <div className="capalt__content">
        {pillars.map(([key, pillar], i) => {
          const [lineA, lineB] = splitTitle(pillar.title || "");
          return (
            <div
              key={key}
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className={`capalt__citem${current === i ? " capalt__citem--current" : ""}`}
            >
              <h3 className="capalt__citem-title">
                <span className="oh">
                  <span className="oh__inner">{lineA}</span>
                </span>
                {lineB && (
                  <span className="oh">
                    <span className="oh__inner">{lineB}</span>
                  </span>
                )}
              </h3>
              <div className="capalt__citem-desc">
                <p className="oh">
                  <strong className="oh__inner">
                    {pillar.label || `${String(i + 1).padStart(2, "0")} — Capability`}
                  </strong>
                </p>
                <p className="oh">
                  <span className="oh__inner">{pillar.description}</span>
                </p>
                {pillar.tag && (
                  <p className="oh">
                    <span className="oh__inner">{pillar.tag}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <button ref={backRef} className="capalt__back" onClick={close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M11.49 20.56a.75.75 0 0 1-1.05-.06l-7-8a.75.75 0 0 1 0-1l7-8a.75.75 0 1 1 1.11 1l-5.9 6.75H20a.75.75 0 0 1 0 1.5H5.65l5.9 6.76a.75.75 0 0 1-.06 1.05Z" />
          </svg>
          <span className="oh__inner">Back</span>
        </button>

        <nav className="capalt__nav-wrap">
          <button ref={prevRef} className="capalt__nav capalt__nav--prev" onClick={() => navigate(-1)} aria-label="Previous capability">
            <ArrowSVG />
          </button>
          <button ref={nextRef} className="capalt__nav capalt__nav--next" onClick={() => navigate(1)} aria-label="Next capability">
            <ArrowSVG />
          </button>
        </nav>
      </div>

      <div ref={titleRef} className="capalt__titlewrap">
        <div className="capalt__titlepane">
          <div className="capalt__title">
            <h2 className="capalt__title-main oh">
              <span className="oh__inner">Capabilities</span>
            </h2>
            <span className="capalt__title-sub oh">
              <span className="oh__inner">01 &mdash; {String(total).padStart(2, "0")}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="capalt__stackwrap">
        <div ref={stackRef} className="capalt__stack">
          <div className="capalt__item capalt__item--empty" />
          {pillars.map(([key, pillar], i) => (
            <button
              key={key}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`capalt__item${current === i ? " capalt__item--current" : ""}`}
              style={(() => {
                const art = PILLAR_ART[i % PILLAR_ART.length];
                return { backgroundImage: `url(${art.src}), ${art.fallback}` };
              })()}
              onClick={() => open(i)}
              aria-label={`Open ${pillar.title || pillar.label}`}
            />
          ))}
          <div className="capalt__item capalt__item--empty" />
        </div>
      </div>
    </section>
  );
}
