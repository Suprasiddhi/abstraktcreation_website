"use client";

import { useEffect } from "react";

/**
 * Section arrival choreography for Home v2.
 *
 * Two cooperating layers:
 *
 * 1. Entrance reveals — an IntersectionObserver adds `.ab-in` to any
 *    `[data-reveal]` section the first time it enters, and CSS in
 *    v2-animations.css transitions the `[data-rv]` children (masked
 *    headline line-rise, eyebrow, divider rule, staggered content).
 *    Fires once, then unobserves: re-animating on scroll-up reads cheap.
 *
 * 2. Depth handoff — a scroll-linked pass gives `[data-depth]` sections a
 *    rounded top edge + top shadow that flattens as they lock into place,
 *    while the outgoing section's `[data-depth-inner]` content drifts up
 *    and dims. The dim uses filter: brightness(), matching the existing
 *    Capabilities card-stack, so the whole page reads as one depth idea.
 *    The transform stays on the INNER wrapper so section backgrounds keep
 *    their full bleed (a transformed section would expose slivers of the
 *    page background at its edges). A section whose content relies on
 *    position: sticky opts out of the transform via
 *    data-depth-inner="dim" — a transformed ancestor would break it.
 *
 * Honours prefers-reduced-motion: everything resolves to its final state
 * and no scroll listener is attached.
 */
export function useSectionReveal(
  rootRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      sections.forEach((s) => s.classList.add("ab-in"));
      return;
    }

    // --- 1. Entrance reveals -------------------------------------------
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("ab-in");
          io.unobserve(entry.target);
        });
      },
      // Trigger ~18% into the viewport: waiting for 50% reads as laggy,
      // because the reader has already taken the section in by then.
      { threshold: 0, rootMargin: "0px 0px -18% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    // --- 2. Depth handoff ----------------------------------------------
    const depthSections = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    let raf: number | null = null;

    const tick = () => {
      const vh = window.innerHeight;

      depthSections.forEach((section) => {
        const r = section.getBoundingClientRect();

        // Entering: 0 while still below the fold, 1 once locked in.
        const pIn = clamp((vh - r.top) / (vh * 0.9), 0, 1);
        // Exiting: 0 until the section's bottom starts leaving the viewport.
        const pOut = clamp((vh - r.bottom) / vh, 0, 1);

        const radius = 22 * (1 - pIn);
        section.style.borderTopLeftRadius = radius + "px";
        section.style.borderTopRightRadius = radius + "px";
        section.style.boxShadow = `0 -34px 60px -24px rgba(0,0,0,${(0.34 * (1 - pIn)).toFixed(3)})`;

        const inner = section.querySelector<HTMLElement>("[data-depth-inner]");
        if (inner) {
          if (inner.dataset.depthInner !== "dim") {
            inner.style.transform = `translate3d(0,${(-22 * pOut).toFixed(2)}px,0)`;
          }
          inner.style.filter = `brightness(${(1 - 0.18 * pOut).toFixed(3)})`;
        }
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        tick();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, ...deps]);
}
