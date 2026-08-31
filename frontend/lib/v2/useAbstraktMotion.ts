"use client";

import { useEffect } from "react";

/**
 * Ports the Abstrakt Home v2 design's scroll/drag/reveal engine into React.
 * Queries the DOM by the same data-* attributes the original vanilla-JS
 * version used, scoped to `rootRef`, and wires click/drag handlers via
 * addEventListener on elements tagged `data-action="..."` rather than React
 * onClick — this keeps the port mechanical and 1:1 with the source.
 */
export function useAbstraktMotion(rootRef: React.RefObject<HTMLElement | null>, deps: React.DependencyList = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends Element = Element>(s: string) => root.querySelector<T>(s);
    const qa = <T extends Element = Element>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const cleanups: Array<() => void> = [];

    // ---------- Menu ----------
    // NavV2 owns the overlay's open state in React and flags it on <html>.
    // The only thing left for this hook is to stand the scroll-direction nav
    // hide down while the overlay is covering the bar.
    const menuIsOpen = () => document.documentElement.dataset.menuOpen === "1";

    // ---------- Person bio reveal ----------
    qa<HTMLElement>('[data-action="toggle-person"]').forEach((btn) => {
      const handler = () => {
        const card = btn.closest<HTMLElement>("[data-person]");
        if (!card) return;
        const on = card.dataset.open !== "1";
        card.dataset.open = on ? "1" : "0";
        const base = btn.offsetWidth || 54;
        const r = card.getBoundingClientRect();
        const inset = 14 + base / 2;
        const size = Math.ceil(2 * Math.sqrt(Math.pow(r.width - inset, 2) + Math.pow(r.height - inset, 2))) + 24;
        const circle = card.querySelector<HTMLElement>("[data-circle]");
        if (circle) {
          circle.style.width = (on ? size : 0) + "px";
          circle.style.height = (on ? size : 0) + "px";
        }
        const panel = card.querySelector<HTMLElement>("[data-panel]");
        const label = card.querySelector<HTMLElement>("[data-label]");
        const icon = btn.querySelector<HTMLElement>("[data-plus-icon]");
        if (panel) {
          panel.style.opacity = on ? "1" : "0";
          panel.style.transform = on ? "translateY(0)" : "translateY(22px)";
          panel.style.transitionDelay = on ? ".3s" : "0s";
        }
        if (label) label.style.opacity = on ? "0" : "1";
        if (icon) icon.style.transform = on ? "rotate(45deg)" : "rotate(0deg)";
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    // ---------- FAQ accordion ----------
    qa<HTMLElement>('[data-action="toggle-faq"]').forEach((btn) => {
      const handler = () => {
        const row = btn.closest<HTMLElement>("[data-faq]");
        if (!row) return;
        const on = row.dataset.open !== "1";
        qa<HTMLElement>("[data-faq]").forEach((r) => {
          if (r === row) return;
          r.dataset.open = "0";
          const b = r.querySelector<HTMLElement>("[data-faq-body]");
          if (b) b.style.maxHeight = "0px";
          const ic = r.querySelector<HTMLElement>("[data-faq-icon]");
          if (ic) ic.style.transform = "rotate(0deg)";
        });
        row.dataset.open = on ? "1" : "0";
        const body = row.querySelector<HTMLElement>("[data-faq-body]");
        const icon = row.querySelector<HTMLElement>("[data-faq-icon]");
        if (body) body.style.maxHeight = on ? body.scrollHeight + "px" : "0px";
        if (icon) icon.style.transform = on ? "rotate(45deg)" : "rotate(0deg)";
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    // ---------- Testimonial carousel ----------
    let qi = 0;
    let dx = 0;
    const quoteStep = () => {
      const c = q<HTMLElement>("[data-quote]");
      return c ? c.offsetWidth + 50 : 500;
    };
    const applyQuote = (anim: boolean) => {
      const cards = qa<HTMLElement>("[data-quote]");
      if (!cards.length) return;
      const n = cards.length;
      const step = quoteStep();
      cards.forEach((card, i) => {
        let pos = (((i - qi) % n) + n) % n;
        if (pos > n - 2) pos = pos - n;
        const stacked = pos < 0;
        card.style.transition = anim ? "transform .6s ease-in-out,opacity .6s ease-in-out" : "none";
        card.style.transform = "translate3d(" + ((stacked ? 0 : pos * step) + (stacked ? 0 : dx)) + "px,0,0) scale(" + (stacked ? 0 : 1) + ")";
        card.style.opacity = stacked ? "0" : "1";
        card.style.zIndex = String(n - Math.abs(pos));
        card.style.pointerEvents = pos === 0 ? "auto" : "none";
      });
    };
    const goQuote = (d: number) => {
      qi += d;
      dx = 0;
      applyQuote(true);
    };
    qa<HTMLElement>('[data-action="prev-quote"]').forEach((btn) => {
      const handler = () => goQuote(-1);
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });
    qa<HTMLElement>('[data-action="next-quote"]').forEach((btn) => {
      const handler = () => goQuote(1);
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });
    const zone = q<HTMLElement>("[data-drag-zone]");
    if (zone) {
      applyQuote(false);
      let sx = 0;
      let dragging = false;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        sx = e.clientX;
        dx = 0;
        try {
          zone.setPointerCapture(e.pointerId);
        } catch {}
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        dx = (e.clientX - sx) * 0.5;
        applyQuote(false);
      };
      const onEnd = () => {
        if (!dragging) return;
        dragging = false;
        const d = dx;
        dx = 0;
        if (d < -20) goQuote(1);
        else if (d > 20) goQuote(-1);
        else applyQuote(true);
      };
      const onResize = () => applyQuote(false);
      zone.addEventListener("pointerdown", onDown);
      zone.addEventListener("pointermove", onMove);
      zone.addEventListener("pointerup", onEnd);
      zone.addEventListener("pointercancel", onEnd);
      zone.addEventListener("lostpointercapture", onEnd);
      addEventListener("resize", onResize);
      cleanups.push(() => {
        zone.removeEventListener("pointerdown", onDown);
        zone.removeEventListener("pointermove", onMove);
        zone.removeEventListener("pointerup", onEnd);
        zone.removeEventListener("pointercancel", onEnd);
        zone.removeEventListener("lostpointercapture", onEnd);
        removeEventListener("resize", onResize);
      });
    }

    // ---------- Magnetic cursor ----------
    const cur = q<HTMLElement>("[data-cursor]");
    const label = q<HTMLElement>("[data-cursor-label]");
    if (cur && !window.matchMedia("(max-width: 900px)").matches) {
      const onMove = (e: MouseEvent) => {
        cur.style.left = e.clientX + "px";
        cur.style.top = e.clientY + "px";
        const t = e.target as HTMLElement | null;
        const inZone = t && t.closest && t.closest("[data-drag-zone]");
        if (inZone) {
          cur.style.opacity = "1";
          cur.style.width = "112px";
          cur.style.height = "112px";
          cur.style.background = "#501EBD";
          if (label) label.style.opacity = "1";
        } else {
          cur.style.opacity = "0";
          cur.style.width = "34px";
          cur.style.height = "34px";
          cur.style.background = "#0E0E0E";
          if (label) label.style.opacity = "0";
        }
      };
      addEventListener("mousemove", onMove, { passive: true });
      cleanups.push(() => removeEventListener("mousemove", onMove));
    }

    // ---------- Generic reveal + stat count-up ----------
    const revealEls = qa<HTMLElement>("[data-r]");
    if (revealEls.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              (en.target as HTMLElement).style.opacity = "1";
              (en.target as HTMLElement).style.transform = "translateY(0)";
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }
    const statEls = qa<HTMLElement>("[data-stat]");
    if (statEls.length) {
      const so = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            so.unobserve(el);
            const to = parseFloat(el.dataset.stat || "0") || 0;
            const suf = el.dataset.suffix || "";
            const t0 = performance.now();
            const dur = 1100;
            const step = (t: number) => {
              const p = Math.min(1, (t - t0) / dur);
              const e = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(to * e) + suf;
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.5 }
      );
      statEls.forEach((el) => so.observe(el));
      cleanups.push(() => so.disconnect());
    }

    // ---------- Live clock ----------
    const clockEl = q<HTMLElement>("[data-clock]");
    if (clockEl) {
      const fmt = (tz: string) => {
        try {
          return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date());
        } catch {
          return "--:--";
        }
      };
      const upd = () => {
        clockEl.textContent = fmt("Asia/Kathmandu") + " NPT · " + fmt("America/Chicago") + " CT";
      };
      upd();
      const clockTimer = setInterval(upd, 30000);
      cleanups.push(() => clearInterval(clockTimer));
    }

    // ---------- Scroll-driven motion ----------
    // The hero's own motion lives in ParallaxLayersV2 (GSAP/ScrollTrigger),
    // not here — this pass covers the sections below it.
    const nav = q<HTMLElement>("[data-nav]");

    // Sections that sit under the nav as dark or photographic ground. Anything
    // unmarked is treated as the page's cream default.
    const toneSections = qa<HTMLElement>("[data-nav-tone]");
    // Sampled at the nav's own vertical midline rather than the viewport top,
    // so the swap lands as the bar crosses the boundary, not before it.
    const NAV_MIDLINE = 46;
    let lastTone = "";

    const applyTone = () => {
      if (!nav) return;
      let tone = "light";
      for (const section of toneSections) {
        const r = section.getBoundingClientRect();
        if (r.top <= NAV_MIDLINE && r.bottom >= NAV_MIDLINE) {
          tone = section.dataset.navTone || "light";
          break;
        }
      }
      if (tone === lastTone) return;
      lastTone = tone;
      const dark = tone === "dark";
      nav.style.setProperty("--nav-fg", dark ? "#F7F6F3" : "#0E0E0E");
      nav.style.setProperty("--nav-pill-bg", dark ? "#F7F6F3" : "#0E0E0E");
      nav.style.setProperty("--nav-pill-fg", dark ? "#0E0E0E" : "#F7F6F3");
    };

    const revealSec = q<HTMLElement>("[data-reveal-sec]");
    const words = qa<HTMLElement>("[data-rw]");
    const workSec = q<HTMLElement>("[data-work-sec]");
    const track = q<HTMLElement>("[data-work-track]");
    const bar = q<HTMLElement>("[data-work-bar]");
    const caps = qa<HTMLElement>("[data-cap]");
    const procSec = q<HTMLElement>("[data-proc-sec]");
    const fill = q<HTMLElement>("[data-proc-fill]");
    const steps = qa<HTMLElement>("[data-step]");
    const wordmark = q<HTMLElement>("[data-wordmark]");
    let lastY = window.scrollY;
    let hidden = false;

    const prog = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const d = r.height - window.innerHeight;
      return d <= 0 ? clamp(1 - r.bottom / window.innerHeight, 0, 1) : clamp(-r.top / d, 0, 1);
    };

    const tick = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      applyTone();
      if (nav && !menuIsOpen()) {
        if (y > lastY && y > 220) {
          if (!hidden) {
            nav.style.transform = "translate3d(0,-120%,0)";
            hidden = true;
          }
        } else if (hidden) {
          nav.style.transform = "translate3d(0,0,0)";
          hidden = false;
        }
      }
      lastY = y;

      if (revealSec && words.length) {
        const p = prog(revealSec) * 1.18;
        const n = words.length;
        for (let i = 0; i < n; i++) {
          const s = i / n;
          const e = (i + 2.2) / n;
          words[i].style.opacity = String(0.14 + 0.86 * clamp((p - s) / (e - s), 0, 1));
        }
      }
      if (workSec && track) {
        const p = prog(workSec);
        const max = Math.max(0, track.scrollWidth - window.innerWidth);
        track.style.transform = "translate3d(" + -p * max + "px,0,0)";
        if (bar) bar.style.width = p * 100 + "%";
      }
      caps.forEach((card, i) => {
        const next = caps[i + 1];
        if (!next) {
          card.style.transform = "none";
          card.style.filter = "none";
          return;
        }
        const r = card.getBoundingClientRect();
        const nr = next.getBoundingClientRect();
        const qv = clamp((r.bottom - nr.top) / r.height, 0, 1);
        card.style.transform = "translate3d(0," + -qv * 30 + "px,0) scale(" + (1 - qv * 0.08) + ")";
        card.style.filter = "brightness(" + (1 - qv * 0.3) + ")";
      });
      if (procSec && fill) {
        const r = procSec.getBoundingClientRect();
        const p = clamp((vh * 0.62 - r.top) / (r.height * 0.78), 0, 1);
        fill.style.height = p * 100 + "%";
        steps.forEach((s, i) => {
          const on = p >= (i + 0.15) / steps.length;
          s.style.opacity = on ? "1" : "0.4";
          const dot = s.querySelector<HTMLElement>("[data-step-dot]");
          if (dot) {
            dot.style.background = on ? "#501EBD" : "#E2E1DB";
            dot.style.transform = on ? "scale(1.35)" : "scale(1)";
          }
        });
      }
      if (wordmark) {
        const r = wordmark.getBoundingClientRect();
        const p = clamp((vh - r.top) / vh, 0, 1);
        wordmark.style.transform = "translate3d(" + (1 - p) * -8 + "%,0,0)";
      }
    };

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        tick();
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    tick();
    cleanups.push(() => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    });

    return () => {
      cleanups.forEach((fn) => fn());
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, ...deps]);
}
