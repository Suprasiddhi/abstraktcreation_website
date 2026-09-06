"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BRAND } from "./tokens";

/**
 * Capabilities petal flower — ported from the "AA Capabilities" Claude
 * Design handoff (website-aa-capabilities-section). Replaces the previous
 * skewed-panel CapabilitiesStack: same section anchor (#capabilities) and
 * reveal/screen-label conventions, entirely different presentation.
 *
 * CMS-driven, same as the component it replaced: `pillars` comes from the
 * API (or the sessionStorage cache) via the same prop shape CapabilitiesStack
 * used, and the admin's existing "Manage Services" panel edits it exactly as
 * before. The handoff's six petals had per-petal icons baked in that the CMS
 * `pillars` schema has no field for — icons are kept as decoration only,
 * cycling through the handoff's six by position. The click-to-reveal detail
 * strip is fed from `tag` (the closest existing field in shape and intent)
 * rather than dropped. Petal count follows however many pillars the CMS
 * returns (today: 4), not a fixed 6, so the angle/orbit geometry below is
 * generated rather than hardcoded — evenly spaced at 360°/n instead of the
 * handoff's fixed 6-way top/upper-left/upper-right/... visual order.
 *
 * Petals sit evenly around a centre disc, each an absolutely positioned
 * 470×470 wrapper rotated into place — the SVG path itself is always drawn
 * "up" and rotation does the layout, which is what lets one petal shape ring
 * a circle without a bespoke path per item. Content inside each petal
 * counter-rotates so its text reads upright.
 */

interface Pillar {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
}

interface CapabilitiesPetalsProps {
  data?: { pillars: Record<string, Pillar> };
}

// Decorative only — the CMS has no icon field, so a pillar's icon is picked
// by its position in the sorted list, cycling through this set. A pillar
// count above 6 repeats icons rather than running out.
const ICONS: React.ReactNode[] = [
  <svg key="web" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
    <path d="M9 20.5h6M12 16.5v4" />
    <path d="M9.5 11.5 12 8.5l2.5 3" />
  </svg>,
  <svg key="brand" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5 18.5 9 12 21.5 5.5 9Z" />
    <circle cx="12" cy="9.8" r="2.1" />
  </svg>,
  <svg key="mobile" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 18.8h3" />
  </svg>,
  <svg key="marketing" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5v3l14.5 5V5.5Z" />
    <path d="M7 12.8v4.4a2.2 2.2 0 0 0 4.4 0v-3" />
    <path d="M20.5 9.5v5" />
  </svg>,
  <svg key="uiux" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.6 20.5 7.3v9.4L12 21.4 3.5 16.7V7.3Z" />
    <path d="M3.5 7.3 12 12l8.5-4.7M12 12v9.4" />
  </svg>,
  <svg key="creative" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.8 2.8 21.2 7.2 12 16.4 7.6 12Z" />
    <path d="M7.6 12.6 4 20.6l8-3.6" />
  </svg>,
];

const EASE = "cubic-bezier(.22,.9,.24,1)";
const PETAL_PATH =
  "M 196 386 Q 200 392 204 386 L 341 144 Q 352 122 332 110 Q 200 20 68 110 Q 48 122 59 144 Z";

const serif = "var(--font-instrument-serif), 'Instrument Serif', serif";
const sans = "var(--font-manrope), 'DM Sans', sans-serif";

function soft(a: number) {
  return `rgba(17,17,24,${a})`;
}
function acc(a: number) {
  const n = parseInt(BRAND.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export default function CapabilitiesPetals({ data }: CapabilitiesPetalsProps) {
  const [mobile, setMobile] = useState(false);
  const [phase, setPhase] = useState<"hidden" | "blooming" | "done">("hidden");
  const [hover, setHover] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [cursorOn, setCursorOn] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const flowerRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<{ fallback?: number; bloom?: number }>({});

  const items = useMemo(() => {
    const pillarList = Object.values(data?.pillars || {})
      .filter((p) => p && (p.title || p.label))
      .sort((a, b) => {
        const na = parseInt(a.id || "", 10);
        const nb = parseInt(b.id || "", 10);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return (a.id || "").localeCompare(b.id || "");
      });

    return pillarList.map((pillar, i) => ({
      icon: ICONS[i % ICONS.length],
      num: String(i + 1).padStart(2, "0"),
      title: pillar.title || pillar.label || "",
      desc: pillar.description || "",
      // The handoff's click-to-reveal strip held a short list of specifics
      // ("Design systems · CMS · Speed") with no CMS field behind it. `tag`
      // is the closest existing field in shape and intent — comma-separated
      // in the CMS, so it's re-joined with the handoff's "·" separator
      // rather than showing raw commas.
      detail: (pillar.tag || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(" · "),
    }));
  }, [data]);

  // Evenly spaced around the ring rather than a fixed 60°, so any pillar
  // count from the CMS lays out correctly — 4 today, but not assumed.
  const angles = useMemo(() => {
    const n = items.length || 1;
    return items.map((_, i) => Math.round((i * 360) / n));
  }, [items]);

  // Responsive: petal ring collapses to a stacked card list below 1180px,
  // matching the design's own mobile fallback (petals are unreadable
  // shrunk into a phone width).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1180px)");
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Bloom-in once the flower scrolls into view, with a fallback timer so a
  // ref that never intersects (rare, but IntersectionObserver support or
  // layout edge cases) still reveals instead of staying hidden forever.
  useEffect(() => {
    const el = flowerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPhase("blooming");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase((p) => (p === "hidden" ? "blooming" : p));
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    timers.current.fallback = window.setTimeout(() => setPhase((p) => (p === "hidden" ? "blooming" : p)), 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(timers.current.fallback);
    };
  }, []);

  useEffect(() => {
    if (phase !== "blooming") return;
    const t = window.setTimeout(() => setPhase("done"), 1700);
    return () => window.clearTimeout(t);
  }, [phase]);

  const anyOn = hover !== null || active !== null;
  const shown = phase !== "hidden";
  const done = phase === "done";

  const wash = "#f3efff";

  if (!items.length) return null;

  return (
    <section id="capabilities" data-reveal="1" data-depth="flat" data-screen-label="Capabilities" style={{ scrollMarginTop: 90 }}>
      <style>{`
        @keyframes aaBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.014); } }
        @keyframes aaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes aaSpinBack { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          boxSizing: "border-box",
          background: anyOn ? wash : "#ffffff",
          transition: "background 900ms ease",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: mobile ? "64px 22px 76px" : "60px 48px",
        }}
      >
        {/* Dotted texture, top-right — matches the reference's quiet corner
            detail rather than leaving that quadrant bare. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "34%",
            height: "46%",
            backgroundImage: "radial-gradient(rgba(17,17,24,0.10) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            opacity: 0.4,
            pointerEvents: "none",
            maskImage: "linear-gradient(215deg, #000 0%, transparent 62%)",
            WebkitMaskImage: "linear-gradient(215deg, #000 0%, transparent 62%)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: mobile ? 560 : 1560,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "minmax(300px,1fr) 960px",
            alignItems: "center",
            gap: mobile ? 40 : 32,
          }}
        >
          <div style={{ maxWidth: 440 }}>
            <div
              data-rv="eyebrow"
              style={{ fontFamily: sans, fontSize: 12, fontWeight: 500, letterSpacing: ".28em", color: BRAND, marginBottom: 20 }}
            >
              CAPABILITIES
            </div>
            <h2
              data-rv="up"
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: mobile ? 42 : 56,
                lineHeight: 1.08,
                letterSpacing: "-0.012em",
                color: "#0b0b10",
                margin: "0 0 30px",
              }}
            >
              Everything we do is built to move your brand forward.
            </h2>
            <div
              style={{
                width: anyOn ? 120 : 84,
                height: 1,
                background: anyOn ? BRAND : "#1a1a22",
                marginBottom: 30,
                transition: `width 700ms ${EASE}, background 500ms ease`,
              }}
            />
            <p
              data-rv="up"
              style={{
                ["--rv-i" as string]: 1,
                fontFamily: sans,
                fontSize: 15.5,
                lineHeight: 1.75,
                color: "#63636f",
                margin: 0,
                maxWidth: 352,
              }}
            >
              Six disciplines, one team. We take an idea from first sketch through launch and keep it sharp long after.
            </p>
          </div>

          <div
            ref={flowerRef}
            onMouseMove={(e) => {
              setMouse({ x: e.clientX, y: e.clientY });
              if (!cursorOn) setCursorOn(true);
            }}
            onMouseEnter={() => !mobile && setCursorOn(true)}
            onMouseLeave={() => {
              setCursorOn(false);
              setHover(null);
            }}
            style={{
              position: "relative",
              justifySelf: mobile ? "stretch" : "center",
              width: mobile ? "100%" : 960,
              height: mobile ? "auto" : 960,
              cursor: !mobile ? "none" : "default",
            }}
          >
            <div
              style={
                mobile
                  ? { display: "flex", flexDirection: "column", gap: 14, width: "100%" }
                  : {
                      position: "absolute",
                      inset: 0,
                      animation: "aaBreathe 7s ease-in-out infinite",
                      animationPlayState: anyOn ? "paused" : "running",
                    }
              }
            >
              {!mobile && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 928,
                      height: 928,
                      marginLeft: -464,
                      marginTop: -464,
                      borderRadius: "50%",
                      border: `1.5px dashed ${anyOn ? acc(0.55) : soft(0.26)}`,
                      animation: "aaSpin 40s linear infinite",
                      transition: "border-color 600ms ease",
                    }}
                  />
                  <div style={{ position: "absolute", inset: 0, animation: "aaSpinBack 40s linear infinite" }}>
                    {angles.map((angDeg, i) => {
                      const a = ((angDeg - 90) * Math.PI) / 180;
                      const r = 464;
                      return (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: `calc(50% + ${(Math.cos(a) * r).toFixed(1)}px)`,
                            top: `calc(50% + ${(Math.sin(a) * r).toFixed(1)}px)`,
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            marginLeft: -3.5,
                            marginTop: -3.5,
                            background: anyOn ? BRAND : "#15151c",
                            transform: anyOn ? "scale(1.35)" : "scale(1)",
                            transition: `background 480ms ease, transform 520ms ${EASE}`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {items.map((item, i) => {
                const ang = angles[i];
                const isH = hover === i;
                const isA = active === i;
                const lit = isH || isA;
                const sc = isA ? 1.06 : isH ? 1.035 : 1;
                const out = isA ? -46 : isH ? -40 : -30;
                const delay = done ? "0ms" : `${i * 130}ms`;

                const onEnter = () => setHover(i);
                const onLeave = () => setHover(null);
                const onClick = () => {
                  setActive((cur) => (cur === i ? null : i));
                  setHover(i);
                };

                const wrapStyle: React.CSSProperties = mobile
                  ? {
                      position: "relative",
                      background: lit ? BRAND : "#fff",
                      border: `1px solid ${lit ? BRAND : soft(0.08)}`,
                      borderRadius: 18,
                      padding: "20px 22px 22px",
                      cursor: "pointer",
                      width: "100%",
                      boxSizing: "border-box",
                      opacity: shown ? 1 : 0,
                      transform: shown ? "translateY(0)" : "translateY(22px)",
                      boxShadow: lit ? `0 16px 34px ${acc(0.16)}` : `0 6px 18px ${soft(0.04)}`,
                      transition: `opacity 600ms ease ${delay}, transform 700ms ${EASE} ${delay}, background 380ms ease, border-color 380ms ease, box-shadow 420ms ease`,
                    }
                  : {
                      position: "absolute",
                      left: "calc(50% - 235px)",
                      top: "calc(50% - 456px)",
                      width: 470,
                      height: 470,
                      transformOrigin: "235px 456px",
                      pointerEvents: "none",
                      zIndex: isA ? 6 : isH ? 5 : 2,
                      willChange: "transform",
                      opacity: shown ? 1 : 0,
                      transform: `rotate(${ang}deg) translateY(${shown ? out : 6}px) scale(${shown ? sc : 0.44})`,
                      transition: done
                        ? `transform 620ms ${EASE}, opacity 300ms ease`
                        : `transform 1100ms ${EASE} ${delay}, opacity 700ms ease ${delay}`,
                    };

                const contentStyle: React.CSSProperties = mobile
                  ? { position: "static", textAlign: "left" }
                  : {
                      position: "absolute",
                      left: "50%",
                      top: "28%",
                      width: 200,
                      transform: `translateX(-50%) rotate(${-ang}deg)`,
                      textAlign: "center",
                      pointerEvents: "auto",
                      cursor: "pointer",
                    };

                return (
                  <div key={item.num} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick} style={wrapStyle}>
                    {!mobile && (
                      <svg
                        viewBox="0 0 400 400"
                        width="470"
                        height="470"
                        style={{
                          display: "block",
                          overflow: "visible",
                          filter: lit ? `drop-shadow(0 24px 48px ${acc(0.26)})` : `drop-shadow(0 12px 26px ${soft(0.05)})`,
                          transition: "filter 480ms ease",
                        }}
                      >
                        <path
                          d={PETAL_PATH}
                          onMouseEnter={onEnter}
                          onMouseLeave={onLeave}
                          onClick={onClick}
                          style={{
                            fill: lit ? BRAND : "#fdfdff",
                            stroke: lit ? acc(0.6) : soft(0.07),
                            strokeWidth: lit ? 1.6 : 1.2,
                            pointerEvents: "auto",
                            cursor: "pointer",
                            transition: "fill 400ms ease, stroke 400ms ease, stroke-width 400ms ease",
                          }}
                        />
                      </svg>
                    )}
                    <div onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick} style={contentStyle}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: mobile ? "0 0 12px" : "0 auto 10px",
                          background: lit ? "rgba(255,255,255,0.2)" : "#f4f4f8",
                          color: lit ? "#ffffff" : "#3c3c48",
                          transform: lit ? "scale(1.06)" : "scale(1)",
                          transition: `background 400ms ease, color 400ms ease, transform 520ms ${EASE}`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: 11.5,
                          fontWeight: 500,
                          letterSpacing: "0.22em",
                          color: lit ? "rgba(255,255,255,0.9)" : "#b7b7c3",
                          transition: "color 380ms ease",
                        }}
                      >
                        {item.num}
                      </div>
                      <div
                        style={{
                          fontFamily: serif,
                          fontSize: mobile ? 25 : 21,
                          lineHeight: 1.16,
                          marginTop: 6,
                          letterSpacing: "0.005em",
                          color: lit ? "#ffffff" : "#0d0d12",
                          transition: "color 380ms ease",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: mobile ? 14 : 12,
                          lineHeight: 1.55,
                          marginTop: 7,
                          color: lit ? "rgba(255,255,255,0.82)" : "#71717d",
                          transition: "color 380ms ease",
                        }}
                      >
                        {item.desc}
                      </div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: 10.5,
                          letterSpacing: "0.05em",
                          lineHeight: 1.5,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          color: lit ? "rgba(255,255,255,0.95)" : BRAND,
                          maxHeight: isA ? 30 : 0,
                          opacity: isA ? 1 : 0,
                          marginTop: isA ? 8 : 0,
                          paddingTop: isA ? 8 : 0,
                          borderTop: `1px solid ${isA ? "rgba(255,255,255,0.35)" : "transparent"}`,
                          transition: `max-height 520ms ${EASE}, opacity 400ms ease, margin-top 440ms ease, padding-top 440ms ease, border-color 440ms ease`,
                        }}
                      >
                        {item.detail}
                      </div>
                    </div>
                  </div>
                );
              })}

              {!mobile && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 252,
                    height: 252,
                    marginLeft: -126,
                    marginTop: -126,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 7,
                    background: anyOn
                      ? "radial-gradient(circle at 50% 38%, #ffffff 0%, #efe9ff 100%)"
                      : "radial-gradient(circle at 50% 38%, #ffffff 0%, #f6f6fa 100%)",
                    boxShadow: anyOn
                      ? `inset 0 1px 0 #fff, 0 26px 60px ${acc(0.22)}, 0 0 0 1px ${acc(0.16)}`
                      : `inset 0 1px 0 #fff, 0 18px 44px ${soft(0.07)}, 0 0 0 1px ${soft(0.05)}`,
                    transform: anyOn ? "scale(1.05)" : "scale(1)",
                    transition: `transform 700ms ${EASE}, box-shadow 600ms ease, background 600ms ease`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: serif,
                      fontSize: 108,
                      lineHeight: 1,
                      color: anyOn ? BRAND : "#12121a",
                      paddingTop: 8,
                      transform: anyOn ? "scale(1.04)" : "scale(1)",
                      transition: `color 520ms ease, transform 700ms ${EASE}`,
                    }}
                  >
                    A
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!mobile && cursorOn && (
          <div style={{ position: "fixed", left: mouse.x, top: mouse.y, zIndex: 99, pointerEvents: "none" }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                marginLeft: -13,
                marginTop: -13,
                border: `1px solid ${acc(0.55)}`,
                background: anyOn ? acc(0.14) : acc(0.9),
                boxShadow: `0 0 0 ${anyOn ? "10px" : "0px"} ${acc(0.08)}`,
                transform: `scale(${anyOn ? 1.5 : 0.42})`,
                transition: `transform 300ms ${EASE}, background 300ms ease, box-shadow 400ms ease`,
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
