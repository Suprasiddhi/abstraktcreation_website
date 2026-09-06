"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { BRAND_LIGHT, INK, displayFont, bodyFont } from "./tokens";
import SectionHeading from "./SectionHeading";

interface ProjectData {
  id?: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  client?: string;
  /** Static content.ts entries carry `image`; CMS projects carry
   *  `thumbnailUrl` (a data URI) instead — both are accepted. */
  image?: string;
  thumbnailUrl?: string;
  videoThumbnailUrl?: string;
}

interface WorksCarouselProps {
  data?: { projects: ProjectData[] };
}

/** Slots on the ring. The design fixes twelve at 30° apart; with fewer real
 *  projects than that the list is cycled to fill, which is what keeps the ring
 *  visually dense rather than leaving gaps between distant cards. */
const SLOTS = 12;

/** Ring geometry, lifted from the design: cards are 340×400 sitting at
 *  translateZ(-760px) from a 620px perspective. The radius is what sets how
 *  much the ring wraps away from the camera; the card size follows it. */
const CARD_W = 340;
const CARD_H = 400;
const RADIUS = 760;
const PERSPECTIVE = 620;

/** Seconds for one full revolution. */
const SPIN_SECONDS = 110;

/** Half-life (ms) of the ease between spinning and parked. The ring loses
 *  half its remaining speed every this-many ms, so a hover glides it to a
 *  stop over roughly a quarter second instead of snapping. */
const SPIN_RAMP_HALF_LIFE = 190;

/** Cards past this angle from front-centre are hidden — they are edge-on or
 *  behind the ring, and painting them costs compositing for nothing. */
const VISIBLE_ANGLE = 85;

/** The design's stage is authored at this height and scaled to fit. */
const STAGE_TALL = 672;

/** Height multiplier for the whole section. The section's min-height and the
 *  viewport-derived caps in `fit()` are scaled together, so the ring grows
 *  with the band instead of a taller section leaving dead space around a
 *  ring still sized to one screen. */
const SECTION_SCALE = 1.2;

/** Backdrop art: a dark studio wall, lit from the upper left, with leaf
 *  shadows at the left, empty frames on a plinth at the right and clean
 *  negative space through the middle. It carries no typography of its own,
 *  so it sits full-bleed behind the live heading and the ring both. */
const BG_SRC = "/images/our_works_bg.png";

/** Flip when the backdrop art is a dark variant: restores the ink field,
 *  light type and deep card shadows the ring was originally tuned for. */
const BG_IS_DARK = true;

const T = BG_IS_DARK
  ? {
      // Matched to the artwork's wall rather than pure ink, so any crop or
      // overscan edge blends instead of banding against the photograph.
      field: "#2A2621",
      eyebrow: BRAND_LIGHT,
      heading: "#F7F6F3",
      body: "rgba(247,246,243,.72)",
      // Brand pool behind the ring, then a vertical scrim that darkens the
      // top for the heading and the floor for the band — the middle stays
      // open so the wall texture, leaf shadows and frames still read.
      wash: "radial-gradient(120% 80% at 50% 46%, rgba(80,30,189,.20) 0%, rgba(80,30,189,.05) 40%, rgba(14,14,14,0) 72%), linear-gradient(180deg, rgba(11,10,9,.72) 0%, rgba(11,10,9,.30) 30%, rgba(11,10,9,.22) 58%, rgba(11,10,9,.62) 100%)",
      cardShadow: "0 20px 48px rgba(0,0,0,0.58), 0 0 0 1px rgba(247,246,243,0.16)",
      cardHoverShadow: `0 34px 74px rgba(0,0,0,0.62), 0 0 0 1px ${BRAND_LIGHT}`,
      panelBg: "rgba(18,16,20,0.72)",
      panelBorder: "1px solid rgba(247,246,243,0.16)",
      panelShadow: "0 24px 60px rgba(0,0,0,0.5)",
      panelName: "#F7F6F3",
      panelMeta: "rgba(247,246,243,0.58)",
      btnBg: "#F7F6F3",
      btnInk: INK,
      navTone: "dark",
    }
  : {
      // Cream artwork: type drops to ink, and the card shadows warm up and
      // lighten — a black drop shadow on cream reads as grime, not depth.
      field: "#EFE9E0",
      eyebrow: "#501EBD",
      heading: "#141210",
      body: "rgba(32,28,24,.72)",
      wash: "linear-gradient(180deg, rgba(243,238,231,.86) 0%, rgba(243,238,231,.34) 34%, rgba(238,231,222,.30) 68%, rgba(232,224,213,.72) 100%)",
      cardShadow: "0 18px 44px rgba(84,64,44,0.22), 0 0 0 1px rgba(32,28,24,0.10)",
      cardHoverShadow: "0 30px 68px rgba(84,64,44,0.30), 0 0 0 1px rgba(80,30,189,0.55)",
      panelBg: "rgba(253,251,247,0.78)",
      panelBorder: "1px solid rgba(32,28,24,0.12)",
      panelShadow: "0 24px 60px rgba(84,64,44,0.24)",
      panelName: "#141210",
      panelMeta: "rgba(32,28,24,0.58)",
      btnBg: "#141210",
      btnInk: "#F7F6F3",
      navTone: "light",
    };

export default function WorksCarousel({ data }: WorksCarouselProps) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);

  const angle = useRef(0);
  /** Target spin rate as a fraction of full speed: 1 running, 0 parked.
   *  `spin` eases toward it each frame rather than snapping, so hovering a
   *  card slows the ring to a stop over ~250ms and leaving it ramps back —
   *  the same treatment the logo marquee uses. */
  const paused = useRef(false);
  const spin = useRef(1);
  const last = useRef(0);
  const raf = useRef(0);

  /** The card the panel currently describes, and a grace timer for the gap
   *  between card and panel. Without the grace period the panel closes the
   *  instant the pointer leaves the card — including while it is travelling
   *  toward the panel's own button, which made "View Project" unclickable. */
  const activeCard = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  /** Distinct projects that actually have artwork, then cycled up to SLOTS so
   *  every position on the ring carries a card. A card with no image is an
   *  empty rectangle on a rotating ring, so unillustrated projects (the CMS
   *  holds several placeholder entries) are dropped rather than shown blank. */
  const slots = useMemo(() => {
    const seen = new Set<string>();
    const distinct = (data?.projects || [])
      .map((p) => ({ ...p, src: p.image || p.thumbnailUrl || p.videoThumbnailUrl || "" }))
      .filter((p) => {
        if (!p.src) return false;
        const key = p.src.slice(0, 200).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    if (!distinct.length) return [];
    return Array.from({ length: SLOTS }, (_, i) => distinct[i % distinct.length]);
  }, [data]);

  /** Scale the whole stage so the ring fits the viewport at any size. Mirrors
   *  the design's fit(): take the larger of a height- and a width-derived
   *  scale, clamp it, then size the band to the scaled stage. */
  const fit = useCallback(() => {
    const band = bandRef.current;
    const stage = stageRef.current;
    if (!band || !stage) return;
    // The section is SECTION_SCALE viewports tall, so the space the band has
    // to fill is that, not the raw viewport height.
    const h = window.innerHeight * SECTION_SCALE;
    const w = window.innerWidth;
    const kh = (h * 0.5) / STAGE_TALL;
    const kw = (w * 1.05) / 1520;
    const k = Math.max(0.3, Math.min(1.25, Math.max(kh, kw)));
    const bandH = Math.round(Math.min(STAGE_TALL * k, h * 0.68, h - 272));
    stage.style.transform = `scale(${k.toFixed(4)})`;
    stage.style.top = Math.round(bandH / 2 - 210 * k) + "px";
    band.style.height = bandH + "px";
  }, []);

  useEffect(() => {
    if (!slots.length) return;

    fit();
    window.addEventListener("resize", fit);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(document.documentElement);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Rotate the ring, then counter-rotate each card toward the camera. The
     *  counter-rotation (-0.3 × its angle from centre) is what keeps cards
     *  readable as they swing around instead of turning fully edge-on. */
    const paint = () => {
      const el = ringRef.current;
      if (!el) return;
      el.style.transform = `rotateY(${angle.current}deg)`;
      const kids = el.children;
      const step = 360 / kids.length;
      for (let i = 0; i < kids.length; i++) {
        let p = (angle.current + i * step) % 360;
        if (p > 180) p -= 360;
        const a = Math.abs(p);
        const k = kids[i] as HTMLElement;
        if (a > VISIBLE_ANGLE) {
          if (k.style.visibility !== "hidden") k.style.visibility = "hidden";
          continue;
        }
        if (k.style.visibility === "hidden") k.style.visibility = "visible";
        const cr = (-0.3 * p).toFixed(2);
        k.style.transform = `rotateY(${k.dataset.a}deg) translateZ(-${RADIUS}px) rotateY(${cr}deg)`;
      }
    };

    if (reduced) {
      // Hold the ring still but keep the front cards laid out correctly.
      paint();
      return () => {
        window.removeEventListener("resize", fit);
        if (ro) ro.disconnect();
      };
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last.current, 60);
      last.current = now;
      const period = SPIN_SECONDS * 1000;

      // Exponential ease toward the target rate. Framed as a half-life so the
      // ramp takes the same wall-clock time on 60Hz and 120Hz displays, and
      // so a hover-out mid-slowdown reverses smoothly instead of jumping.
      const target = paused.current ? 0 : 1;
      const k = 1 - Math.pow(0.5, dt / SPIN_RAMP_HALF_LIFE);
      spin.current += (target - spin.current) * k;
      if (Math.abs(target - spin.current) < 0.001) spin.current = target;

      if (spin.current > 0) {
        angle.current =
          (angle.current + (dt / period) * 360 * spin.current + 360) % 360;
      }
      paint();
      raf.current = requestAnimationFrame(tick);
    };

    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", fit);
      if (ro) ro.disconnect();
    };
  }, [slots, fit]);

  /** Park the glass panel beside the hovered card, flipping to its left when
   *  there is no room on the right, and clamped inside the band either way. */
  const showPanel = useCallback((card: HTMLElement) => {
    const p = panelRef.current;
    if (!p) return;
    if (nameRef.current) nameRef.current.textContent = card.dataset.name || "";
    if (metaRef.current) metaRef.current.textContent = card.dataset.meta || "";
    const host = (p.offsetParent || p.parentElement) as HTMLElement | null;
    if (!host) return;
    const hb = host.getBoundingClientRect();
    const cb = card.getBoundingClientRect();
    const pw = 268;
    const ph = p.offsetHeight || 150;
    const cx = cb.left + cb.width / 2 - hb.left;
    const off = cb.width / 2 + pw / 2 + 18;
    let x = cx + off;
    if (x + pw / 2 > hb.width - 14) x = cx - off;
    x = Math.max(pw / 2 + 14, Math.min(hb.width - pw / 2 - 14, x));
    let y = cb.top - hb.top + cb.height / 2 - ph / 2;
    y = Math.max(14, Math.min(hb.height - ph - 14, y));
    p.style.setProperty("--px", Math.round(x) + "px");
    p.style.setProperty("--py", Math.round(y) + "px");
    p.style.setProperty("--po", "1");
    p.style.setProperty("--pty", "0px");
  }, []);

  /** Drop the lifted state on a card and hide the panel. */
  const closeNow = useCallback(() => {
    const c = activeCard.current;
    if (c) {
      c.style.setProperty("--ov", "0");
      c.style.setProperty("--iz", "1");
      c.style.setProperty("--lf", "1");
      c.style.removeProperty("--sh");
      c.style.zIndex = "";
      activeCard.current = null;
    }
    const p = panelRef.current;
    if (p) {
      p.style.setProperty("--po", "0");
      p.style.setProperty("--pty", "12px");
      p.style.pointerEvents = "none";
    }
    paused.current = false;
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /** Close after a beat, so the pointer can cross the gap into the panel. */
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(closeNow, 220);
  }, [cancelClose, closeNow]);

  const cardIn = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      cancelClose();
      const c = e.currentTarget;
      // Moving straight from one card to another: drop the previous card's
      // lift before adopting the new one, or it stays raised for good.
      if (activeCard.current && activeCard.current !== c) {
        const prev = activeCard.current;
        prev.style.setProperty("--ov", "0");
        prev.style.setProperty("--iz", "1");
        prev.style.setProperty("--lf", "1");
        prev.style.removeProperty("--sh");
        prev.style.zIndex = "";
      }
      activeCard.current = c;
      c.style.setProperty("--ov", "1");
      c.style.setProperty("--iz", "1.07");
      c.style.setProperty("--lf", "1.09");
      c.style.setProperty("--sh", T.cardHoverShadow);
      c.style.zIndex = "6";
      // The ring must hold still while the panel is reachable — a moving card
      // drags the panel with it and the button walks away from the cursor.
      paused.current = true;
      showPanel(c);
      const p = panelRef.current;
      if (p) p.style.pointerEvents = "auto";
    },
    [showPanel, cancelClose]
  );

  const cardOut = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  if (!slots.length) return null;

  return (
    <section
      id="works"
      data-screen-label="Our works"
      data-nav-tone={T.navTone}
      style={{
        position: "relative",
        width: "100%",
        minHeight: `calc(100svh * ${SECTION_SCALE})`,
        overflow: "hidden",
        background: T.field,
        fontFamily: bodyFont,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Backdrop art, full-bleed and bottom-anchored — the plinth and torn
          paper edge stay planted at the section floor while the wall's open
          upper area takes the crop on shorter viewports. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${BG_SRC}")`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Wash over the art: settles it back so the cards and copy stay the
          subject, and keeps the top of the section clean for the heading. */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: T.wash }} />

      <div
        style={{
          position: "relative",
          zIndex: 3,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "min(680px, calc(100% - 64px))",
          margin: "0 auto",
          padding: "clamp(96px,14vh,150px) 0 6px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: "clamp(38px,5.6vw,72px)",
            lineHeight: 0.96,
            letterSpacing: "-.03em",
            textTransform: "uppercase",
            color: T.heading,
          }}
        >
          <SectionHeading tone={BG_IS_DARK ? "dark" : "light"}>Our Works</SectionHeading>
        </h2>
        <p
          style={{
            margin: "18px auto 0",
            maxWidth: 440,
            fontSize: "clamp(14px,1.1vw,16px)",
            lineHeight: 1.6,
            color: T.body,
            textWrap: "pretty",
          }}
        >
          Campaigns, platforms and brand systems — built end to end, in one studio.
        </p>
      </div>

      {/* The band clips the ring; the stage inside is scaled to fit by fit(). */}
      <div
        ref={bandRef}
        // Entering the band does NOT pause: the band is a full-width strip of
        // mostly empty backdrop, and stopping the ring the moment the pointer
        // crosses it reads as the carousel dying on approach. Only a card
        // (cardIn) or the panel pauses.
        //
        // Not an immediate resume: the panel can sit outside the band, so
        // leaving here may just mean the pointer is on its way to the button.
        // closeNow() is what finally unpauses, once the grace period lapses.
        onMouseLeave={scheduleClose}
        style={{ position: "relative", flex: "0 0 auto", width: "100%", height: 342, zIndex: 2, overflow: "hidden" }}
      >
        <div
          ref={stageRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 420,
            perspective: `${PERSPECTIVE}px`,
            perspectiveOrigin: "50% 50%",
            transformOrigin: "50% 0",
            transform: "scale(0.855)",
          }}
        >
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateZ(${Math.round(RADIUS * 0.408)}px)` }}>
            <div ref={ringRef} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d" }}>
              {slots.map((project, i) => {
                const a = ((360 / SLOTS) * i).toFixed(3);
                return (
                  <div
                    key={i}
                    data-a={a}
                    data-name={project.client || project.title}
                    data-meta={[project.category, project.subtitle].filter(Boolean).join(" · ")}
                    onMouseEnter={cardIn}
                    onMouseLeave={cardOut}
                    style={{
                      position: "absolute",
                      left: -CARD_W / 2,
                      top: -CARD_H / 2,
                      width: CARD_W,
                      height: CARD_H,
                      transform: `rotateY(${a}deg) translateZ(-${RADIUS}px)`,
                      backfaceVisibility: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 7,
                        overflow: "hidden",
                        background: BG_IS_DARK ? "#1A1A1A" : "#E4DCD1",
                        boxShadow: `var(--sh, ${T.cardShadow})`,
                        transform: "scale(var(--lf, 1))",
                        transition: "transform 0.55s cubic-bezier(.22,1,.36,1), box-shadow 0.55s ease",
                      }}
                    >
                      {project.src && (
                        <img
                          src={project.src}
                          alt={project.title}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transform: "scale(var(--iz, 1))",
                            transition: "transform 0.9s cubic-bezier(.22,1,.36,1)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(180deg, rgba(11,10,9,0) 40%, rgba(11,10,9,0.5) 100%)",
                          opacity: "var(--ov, 0)",
                          transition: "opacity 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Glass info panel — parked beside whichever card is hovered. It is
            hoverable in its own right: entering it cancels the pending close,
            so the pointer can leave the card and reach the button. */}
        <div
          ref={panelRef}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{
            position: "absolute",
            left: "var(--px, 0px)",
            top: "var(--py, 0px)",
            zIndex: 7,
            width: 268,
            padding: "18px 20px 20px",
            boxSizing: "border-box",
            borderRadius: 14,
            background: T.panelBg,
            border: T.panelBorder,
            backdropFilter: "blur(22px) saturate(1.3)",
            WebkitBackdropFilter: "blur(22px) saturate(1.3)",
            boxShadow: T.panelShadow,
            opacity: "var(--po, 0)",
            transform: "translate(-50%, var(--pty, 12px))",
            transition:
              "opacity 0.38s ease, transform 0.5s cubic-bezier(.22,1,.36,1), left 0.5s cubic-bezier(.22,1,.36,1), top 0.5s cubic-bezier(.22,1,.36,1)",
            // Toggled to "auto" while a card is hovered; hidden panels must not
            // swallow pointer events over the ring behind them.
            pointerEvents: "none",
          }}
        >
          <div ref={nameRef} style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 20, lineHeight: 1.2, letterSpacing: "-.01em", color: T.panelName }} />
          <div ref={metaRef} style={{ marginTop: 7, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: T.panelMeta }} />
          <a
            className="ab-btn ab-btn--invert"
            href="#contact"
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "11px 18px",
              borderRadius: 999,
              background: T.btnBg,
              color: T.btnInk,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".01em",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span>View Project</span>
            {/* `currentColor`, not T.btnInk: the hover inverts the label's
                colour, and a hardcoded stroke would leave the arrow in the
                old ink while the text beside it flipped. */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13" />
              <path d="M12.5 6.5 19 12l-6.5 5.5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
