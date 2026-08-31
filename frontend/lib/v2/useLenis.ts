"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

/**
 * Site-wide smooth scroll for the Home v2 page. Lenis runs in its default
 * (non-virtual) mode — it eases the real `window.scrollY` every frame via
 * its own rAF loop rather than replacing scroll with a transformed proxy,
 * so native `scroll` events keep firing and `getBoundingClientRect()` stays
 * accurate. That means the existing hand-rolled scroll effects in
 * useAbstraktMotion (which read window.scrollY / getBoundingClientRect)
 * keep working unmodified, and GSAP ScrollTrigger (used by the work
 * gallery's camera effect) can stay in sync via gsap.ticker.
 */
let instance: Lenis | null = null;

/**
 * The live Lenis instance, or null before the hook mounts. Any component that
 * takes over the viewport must stop Lenis while it is open — Lenis keeps
 * easing the real scroll position otherwise, and a fixed overlay ends up
 * fighting a scroll it cannot see.
 */
export function getLenis() {
  return instance;
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // Lenis owns the scroll position and eases it back every frame, so a bare
    // window.scrollTo() is reverted before it lands. Expose the instance in
    // development so scroll-linked work can be driven and measured.
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }
    instance = lenis;

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
