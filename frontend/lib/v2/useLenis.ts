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

    // --- Scrollbar-drag reconciliation ---------------------------------
    // Lenis ignores a native scroll event whenever it is mid-animation
    // (`isScrolling === 'smooth'`): its onNativeScroll only adopts the real
    // position when isScrolling is false or 'native'. Dragging the scrollbar
    // while a wheel ease is still running therefore never updates
    // `targetScroll`, and the rAF loop keeps easing the page back to where
    // the wheel had been heading — the drag visibly snaps back.
    //
    // Pointer-down on the scrollbar is the unambiguous signal: a `pointerdown`
    // whose coordinates fall outside the document's client box is on the
    // scrollbar gutter, since no content lives there. For the duration of that
    // drag we stop Lenis outright and hand scrolling back to the browser, then
    // resync and resume on release.
    // NOTE: do NOT import "lenis/dist/lenis.css" to go with this. That sheet
    // carries `.lenis.lenis-stopped { overflow: clip }`, and Lenis adds the
    // `lenis-stopped` class on stop() — which would freeze the page for the
    // exact drag this code is handing back to the browser.
    let draggingScrollbar = false;

    const isOnScrollbar = (e: PointerEvent) => {
      const el = document.documentElement;
      return (
        e.clientX > el.clientWidth || e.clientY > el.clientHeight
      );
    };

    // NavV2 also stops/starts Lenis for the menu overlay. While the menu is
    // open the page is deliberately frozen (body overflow hidden), so this
    // reconciliation must stay out of the way entirely — otherwise releasing a
    // drag would start() Lenis back up underneath the open overlay.
    const menuIsOpen = () => document.documentElement.dataset.menuOpen === "1";

    const onPointerDown = (e: PointerEvent) => {
      if (draggingScrollbar || menuIsOpen() || !isOnScrollbar(e)) return;
      draggingScrollbar = true;
      // stop() halts the ease and leaves the browser's own scrolling intact,
      // so the drag tracks the cursor 1:1 with no interference.
      lenis.stop();
    };

    const endScrollbarDrag = () => {
      if (!draggingScrollbar) return;
      draggingScrollbar = false;
      // The menu may have opened mid-drag; it owns the stopped state now.
      if (menuIsOpen()) return;
      lenis.start();
      // Adopt wherever the drag actually left the page. Without this the
      // animated/target positions still hold the pre-drag value and the first
      // frame after start() jumps back to it.
      lenis.resize();
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };

    // Keyboard scrolling (PageUp/PageDown, Home/End, Space, arrows) is not
    // handled by Lenis at all — it reaches the browser as a native scroll and
    // so hits the same rejection as a scrollbar drag: pressed mid-ease, the
    // key moves the page and Lenis pulls it straight back. Adopting the real
    // position first means the keypress starts from where the page actually
    // is, and the native scroll it causes is then accepted.
    const SCROLL_KEYS = new Set([
      "PageUp",
      "PageDown",
      "Home",
      "End",
      "ArrowUp",
      "ArrowDown",
      " ",
      "Spacebar",
    ]);

    const onKeyDown = (e: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(e.key) || menuIsOpen()) return;
      const t = e.target as HTMLElement | null;
      // Let a focused field, editable region or scrollable widget keep its own
      // key behaviour — these keys move a caret or a listbox there, not the page.
      if (
        t &&
        (t.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) ||
          t.closest("[data-lenis-prevent]"))
      ) {
        return;
      }
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };

    // Capture phase so a stopPropagation() anywhere in the tree cannot hide
    // the gesture from us.
    addEventListener("keydown", onKeyDown, { capture: true });
    addEventListener("pointerdown", onPointerDown, { capture: true });
    addEventListener("pointerup", endScrollbarDrag, { capture: true });
    addEventListener("pointercancel", endScrollbarDrag, { capture: true });
    // A drag released outside the window never fires pointerup on it.
    addEventListener("blur", endScrollbarDrag);

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
      removeEventListener("keydown", onKeyDown, { capture: true });
      removeEventListener("pointerdown", onPointerDown, { capture: true });
      removeEventListener("pointerup", endScrollbarDrag, { capture: true });
      removeEventListener("pointercancel", endScrollbarDrag, { capture: true });
      removeEventListener("blur", endScrollbarDrag);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
