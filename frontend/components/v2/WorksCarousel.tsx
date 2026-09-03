"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { BRAND_LIGHT, INK, displayFont, bodyFont } from "./tokens";

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

/** Cards past this angle from front-centre are hidden — they are edge-on or
 *  behind the ring, and painting them costs compositing for nothing. */
const VISIBLE_ANGLE = 85;

/** The design's stage is authored at this height and scaled to fit. */
const STAGE_TALL = 672;

export default function WorksCarousel({ data }: WorksCarouselProps) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);

  const angle = useRef(0);
  const paused = useRef(false);
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
    const h = window.innerHeight;
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
      if (!paused.current) {
        angle.current = (angle.current + (dt / period) * 360 + 360) % 360;
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
      c.style.setProperty("--sh", `0 34px 74px rgba(0,0,0,0.62), 0 0 0 1px ${BRAND_LIGHT}`);
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
      data-nav-tone="dark"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100svh",
        overflow: "hidden",
        background: INK,
        fontFamily: bodyFont,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Depth behind the ring: a soft brand-tinted pool at the centre over a
          flat ink field, so the cards read as lit from the stage rather than
          floating on a plain rectangle. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 80% at 50% 42%, rgba(80,30,189,.22) 0%, rgba(80,30,189,.06) 38%, rgba(14,14,14,0) 70%), linear-gradient(180deg, #0E0E0E 0%, #131015 46%, #0B0A09 100%)`,
        }}
      />

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
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: BRAND_LIGHT, marginBottom: 18 }}>
          (03) OUR WORKS
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: "clamp(38px,5.6vw,72px)",
            lineHeight: 0.96,
            letterSpacing: "-.03em",
            textTransform: "uppercase",
            color: "#F7F6F3",
          }}
        >
          Our Works
        </h2>
        <p
          style={{
            margin: "18px auto 0",
            maxWidth: 440,
            fontSize: "clamp(14px,1.1vw,16px)",
            lineHeight: 1.6,
            color: "rgba(247,246,243,.72)",
            textWrap: "pretty",
          }}
        >
          Campaigns, platforms and brand systems — built end to end, in one studio.
        </p>
      </div>

      {/* The band clips the ring; the stage inside is scaled to fit by fit(). */}
      <div
        ref={bandRef}
        onMouseEnter={() => { paused.current = true; }}
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
                        background: "#1A1A1A",
                        boxShadow: "var(--sh, 0 20px 48px rgba(0,0,0,0.58), 0 0 0 1px rgba(247,246,243,0.16))",
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
            background: "rgba(18,16,20,0.72)",
            border: "1px solid rgba(247,246,243,0.16)",
            backdropFilter: "blur(22px) saturate(1.3)",
            WebkitBackdropFilter: "blur(22px) saturate(1.3)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            opacity: "var(--po, 0)",
            transform: "translate(-50%, var(--pty, 12px))",
            transition:
              "opacity 0.38s ease, transform 0.5s cubic-bezier(.22,1,.36,1), left 0.5s cubic-bezier(.22,1,.36,1), top 0.5s cubic-bezier(.22,1,.36,1)",
            // Toggled to "auto" while a card is hovered; hidden panels must not
            // swallow pointer events over the ring behind them.
            pointerEvents: "none",
          }}
        >
          <div ref={nameRef} style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 20, lineHeight: 1.2, letterSpacing: "-.01em", color: "#F7F6F3" }} />
          <div ref={metaRef} style={{ marginTop: 7, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(247,246,243,0.58)" }} />
          <a
            href="#contact"
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "11px 18px",
              borderRadius: 999,
              background: "#F7F6F3",
              color: INK,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".01em",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span>View Project</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13" />
              <path d="M12.5 6.5 19 12l-6.5 5.5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
