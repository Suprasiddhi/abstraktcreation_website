import React from "react";
import { displayFont, MUTED } from "./tokens";

type ThemeKey = "digital" | "identity" | "campaign" | "creative";

interface Pillar {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  tag?: string;
  badge?: string;
  imageUrl?: string;
}

interface CapabilitiesV2Props {
  data?: { pillars: Record<string, Pillar> };
}

// Cards render whatever pillars the CMS provides (keys are not fixed), so
// themes just cycle through this order by index.
const THEME_ORDER: ThemeKey[] = ["digital", "identity", "campaign", "creative"];

const CARD_THEME: Record<ThemeKey, { bg: string; fg: string; eyebrow: string; muted: string; mediaBg: string; chipBorder: string }> = {
  digital: { bg: "#0E0E0E", fg: "#F7F6F3", eyebrow: "#9A78F5", muted: "#9C9B95", mediaBg: "#151515", chipBorder: "#2A2A2A" },
  identity: { bg: "#501EBD", fg: "#ffffff", eyebrow: "rgba(255,255,255,.7)", muted: "rgba(255,255,255,.78)", mediaBg: "#3A1590", chipBorder: "rgba(255,255,255,.28)" },
  campaign: { bg: "#EAE9E4", fg: "#0E0E0E", eyebrow: "#501EBD", muted: "#5C5C58", mediaBg: "#DEDDD7", chipBorder: "#CFCEC7" },
  creative: { bg: "#0E0E0E", fg: "#F7F6F3", eyebrow: "#9A78F5", muted: "#9C9B95", mediaBg: "#151515", chipBorder: "#2A2A2A" },
};

// Local fallback artwork for the card's media half, cycled by pillar index.
// A pillar's own CMS imageUrl always wins when one is set.
const FALLBACK_MEDIA = [
  "/images/capabilities/capability-1.png",
  "/images/capabilities/capability-2.png",
  "/images/capabilities/capability-3.png",
  "/images/capabilities/capability-4.png",
  "/images/capabilities/capability-5.png",
];

export default function CapabilitiesV2({ data }: CapabilitiesV2Props) {
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
            (02) CAPABILITIES
          </span>
          <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(34px,5.6vw,84px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
            Four pillars
          </h2>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: MUTED, paddingBottom: 8 }}>SCROLL TO STACK</span>
      </div>

      <div style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(24px,4vh,48px) clamp(18px,3.6vw,60px) 0" }}>
        {pillarList.map((pillar, i) => {
          const theme = CARD_THEME[THEME_ORDER[i % THEME_ORDER.length]];
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.imageUrl || FALLBACK_MEDIA[i % FALLBACK_MEDIA.length]}
                    alt={`${pillar.title || pillar.label} visual`}
                    loading="lazy"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
