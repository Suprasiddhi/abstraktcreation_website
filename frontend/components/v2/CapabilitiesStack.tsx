"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { displayFont, bodyFont } from "./tokens";

interface Pillar {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
}

interface CapabilitiesStackProps {
  data?: { pillars: Record<string, Pillar> };
}

const FALLBACK_MEDIA = [
  "/images/capabilities/capability-1.png",
  "/images/capabilities/capability-2.png",
  "/images/capabilities/capability-3.png",
  "/images/capabilities/capability-4.png",
  "/images/capabilities/capability-5.png",
];

const ACCENT = "#501EBD";
const OVERLAP = 24;
const HEAD_VW = 0.2;
const HEAD_MIN_PX = 220;
const HEAD_MAX_PX = 380;
const SKEW = 20;
const HOVER_GROWTH = 1.62;
const IDLE = { num: "rgba(22,23,26,0.82)", name: "rgba(22,23,26,0.8)", img: "none" };
const DIM = { num: "rgba(22,23,26,0.4)", name: "rgba(22,23,26,0.4)", img: "grayscale(1) brightness(1.12) contrast(0.9)" };

function splitLines(name: string): string[] {
  const w = name.toUpperCase().split(/\s+/);
  if (w.length <= 2) return w;
  let best = 1, diff = Infinity;
  for (let k = 1; k < w.length; k++) {
    const d = Math.abs(w.slice(0, k).join(" ").length - w.slice(k).join(" ").length);
    if (d < diff) { diff = d; best = k; }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
}

export default function CapabilitiesStack({ data }: CapabilitiesStackProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const headRef = useRef<HTMLDivElement | null>(null);
  const probeRef = useRef<HTMLSpanElement | null>(null);

  const items = useMemo(() => {
    const pillarList = Object.values(data?.pillars || {})
      .filter((p) => p && (p.title || p.label))
      .sort((a, b) => {
        const na = parseInt(a.id || "", 10);
        const nb = parseInt(b.id || "", 10);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return (a.id || "").localeCompare(b.id || "");
      });

    return pillarList.map((pillar, i) => {
      const name = pillar.title || pillar.label || "";
      return {
        num: String(i + 1).padStart(2, "0"),
        name,
        lines: splitLines(name),
        desc: pillar.description || "",
        image: pillar.imageUrl || FALLBACK_MEDIA[i % FALLBACK_MEDIA.length],
      };
    });
  }, [data]);

  const longestLine = useMemo(
    () => items.map((it) => it.lines).reduce((a, b) => a.concat(b), [] as string[]).reduce((a, b) => (b.length > a.length ? b : a), ""),
    [items]
  );

  useEffect(() => {
    if (!items.length) return;
    const wrap = wrapRef.current;
    const strip = stripRef.current;
    if (!wrap || !strip) return;

    const panels = panelsRef.current.filter(Boolean);
    const head = headRef.current;
    panels.forEach((p, i) => { p.style.zIndex = String(50 - i); });

    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;transition:none;white-space:nowrap;font-family:" + displayFont + ";font-weight:500;letter-spacing:0.13em;text-transform:uppercase";
    strip.appendChild(probe);
    probeRef.current = probe;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let advance = 0;
    let baseW = 200;
    let headW = 0;
    let headExtra = 0;
    let headMin = 0;
    let maxX = 0;
    let measured = false;
    let fitKey: string | null = null;
    let headKey: string | null = null;
    let nameSize = 19;
    let hovered = -1;
    let cur = 0, target = 0, entry = 0, entryCur = 0;
    let raf = 0;
    let frame = 0;

    function safe(fn: () => boolean | void): boolean {
      try { return fn() !== false; } catch { return false; }
    }

    function measure(): boolean {
      if (!wrap || !strip || !panels.length) return false;
      if (window.innerWidth < 200 || window.innerHeight < 200) return false;
      const ph = panels[0] ? panels[0].offsetHeight : 0;
      if (ph < 100) return false;
      vw = window.innerWidth;
      vh = window.innerHeight;
      const inView = vw < 1100 ? 4 : 5;
      headW = Math.max(Math.min(vw * HEAD_VW, HEAD_MAX_PX), HEAD_MIN_PX, headMin);
      advance = (vw + OVERLAP - headW - headExtra) / inView;
      baseW = Math.max(150, advance + OVERLAP);
      if (head && hovered < 0) head.style.width = headW + headExtra + "px";
      if (hovered < 0) panels.forEach((p) => { p.style.width = baseW + "px"; });
      const stripW = headW + headExtra + advance * panels.length;
      maxX = Math.max(0, stripW - vw + OVERLAP + 24);
      wrap.style.height = vh + Math.max(400, maxX * 1.25) + "px";
      measured = true;
      return true;
    }

    function applySkew(): boolean {
      const s = SKEW;
      if (!panels.length || !measured) return false;
      const h = panels[0] ? panels[0].offsetHeight : 0;
      if (h < 100) return false;
      const tan = Math.tan((s * Math.PI) / 180);
      const covered = OVERLAP;
      const contentW = Math.max(60, baseW - OVERLAP - covered - 6);
      const key = contentW + "|" + s + "|" + ((document.fonts && (document.fonts as any).status) || "");
      if (fitKey !== key && probe) {
        fitKey = key;
        probe.style.fontSize = "100px";
        probe.textContent = longestLine;
        const w = probe.getBoundingClientRect().width || 1;
        nameSize = Math.max(15, Math.min(24, Math.floor((contentW / w) * 200) / 2));
      }
      if (head && strip) {
        const title = head.querySelector('[data-role="head-title"]') as HTMLElement | null;
        headExtra = Math.ceil(tan * h * 0.5);
        head.style.marginLeft = headExtra + "px";
        strip.style.paddingLeft = "0px";
        if (hovered < 0) head.style.width = headW + "px";
        head.style.transform = `skewX(${-s}deg)`;
        if (title) {
          title.style.transform = `translate(-50%,-50%) skewX(${s}deg) rotate(${-(90 - s)}deg)`;
          const hk = Math.round(h) + "|" + s + "|" + ((document.fonts && (document.fonts as any).status) || "");
          if (headKey !== hk) {
            headKey = hk;
            title.style.fontSize = "100px";
            const w = title.scrollWidth || 1;
            const fitLen = ((h * 0.94) / Math.cos((s * Math.PI) / 180) / w) * 100;
            const rad = (s * Math.PI) / 180;
            const band = (0.78 * fitLen) / Math.cos(rad);
            const need = Math.ceil(band + 18);
            if (Math.abs(need - headMin) > 2) {
              headMin = need;
              measure();
              if (hovered < 0) head.style.width = headW + "px";
            }
            title.style.fontSize = Math.max(28, Math.round(fitLen)) + "px";
            const titleLeft = headW / 2;
            title.style.left = titleLeft + "px";
          }
        }
      }
      panels.forEach((p) => {
        const img = p.querySelector('[data-role="img"]') as HTMLElement | null;
        const txt = p.querySelector('[data-role="text"]') as HTMLElement | null;
        if (img) {
          const bleed = Math.ceil(tan * h) + 12;
          img.style.left = -bleed + "px";
          img.style.width = `calc(100% + ${bleed * 2}px)`;
          img.style.transform = `skewX(${s}deg)`;
        }
        if (!txt) return;
        p.style.marginLeft = -OVERLAP + "px";
        txt.style.left = covered + "px";
        txt.style.right = OVERLAP + 6 + "px";
        txt.style.transform = `skewX(${s}deg)`;
        txt.style.transformOrigin = "center";
        const isHovered = panels.indexOf(p) === hovered;
        const size = nameSize || 19;
        const numSize = Math.round(size * 3.6);
        txt.querySelectorAll('[data-role="nameline"]').forEach((nm) => {
          const el = nm as HTMLElement;
          el.dataset.base = String(size);
          el.style.fontSize = (isHovered ? size * 1.26 : size) + "px";
        });
        const num = txt.querySelector('[data-role="num"]') as HTMLElement | null;
        if (num) {
          num.dataset.base = String(numSize);
          num.style.fontSize = (isHovered ? numSize * 1.22 : numSize) + "px";
        }
      });
      return true;
    }

    function settle(tries: number) {
      const ok = safe(() => measure()) && safe(() => applySkew());
      safe(() => {
        updateTargetOnly();
        cur = target;
        entryCur = entry;
        paint(1);
      });
      if (!ok && tries < 24) setTimeout(() => settle(tries + 1), 40);
    }

    function updateTargetOnly() {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const span = wrap.offsetHeight - vh;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      target = p * maxX;
      entry = Math.min(1, Math.max(0, 1 - r.top / (vh * 0.85)));
    }

    function updateTarget() {
      if (!wrap) return;
      updateTargetOnly();
      paint(0.5);
    }

    function paint(k: number) {
      if (!strip || !panels.length) return;
      cur += (target - cur) * k;
      entryCur += (entry - entryCur) * Math.min(1, k * 1.3);
      if (Math.abs(target - cur) < 0.05) cur = target;
      strip.style.transform = `translate3d(${-cur}px,0,0)`;
      const e = entryCur, s = SKEW;
      panels.forEach((p, i) => {
        const stagger = Math.min(1, Math.max(0, e * 1.9 - i * 0.05));
        p.style.transform = `translate3d(0,${(1 - stagger) * 120}px,0) skewX(${-s}deg)`;
        p.style.opacity = String(0.15 + stagger * 0.85);
      });
    }

    function setHover(i: number) {
      hovered = i;
      if (!panels.length || !baseW) return;
      const n = panels.length + 1, g = HOVER_GROWTH;
      const shrink = 1 - (g - 1) / (n - 1);
      if (head && headW) {
        head.style.width = (i < 0 ? headW : headW * shrink) + headExtra + "px";
        head.style.transition = "width 880ms cubic-bezier(.16,1,.3,1)";
      }
      const padHover = Math.round((baseW * (g - 1)) / 2.6);
      panels.forEach((p, idx) => {
        const on = idx === i;
        p.style.width = (i < 0 ? baseW : baseW * (on ? g : shrink)) + "px";
        const stack = p.querySelector('[data-role="stack"]') as HTMLElement | null;
        if (stack) stack.style.paddingLeft = on ? padHover + "px" : "0px";
        const img = p.querySelector('[data-role="img"]') as HTMLElement | null;
        const wash = p.querySelector('[data-role="wash-in"]') as HTMLElement | null;
        const num = p.querySelector('[data-role="num"]') as HTMLElement | null;
        const rev = p.querySelector('[data-role="reveal"]') as HTMLElement | null;
        if (img) img.style.filter = on ? "saturate(1.06) contrast(1.02) brightness(0.92)" : (i < 0 ? IDLE.img : DIM.img);
        if (wash) {
          wash.style.transform = on ? "scale(1)" : "scale(.08)";
          wash.style.opacity = on ? "1" : "0";
        }
        if (num) {
          num.style.color = on ? ACCENT : (i < 0 ? IDLE.num : DIM.num);
          const b = parseFloat(num.dataset.base || "70");
          num.style.fontSize = (on ? b * 1.22 : b) + "px";
        }
        p.querySelectorAll('[data-role="nameline"]').forEach((nm) => {
          const el = nm as HTMLElement;
          el.style.color = on ? ACCENT : (i < 0 ? IDLE.name : DIM.name);
          const b = parseFloat(el.dataset.base || "19");
          el.style.fontSize = (on ? b * 1.26 : b) + "px";
        });
        if (rev) {
          rev.style.gridTemplateRows = on ? "1fr" : "0fr";
          rev.style.opacity = on ? "1" : "0";
        }
      });
    }

    const onScroll = () => safe(() => { updateTarget(); return true; });
    const onResize = () => safe(() => { measure(); applySkew(); updateTarget(); return true; });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let ro: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => safe(() => { measure(); applySkew(); updateTarget(); return true; }));
      ro.observe(strip);
    }

    let fontsCleanup = () => {};
    if (document.fonts && document.fonts.ready) {
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        safe(() => {
          fitKey = null; headKey = null;
          measure(); applySkew(); updateTarget();
          return true;
        });
      });
      fontsCleanup = () => { cancelled = true; };
    }

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame = frame + 1;
      try {
        if (frame % 30 === 0) { if (measure() !== false) applySkew(); updateTargetOnly(); }
        paint(0.085);
      } catch {
        // never break the chain
      }
    };
    raf = requestAnimationFrame(tick);
    settle(0);

    const panelHandlers: Array<{ el: HTMLDivElement; enter: () => void; leave: () => void }> = [];
    panels.forEach((p, i) => {
      const enter = () => setHover(i);
      const leave = () => setHover(-1);
      p.addEventListener("mouseenter", enter);
      p.addEventListener("mouseleave", leave);
      panelHandlers.push({ el: p, enter, leave });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      fontsCleanup();
      cancelAnimationFrame(raf);
      panelHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      probe.remove();
    };
  }, [items, longestLine]);

  if (!items.length) return null;

  return (
    <section id="capabilities" data-screen-label="Capabilities" style={{ scrollMarginTop: 90 }}>
      <style>{`
        @keyframes capNudge { 0%,100% { transform: translateY(0); opacity: .45 } 50% { transform: translateY(9px); opacity: 1 } }
      `}</style>
      <div style={{ background: "#f5f4f2", color: "#16171a", fontFamily: bodyFont, overflowX: "clip" }}>
        <div ref={wrapRef} style={{ position: "relative", height: "calc(100vh + 62vw)" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#faf9f7" }}>
            <div ref={stripRef} style={{ position: "absolute", top: 0, left: 0, height: "100%", display: "flex", alignItems: "stretch", willChange: "transform" }}>

              <div
                ref={headRef}
                style={{
                  position: "relative",
                  flex: "0 0 auto",
                  width: 200,
                  height: "100%",
                  overflow: "hidden",
                  background: "#faf9f7",
                  transform: "skewX(-20deg)",
                  marginLeft: -24,
                  boxShadow: "-1px 0 0 rgba(255,255,255,.6), 16px 0 26px rgba(20,20,22,.34), 44px 0 70px rgba(20,20,22,.2)",
                  zIndex: 60,
                }}
              >
                <div
                  data-role="head-title"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%) skewX(20deg) rotate(-70deg)",
                    transformOrigin: "center",
                    fontFamily: displayFont,
                    fontWeight: 700,
                    fontSize: 130,
                    lineHeight: 0.86,
                    letterSpacing: ".005em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    color: ACCENT,
                    pointerEvents: "none",
                  }}
                >
                  Capabilities
                </div>
              </div>

              {items.map((item, i) => (
                <div
                  key={item.num + item.name}
                  ref={(el) => { if (el) panelsRef.current[i] = el; }}
                  data-role="panel"
                  style={{
                    position: "relative",
                    flex: "0 0 auto",
                    width: 230,
                    height: "100%",
                    marginLeft: -24,
                    transform: "skewX(-20deg)",
                    overflow: "hidden",
                    background: "#dedbd6",
                    boxShadow: "-1px 0 0 rgba(255,255,255,.6), 16px 0 26px rgba(20,20,22,.34), 44px 0 70px rgba(20,20,22,.2)",
                    transition: "width 880ms cubic-bezier(.16,1,.3,1)",
                    cursor: "pointer",
                  }}
                >
                  <div data-role="img" style={{ position: "absolute", top: -2, bottom: -2, left: "-60%", width: "220%", transform: "skewX(20deg)", filter: "none", transition: "filter 880ms cubic-bezier(.16,1,.3,1)" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>

                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(196deg,rgba(245,244,242,.06) 0%,rgba(245,244,242,.3) 48%,rgba(245,244,242,.74) 100%)", pointerEvents: "none" }} />

                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                    <div
                      data-role="wash-in"
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        width: "230%",
                        height: "230%",
                        transform: "scale(.08)",
                        transformOrigin: "0% 100%",
                        opacity: 0,
                        background: "radial-gradient(circle at 0% 100%, rgba(251,250,247,.98) 0%, rgba(251,250,247,.94) 38%, rgba(251,250,247,.62) 58%, rgba(251,250,247,.18) 74%, rgba(251,250,247,0) 86%)",
                        transition: "transform 1020ms cubic-bezier(.16,1,.3,1), opacity 620ms ease",
                      }}
                    />
                  </div>

                  <div data-role="text" style={{ position: "absolute", left: 24, right: 30, top: 0, bottom: 0, pointerEvents: "none", transform: "skewX(20deg)", transformOrigin: "center" }}>
                    <div data-role="stack" style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "flex-start", transition: "padding-left 880ms cubic-bezier(.16,1,.3,1)" }}>
                      <div data-role="num" style={{ fontFamily: displayFont, fontWeight: 200, fontSize: 70, lineHeight: 1, letterSpacing: ".02em", color: "rgba(22,23,26,.88)", transition: "color 620ms ease, font-size 760ms cubic-bezier(.16,1,.3,1)" }}>
                        {item.num}
                      </div>
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                        {item.lines.map((line, li) => (
                          <div
                            key={li}
                            data-role="nameline"
                            style={{ fontFamily: displayFont, fontWeight: 500, fontSize: 19, letterSpacing: ".13em", lineHeight: 1.3, textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(22,23,26,.92)", transition: "color 620ms ease, font-size 760ms cubic-bezier(.16,1,.3,1)" }}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                      <div data-role="reveal" style={{ display: "grid", gridTemplateRows: "0fr", width: "100%", opacity: 0, transition: "grid-template-rows 820ms cubic-bezier(.16,1,.3,1), opacity 520ms ease 60ms" }}>
                        <div style={{ overflow: "hidden", minHeight: 0 }}>
                          <div style={{ paddingTop: 18, paddingLeft: 18, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 13 }}>
                            <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(22,23,26,.78)" }}>{item.desc}</div>
                            <div style={{ fontFamily: displayFont, fontWeight: 500, fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase", color: ACCENT, borderBottom: `1px solid ${ACCENT}73`, paddingBottom: 5 }}>
                              View work
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
