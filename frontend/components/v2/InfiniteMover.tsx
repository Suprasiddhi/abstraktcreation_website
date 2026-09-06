"use client";

import React, { useEffect, useRef } from "react";

type InfiniteMoverProps = {
  children: React.ReactNode;
  /** LR: content travels left-to-right; RL: right-to-left. */
  move?: "LR" | "RL";
  /** Seconds for one full copy-width of travel. */
  duration?: number;
  /** Off when the caller paints its own edge fades over the row. */
  maskEdges?: boolean;
  /** Grab-and-throw on pointer down. Off keeps it a pure hover-pause row. */
  draggable?: boolean;
  style?: React.CSSProperties;
};

const COPIES = [0, 1, 2, 3, 4];

/** Per-frame factor that eases `speed` toward its target. Framed as a
 *  half-life in ms so the ramp feels the same on 60Hz and 120Hz displays. */
const RAMP_HALF_LIFE = 190;
/** Below this px/s a fling is spent and the row returns to its drift. */
const FLING_EPSILON = 6;
/** Pointer travel that separates a click on a logo from a drag of the row. */
const DRAG_THRESHOLD = 4;

/**
 * Infinite marquee. Five identical copies of `children` sit side by side in
 * a clipped flex row; the group is translated by a single transform and
 * wrapped modulo one copy-width, so the copy sliding into view is always
 * pixel-identical to the one that left and the wrap is invisible.
 *
 * Motion is rAF-driven rather than a CSS animation because a CSS animation
 * can only be running or `paused` — it snaps to a halt, and it cannot take
 * drag input. Here `speed` is a value eased toward a target each frame, so
 * hover ramps it to zero over ~200ms and hover-out ramps it back, and a
 * pointer drag can write straight to the offset.
 *
 * With `maskEdges` the container carries the `ab-inf-x--masked` edge fade;
 * callers that paint their own solid-ground fades over the row turn it off.
 */
export default function InfiniteMover({
  children,
  move = "LR",
  duration = 40,
  maskEdges = true,
  draggable = true,
  style,
}: InfiniteMoverProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!viewport || !track || !copy) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dir = move === "LR" ? 1 : -1;

    let copyWidth = copy.offsetWidth;
    // Offset is kept wrapped into [0, copyWidth) so it never grows without
    // bound over a long session and loses float precision.
    let offset = 0;
    let baseSpeed = copyWidth / duration;
    let speed = dir * baseSpeed;
    let targetSpeed = dir * baseSpeed;
    let hovering = false;
    let dragging = false;
    let raf: number | null = null;
    let last = 0;

    // Fling velocity is measured from the last two pointer samples rather
    // than the whole gesture, so a drag that stops before release lets go
    // at rest instead of inheriting speed from earlier in the stroke.
    let lastMoveX = 0;
    let lastMoveT = 0;
    let dragVelocity = 0;
    let pointerId: number | null = null;
    let downX = 0;
    let movedPastThreshold = false;

    const ro = new ResizeObserver(() => {
      const next = copy.offsetWidth;
      if (!next) return;
      copyWidth = next;
      baseSpeed = copyWidth / duration;
      if (!dragging && !hovering) targetSpeed = dir * baseSpeed;
    });
    ro.observe(copy);

    const draw = () => {
      // The track starts shifted one copy left so the row is populated on
      // both sides of the viewport regardless of travel direction.
      track.style.transform = `translate3d(${offset - copyWidth}px, 0, 0)`;
    };

    const wrap = () => {
      if (copyWidth <= 0) return;
      offset = ((offset % copyWidth) + copyWidth) % copyWidth;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!dragging) {
        // Exponential ease toward the target — no easing curve to finish,
        // so hover and hover-out can interrupt each other mid-ramp without
        // any discontinuity.
        const k = 1 - Math.pow(0.5, (dt * 1000) / RAMP_HALF_LIFE);
        speed += (targetSpeed - speed) * k;

        if (Math.abs(dragVelocity) > FLING_EPSILON) {
          offset += dragVelocity * dt;
          dragVelocity *= Math.pow(0.94, (dt * 1000) / 16.67);
        } else {
          dragVelocity = 0;
        }

        offset += speed * dt;
        wrap();
        draw();
      }

      // Free-running drift never settles, so the only resting state is the
      // row parked under a hovering pointer: target zero, ramp finished,
      // no fling left to spend. Anything else keeps the loop alive.
      const parked =
        !dragging &&
        targetSpeed === 0 &&
        Math.abs(speed) < 0.5 &&
        dragVelocity === 0;

      if (parked) {
        speed = 0;
        raf = null;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf === null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => {
      hovering = true;
      targetSpeed = 0;
      wake();
    };

    const onLeave = () => {
      hovering = false;
      if (!dragging) {
        targetSpeed = dir * baseSpeed;
        wake();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!draggable) return;
      if (e.button !== 0 && e.pointerType === "mouse") return;
      dragging = true;
      pointerId = e.pointerId;
      downX = e.clientX;
      movedPastThreshold = false;
      lastMoveX = e.clientX;
      lastMoveT = performance.now();
      dragVelocity = 0;
      speed = 0;
      targetSpeed = 0;
      viewport.setPointerCapture(e.pointerId);
      viewport.style.cursor = "grabbing";
      wake();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;

      if (!movedPastThreshold && Math.abs(e.clientX - downX) > DRAG_THRESHOLD) {
        movedPastThreshold = true;
      }

      const now = performance.now();
      const dx = e.clientX - lastMoveX;
      const dt = now - lastMoveT;
      if (dt > 0) dragVelocity = (dx / dt) * 1000;

      offset += dx;
      wrap();
      draw();

      lastMoveX = e.clientX;
      lastMoveT = now;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      viewport.style.cursor = draggable ? "grab" : "";

      // A release more than ~80ms after the last move is a hold, not a
      // throw — drop the stale velocity rather than flinging on let-go.
      if (performance.now() - lastMoveT > 80) dragVelocity = 0;

      // Suppress the click that follows a real drag so releasing over a
      // logo doesn't also activate it.
      if (movedPastThreshold) {
        const swallow = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        viewport.addEventListener("click", swallow, { capture: true, once: true });
        // If no click materialises, don't leave the handler armed for the
        // next genuine click.
        setTimeout(() => viewport.removeEventListener("click", swallow, true), 0);
      }

      targetSpeed = hovering ? 0 : dir * baseSpeed;
      wake();
    };

    // Dragging an image or text selection inside the row hijacks the
    // gesture on desktop; the row owns horizontal pointer movement.
    const onDragStart = (e: Event) => e.preventDefault();

    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("dragstart", onDragStart);
    if (draggable) {
      viewport.addEventListener("pointerdown", onPointerDown);
      viewport.addEventListener("pointermove", onPointerMove);
      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
      viewport.style.cursor = "grab";
    }

    draw();
    wake();

    return () => {
      ro.disconnect();
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("dragstart", onDragStart);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      if (raf !== null) cancelAnimationFrame(raf);
    };
    // `children` is deliberately not a dependency: it is a fresh array on
    // every parent render, and re-running would reset the row's position
    // mid-scroll. The ResizeObserver already handles content changing
    // width, which is the only thing this loop reads off the children.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [move, duration, draggable]);

  return (
    <div
      ref={viewportRef}
      className={maskEdges ? "ab-inf-x ab-inf-x--masked" : "ab-inf-x"}
      style={{
        position: "relative",
        overflow: "hidden",
        // Vertical scroll still belongs to the page; only horizontal
        // panning is claimed by the row.
        touchAction: "pan-y",
        ...style,
      }}
    >
      <div ref={trackRef} style={{ display: "flex", willChange: "transform" }}>
        {COPIES.map((i) => (
          <div
            key={i}
            ref={i === 0 ? copyRef : undefined}
            aria-hidden={i > 0}
            style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
