"use client";

import React, { useRef, useState } from "react";
import { displayFont, MUTED } from "./tokens";

type ThemeKey = "digital" | "identity" | "campaign" | "creative";

interface Pillar {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
}

interface CapabilitiesV3Props {
  data?: { pillars: Record<string, Pillar> };
}

const CARD_THEME: Record<ThemeKey, {
  bg: string; fg: string; eyebrow: string; muted: string; mediaBg: string; chipBorder: string;
}> = {
  digital: { bg: "#0E0E0E", fg: "#F7F6F3", eyebrow: "#9A78F5", muted: "#9C9B95", mediaBg: "#151515", chipBorder: "#2A2A2A" },
  identity: { bg: "#501EBD", fg: "#ffffff", eyebrow: "rgba(255,255,255,.7)", muted: "rgba(255,255,255,.78)", mediaBg: "#3A1590", chipBorder: "rgba(255,255,255,.28)" },
  campaign: { bg: "#EAE9E4", fg: "#0E0E0E", eyebrow: "#501EBD", muted: "#5C5C58", mediaBg: "#DEDDD7", chipBorder: "#CFCEC7" },
  creative: { bg: "#0E0E0E", fg: "#F7F6F3", eyebrow: "#9A78F5", muted: "#9C9B95", mediaBg: "#151515", chipBorder: "#2A2A2A" },
};

const FALLBACK_MEDIA = [
  "/images/capabilities/capability-1.png",
  "/images/capabilities/capability-2.png",
  "/images/capabilities/capability-3.png",
  "/images/capabilities/capability-4.png",
  "/images/capabilities/capability-5.png",
];

function getThemeKey(pillarId: string | undefined): ThemeKey {
  if (!pillarId) return "digital";
  const firstChar = pillarId.split("")[0];
  if (firstChar === "1") return "digital";
  if (firstChar === "2") return "identity";
  if (firstChar === "3") return "campaign";
  if (firstChar === "4") return "creative";
  return "digital";
}

export default function CapabilitiesV3({ data }: CapabilitiesV3Props) {
  const pillarList = Object.values(data?.pillars || {})
    .filter((p) => p && (p.title || p.label))
    .sort((a, b) => {
      const na = parseInt(a.id || "", 10);
      const nb = parseInt(b.id || "", 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return (a.id || "").localeCompare(b.id || "");
    });

  if (!pillarList.length) return null;

  return (
    <section id="capabilities" data-screen-label="Capabilities" style={{ padding: "0 0 clamp(50px,8vh,110px)", scrollMarginTop: 90 }}>
      <div
        style={{
          maxWidth: 1680,
          margin: "0 auto",
          padding: "0 clamp(18px,3.6vw,60px) clamp(24px,4vh,50px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 20,
          borderBottom: "1px solid #E2E1DB",
        }}
      >
        <div>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, marginBottom: 14 }}>
            (03) CAPABILITIES
          </span>
          <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(34px,5.6vw,84px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
            Four pillars
          </h2>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: MUTED, paddingBottom: 8 }}>HOVER TO EXPLORE</span>
      </div>

      <div style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(24px,4vh,48px) clamp(18px,3.6vw,60px) 0" }}>
        {pillarList.map((pillar, i) => {
          const themeKey = getThemeKey(pillar.id);
          const theme = CARD_THEME[themeKey] || CARD_THEME.digital;
          const chips = (pillar.tag || "").split(",").map((t) => t.trim()).filter(Boolean);

          return (
            <div
              key={pillar.id || i}
              data-cap="1"
              data-cap-card="1"
              style={{
                position: "sticky",
                top: 96,
                height: "calc(100vh - 150px)",
                marginBottom: "clamp(30px,7vh,80px)",
                borderRadius: 26,
                background: theme.bg,
                color: theme.fg,
                overflow: "hidden",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "clamp(20px,3vw,54px)",
                  padding: "clamp(24px,3.4vw,56px)",
                  transition: "transform .4s cubic-bezier(.22,1,.36,1), opacity .3s ease",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".28em", color: theme.eyebrow }}>
                    {String(i + 1).padStart(2, "0")} — {pillar.label}
                  </span>
                  <div>
                    <h3 style={{ margin: "0 0 18px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(34px,5.4vw,80px)", lineHeight: 0.92, letterSpacing: "-.04em" }}>
                      {pillar.title}
                    </h3>
                    <p style={{ margin: 0, maxWidth: "34ch", fontSize: "clamp(14px,1.15vw,18px)", lineHeight: 1.6, color: theme.muted }}>
                      {pillar.description}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {chips.map((chip, ci) => (
                      <span
                        key={ci}
                        style={{
                          padding: "8px 15px",
                          borderRadius: 999,
                          border: `1px solid ${theme.chipBorder}`,
                          fontSize: 12,
                          fontWeight: 600,
                          color: theme.fg === "#ffffff" ? "#ffffff" : theme.fg === "#F7F6F3" ? "#C9C9C4" : "#4A4A48",
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    borderRadius: 18,
                    overflow: "hidden",
                    background: theme.mediaBg,
                    minWidth: 0,
                    transition: "transform .4s cubic-bezier(.22,1,.36,1)",
                  }}
                >
                  {/* Front face - visible by default */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      src={pillar.imageUrl || FALLBACK_MEDIA[i % FALLBACK_MEDIA.length]}
                      alt={`${pillar.title || pillar.label} visual`}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>

                  {/* Back face - revealed on hover */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backfaceVisibility: "hidden",
                      padding: "clamp(24px,3.4vw,56px)",
                      transform: "rotateY(180deg)",
                      opacity: 0,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".28em", color: theme.eyebrow }}>
                      {String(i + 1).padStart(2, "0")} — {pillar.label}
                    </span>
                    <h3 style={{ margin: "0 0 18px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(34px,5.4vw,80px)", lineHeight: 0.92, letterSpacing: "-.04em" }}>
                      {pillar.title}
                    </h3>
                    <p style={{ margin: 0, maxWidth: "34ch", fontSize: "clamp(14px,1.15vw,18px)", lineHeight: 1.6, color: theme.muted }}>
                      {pillar.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {chips.map((chip, ci) => (
                        <span
                          key={ci}
                          style={{
                            padding: "8px 15px",
                            borderRadius: 999,
                            border: `1px solid ${theme.chipBorder}`,
                            fontSize: 12,
                            fontWeight: 600,
                            color: theme.fg === "#ffffff" ? "#ffffff" : theme.fg === "#F7F6F3" ? "#C9C9C4" : "#4A4A48",
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover wrapper - lifts and enlarges on hover */}
              <div
                style={{
                  perspective: 1000,
                  transition: "transform .4s cubic-bezier(.22,1,.36,1)",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 1,
                }}
                onMouseOver={(e) => {
                  const wrapper = e.currentTarget as HTMLElement;
                  wrapper.style.transform = "translateY(-8px) scale(1.02)";
                  // Flip the card content
                  const cardDiv = wrapper.parentElement as HTMLElement;
                  if (cardDiv) {
                    const contentGrid = cardDiv.firstElementChild as HTMLElement;
                    if (contentGrid) {
                      const frontFace = contentGrid.firstElementChild as HTMLElement;
                      const backFace = contentGrid.children[1] as HTMLElement;
                      if (frontFace && backFace) {
                        frontFace.style.transform = "rotateY(180deg)";
                        frontFace.style.opacity = "0";
                        backFace.style.transform = "rotateY(0deg)";
                        backFace.style.opacity = "1";
                      }
                    }
                  }
                }}
                onMouseOut={(e) => {
                  const wrapper = e.currentTarget as HTMLElement;
                  wrapper.style.transform = "translateY(0) scale(1)";
                  // Flip back the card content
                  const cardDiv = wrapper.parentElement as HTMLElement;
                  if (cardDiv) {
                    const contentGrid = cardDiv.firstElementChild as HTMLElement;
                    if (contentGrid) {
                      const frontFace = contentGrid.firstElementChild as HTMLElement;
                      const backFace = contentGrid.children[1] as HTMLElement;
                      if (frontFace && backFace) {
                        frontFace.style.transform = "rotateY(0deg)";
                        frontFace.style.opacity = "1";
                        backFace.style.transform = "rotateY(180deg)";
                        backFace.style.opacity = "0";
                      }
                    }
                  }
                }}
              >
                {/* The card content is contained within - front/back faces flip */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}