"use client";

import React from "react";
import { NAV_LINKS, SOCIALS, CONTACTS } from "./menuData";
import "./menu-sidebar.css";

/**
 * The open menu as a right-hand rail — based on the `menu-sidebar.dc.html`
 * design canvas, and the alternative to the full-screen panel in NavV2.
 *
 * One deliberate departure from the artboard: it backed the rail with the
 * same animated wave field as the full-screen menu, over an opaque charcoal
 * ground. That made a sidebar behave like a full takeover — the page it was
 * summoned from disappeared completely. Here the area beside the rail is
 * frosted glass instead: the page stays visible, blurred and lightly veiled,
 * so the menu reads as a layer above the site rather than a replacement for
 * it. See menu-sidebar.css for the treatment.
 *
 * Presentation only: NavV2 still owns the open state, focus handoff, Lenis
 * stop/start and Escape handling, so the two variants behave identically and
 * differ only in how they look.
 */

interface SidebarMenuV2Props {
  open: boolean;
  onClose: () => void;
  /** Smooth-scrolls to an in-page target and closes the menu. */
  onNavigate: (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function SidebarMenuV2({ open, onClose, onNavigate, closeRef }: SidebarMenuV2Props) {
  return (
    <div id="menu-overlay" className="ms2" data-menu="1" data-open={open ? "1" : "0"} aria-hidden={!open} inert={!open}>
      {/* Frosted glass over the live page. Dismisses on click, and is
          deliberately not a <button>: the panel's Close button and the Escape
          key already cover keyboard users, and a full-height control here
          would only add a duplicate tab stop. */}
      <div className="ms2__field" onClick={onClose}>
        <span className="ms2__mark">
          ABSTRAKT<span className="ms2__mark-dot">.</span>
        </span>
      </div>

      <aside className="ms2__panel">
        <div className="ms2__head">
          <span className="ms2__wordmark">
            ABSTRAKT<span className="ms2__wordmark-dot">.</span>
          </span>
          <button type="button" ref={closeRef} className="ms2__close" onClick={onClose} aria-label="Close menu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14" />
              <path d="M19 5L5 19" />
            </svg>
          </button>
        </div>

        <nav className="ms2__nav" aria-label="Primary">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              className="ms2__link"
              href={link.href}
              onClick={onNavigate(link.href)}
              style={{ transitionDelay: open ? `${(0.14 + i * 0.06).toFixed(2)}s` : "0s" }}
            >
              <span className="ms2__roll">
                <span className="ms2__word">{link.label}</span>
                <span className="ms2__word ms2__word--accent">{link.label}</span>
              </span>
            </a>
          ))}
        </nav>

        <a className="ms2__cta" href="#contact" onClick={onNavigate("#contact")}>
          <span>Start a project</span>
          <span className="ms2__cta-arrow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h13" />
              <path d="M12 6l6 6-6 6" />
            </svg>
          </span>
        </a>

        <div className="ms2__rule" />

        <div className="ms2__meta">
          <span className="ms2__meta-label">DIRECT</span>
          {CONTACTS.map((c) => (
            <a
              key={c.href}
              className={c.strong ? "ms2__meta-link ms2__meta-link--strong" : "ms2__meta-link"}
              href={c.href}
            >
              {c.label}
            </a>
          ))}
        </div>

        <div className="ms2__socials">
          {SOCIALS.map((s) => (
            <a key={s.label} className="ms2__social" href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
              {s.icon}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}
