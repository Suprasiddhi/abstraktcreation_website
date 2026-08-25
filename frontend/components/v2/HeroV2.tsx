import React from "react";
import PlaceholderSlot from "./PlaceholderSlot";
import { displayFont } from "./tokens";

interface HeroV2Props {
  data?: {
    headlineLine1?: string;
    description?: string;
  };
}

export default function HeroV2({ data }: HeroV2Props) {
  const headline = data?.headlineLine1 || "One studio for the site, the brand, and everything that carries it.";
  const description =
    data?.description ||
    "Web solutions, brand systems, campaigns, video, 3D and sound. Built in house, from the first call to the thing that ships.";

  return (
    <>
      <section
        data-screen-label="Hero"
        style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(130px,20vh,210px) clamp(18px,3.6vw,60px) 0" }}
      >
        <div data-hero-head="1" style={{ willChange: "transform" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "clamp(40px,8.1vw,126px)",
              lineHeight: 0.94,
              letterSpacing: "-.04em",
              maxWidth: "17ch",
            }}
          >
            {headline}
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 28,
              marginTop: "clamp(26px,4vh,46px)",
            }}
          >
            <p style={{ margin: 0, maxWidth: "46ch", fontSize: "clamp(16px,1.35vw,21px)", lineHeight: 1.55, color: "#4A4A48" }}>
              {description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a
                href="#work"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  height: 52,
                  padding: "0 26px",
                  borderRadius: 999,
                  background: "#0E0E0E",
                  color: "#F7F6F3",
                  fontSize: 15,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                See the work <span style={{ fontSize: 17 }}>↓</span>
              </a>
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 52,
                  padding: "0 26px",
                  borderRadius: 999,
                  border: "1px solid #D6D5CF",
                  color: "#0E0E0E",
                  fontSize: 15,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Start a project
              </a>
            </div>
          </div>
        </div>
      </section>

      <section data-hero-sec="1" style={{ position: "relative", height: "300vh", marginTop: "clamp(40px,7vh,90px)" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div
            data-hero-media="1"
            style={{
              position: "relative",
              width: "66vw",
              aspectRatio: "16/9",
              borderRadius: 22,
              overflow: "hidden",
              background: "#0E0E0E",
              willChange: "width,transform",
            }}
          >
            <PlaceholderSlot label="Showreel — 16:9 video still" tone="dark" />
            <div style={{ position: "absolute", top: 18, left: 20, display: "flex", alignItems: "center", gap: 9, pointerEvents: "none" }}>
              <span style={{ display: "block", width: 7, height: 7, borderRadius: 999, background: "#9A78F5" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".24em", color: "rgba(255,255,255,.72)" }}>SHOWREEL 2026</span>
            </div>
            <div style={{ position: "absolute", bottom: 18, right: 20, fontSize: 10, fontWeight: 700, letterSpacing: ".24em", color: "rgba(255,255,255,.55)", pointerEvents: "none" }}>
              SCROLL
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
