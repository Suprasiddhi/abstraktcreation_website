"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { BRAND_LIGHT } from "./tokens";

/**
 * Page-wide scroll progress — a 2px bar fixed to the top of the viewport.
 *
 * Fill width is the document scroll fraction, driven by native scroll events
 * (Lenis drives those already) and eased with gsap.quickTo so the bar glides
 * rather than stepping with each wheel tick. The range is recomputed on every
 * event, so late-loading sections and resizes never leave the bar stuck short
 * of full. Informational, not decorative — it stays under reduced motion,
 * just without the easing lag.
 */
export default function ScrollProgressV2() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setX = gsap.quickTo(fill, "scaleX", { duration: 0.25, ease: "power1.out" });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (reduced) {
        gsap.set(fill, { scaleX: p });
      } else {
        setX(p);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 160,
        pointerEvents: "none",
        background: "rgba(14,14,14,.08)",
      }}
    >
      <div
        ref={fillRef}
        style={{
          height: "100%",
          width: "100%",
          background: BRAND_LIGHT,
          transform: "scaleX(0)",
          transformOrigin: "left center",
          willChange: "transform",
        }}
      />
    </div>
  );
}
