"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { displayFont } from "./tokens";
import { getLenis } from "../../lib/v2/useLenis";
import SidebarMenuV2 from "./SidebarMenuV2";

export default function NavV2() {
  // The menu used to be toggled imperatively from useAbstraktMotion. It now
  // owns its open state in React so the backdrop canvas can be started and
  // stopped with it; the hook reads `data-menu-open` off <html> for the one
  // thing it still needs to know (stand down the scroll-direction nav hide).
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const everOpened = useRef(false);

  // The overlay covers the bar but the bar stays focusable behind it, so hand
  // focus over on open and take it back on close.
  useEffect(() => {
    if (open) {
      everOpened.current = true;
      closeRef.current?.focus({ preventScroll: true });
    } else if (everOpened.current) {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    document.documentElement.dataset.menuOpen = open ? "1" : "0";
    document.body.style.overflow = open ? "hidden" : "";
    // Lenis keeps easing the real scroll position otherwise, and a fixed
    // overlay ends up fighting a scroll it cannot see.
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.menuOpen;
      document.body.style.overflow = "";
      getLenis()?.start();
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);

  const goTo = useCallback((href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>(href);
    setOpen(false);
    if (!target) return;
    e.preventDefault();
    const lenis = getLenis();
    // The effect above restarts Lenis, but it has not run yet at this point —
    // restart it here so the scroll issued on the next frame actually lands.
    lenis?.start();
    requestAnimationFrame(() => {
      if (lenis) lenis.scrollTo(target);
      else target.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  // The overlay variant paints over the bar, but the sidebar's field is
  // frosted glass — the bar would show through it, and its wordmark sits
  // almost exactly under the field's watermark. Fade it out instead; the
  // watermark stands in for it while the menu is open.
  // The sidebar carries its own wordmark and close control, so the bar steps
  // aside entirely while it is open rather than sitting on top of it.
  const hideBar = open;

  return (
    <>
      <div
        data-nav="1"
        inert={hideBar}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          opacity: hideBar ? 0 : 1,
          pointerEvents: hideBar ? "none" : undefined,
          // Was mix-blend-mode: difference, which inverts against whatever is
          // behind it. That reads fine over flat cream and falls apart over
          // photography — the hero parallax and the Works carousel both left
          // the wordmark and pills half-legible. The tone is now switched
          // explicitly per section by useAbstraktMotion, which reads
          // [data-nav-tone] and sets these variables.
          transition: "transform .55s cubic-bezier(.22,1,.36,1), color .3s ease, opacity .35s ease",
          willChange: "transform",
        }}
      >
        <div
          style={{
            maxWidth: 1680,
            margin: "0 auto",
            padding: "20px clamp(18px,3.6vw,60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <a
            href="#top"
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "clamp(18px,2vw,23px)",
              letterSpacing: "-.03em",
              color: "var(--nav-fg,#0E0E0E)",
              transition: "color .3s ease",
              lineHeight: 1,
            }}
          >
            ABSTRAKT<span>.</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Account access, not a third marketing CTA, so it stays lighter
                than the two filled pills — but it cannot be bare text. The
                bar crosses the hero photograph, where `--nav-fg` resolves to
                near-white and the backdrop behind this one element runs from
                a blown-out softbox to dark wall: no single colour is legible
                across it, and a hairline divider disappeared entirely. A
                frosted chip gives the link its own ground so legibility stops
                depending on what is behind it, while a translucent fill and
                no border keep it clearly below the solid pills.

                Points at /admin as a placeholder until a real client-portal
                route exists; repoint the href once one does. */}
            <a
              className="ab-nav-login"
              href="/admin"
              // The label is hidden below 720px, leaving only the glyph —
              // without this the link would have no accessible name there.
              aria-label="Client login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                height: 42,
                padding: "0 16px",
                borderRadius: 999,
                // Fallbacks are the DARK pair: applyTone only sets these on
                // the first rAF, and the page always opens on the hero
                // photograph — defaulting light would flash dark type on the
                // photo for a frame.
                color: "var(--nav-login-fg,#F7F6F3)",
                background: "var(--nav-login-bg,rgba(14,14,14,.42))",
                backdropFilter: "blur(10px) saturate(1.2)",
                WebkitBackdropFilter: "blur(10px) saturate(1.2)",
                transition: "background .3s ease, color .3s ease",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: ".01em",
                whiteSpace: "nowrap",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flex: "0 0 auto", opacity: 0.85 }}
              >
                <rect x="4" y="10.5" width="16" height="10.5" rx="2.2" />
                <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
              </svg>
              <span className="ab-nav-login__label">Client Login</span>
            </a>
            {/* The divider that used to sit here is gone: a 1px hairline at
                18% opacity vanished over the hero photograph, and the chip's
                own edge already separates account access from the CTAs. */}
            <a
              href="#work"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 42,
                padding: "0 20px",
                borderRadius: 999,
                background: "var(--nav-pill-bg,#0E0E0E)",
                color: "var(--nav-pill-fg,#F7F6F3)",
                transition: "background .3s ease, color .3s ease",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".01em",
                whiteSpace: "nowrap",
              }}
            >
              See the work
            </a>
            <button
              type="button"
              ref={toggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                height: 42,
                padding: "0 18px",
                borderRadius: 999,
                background: "var(--nav-pill-bg,#0E0E0E)",
                color: "var(--nav-pill-fg,#F7F6F3)",
                transition: "background .3s ease, color .3s ease",
                border: 0,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "block", width: 15, height: 1.6, background: "var(--nav-pill-fg,#F7F6F3)" }} />
                <span style={{ display: "block", width: 15, height: 1.6, background: "var(--nav-pill-fg,#F7F6F3)" }} />
              </span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      <SidebarMenuV2 open={open} onClose={closeMenu} onNavigate={goTo} closeRef={closeRef} />
    </>
  );
}
