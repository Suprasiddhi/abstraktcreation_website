"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { BRAND_LIGHT, INK, displayFont } from "./tokens";

interface ProjectData {
  id?: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  image?: string;
}

interface WorksV2Props {
  data?: { projects: ProjectData[] };
}

const AUTOPLAY_MS = 5200;
const TRANSITION_S = 0.95;
const CARD_GAP = 16;
const CARD_W = "clamp(124px,13vw,190px)";
const CARD_H = "calc(clamp(124px,13vw,190px) * 4 / 3)";

/** Width of the rail's viewport: exactly three and a half cards. The rail is
 *  far wider and absolutely positioned inside, so its full length never reaches
 *  flex layout — that is what stops seven cards from eating the whole row.
 *  Sizing the window to the cards (rather than letting the section edge do the
 *  cutting) keeps the half card a consistent half at any viewport width. */
const RAIL_WINDOW = `calc(${CARD_W} * 3.5 + ${CARD_GAP * 3}px)`;

/** Horizontal padding of the content container, restated so the rail window can
 *  cancel it and run its cut edge out to the section boundary. */
const GUTTER = "clamp(18px,3.6vw,60px)";

/** Slots rendered in the strip. Only ~3.5 are ever visible — the rest sit
 *  beyond the clipped right edge so that when the rail shifts, the card
 *  entering from the right was already mounted and simply slides in. That
 *  buffer is what stops a new card appearing out of nowhere. */
const QUEUE_LEN = 7;

/** Slides the carousel should have. Below this the distinct projects are
 *  repeated in whole cycles to reach it — so with three real projects the reel
 *  is six slides and each is featured twice. Raise the real project count and
 *  the repetition disappears on its own. */
const MIN_SLIDES = 6;

/** Clears the fixed nav so the eyebrow doesn't collide with the wordmark. */
const NAV_CLEARANCE = "clamp(132px,16vh,178px)";

const TITLE_FS = "clamp(38px,6.4vw,98px)";
/** Two lines of title, always reserved. Line box is 0.94 leading + 0.06em of
 *  descender padding = exactly 1em, so two lines is twice the font size.
 *  Without this floor a one-word title like "Arbitrary" renders a line shorter
 *  than "Zuus x Shake Shaq" and the whole row jumps between slides. */
const TITLE_MIN_H = `calc(${TITLE_FS} * 2)`;

/** Split a title across at most two masked lines, balanced by character count,
 *  so the staggered per-line reveal has something to stagger. */
function splitTitle(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title];
  let best = 1;
  let bestDelta = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    const delta = Math.abs(a - b);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/**
 * Featured-project carousel — the "Globe Express" interaction adapted to Abstrakt.
 *
 * The move that makes it read as premium rather than as a carousel is the
 * transition: the leading card does not cross-fade into the background, it
 * EXPANDS from its slot in the rail to full bleed, corner radius flattening on
 * the way. Two details are what keep that illusion intact:
 *
 *   1. The card the plate flies from is hidden the instant the flight starts.
 *      Leave it visible and the same   is on screen twice — once growing,
 *      once still sitting in the rail — and it pops when it is finally removed.
 *   2. The rail renders more cards than fit and is translated by exactly one
 *      slot, then reset to zero as the data shifts by one. The card arriving
 *      from the right was already mounted off-screen, so it slides in rather
 *      than appearing.
 */
export default function WorksV2({ data }: WorksV2Props) {
  const projects = useMemo(() => {
    const seen = new Set<string>();
    const distinct = (data?.projects || []).filter((p) => {
      const key = (p.image || p.title || "").toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (!distinct.length) return distinct;
    // Repeat in whole cycles up to MIN_SLIDES so the rail is genuinely that
    // long rather than faking length at render time. Once there are MIN_SLIDES
    // real projects this is a no-op and each one is featured exactly once.
    const reps = Math.ceil(MIN_SLIDES / distinct.length);
    return Array.from({ length: reps }, () => distinct).flat();
  }, [data]);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const animating = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const count = projects.length;

  // The rail is a continuous cycle of what is coming next. With only a few
  // projects the sequence necessarily repeats — that reads as a loop, which is
  // what an infinite carousel is, rather than as duplicated content.
  const queue = useMemo(
    () => (count ? Array.from({ length: QUEUE_LEN }, (_, k) => (active + 1 + k) % count) : []),
    [active, count]
  );

  const copyTargets = useCallback(
    () => [metaRef.current, titleRef.current, descRef.current, ctaRef.current].filter(Boolean) as HTMLElement[],
    []
  );

  const go = useCallback(
    (dir: number) => {
      if (animating.current || count < 2) return;
      const next = ((active + dir) % count + count) % count;
      const project = projects[next];
      const root = rootRef.current;
      const bg = bgRef.current;
      const fly = flyRef.current;
      const rail = railRef.current;
      if (!root || !bg || !fly) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const commit = () => {
        bg.style.backgroundImage = project.image ? `url(${project.image})` : "none";
        gsap.set(fly, { autoAlpha: 0 });

        // The rail's reset to x:0 and the queue advancing one slot describe the
        // same pixels, so they have to land in the SAME paint. setActive on its
        // own is asynchronous: the reset would apply immediately while the cards
        // still showed the old, unshifted order, giving one frame where the rail
        // snaps back a whole card. That single frame is the stutter at the end of
        // every transition. flushSync commits the re-render first, so the reset
        // is a no-op against already-correct DOM.
        flushSync(() => setActive(next));

        if (rail) gsap.set(rail, { x: 0 });
        // Slots are reused positionally, so the node hidden for the flight is
        // still hidden after the re-render — restore it now that it holds a
        // different project.
        cardRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 1 }));
        animating.current = false;
      };

      if (reduced) {
        commit();
        return;
      }

      animating.current = true;

      const rootRect = root.getBoundingClientRect();
      // Slot `dir - 1` is the card for `next`: the rail lists active+1 onward,
      // so stepping forward by `dir` lands on the card `dir - 1` along. Clicking
      // the third card is go(3) and must fly from that card, not from slot 0.
      const leadCard = dir > 0 ? cardRefs.current[dir - 1] : null;
      const cardRect = leadCard?.getBoundingClientRect();

      if (leadCard) {
        // The plate now owns this image — the card must not also be showing it.
        gsap.set(leadCard, { autoAlpha: 0 });
      }

      gsap.set(fly, {
        autoAlpha: 1,
        backgroundImage: project.image ? `url(${project.image})` : "none",
        left: cardRect ? cardRect.left - rootRect.left : 0,
        top: cardRect ? cardRect.top - rootRect.top : 0,
        width: cardRect ? cardRect.width : rootRect.width,
        height: cardRect ? cardRect.height : rootRect.height,
        borderRadius: cardRect ? 14 : 0,
        scale: cardRect ? 1 : 1.08,
      });

      // One timeline for the whole transition. These used to be separate
      // tweens with commit() hanging off the plate's onComplete — but the rail
      // had its own tween of the same duration, so whichever finished last won
      // the race for `x`. When the rail won, it stayed parked one slot left and
      // every card in the strip was off by one from that point on. A single
      // timeline's onComplete cannot fire until every child is done.
      timeline.current?.kill();
      const tl = gsap.timeline({ onComplete: commit });
      timeline.current = tl;

      // Copy clears out as one block so the expanding plate never fights text
      // for the same pixels — title, category, description and button together.
      tl.to(copyTargets(), { autoAlpha: 0, y: -20, duration: 0.34, ease: "power2.in", stagger: 0.035 }, 0);

      tl.to(
        fly,
        {
          left: 0,
          top: 0,
          width: rootRect.width,
          height: rootRect.height,
          borderRadius: 0,
          scale: 1,
          duration: TRANSITION_S,
          ease: "power3.inOut",
        },
        0
      );

      // Rail slides by exactly as many slots as the queue is about to advance,
      // so the reset to zero in commit() lands on the same pixels the animation
      // ended on. Sliding one slot while the data jumped three was the other
      // way the strip came out mis-ordered.
      if (rail && dir > 0 && cardRect) {
        tl.fromTo(
          rail,
          { x: 0 },
          { x: -(cardRect.width + CARD_GAP) * dir, duration: TRANSITION_S, ease: "power3.inOut" },
          0
        );
      }
    },
    [active, count, projects, copyTargets]
  );

  // Incoming copy: masked per-line title rise, then the supporting copy.
  useEffect(() => {
    const targets = copyTargets();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    const lines = titleRef.current?.querySelectorAll("[data-line] > span");
    if (lines?.length) {
      gsap.fromTo(lines, { yPercent: 108 }, { yPercent: 0, duration: 0.82, ease: "power3.out", stagger: 0.075, delay: 0.1 });
    }
    gsap.fromTo(
      [metaRef.current, descRef.current, ctaRef.current].filter(Boolean) as HTMLElement[],
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07, delay: 0.26 }
    );
  }, [active, copyTargets]);

  useEffect(() => () => { timeline.current?.kill(); }, []);

  // Only count down while the section is actually on screen — a timer that ran
  // from mount would have cycled through the whole reel before the visitor
  // ever scrolled this far.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bar = progressRef.current;
    let tween: gsap.core.Tween | null = null;
    if (bar) {
      tween = gsap.fromTo(
        bar,
        { scaleX: 0 },
        { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: "none", transformOrigin: "left center" }
      );
    }
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => {
      window.clearTimeout(timer);
      tween?.kill();
      if (bar) gsap.set(bar, { scaleX: 0 });
    };
  }, [active, inView, count, go]);

  if (count === 0) return null;

  const current = projects[active];
  const titleLines = splitTitle(current.title);

  return (
    <section
      id="works"
      ref={rootRef}
      data-screen-label="Our works"
      data-nav-tone="dark"
      style={{
        position: "relative",
        // One viewport exactly, so the arrows and index land on screen with the
        // rest of the section — the nav clearance is taken from inside.
        minHeight: "100svh",
        overflow: "hidden",
        background: INK,
        color: "#F7F6F3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: current.image ? `url(${current.image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        ref={flyRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0,
          visibility: "hidden",
          overflow: "hidden",
          willChange: "width,height,left,top",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(10,10,10,.88) 0%, rgba(10,10,10,.64) 34%, rgba(10,10,10,.2) 62%, rgba(10,10,10,.46) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          // Stretches to the section rather than restating its height, which
          // would stack the nav clearance twice.
          flex: 1,
          width: "100%",
          maxWidth: 1680,
          margin: "0 auto",
          padding: `${NAV_CLEARANCE} ${GUTTER} clamp(28px,5vh,54px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "clamp(28px,5vh,60px)",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: BRAND_LIGHT }}>
          (03) OUR WORKS
        </span>

        {/* Copy left, rail right. The rail is allowed to run past the container
            and is clipped by the section, which is what puts a partial card at
            the right edge. */}
        {/* Anchored from the bottom rather than distributed. Both columns are
            bottom-aligned, so the card stack keeps the same baseline no matter
            how tall the copy beside it happens to be on a given slide. */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "clamp(24px,4vw,70px)", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <div ref={metaRef}>
              <span style={{ display: "block", width: 26, height: 2, background: "rgba(255,255,255,.7)", marginBottom: 16 }} />
              {current.category && (
                <span style={{ display: "block", fontSize: "clamp(13px,1.1vw,16px)", color: "rgba(255,255,255,.78)", marginBottom: 10 }}>
                  {current.category}
                </span>
              )}
            </div>

            <div
              ref={titleRef}
              style={{ minHeight: TITLE_MIN_H, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
            >
              {titleLines.map((line, i) => (
                <span key={i} data-line style={{ display: "block", overflow: "hidden", paddingBottom: ".06em" }}>
                  <span
                    style={{
                      display: "block",
                      fontFamily: displayFont,
                      fontWeight: 700,
                      fontSize: TITLE_FS,
                      lineHeight: 0.94,
                      letterSpacing: "-.03em",
                      textTransform: "uppercase",
                    }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </div>

            {current.subtitle && (
              <p ref={descRef} style={{ margin: "clamp(16px,2.4vh,26px) 0 0", maxWidth: "42ch", fontSize: "clamp(14px,1.1vw,17px)", lineHeight: 1.55, color: "rgba(255,255,255,.74)" }}>
                {current.subtitle}
              </p>
            )}

            <a
              ref={ctaRef}
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                marginTop: "clamp(20px,3vh,32px)",
                height: 50,
                padding: "0 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.34)",
                color: "#F7F6F3",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".16em",
              }}
            >
              VIEW PROJECT →
            </a>
          </div>

          <div
            style={{
              position: "relative",
              flex: "0 0 auto",
              width: RAIL_WINDOW,
              height: CARD_H,
              overflow: "hidden",
              // Cancels the container gutter so the half card is cut by the
              // section edge, as in the reference, rather than floating inside
              // the content column with a strip of background beside it.
              marginRight: `calc(-1 * ${GUTTER})`,
            }}
          >
            <div ref={railRef} style={{ position: "absolute", left: 0, top: 0, display: "flex", gap: CARD_GAP, willChange: "transform" }}>
              {queue.map((index, slot) => {
              const project = projects[index];
              return (
                <button
                  key={slot}
                  ref={(el) => {
                    cardRefs.current[slot] = el;
                  }}
                  onClick={() => !animating.current && go(slot + 1)}
                  aria-label={`Show ${project.title}`}
                  style={{
                    position: "relative",
                    width: CARD_W,
                    height: CARD_H,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: 0,
                    padding: 0,
                    cursor: "pointer",
                    background: "#1A1A1A",
                    backgroundImage: project.image ? `url(${project.image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // Lifts the cards off the background plate — without it
                    // they read as flat cutouts on the full-bleed image.
                    boxShadow: "0 22px 44px -14px rgba(0,0,0,.65), 0 6px 14px -6px rgba(0,0,0,.5)",
                    textAlign: "left",
                    flex: "0 0 auto",
                  }}
                >
                  <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.18) 52%, transparent 100%)" }} />
                  <span style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
                    {project.category && (
                      <span style={{ display: "block", fontSize: 9, letterSpacing: ".16em", color: "rgba(255,255,255,.66)", marginBottom: 4 }}>
                        {project.category.toUpperCase()}
                      </span>
                    )}
                    <span style={{ display: "block", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(12px,1.05vw,15px)", lineHeight: 1.08, letterSpacing: "-.01em", textTransform: "uppercase", color: "#F7F6F3" }}>
                      {project.title}
                    </span>
                  </span>
                </button>
              );
              })}
            </div>
          </div>
        </div>

        {/* Equal-weight flanks either side of the arrows, so the pair sits on the
            section's centre line while the index stays pinned right. */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 12, flex: "0 0 auto" }}>
            <button
              onClick={() => go(-1)}
              aria-label="Previous project"
              style={{ width: 42, height: 42, borderRadius: 999, border: "1px solid rgba(255,255,255,.32)", background: "transparent", color: "#F7F6F3", cursor: "pointer", fontSize: 15 }}
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next project"
              style={{ width: 42, height: 42, borderRadius: 999, border: "1px solid rgba(255,255,255,.32)", background: "transparent", color: "#F7F6F3", cursor: "pointer", fontSize: 15 }}
            >
              ›
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 18, minWidth: 0 }}>
            <span style={{ position: "relative", flex: 1, height: 1, background: "rgba(255,255,255,.24)", minWidth: 30 }}>
              <div ref={progressRef} style={{ position: "absolute", inset: 0, background: BRAND_LIGHT, transform: "scaleX(0)", transformOrigin: "left center" }} />
            </span>
            <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(28px,3.2vw,48px)", lineHeight: 1, letterSpacing: "-.02em", flex: "0 0 auto" }}>
              {String(active + 1).padStart(2, "0")}
              <span style={{ fontSize: "0.42em", color: "rgba(255,255,255,.6)", marginLeft: 6 }}>
                / {String(count).padStart(2, "0")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
