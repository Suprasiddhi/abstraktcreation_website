import React from "react";
import PlaceholderSlot from "./PlaceholderSlot";
import { LINE, MUTED } from "./tokens";

interface LogoItem {
  id?: number;
  name: string;
  imageUrl?: string;
}

interface TrustedByV2Props {
  data?: LogoItem[];
}

function LogoTile({ logo }: { logo: LogoItem }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        position: "relative",
        width: "clamp(150px,15vw,224px)",
        height: "clamp(76px,7vw,104px)",
        borderRadius: 14,
        background: "#EFEEE9",
        border: `1px solid ${LINE}`,
        overflow: "hidden",
      }}
    >
      {logo.imageUrl ? (
        <img src={logo.imageUrl} alt={logo.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 14 }} />
      ) : (
        <PlaceholderSlot label={logo.name || "Client logo"} tone="light" />
      )}
    </div>
  );
}

export default function TrustedByV2({ data }: TrustedByV2Props) {
  const logos = data && data.length ? data : [];
  if (logos.length === 0) return null;

  const mid = Math.ceil(logos.length / 2);
  const rowA = logos.slice(0, mid).length ? logos.slice(0, mid) : logos;
  const rowB = logos.slice(mid).length ? logos.slice(mid) : logos;
  const loopedA = [...rowA, ...rowA];
  const loopedB = [...rowB, ...rowB];

  return (
    <section style={{ padding: "clamp(26px,4vh,44px) 0", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 clamp(18px,3.6vw,60px)", marginBottom: "clamp(18px,3vh,30px)" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED }}>TRUSTED BY</span>
        <span style={{ flex: 1, height: 1, background: LINE }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED }}>NEPAL · US</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "clamp(14px,2vw,22px)", width: "max-content", padding: "0 clamp(18px,3.6vw,60px)", animation: "abDriftA 46s ease-in-out infinite alternate" }}>
          {loopedA.map((logo, i) => (
            <LogoTile key={`a-${i}`} logo={logo} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "clamp(14px,2vw,22px)", width: "max-content", padding: "0 clamp(18px,3.6vw,60px)", animation: "abDriftB 52s ease-in-out infinite alternate" }}>
          {loopedB.map((logo, i) => (
            <LogoTile key={`b-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
