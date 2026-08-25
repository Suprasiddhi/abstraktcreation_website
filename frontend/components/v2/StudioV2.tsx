import React from "react";
import PlaceholderSlot from "./PlaceholderSlot";
import { displayFont } from "./tokens";

interface MemberData {
  name: string;
  role: string;
  description?: string;
}

interface StudioV2Props {
  data?: { team: MemberData[] };
}

export default function StudioV2({ data }: StudioV2Props) {
  const team = data?.team || [];
  if (team.length === 0) return null;

  return (
    <section id="studio" data-screen-label="People" style={{ position: "relative", padding: "clamp(60px,9vh,110px) 0", background: "#EAE9E4", scrollMarginTop: 80, overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1680, margin: "0 auto", padding: "0 clamp(18px,3.6vw,60px)" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            paddingBottom: "clamp(24px,4vh,44px)",
            borderBottom: "1px solid #D6D5CF",
            marginBottom: "clamp(28px,4.5vh,52px)",
          }}
        >
          <div>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "#8B8A84", marginBottom: 14 }}>
              (05) THE PEOPLE
            </span>
            <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(32px,5.2vw,78px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
              Who you actually work with
            </h2>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: "#8B8A84", paddingBottom: 8 }}>TAP + TO READ</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(14px,1.6vw,24px)" }}>
          {team.map((member, i) => (
            <PersonCard key={i} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PersonCard({ member, compact = false }: { member: MemberData; compact?: boolean }) {
  const pad = compact ? 20 : 24;
  const btnSize = compact ? 46 : 54;
  const iconSize = compact ? 14 : 16;

  return (
    <div data-person="1" style={{ position: "relative", aspectRatio: "3/4", borderRadius: compact ? 18 : 20, overflow: "hidden", background: "#2A0E70" }}>
      <PlaceholderSlot label={member.name} tone="purple" />
      <div
        data-circle="1"
        style={{
          position: "absolute",
          left: `calc(100% - ${btnSize - 13}px)`,
          top: `calc(100% - ${btnSize - 13}px)`,
          width: 0,
          height: 0,
          transform: "translate(-50%,-50%)",
          borderRadius: 999,
          background: "#ffffff",
          transition: "width .68s cubic-bezier(.76,0,.24,1),height .68s cubic-bezier(.76,0,.24,1)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div
        data-panel="1"
        style={{
          position: "absolute",
          inset: 0,
          padding: pad,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#0E0E0E",
          zIndex: 4,
          opacity: 0,
          transform: "translateY(22px)",
          transition: "opacity .34s .22s,transform .34s .22s",
          pointerEvents: "none",
        }}
      >
        <p style={{ margin: 0, fontSize: compact ? 15 : "clamp(15px,1.3vw,20px)", lineHeight: 1.45, fontWeight: 500 }}>
          {member.description || "Part of the studio team."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: compact ? 16 : 19 }}>{member.name}</span>
          <span style={{ fontSize: compact ? 13 : 14, opacity: 0.8 }}>{member.role}</span>
        </div>
      </div>
      <button
        type="button"
        data-action="toggle-person"
        aria-label="Read bio"
        style={{
          position: "absolute",
          bottom: compact ? 12 : 14,
          right: compact ? 12 : 14,
          width: btnSize,
          height: btnSize,
          borderRadius: 999,
          background: "#ffffff",
          border: 0,
          padding: 0,
          cursor: "pointer",
          zIndex: 3,
          transition: "width .68s cubic-bezier(.76,0,.24,1),height .68s cubic-bezier(.76,0,.24,1),transform .68s cubic-bezier(.76,0,.24,1)",
        }}
      >
        <span
          data-plus-icon="1"
          style={{ position: "absolute", bottom: compact ? 16 : 19, right: compact ? 16 : 19, display: "block", width: iconSize, height: iconSize, transition: "transform .5s cubic-bezier(.34,1.5,.64,1)" }}
        >
          <span style={{ position: "absolute", top: iconSize / 2 - 1, left: 0, width: iconSize, height: 2, background: "#0E0E0E", borderRadius: 2 }} />
          <span style={{ position: "absolute", left: iconSize / 2 - 1, top: 0, width: 2, height: iconSize, background: "#0E0E0E", borderRadius: 2 }} />
        </span>
      </button>
      <div data-label="1" style={{ position: "absolute", left: compact ? 16 : 20, bottom: compact ? 18 : 22, color: "#ffffff", transition: "opacity .3s", pointerEvents: "none" }}>
        <span style={{ display: "block", fontFamily: displayFont, fontWeight: 700, fontSize: compact ? 16 : 19 }}>{member.name}</span>
        <span style={{ fontSize: compact ? 12 : 13, opacity: 0.75 }}>{member.role}</span>
      </div>
    </div>
  );
}
