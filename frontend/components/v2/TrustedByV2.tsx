import React from "react";
import InfiniteMover from "./InfiniteMover";
import { MUTED } from "./tokens";

interface LogoItem {
  id?: number;
  name: string;
  imageUrl?: string;
}

interface TrustedByV2Props {
  data?: LogoItem[];
}

// One full set per copy; the InfiniteMover renders the set five times, and
// the set itself must out-width the viewport for the loop to stay covered.
const MIN_TILES_PER_SET = 10;
const TILE_GAP = "clamp(12px,1.4vw,20px)";

function buildSet(items: LogoItem[]): LogoItem[] {
  if (!items.length) return [];
  const set: LogoItem[] = [];
  while (set.length < MIN_TILES_PER_SET) set.push(...items);
  return set;
}

function LogoTile({ logo }: { logo: LogoItem }) {
  return (
    <div
      className="ab-logo-tile"
      style={{
        flex: "0 0 auto",
        position: "relative",
        width: "clamp(128px,13vw,170px)",
        height: "clamp(66px,6.2vw,88px)",
        marginRight: TILE_GAP,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {logo.imageUrl ? (
        <img
          src={logo.imageUrl}
          alt={logo.name}
          style={{ maxWidth: "68%", maxHeight: "58%", width: "auto", height: "auto", objectFit: "contain", display: "block" }}
        />
      ) : (
        <span
          style={{
            fontSize: "clamp(11px,1vw,13px)",
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#6F6E68",
            textAlign: "center",
            padding: "0 10px",
          }}
        >
          {logo.name}
        </span>
      )}
    </div>
  );
}

export default function TrustedByV2({ data }: TrustedByV2Props) {
  const logos = data && data.length ? data : [];
  if (logos.length === 0) return null;

  // Both rows carry the full set so they're equally dense; the second is
  // rotated so the rows don't read as mirrored.
  const rotate = Math.floor(logos.length / 2);
  const setA = buildSet(logos);
  const setB = buildSet([...logos.slice(rotate), ...logos.slice(0, rotate)]);

  return (
    <section
      data-reveal="1"
      data-depth="1"
      style={{ padding: "clamp(26px,4vh,44px) 0", overflow: "hidden" }}
    >
      <div data-depth-inner="1">
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 clamp(18px,3.6vw,60px)", marginBottom: "clamp(18px,3vh,30px)" }}>
          <span data-rv="eyebrow" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, whiteSpace: "nowrap" }}>
            TRUSTED BY
          </span>
          <span style={{ flex: 1 }} />
          <span data-rv="eyebrow" style={{ ["--rv-i" as string]: 1, fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, whiteSpace: "nowrap" }}>
            NEPAL · US
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,1.4vw,20px)" }}>
          <InfiniteMover move="RL" duration={48}>
            {setA.map((logo, i) => (
              <LogoTile key={`a-${i}`} logo={logo} />
            ))}
          </InfiniteMover>
          <InfiniteMover move="LR" duration={62}>
            {setB.map((logo, i) => (
              <LogoTile key={`b-${i}`} logo={logo} />
            ))}
          </InfiniteMover>
        </div>
      </div>
    </section>
  );
}
