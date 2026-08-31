"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./parallax-hero.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroV2Props {
  // Accepted so the page's CMS wiring keeps compiling; the layer scene
  // does not read copy from it.
  data?: {
    headlineLine1?: string;
    description?: string;
  };
}

// Hero title typewriter cycle: the brand stamps first, then the three
// verbs escalate. Timings ported from the previous site's hero.
const TYPEWRITER_WORDS = ["ABSTRAKT", "DESIGN", "BUILD", "GROW"];
const TYPE_MS = 120;
const HOLD_MS = 2200;
const DELETE_MS = 60;

// Original Osmo reference art, kept for comparison while the local scene
// is dialled in.
// const LAYER_IMAGES = {
//   three:
//     "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp",
//   two:
//     "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp",
//   one:
//     "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp",
// };

// Local hero art from /public/images/hero. Same slot order as above:
// `three` is the backmost plate, `one` is the foreground.
const LAYER_IMAGES = {
  three: "/images/hero/layer3.1.png",
  two: "/images/hero/layer2.png",
  one: "/images/hero/layer1.1.png",
};

// Straight from the source: layer 1 sits furthest back and is driven down
// hardest, cancelling most of the page's upward travel so it reads as near
// stationary. Layer 4 is the foreground and barely moves, so it sweeps up
// across the title on layer 3.
const LAYERS = [
  { layer: "1", yPercent: 70 },
  { layer: "2", yPercent: 55 },
  { layer: "3", yPercent: 40 },
  { layer: "4", yPercent: 10 },
];

export default function HeroV2({}: HeroV2Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Typewriter: type the word, hold, delete, move to the next, loop.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    if (reduced) {
      setTyped(TYPEWRITER_WORDS[0]);
      return;
    }

    let word = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = (current: string) => {
      const full = TYPEWRITER_WORDS[word];
      if (!deleting) {
        if (current.length < full.length) {
          const next = full.slice(0, current.length + 1);
          setTyped(next);
          timer = setTimeout(() => step(next), TYPE_MS);
        } else {
          timer = setTimeout(() => {
            deleting = true;
            step(full);
          }, HOLD_MS);
        }
      } else if (current.length > 0) {
        const next = current.slice(0, -1);
        setTyped(next);
        timer = setTimeout(() => step(next), DELETE_MS);
      } else {
        deleting = false;
        word = (word + 1) % TYPEWRITER_WORDS.length;
        step("");
      }
    };

    timer = setTimeout(() => step(""), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Lenis and the GSAP ticker are already wired together site-wide in
    // useLenis, so the source's own Lenis bootstrap is intentionally absent.
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-parallax-layers]").forEach((triggerElement) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "0% 0%",
            end: "100% 0%",
            scrub: 0,
          },
        });
        LAYERS.forEach((layerObj, idx) => {
          tl.to(
            triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
            { yPercent: layerObj.yPercent, ease: "none" },
            idx === 0 ? undefined : "<"
          );
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="parallax" ref={rootRef} data-screen-label="Hero" data-nav-tone="dark">
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LAYER_IMAGES.three}
              loading="eager"
              width={800}
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LAYER_IMAGES.two}
              loading="eager"
              width={800}
              data-parallax-layer="2"
              alt=""
              className="parallax__layer-img"
            />
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h2 className="parallax__title" style={{ color: "#ffffff" }}>
                {typed || "\u200b"}
                {!reducedMotion && <span className="parallax__cursor" aria-hidden="true" />}
              </h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LAYER_IMAGES.one}
              loading="eager"
              width={800}
              data-parallax-layer="4"
              alt=""
              className="parallax__layer-img"
            />
          </div>
          <div className="parallax__fade" />
        </div>
      </section>
      <section className="parallax__content" />
    </div>
  );
}
