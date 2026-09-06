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
    // `isIntersecting` is not trusted on its own here. The effect re-runs
    // whenever the page swaps in CMS data, and a freshly constructed
    // observer reports on EVERY observed element in its first callback.
    // Sections far below the fold came back as "intersecting" against the
    // document rather than the viewport, got marked revealed while still
    // off-screen, and were immediately unobserved — so by the time the
    // reader scrolled down, the transition had already run and the section
    // simply appeared. Testing the rect against the viewport directly is
    // what makes a re-run idempotent.
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Same ~32% bite as the rootMargin below: reveal once the section is
      // genuinely in front of the reader — head + headline visible — not the
      // instant its top edge grazes the bottom of the screen. Firing at the
      // graze meant the 0.6-0.9s animation finished mid-scroll, before the
      // reader ever looked at the section, so everything read as pre-revealed.
      //
      // `r.bottom > 0` alone is not enough for the lower bound: a section
      // taller than the viewport can have its top scrolled well above the
      // screen while its content still fills it, so the top test is what
      // carries tall sections and the bottom test carries short ones.
      return r.top < vh * 0.68 && r.bottom > vh * 0.08;
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !onScreen(entry.target)) return;
          entry.target.classList.add("ab-in");
          io.unobserve(entry.target);
        });
      },
      // Trigger ~32% into the viewport: the section is being read by the
      // time its entrance plays, rather than finishing while still a sliver
      // at the screen's bottom edge. Waiting for 50%+ reads as laggy,
      // because the reader has already taken the section in by then.
      //
      // threshold MUST stay 0. A non-zero threshold is a fraction of the
      // element's own area, so a section taller than the viewport can never
      // reach it — the work gallery and index are each well over one screen
      // tall, and at threshold 0.1 they scrolled past without the callback
      // ever reporting `isIntersecting`, leaving every [data-rv] child stuck
      // at opacity 0. The gating is `onScreen` above, which measures the
      // rect against the viewport and does not care how tall the section is.
      { threshold: 0, rootMargin: "0px 0px -32% 0px" }
    );
    // A section revealed on a previous run keeps its class and is not
    // re-observed, so a data swap never replays an animation the reader
    // has already seen.
    sections.forEach((s) => {
      if (!s.classList.contains("ab-in")) io.observe(s);
    });

    // --- 2. Depth handoff ----------------------------------------------
    const depthSections = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    let raf: number | null = null;

    const tick = () => {
      const vh = window.innerHeight;

      // Safety net for the reveals above. Everything [data-rv] defaults to
      // opacity 0, so a missed IntersectionObserver callback does not just
      // skip an animation — it hides the section's content permanently. This
      // sweep runs on the same scroll pass as the depth work and reveals
      // anything already on screen that the observer did not catch, so no
      // geometry edge case can leave a section blank.
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.classList.contains("ab-in")) continue;
        if (onScreen(s)) {
          s.classList.add("ab-in");
          io.unobserve(s);
        }
      }

      depthSections.forEach((section) => {
        const r = section.getBoundingClientRect();

        // Entering: 0 while still below the fold, 1 once locked in.
        const pIn = clamp((vh - r.top) / (vh * 0.9), 0, 1);
        // Exiting: 0 until the section's bottom starts leaving the viewport.
        const pOut = clamp((vh - r.bottom) / vh, 0, 1);

        const radius = 22 * (1 - pIn);
        section.style.borderTopLeftRadius = radius + "px";
        section.style.borderTopRightRadius = radius + "px";
        // The lift shadow only reads as depth where the incoming section
        // actually changes ground colour. On a same-colour handoff there is
        // no edge to imply, so it just smudges the seam — those sections opt
        // out with data-depth="flat" and keep the radius and drift.
        if (section.dataset.depth !== "flat") {
          section.style.boxShadow = `0 -34px 60px -24px rgba(0,0,0,${(0.34 * (1 - pIn)).toFixed(3)})`;
        }

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
