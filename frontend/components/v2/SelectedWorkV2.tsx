"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { displayFont } from "./tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectData {
  id?: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  image?: string;
}

interface SelectedWorkV2Props {
  data?: { projects: ProjectData[] };
}

// Hand-placed positions (in vw/vh units) + base tilt for each polaroid, scattered
// like a gallery wall. The camera un-tilts (camRotate = -baseRotate) whichever
// polaroid it settles on, so the focused photo reads straight while the rest
// of the wall stays scattered around it.
const WALL_LAYOUT = [
  { x: 28, y: 38, baseRotate: -6, zoom: 1.55 },
  { x: 68, y: 28, baseRotate: 5, zoom: 1.7 },
  { x: 50, y: 62, baseRotate: -4, zoom: 1.6 },
  { x: 22, y: 72, baseRotate: 7, zoom: 1.65 },
  { x: 78, y: 66, baseRotate: -5, zoom: 1.75 },
];

export default function SelectedWorkV2({ data }: SelectedWorkV2Props) {
  const projects = (data?.projects || []).slice(0, WALL_LAYOUT.length);
  const sectionRef = useRef<HTMLElement>(null);
  const scaleGroupRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projects.length || !sectionRef.current || !scaleGroupRef.current || !panRef.current) return;

    const stops = projects.map((p, i) => WALL_LAYOUT[i % WALL_LAYOUT.length]);
    const stopCount = stops.length + 1; // + final zoom-out/CTA stop

    gsap.set(panRef.current, { xPercent: 50 - stops[0].x, yPercent: 50 - stops[0].y });
    gsap.set(scaleGroupRef.current, { scale: stops[0].zoom, rotation: -stops[0].baseRotate });
    captionRefs.current.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
    if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.width = self.progress * 100 + "%";
          },
        },
      });

      stops.forEach((stop, i) => {
        if (i === 0) return; // already set as the initial state above
        tl.to(panRef.current, { xPercent: 50 - stop.x, yPercent: 50 - stop.y, duration: 1, ease: "power2.inOut" }, i - 1)
          .to(scaleGroupRef.current, { scale: stop.zoom, rotation: -stop.baseRotate, duration: 1, ease: "power2.inOut" }, i - 1);
      });

      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i > 0) tl.to(el, { opacity: 1, duration: 0.25 }, i - 1 + 0.1);
        if (i < stops.length - 1 || stops.length === 1) tl.to(el, { opacity: 0, duration: 0.25 }, i + 0.75);
      });

      // final stop: pull back out to reveal the whole wall + CTA
      const lastIndex = stops.length - 1;
      tl.to(panRef.current, { xPercent: 0, yPercent: 0, duration: 1, ease: "power2.inOut" }, lastIndex)
        .to(scaleGroupRef.current, { scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, lastIndex);
      const lastCaption = captionRefs.current[lastIndex];
      if (lastCaption) tl.to(lastCaption, { opacity: 0, duration: 0.25 }, lastIndex + 0.1);
      if (ctaRef.current) tl.to(ctaRef.current, { opacity: 1, duration: 0.4 }, lastIndex + 0.4);
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  if (projects.length === 0) return null;

  return (
    <section
      id="work"
      ref={sectionRef}
      data-screen-label="Selected work"
      style={{ position: "relative", height: `${(projects.length + 1) * 100}vh`, background: "#0E0E0E", color: "#F7F6F3" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div ref={scaleGroupRef} style={{ position: "absolute", inset: 0 }}>
          <div ref={panRef} style={{ position: "absolute", inset: 0 }}>
            {projects.map((project, i) => {
              const stop = WALL_LAYOUT[i % WALL_LAYOUT.length];
              return (
                <div
                  key={project.id ?? i}
                  style={{
                    position: "absolute",
                    left: `${stop.x}vw`,
                    top: `${stop.y}vh`,
                    transform: `translate(-50%,-50%) rotate(${stop.baseRotate}deg)`,
                    width: "min(340px,34vw)",
                    background: "#F7F6F3",
                    padding: "14px 14px 46px",
                    borderRadius: 4,
                    boxShadow: "0 30px 60px rgba(0,0,0,.55)",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#151515" }}>
                    {project.image ? (
                      <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#6B6B6B" }}>
                        {project.title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed chrome: header + progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, padding: "clamp(70px,10vh,110px) clamp(18px,3.6vw,60px) clamp(18px,3vh,34px)", pointerEvents: "none" }}>
          <div>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "#9A78F5", marginBottom: 14 }}>
              (03) SELECTED WORK
            </span>
            <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(32px,5.2vw,78px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
              Things we made
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 220, flex: 1, maxWidth: 420, paddingBottom: 10 }}>
            <div style={{ flex: 1, height: 2, background: "#242424", overflow: "hidden" }}>
              <div ref={barRef} style={{ height: "100%", width: "0%", background: "#9A78F5" }} />
            </div>
            <a href="#contact" style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".18em", color: "#F7F6F3", whiteSpace: "nowrap", pointerEvents: "auto" }}>
              ALL PROJECTS →
            </a>
          </div>
        </div>

        {/* Per-project captions, fixed over the viewport */}
        {projects.map((project, i) => (
          <div
            key={project.id ?? i}
            ref={(el) => {
              captionRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: "clamp(18px,3.6vw,60px)",
              bottom: "clamp(40px,7vh,80px)",
              maxWidth: "min(90vw,520px)",
              pointerEvents: "none",
            }}
          >
            {project.category && (
              <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".22em", color: "#9A78F5", marginBottom: 8 }}>
                {project.category.toUpperCase()}
              </span>
            )}
            <h3 style={{ margin: "0 0 6px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(24px,3.4vw,48px)", lineHeight: 1, letterSpacing: "-.03em" }}>
              {project.title.toUpperCase()}
            </h3>
            {project.subtitle && <p style={{ margin: 0, fontSize: 15, color: "#C9C9C4" }}>{project.subtitle}</p>}
          </div>
        ))}

        {/* Final reveal: zoom-out + CTA */}
        <div
          ref={ctaRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            textAlign: "center",
            background: "rgba(14,14,14,.35)",
            pointerEvents: "none",
          }}
        >
          <h3 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.05, letterSpacing: "-.03em", maxWidth: "18ch" }}>
            Yours could be next on this wall.
          </h3>
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 52,
              padding: "0 26px",
              borderRadius: 999,
              background: "#501EBD",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              pointerEvents: "auto",
            }}
          >
            Start a project →
          </a>
        </div>
      </div>
    </section>
  );
}
