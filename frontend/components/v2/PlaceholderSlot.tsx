import React from "react";

interface PlaceholderSlotProps {
  label: string;
  tone?: "dark" | "purple" | "light";
  style?: React.CSSProperties;
}

const TONES: Record<string, React.CSSProperties> = {
  dark: { background: "linear-gradient(135deg,#1C1C1C,#0E0E0E)", color: "rgba(247,246,243,.4)" },
  purple: { background: "linear-gradient(135deg,#6B32E8,#3A1590)", color: "rgba(255,255,255,.55)" },
  light: { background: "linear-gradient(135deg,#EAE9E4,#D6D5CF)", color: "rgba(14,14,14,.35)" },
};

export default function PlaceholderSlot({ label, tone = "dark", style }: PlaceholderSlotProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 16,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        userSelect: "none",
        ...TONES[tone],
        ...style,
      }}
    >
      {label}
    </div>
  );
}
