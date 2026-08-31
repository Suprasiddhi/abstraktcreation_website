"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// useLayoutEffect warns during SSR; the initial gsap.set must still land
// before paint on the client or the entrance flashes its resting state.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface ParallaxLayer {
  /**
   * yPercent (of the layer's own height) the layer is driven to across the
   * scrub range. Counter-intuitively, a HIGHER value reads as FURTHER AWAY:
   * the layer is pushed down faster, cancelling more of the page's upward
   * travel, so it appears to barely move. A near plane takes a small value
   * and therefore sweeps up and out of frame quickly.
   */
  travel: number;
  /** Pointer drift in px at full deflection. Near planes take more — that is
   *  the direction real depth moves when you shift your head. */
  drift?: number;
  /** Entrance offset in px. Layers settle in from below, back plane first. */
  rise?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface ParallaxLayersV2Props {
  layers: ParallaxLayer[];
  /** Scroll distance the separation is scrubbed across, as a ScrollTrigger
   *  `end` value measured from the container's top hitting the viewport top. */
  end?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Scroll-scrubbed depth stack — the engine behind the Home v2 hero.
 *
 * Three independent motion sources drive the same set of planes, which is
 * what separates this from a stock parallax: the effect has to read before
 * the visitor ever touches the wheel.
 *
 *   1. Entrance — on mount, planes settle in from below with their blur
 *      resolving, back to front. This is the impression that lands in the
 *      first second, with no scroll required.
 *   2. Pointer drift — the scene stays alive while it is standing still.
 *   3. Scroll scrub — the actual layer separation.
 *
 * Entrance writes `y`/`opacity`/`filter` and the scrub writes `yPercent`, so
 * both can share the outer element without fighting (GSAP tracks px and
 * percentage translation as separate transform components). Pointer drift
 * writes `x`/`y` on an inner wrapper so it cannot collide with the entrance.
 *
 * Content-agnostic by design: layers take arbitrary children, so today's
 * DOM/SVG planes can be swapped for artwork later without touching this file.
 */
export default function ParallaxLayersV2({
  layers,
  end = "bottom top",
  style,
  children,
}: ParallaxLayersV2Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const outers = outerRefs.current.filter(Boolean) as HTMLDivElement[];
    const inners = innerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!outers.length) return;

    // Reduced motion: the composed scene is the whole point, so it stays —
    // it simply never moves. Nothing is hidden or offset to begin with.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Entrance is transform + opacity only. Animating filter: blur() here
      // is the obvious way to sell "resolving out of depth" and it is a trap:
      // four full-viewport planes blurring at once forces an uncomposited
      // repaint of the entire screen every frame, and the hero janks on
      // exactly the first impression it exists to make.
      outers.forEach((el, i) => {
        const layer = layers[i];
        gsap.set(el, { y: layer.rise ?? 0, opacity: 0 });
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1.3,
          delay: 0.09 * i,
          ease: "power3.out",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end, scrub: 0 },
      });
      // All layers are placed at position 0 so they scrub as one gesture;
      // the differing `travel` values alone create the depth separation.
      outers.forEach((el, i) => {
        tl.to(el, { yPercent: layers[i].travel, ease: "none" }, 0);
      });
    }, root);

    // --- Pointer drift ------------------------------------------------------
    // Skipped on coarse pointers, where there is no cursor to track and the
    // listener would only cost battery.
    let removeMove: (() => void) | undefined;
    if (window.matchMedia("(pointer: fine)").matches) {
      const setters = inners.map((el, i) => ({
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
        drift: layers[i].drift ?? 0,
      }));
      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        setters.forEach((s) => {
          s.x(-nx * s.drift);
          // Vertical deflection is damped: a scene that slides as much
          // vertically as horizontally reads as loose rather than deep.
          s.y(-ny * s.drift * 0.55);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removeMove = () => window.removeEventListener("pointermove", onMove);
    }

    return () => {
      ctx.revert();
      removeMove?.();
    };
  }, [layers, end]);

  return (
    <div ref={rootRef} style={{ position: "relative", ...style }}>
      {layers.map((layer, i) => (
        <div
          key={i}
          ref={(el) => {
            outerRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform, opacity",
            ...layer.style,
          }}
        >
          <div
            ref={(el) => {
              innerRefs.current[i] = el;
            }}
            style={{ position: "absolute", inset: 0, willChange: "transform" }}
          >
            {layer.children}
          </div>
        </div>
      ))}
      {children}
    </div>
  );
}
