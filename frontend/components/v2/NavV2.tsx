"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { displayFont } from "./tokens";
import { getLenis } from "../../lib/v2/useLenis";
import MenuFieldCanvas from "./MenuFieldCanvas";
import SidebarMenuV2 from "./SidebarMenuV2";
import { NAV_LINKS, SOCIALS, STUDIOS, CONTACTS } from "./menuData";
import "./menu-overlay.css";

export type MenuVariant = "overlay" | "sidebar";

/**
 * Which open-menu treatment ships. Both directions are mounted behind this
 * switch while they are compared — the same "keep both, cut one before
 * launch" arrangement CapabilitiesV2 / CapabilitiesAltV2 use on the page.
 * Append `?menu=overlay` or `?menu=sidebar` to compare without editing code.
 */
const DEFAULT_MENU_VARIANT: MenuVariant = "sidebar";

export default function NavV2({ variant }: { variant?: MenuVariant }) {
  const [menuVariant, setMenuVariant] = useState<MenuVariant>(variant ?? DEFAULT_MENU_VARIANT);

  // Read after mount rather than during render so the server and client agree
  // on the first paint.
  useEffect(() => {
    if (variant) return;
    const q = new URLSearchParams(window.location.search).get("menu");
    if (q === "overlay" || q === "sidebar") setMenuVariant(q);
  }, [variant]);

  // The overlay used to be toggled imperatively from useAbstraktMotion. It now
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
  const hideBar = open && menuVariant === "sidebar";

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

      {menuVariant === "sidebar" ? (
        <SidebarMenuV2 open={open} onClose={closeMenu} onNavigate={goTo} closeRef={closeRef} />
      ) : (
      <div id="menu-overlay" className="mv2" data-menu="1" data-open={open ? "1" : "0"} aria-hidden={!open} inert={!open}>
        <MenuFieldCanvas className="mv2__canvas" active={open} />
        <div className="mv2__glow" />
        <div className="mv2__scrim" />
        <div className="mv2__scrim mv2__scrim--bottom" />

        <div className="mv2__rail">
          <span className="mv2__rail-line" />
          <span className="mv2__rail-text" lang="ne">
            ललितपुर — नेपाल
          </span>
          <span className="mv2__rail-line mv2__rail-line--down" />
        </div>

        <div className="mv2__head">
          <span className="mv2__wordmark">
            ABSTRAKT<span className="mv2__wordmark-dot">.</span>
          </span>
          <div className="mv2__head-actions">
            <a className="mv2__cta" href="#contact" onClick={goTo("#contact")}>
              <span>Start a project</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h13" />
                <path d="M12 6l6 6-6 6" />
              </svg>
            </a>
            <button type="button" ref={closeRef} className="mv2__close" onClick={() => setOpen(false)}>
              <span className="mv2__close-glyph">
                <span />
                <span />
              </span>
              <span>Close</span>
            </button>
          </div>
        </div>

        <div className="mv2__body">
          <nav className="mv2__nav" aria-label="Primary">
            {NAV_LINKS.map((link, i) => (
              <span className="mv2__line" key={link.label}>
                <a
                  className="mv2__link"
                  href={link.href}
                  onClick={goTo(link.href)}
                  style={{ transitionDelay: open ? `${(0.14 + i * 0.06).toFixed(2)}s` : "0s" }}
                >
                  {/* Two stacked copies rolled by 50% on hover — the second one
                      carries the accent colour. */}
                  <span className="mv2__roll">
                    <span className="mv2__word">{link.label}</span>
                    <span className="mv2__word mv2__word--accent">{link.label}</span>
                  </span>
                </a>
              </span>
            ))}
          </nav>

          <div className="mv2__meta">
            <div className="mv2__meta-group">
              <span className="mv2__meta-label">STUDIOS</span>
              <span className="mv2__meta-text">
                {STUDIOS.map((line, i) => (
                  <React.Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </span>
            </div>
            <div className="mv2__meta-group">
              <span className="mv2__meta-label">DIRECT</span>
              {CONTACTS.map((c) => (
                <a
                  key={c.href}
                  className={c.strong ? "mv2__meta-link mv2__meta-link--strong" : "mv2__meta-link"}
                  href={c.href}
                >
                  {c.label}
                </a>
              ))}
            </div>
            <div className="mv2__socials">
              {SOCIALS.map((s) => (
                <a key={s.label} className="mv2__social" href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
