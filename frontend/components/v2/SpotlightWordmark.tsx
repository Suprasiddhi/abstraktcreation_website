"use client";

import React, { useEffect, useRef } from "react";
import { displayFont } from "./tokens";

const FONT: React.CSSProperties = {
  fontFamily: displayFont,
  fontWeight: 700,
  fontSize: "19.4vw",
  lineHeight: 0.78,
  letterSpacing: "-.055em",
  whiteSpace: "nowrap",
  userSelect: "none",
};

const MASK = "radial-gradient(circle var(--r) at var(--mx) var(--my), black 55%, transparent 100%)";

/** How far the glow layer extends past the wordmark box on each side, so a
 *  wide torch radius (up to 280px) completes its falloff off-box instead of
 *  being cut at the edge. */
const BLEED = 320;

/** Ramps the glow layer's alpha in from its top edge. The wordmark sits
 *  directly under the footer's link columns, and an unfaded glow reaching
 *  up there haloes the text; a hard clip instead would leave a straight
 *  line across the glow. This dissolves it over the first third. */
const TOP_FADE =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 16%, black 38%, black 100%)";

/**
 * Footer wordmark with the spotlight reveal from the previous site version.
 *
 * Three stacked layers inside one relative box:
 *   1. a soft halo that reads as the torch's glow on the dark footer,
 *   2. the word as a 1px outline (transparent fill + -webkit-text-stroke),
 *   3. the same word filled brand purple, revealed only inside a circle at
 *      the cursor via a radial-gradient mask.
 *
 * Pointer tracking writes --mx/--my/--r custom properties on the container
 * (no React state); a rAF loop lerps the spotlight toward the cursor so it
 * trails like a torch rather than snapping. Radius eases to 0 when the
 * pointer leaves the document, so the word resolves back to pure outline.
 *
 * Pointer-fine devices only — touch keeps the plain outline wordmark. Under
 * reduced motion the spotlight still follows the pointer (it is
 * pointer-driven, not autonomous) but without the trailing lag.
 */
export default function SpotlightWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let tr = 0;
    let r = 0;
    let raf: number | null = null;

    const tick = () => {
      if (reduced) {
        x = tx;
        y = ty;
        r = tr;
      } else {
        x += (tx - x) * 0.14;
        y += (ty - y) * 0.14;
        r += (tr - r) * 0.08;
      }
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
      el.style.setProperty("--r", r + "px");
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5 || Math.abs(tr - r) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    const wake = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      // Scale the torch with the wordmark so the reveal circle reads the
      // same at any viewport width.
      tr = Math.max(140, Math.min(rect.width * 0.16, 280));
      wake();
    };

    const onLeave = () => {
      tr = 0;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-wordmark="1"
      style={{
        position: "relative",
        // The 0.78 line-height box is taller than the cap-height glyphs it
        // holds, so the span leaves dead space under the word. Pulling the
        // box up by that overhang closes the gap without `overflow:hidden`
        // — clipping here would slice the torch glow into a hard-edged
        // rectangle, since the glow is a full-bleed layer inside this box.
        display: "flow-root",
        marginBottom: "-0.13em",
        fontSize: "19.4vw",
        ["--mx" as string]: "50%",
        ["--my" as string]: "50%",
        ["--r" as string]: "0px",
      }}
    >
      {/* Torch glow. Every stop is a lightening one: the old middle stop
          painted near-black at 55%, which on the footer's own dark ground
          read as a grey box rather than a glow — and the container's
          overflow clip turned its falloff into visible straight edges.
          Purple fading to fully transparent has nothing to clip. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          // Bleeds sideways and downward so a wide torch radius finishes its
          // falloff in open space rather than being cut at the box edge —
          // but NOT upward: above the wordmark sit the footer's link
          // columns, and glow spilling into them washes the text with a
          // purple haze. The top edge stays pinned to the box.
          top: 0,
          left: -BLEED,
          right: -BLEED,
          bottom: -BLEED,
          // Only the horizontal centre needs the bleed offset added, since
          // the layer's top-left origin is inset on x but flush on y.
          background: `radial-gradient(circle var(--r) at calc(var(--mx) + ${BLEED}px) var(--my), rgba(154,120,245,.20) 0%, rgba(154,120,245,.10) 42%, rgba(154,120,245,.03) 68%, rgba(154,120,245,0) 100%)`,
          // Pinning the top edge would trade the spill for a hard horizontal
          // cut across the glow. This ramps the layer's own alpha to zero
          // over its first stretch, so the glow simply thins out as it
          // approaches the footer text instead of ending on a line.
          WebkitMaskImage: TOP_FADE,
          maskImage: TOP_FADE,
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          ...FONT,
          display: "block",
          position: "relative",
          color: "transparent",
          WebkitTextStroke: "1px rgba(250,250,250,.22)",
        }}
      >
        ABSTRAKT
      </span>
      <span
        aria-hidden="true"
        style={{
          ...FONT,
          position: "absolute",
          inset: 0,
          display: "block",
          color: "#9A78F5",
          pointerEvents: "none",
          WebkitMaskImage: MASK,
          maskImage: MASK,
        }}
      >
        ABSTRAKT
      </span>
    </div>
  );
}
