"use client";

import React, { useEffect, useRef } from "react";

/**
 * The animated backdrop of the open menu overlay — a faithful port of the
 * `menu-overlay-motion.dc.html` design canvas.
 *
 * A single tilted plane of vertices is waved in 3D and perspective-projected.
 * Grid-neighbour lines (not proximity lines) are what make it read as one
 * continuous surface rather than a cloud of confetti.
 *
 * The loop only runs while `active` is true. The design artboard is always on
 * screen, so its version never stops; here the overlay is closed most of the
 * time and a permanent rAF loop behind a hidden panel is pure waste.
 */

type Dust = { x: number; y: number; z: number; s: number; vy: number };

interface MenuFieldCanvasProps {
  /** Run the frame loop. Set false while the overlay is closed. */
  active: boolean;
  /** Wave amplitude multiplier. Design default 1 (range 0–2). */
  intensity?: number;
  /** Grid columns at desktop width. Design default 26 (range 10–40). */
  density?: number;
  /** Colour of the horizontal grid lines. Design default #9A78F5. */
  accentColor?: string;
  className?: string;
}

export default function MenuFieldCanvas({
  active,
  intensity = 1,
  density = 26,
  accentColor = "#9A78F5",
  className,
}: MenuFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read through a ref so changing intensity/accent does not tear down and
  // rebuild the whole loop mid-animation. `density` does change the geometry,
  // so it stays in the dependency list and forces a rebuild.
  const liveRef = useRef({ intensity, accentColor });
  useEffect(() => {
    liveRef.current = { intensity, accentColor };
  }, [intensity, accentColor]);

  useEffect(() => {
    if (!active) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const t0 = performance.now();

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let dust: Dust[] = [];
    let raf = 0;
    let alive = true;

    const hex2rgb = (hex: string): [number, number, number] => {
      const s = String(hex || "#9A78F5").replace("#", "");
      const n = parseInt(
        s.length === 3
          ? s
              .split("")
              .map((c) => c + c)
              .join("")
          : s,
        16
      );
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const build = () => {
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const d = Math.max(8, Math.min(40, density));
      cols = w < 720 ? Math.round(d * 0.6) : d;
      rows = Math.round(cols * 0.62);
      const dustCount = w < 720 ? 26 : 60;
      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.3 + Math.random() * 0.7,
        s: 0.4 + Math.random() * 1.2,
        vy: 0.00004 + Math.random() * 0.00009,
      }));
    };

    const project = (x: number, y: number, z: number, tilt: number, spin: number) => {
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);
      const rx = x * cs - z * sn;
      const rz = x * sn + z * cs;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const ry = y * ct - rz * st;
      const rz2 = y * st + rz * ct;
      const d = 2.6;
      const k = d / (d + rz2 + 1.4);
      return { sx: w * 0.5 + rx * k * w * 0.78, sy: h * 0.5 + ry * k * h * 0.8, k };
    };

    const draw = (now: number) => {
      if (!w || !h) {
        // The overlay can mount at zero height for a frame; retry next tick.
        build();
        if (alive) raf = requestAnimationFrame(draw);
        return;
      }
      const time = reduced ? 0 : (now - t0) / 1000;
      const amp = (liveRef.current.intensity ?? 1) * 0.34;
      const [ar, ag, ab] = hex2rgb(liveRef.current.accentColor);
      ctx.clearRect(0, 0, w, h);

      const tilt = 1.02;
      const spin = Math.sin(time * 0.045) * 0.5 + time * 0.012;
      const pts: Array<Array<{ sx: number; sy: number; k: number }>> = [];
      for (let j = 0; j <= rows; j++) {
        const row = [];
        for (let i = 0; i <= cols; i++) {
          const u = (i / cols - 0.5) * 2.6;
          const v = (j / rows - 0.5) * 2.6;
          const wave =
            Math.sin(u * 1.6 + time * 0.5) * 0.5 +
            Math.cos(v * 1.9 - time * 0.36) * 0.4 +
            Math.sin((u + v) * 1.1 + time * 0.22) * 0.35;
          row.push(project(u, v, wave * amp, tilt, spin));
        }
        pts.push(row);
      }

      ctx.lineWidth = 0.75;
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          const p = pts[j][i];
          const fog = Math.max(0, Math.min(1, (p.k - 0.42) / 0.66));
          if (i < cols) {
            const q = pts[j][i + 1];
            ctx.strokeStyle = "rgba(" + ar + "," + ag + "," + ab + "," + (fog * 0.44).toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(q.sx, q.sy);
            ctx.stroke();
          }
          if (j < rows) {
            const q = pts[j + 1][i];
            ctx.strokeStyle = "rgba(247,246,243," + (fog * 0.17).toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(q.sx, q.sy);
            ctx.stroke();
          }
          if ((i + j) % 6 === 0) {
            ctx.fillStyle = "rgba(247,246,243," + (fog * 0.5).toFixed(3) + ")";
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, 0.9 + p.k * 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const d of dust) {
        if (!reduced) {
          d.y -= d.vy * 16;
          if (d.y < -0.05) {
            d.y = 1.05;
            d.x = Math.random();
          }
        }
        ctx.fillStyle = "rgba(247,246,243," + (0.05 + d.z * 0.16).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.s * d.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // With reduced motion the wave is frozen at t=0 and the dust does not
      // drift, so every subsequent frame would be identical. Draw once.
      if (alive && !reduced) raf = requestAnimationFrame(draw);
    };

    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", build);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
    };
  }, [active, density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
