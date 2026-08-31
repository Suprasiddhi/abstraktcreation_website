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
        ["--mx" as string]: "50%",
        ["--my" as string]: "50%",
        ["--r" as string]: "0px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle var(--r) at var(--mx) var(--my), rgba(154,120,245,.16) 0%, rgba(6,3,16,.55) 55%, transparent 78%)",
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
