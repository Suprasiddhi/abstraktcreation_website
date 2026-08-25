import React from "react";
import { displayFont, MUTED } from "./tokens";

interface PositionV2Props {
  data?: { statement?: string };
}

export default function PositionV2({ data }: PositionV2Props) {
  const statement =
    data?.statement ||
    "We build the digital side of a business and the creative work around it. The site, the identity, the campaign, the content. One team, in house.";
  const words = statement.trim().split(/\s+/);

  return (
    <section data-reveal-sec="1" data-screen-label="Position" style={{ position: "relative", height: "230vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1680, margin: "0 auto", padding: "0 clamp(18px,3.6vw,60px)", width: "100%" }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, marginBottom: "clamp(18px,3vh,34px)" }}>
            (01) POSITION
          </span>
          <p
            style={{
              margin: 0,
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize: "clamp(24px,3.5vw,54px)",
              lineHeight: 1.28,
              letterSpacing: "-.02em",
              maxWidth: "24ch",
            }}
          >
            {words.map((w, i) => (
              <span key={i} data-rw="1" style={{ opacity: 0.14 }}>
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
