"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { BRAND, displayFont } from "./tokens";

/**
 * Skill pills in a gravity well — the "project in mind?" toy.
 *
 * Capsule-shaped labels drop in, tumble, collide and settle into a pile at
 * the bottom of the box. Pointer-drag picks one up and flinging it throws it
 * with the velocity of the gesture.
 *
 * Written as a small custom solver rather than pulling in Matter.js (~90KB
 * minified, plus its own renderer glue) for one decorative section. The
 * simulation this needs is narrow: ~16 bodies, one static box, no joints, no
 * compound shapes, no sleeping islands. What follows is roughly 4KB of that.
 *
 * Bodies are capsules — a segment of length (w - h) with radius h/2 — which
 * is exactly what a pill-shaped label is. Capsule/capsule collision reduces
 * to the closest points between two segments, so the whole contact test is
 * one segment-segment distance calculation rather than the general polygon
 * SAT a full engine would run.
 *
 * Integration is semi-implicit Euler with sequential impulse resolution over
 * a few iterations per frame. That is the same family of solver Matter.js
 * uses; the difference is only in how much of it is here.
 */

export interface SkillPill {
  id?: number | string;
  label: string;
  accent?: boolean;
}

/** The default pills, in the order they drop. Taken from the reference recording. */
export const DEFAULT_SKILLS: SkillPill[] = [
  { label: "React", accent: true },
  { label: "Next.js" },
  { label: "Web Solutions", accent: true },
  { label: "API Integration", accent: true },
  { label: "Dashboards" },
  { label: "3D & Animation" },
  { label: "Social Media", accent: true },
  { label: "Music Production", accent: true },
  { label: "Video Production" },
  { label: "Graphic Design", accent: true },
  { label: "UI/UX Design", accent: true },
  { label: "System Architecture" },
  { label: "Digital Marketing" },
  { label: "Creative" },
  { label: "Motion Design", accent: true },
  { label: "Brand Systems" },
];


const GRAVITY = 2100; // px/s²
const RESTITUTION = 0.16; // bounce; low so the pile settles rather than jitters
const FRICTION = 0.14;
const LINEAR_DAMPING = 0.16;
const ANGULAR_DAMPING = 0.34;
const SOLVER_ITERATIONS = 6;
/** Fixed physics step. Decoupling from frame time keeps the pile stable on a
 *  slow frame, which is where variable-dt solvers explode. */
const DT = 1 / 120;
const MAX_STEPS_PER_FRAME = 5;
const PILL_H = 34;

interface Body {
  label: string;
  accent: boolean;
  /** Centre. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Rotation (rad) and angular velocity. */
  a: number;
  va: number;
  w: number;
  h: number;
  /** Half-length of the capsule's inner segment. */
  half: number;
  r: number;
  invMass: number;
  invInertia: number;
  el: HTMLElement | null;
  /** Frame index at which this body enters. */
  dropAt: number;
  live: boolean;
  held: boolean;
}

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

/** Closest points between segments p1p2 and q1q2. Returns the two points and
 *  the parameters along each segment. Standard clamped-parametric solution. */
function segClosest(
  px: number, py: number, pdx: number, pdy: number,
  qx: number, qy: number, qdx: number, qdy: number
) {
  const rx = px - qx;
  const ry = py - qy;
  const a = pdx * pdx + pdy * pdy;
  const e = qdx * qdx + qdy * qdy;
  const f = qdx * rx + qdy * ry;
  let s = 0;
  let t = 0;
  if (a <= 1e-8 && e <= 1e-8) return { s: 0, t: 0 };
  if (a <= 1e-8) {
    t = clamp(f / e, 0, 1);
  } else {
    const c = pdx * rx + pdy * ry;
    if (e <= 1e-8) {
      s = clamp(-c / a, 0, 1);
    } else {
      const b = pdx * qdx + pdy * qdy;
      const denom = a * e - b * b;
      s = denom > 1e-8 ? clamp((b * f - c * e) / denom, 0, 1) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = clamp(-c / a, 0, 1);
      } else if (t > 1) {
        t = 1;
        s = clamp((b - c) / a, 0, 1);
      }
    }
  }
  return { s, t };
}

export interface SkillsPhysicsProps {
  skills?: SkillPill[];
}

export default function SkillsPhysics({ skills }: SkillsPhysicsProps = {}) {
  const activeSkills = skills && skills.length > 0 ? skills : DEFAULT_SKILLS;
  const skillsKey = activeSkills.map(s => `${s.label}:${!!s.accent}`).join("|");
  const boxRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const frameRef = useRef(0);
  const dragRef = useRef<{ body: Body; px: number; py: number; lx: number; ly: number } | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  /** Measure each pill from its rendered width, so the capsule matches the
   *  text rather than a guessed size — a label whose box is wider than its
   *  pill leaves visible gaps in the pile. */
  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    sizeRef.current = { w: box.clientWidth, h: box.clientHeight };
    bodiesRef.current.forEach((b) => {
      if (!b.el) return;
      const w = b.el.offsetWidth || 120;
      const h = b.el.offsetHeight || PILL_H;
      b.w = w;
      b.h = h;
      b.r = h / 2;
      b.half = Math.max(0, (w - h) / 2);
      // Mass from area; inertia approximated as a rod of the capsule's length.
      const mass = (w * h) / 2600;
      b.invMass = 1 / mass;
      b.invInertia = 12 / (mass * (w * w + h * h));
    });
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build bodies from the DOM nodes React rendered.
    const els = Array.from(box.querySelectorAll<HTMLElement>("[data-pill]"));
    bodiesRef.current = els.map((el, i) => ({
      label: activeSkills[i]?.label || "",
      accent: !!activeSkills[i]?.accent,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      a: 0,
      va: 0,
      w: 120,
      h: PILL_H,
      half: 43,
      r: PILL_H / 2,
      invMass: 1,
      invInertia: 0.01,
      el,
      dropAt: i * 7,
      live: false,
      held: false,
    }));
    measure();

    const bodies = bodiesRef.current;

    /** Starting state: spread across the top, above the ceiling, with a
     *  little spin so they do not all fall as a flat rank. */
    const reset = () => {
      const { w } = sizeRef.current;
      frameRef.current = 0;
      bodies.forEach((b, i) => {
        b.x = w * (0.16 + 0.68 * ((i * 0.37) % 1));
        b.y = -60 - i * 26;
        b.vx = (Math.random() - 0.5) * 90;
        b.vy = 0;
        b.a = (Math.random() - 0.5) * 0.9;
        b.va = (Math.random() - 0.5) * 2.4;
        b.live = false;
        b.held = false;
      });
    };
    reset();

    /** Reduced motion: no simulation at all. Lay the pills out in reading
     *  order as a static wrapped row — the content is the point, the tumble
     *  is decoration, and this is the one case where the decoration is
     *  actively unwelcome. */
    if (reduced) {
      let cx = 16;
      let cy = 26;
      const { w } = sizeRef.current;
      bodies.forEach((b) => {
        if (cx + b.w > w - 16) {
          cx = 16;
          cy += b.h + 12;
        }
        b.x = cx + b.w / 2;
        b.y = cy + b.h / 2;
        b.a = 0;
        cx += b.w + 12;
        if (b.el) {
          b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${b.y - b.h / 2}px, 0)`;
          b.el.style.opacity = "1";
        }
      });
      return;
    }

    const applyImpulse = (b: Body, ix: number, iy: number, rx: number, ry: number) => {
      if (b.held) return;
      b.vx += ix * b.invMass;
      b.vy += iy * b.invMass;
      b.va += (rx * iy - ry * ix) * b.invInertia;
    };

    /** Resolve one contact point: push the pair apart, then apply a normal
     *  impulse with restitution and a tangential friction impulse. */
    const resolve = (
      A: Body, B: Body | null,
      nx: number, ny: number, depth: number,
      cxA: number, cyA: number, cxB: number, cyB: number
    ) => {
      const invSum = A.invMass + (B ? B.invMass : 0);
      if (invSum <= 0) return;

      // Positional correction, biased so the pile does not sink.
      const corr = (Math.max(depth - 0.5, 0) / invSum) * 0.7;
      if (!A.held) {
        A.x += nx * corr * A.invMass;
        A.y += ny * corr * A.invMass;
      }
      if (B && !B.held) {
        B.x -= nx * corr * B.invMass;
        B.y -= ny * corr * B.invMass;
      }

      const raX = cxA - A.x;
      const raY = cyA - A.y;
      const rbX = B ? cxB - B.x : 0;
      const rbY = B ? cyB - B.y : 0;

      const vAx = A.vx - A.va * raY;
      const vAy = A.vy + A.va * raX;
      const vBx = B ? B.vx - B.va * rbY : 0;
      const vBy = B ? B.vy + B.va * rbX : 0;

      const rvx = vAx - vBx;
      const rvy = vAy - vBy;
      const vn = rvx * nx + rvy * ny;
      if (vn > 0) return; // already separating

      const raCrossN = raX * ny - raY * nx;
      const rbCrossN = rbX * ny - rbY * nx;
      let denom = invSum + raCrossN * raCrossN * A.invInertia;
      if (B) denom += rbCrossN * rbCrossN * B.invInertia;
      if (denom <= 1e-8) return;

      const j = (-(1 + RESTITUTION) * vn) / denom;
      applyImpulse(A, nx * j, ny * j, raX, raY);
      if (B) applyImpulse(B, -nx * j, -ny * j, rbX, rbY);

      // Friction along the tangent, clamped by Coulomb's cone.
      const tx = -ny;
      const ty = nx;
      const vt = rvx * tx + rvy * ty;
      const raCrossT = raX * ty - raY * tx;
      const rbCrossT = rbX * ty - rbY * tx;
      let tDenom = invSum + raCrossT * raCrossT * A.invInertia;
      if (B) tDenom += rbCrossT * rbCrossT * B.invInertia;
      if (tDenom <= 1e-8) return;
      let jt = -vt / tDenom;
      const max = j * FRICTION;
      jt = clamp(jt, -Math.abs(max), Math.abs(max));
      applyImpulse(A, tx * jt, ty * jt, raX, raY);
      if (B) applyImpulse(B, -tx * jt, -ty * jt, rbX, rbY);
    };

    /** Capsule against the four static walls, tested at both end caps. */
    const collideWalls = (b: Body) => {
      const { w, h } = sizeRef.current;
      const ca = Math.cos(b.a);
      const sa = Math.sin(b.a);
      for (const sgn of [-1, 1]) {
        const ex = b.x + ca * b.half * sgn;
        const ey = b.y + sa * b.half * sgn;
        if (ex - b.r < 0) resolve(b, null, 1, 0, b.r - ex, ex, ey, 0, 0);
        if (ex + b.r > w) resolve(b, null, -1, 0, ex + b.r - w, ex, ey, 0, 0);
        if (ey + b.r > h) resolve(b, null, 0, -1, ey + b.r - h, ex, ey, 0, 0);
        if (ey - b.r < 0 && b.live) resolve(b, null, 0, 1, b.r - ey, ex, ey, 0, 0);
      }
    };

    const collidePair = (A: Body, B: Body) => {
      // Cheap reject before the segment maths.
      const dx = B.x - A.x;
      const dy = B.y - A.y;
      const reach = A.half + A.r + B.half + B.r;
      if (dx * dx + dy * dy > reach * reach) return;

      const aCos = Math.cos(A.a) * A.half;
      const aSin = Math.sin(A.a) * A.half;
      const bCos = Math.cos(B.a) * B.half;
      const bSin = Math.sin(B.a) * B.half;

      const p1x = A.x - aCos;
      const p1y = A.y - aSin;
      const q1x = B.x - bCos;
      const q1y = B.y - bSin;
      const pdx = aCos * 2;
      const pdy = aSin * 2;
      const qdx = bCos * 2;
      const qdy = bSin * 2;

      const { s, t } = segClosest(p1x, p1y, pdx, pdy, q1x, q1y, qdx, qdy);
      const cax = p1x + pdx * s;
      const cay = p1y + pdy * s;
      const cbx = q1x + qdx * t;
      const cby = q1y + qdy * t;

      let nx = cax - cbx;
      let ny = cay - cby;
      let d = Math.hypot(nx, ny);
      const rsum = A.r + B.r;
      if (d >= rsum) return;
      if (d < 1e-6) {
        nx = 0;
        ny = -1;
        d = 1e-6;
      } else {
        nx /= d;
        ny /= d;
      }
      resolve(A, B, nx, ny, rsum - d, cax, cay, cbx, cby);
    };

    const step = () => {
      frameRef.current += 1;
      const f = frameRef.current;

      for (const b of bodies) {
        if (!b.live && f >= b.dropAt) b.live = true;
        if (!b.live || b.held) continue;
        b.vy += GRAVITY * DT;
        b.vx -= b.vx * LINEAR_DAMPING * DT;
        b.vy -= b.vy * LINEAR_DAMPING * DT;
        b.va -= b.va * ANGULAR_DAMPING * DT;
        b.x += b.vx * DT;
        b.y += b.vy * DT;
        b.a += b.va * DT;
      }

      for (let it = 0; it < SOLVER_ITERATIONS; it++) {
        for (let i = 0; i < bodies.length; i++) {
          const A = bodies[i];
          if (!A.live) continue;
          collideWalls(A);
          for (let j = i + 1; j < bodies.length; j++) {
            const B = bodies[j];
            if (!B.live) continue;
            collidePair(A, B);
          }
        }
      }
    };

    const draw = () => {
      for (const b of bodies) {
        if (!b.el) continue;
        b.el.style.opacity = b.live ? "1" : "0";
        b.el.style.transform =
          `translate3d(${(b.x - b.w / 2).toFixed(2)}px, ${(b.y - b.h / 2).toFixed(2)}px, 0)` +
          ` rotate(${b.a.toFixed(4)}rad)`;
      }
    };

    const loop = (now: number) => {
      if (!runningRef.current) return;
      const last = lastRef.current || now;
      lastRef.current = now;
      accRef.current += Math.min((now - last) / 1000, 0.1);
      let steps = 0;
      while (accRef.current >= DT && steps < MAX_STEPS_PER_FRAME) {
        step();
        accRef.current -= DT;
        steps++;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      lastRef.current = 0;
      accRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    // Only simulate while the box is on screen: a physics loop running for a
    // section three viewports away is pure battery cost.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(box);

    const onVis = () => {
      if (document.visibilityState === "hidden") stop();
    };
    document.addEventListener("visibilitychange", onVis);

    // ---- Dragging -------------------------------------------------------
    // Bound to the pills themselves rather than the box, so a drag that
    // starts on empty space is left alone and the page scrolls normally.
    // touch-action: none on the pill is what stops the browser claiming the
    // gesture for scroll once it starts on one.
    const localPoint = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-pill]");
      if (!el) return;
      const b = bodies.find((x) => x.el === el);
      if (!b || !b.live) return;
      const p = localPoint(e);
      b.held = true;
      b.vx = b.vy = b.va = 0;
      dragRef.current = { body: b, px: p.x - b.x, py: p.y - b.y, lx: p.x, ly: p.y };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
      start();
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const p = localPoint(e);
      const { w, h } = sizeRef.current;
      d.body.x = clamp(p.x - d.px, 0, w);
      d.body.y = clamp(p.y - d.py, 0, h);
      // Track gesture velocity so releasing throws the pill.
      d.body.vx = (p.x - d.lx) / DT / 12;
      d.body.vy = (p.y - d.ly) / DT / 12;
      d.lx = p.x;
      d.ly = p.y;
      e.preventDefault();
    };

    const onPointerUp = () => {
      const d = dragRef.current;
      if (!d) return;
      d.body.held = false;
      // Cap the throw so a fast flick cannot tunnel a pill out of the box.
      const sp = Math.hypot(d.body.vx, d.body.vy);
      const MAXV = 2600;
      if (sp > MAXV) {
        d.body.vx = (d.body.vx / sp) * MAXV;
        d.body.vy = (d.body.vy / sp) * MAXV;
      }
      d.body.va += (Math.random() - 0.5) * 4;
      dragRef.current = null;
    };

    box.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const onResize = () => {
      const prev = sizeRef.current.w;
      measure();
      const next = sizeRef.current.w;
      // Keep the pile inside a narrowed box rather than leaving bodies
      // stranded outside it.
      if (prev > 0 && next > 0 && next !== prev) {
        const k = next / prev;
        bodies.forEach((b) => {
          b.x = clamp(b.x * k, b.r, next - b.r);
        });
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      box.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
    };
  }, [measure, skillsKey]);

  return (
    <div
      ref={boxRef}
      className="ab-skills-box"
      role="group"
      aria-label="Things we work with"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        border: "1px solid #242424",
        background: "#111111",
        height: "clamp(320px,42vw,470px)",
        touchAction: "pan-y",
      }}
    >
      {activeSkills.map((s, idx) => (
        <span
          key={`${s.label}-${idx}`}
          data-pill
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-flex",
            alignItems: "center",
            height: PILL_H,
            padding: "0 16px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            fontFamily: displayFont,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-.01em",
            background: s.accent ? BRAND : "#F7F6F3",
            color: s.accent ? "#FFFFFF" : "#0E0E0E",
            opacity: 0,
            cursor: "grab",
            userSelect: "none",
            touchAction: "none",
            willChange: "transform",
          }}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}
