import React from "react";

interface SeamBandProps {
  /** Ground of the section directly above; the band fades up into it. */
  from: string;
  /** Ground of the section directly below; the band fades down into it. */
  to: string;
  /**
   * Dot colour set. "light" is brand purple on cream for seams between the
   * page's light grounds; "ink" is a lifted purple on near-black for a seam
   * that runs into a dark section.
   */
  tone?: "light" | "ink";
}

/**
 * Transition band between two sections with different grounds.
 *
 * The homepage changes ground abruptly in a couple of places — most sharply
 * where the ink capabilities grid meets the cream client band — and those
 * changes landed as a hard horizontal cut. This puts a halftone dot field at
 * the seam so the two grounds meet through a texture instead.
 *
 * The pattern was mocked up as a 1.5MB PNG of a dot field radiating from a
 * centre hexagon. It is drawn in CSS here instead: a repeating gradient stays
 * crisp at any viewport width, costs nothing to download, and inverts for the
 * dark side from one custom property. The mock's centre burst is dropped —
 * at band height it would read as a stray shape rather than a texture.
 *
 * Purely decorative, so it is aria-hidden and carries no reveal hooks: the
 * band should already be textured when it scrolls into view, not animate in
 * as if it were content.
 */
export default function SeamBand({ from, to, tone = "light" }: SeamBandProps) {
  return (
    <div
      aria-hidden="true"
      className={tone === "ink" ? "ab-seam ab-seam--ink" : "ab-seam"}
      style={
        {
          "--seam-from": from,
          "--seam-to": to,
        } as React.CSSProperties
      }
    />
  );
}
