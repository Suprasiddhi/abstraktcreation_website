import React from "react";
import PlaceholderSlot from "./PlaceholderSlot";
import { displayFont, MUTED } from "./tokens";

type PillarKey = "digital" | "identity" | "campaign" | "creative";

interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  tag: string;
  badge?: string;
}

interface CapabilitiesV2Props {
  data?: { pillars: Record<PillarKey, Pillar> };
}

const ORDER: PillarKey[] = ["digital", "identity", "campaign", "creative"];

const CARD_THEME: Record<PillarKey, { bg: string; fg: string; eyebrow: string; muted: string; mediaBg: string; chipBorder: string }> = {
  digital: { bg: "#0E0E0E", fg: "#F7F6F3", eyebrow: "#9A78F5", muted: "#9C9B95", mediaBg: "#151515", chipBorder: "#2A2A2A" },
  identity: { bg: "#501EBD", fg: "#ffffff", eyebrow: "rgba(255,255,255,.7)", muted: "rgba(255,255,255,.78)", mediaBg: "#3A1590", chipBorder: "rgba(255,255,255,.28)" },
  campaign: { bg: "#EAE9E4", fg: "#0E0E0E", eyebrow: "#501EBD", muted: "#5C5C58", mediaBg: "#DEDDD7", chipBorder: "#CFCEC7" },
  creative: { bg: "#0E0E0E", fg: "#F7F6F3", eyebrow: "#9A78F5", muted: "#9C9B95", mediaBg: "#151515", chipBorder: "#2A2A2A" },
};

export default function CapabilitiesV2({ data }: CapabilitiesV2Props) {
  const pillars = data?.pillars;
  if (!pillars) return null;

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
            (02) CAPABILITIES
          </span>
          <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(34px,5.6vw,84px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
            Four pillars
          </h2>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: MUTED, paddingBottom: 8 }}>SCROLL TO STACK</span>
      </div>

      <div style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(24px,4vh,48px) clamp(18px,3.6vw,60px) 0" }}>
        {ORDER.map((key, i) => {
          const pillar = pillars[key];
          if (!pillar) return null;
          const theme = CARD_THEME[key];
          const chips = (pillar.tag || "").split(",").map((t) => t.trim()).filter(Boolean);

          return (
            <div
              key={key}
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
              }}
            >
              <div style={{ height: "100%", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(20px,3vw,54px)", padding: "clamp(24px,3.4vw,56px)" }}>
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
                <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: theme.mediaBg, minWidth: 0 }}>
                  <PlaceholderSlot label={`${pillar.title} — visual`} tone={key === "campaign" ? "light" : key === "identity" ? "purple" : "dark"} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
