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
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
