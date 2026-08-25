import React from "react";
import { displayFont, LINE, INK } from "./tokens";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsV2Props {
  data?: StatItem[];
}

const ACCENT_COLORS = [INK, "#501EBD", INK, INK];

export default function StatsV2({ data }: StatsV2Props) {
  const items = data && data.length ? data : [];
  if (items.length === 0) return null;

  return (
    <section data-screen-label="Stats" style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(56px,9vh,110px) clamp(18px,3.6vw,60px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "clamp(18px,2.4vw,40px)" }}>
        {items.map((stat, i) => (
          <div
            key={i}
            data-r="1"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 20,
              borderTop: `2px solid ${i === 0 ? INK : LINE}`,
              opacity: 0,
              transform: "translateY(26px)",
              transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${i * 0.08}s,transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.08}s`,
            }}
          >
            <span
              data-stat={stat.value}
              data-suffix={stat.suffix || ""}
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: "clamp(46px,6vw,88px)",
                lineHeight: 0.9,
                letterSpacing: "-.04em",
                color: ACCENT_COLORS[i % ACCENT_COLORS.length],
              }}
            >
              0
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
