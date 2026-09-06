import React from "react";
import { LINE, BODY_MUTED, MUTED, displayFont } from "./tokens";

interface SectionEmptyProps {
  /** Section name, used in the default message: "Our work isn't available…" */
  label: string;
  /** Overrides the generated message where a section needs its own wording. */
  message?: string;
  /** Screen-reader/analytics label for the wrapping section element. */
  screenLabel?: string;
}

/**
 * Shown in place of a section whose content could not be loaded.
 *
 * The page used to fall back to hardcoded copy from content.ts, which meant
 * a dead backend rendered a full, plausible-looking site — nobody could tell
 * live content from stale placeholder text, and empty CMS tables were
 * invisible. This says plainly that something is unavailable instead.
 *
 * Deliberately quiet: a muted line at the section's normal rhythm, not an
 * error banner. A visitor who hits one section's outage should read it as
 * "nothing here right now", not as a broken page.
 */
export default function SectionEmpty({ label, message, screenLabel }: SectionEmptyProps) {
  return (
    <section
      data-reveal="1"
      data-depth="flat"
      data-screen-label={screenLabel || label}
      style={{
        maxWidth: 1680,
        margin: "0 auto",
        padding: "clamp(44px,6vh,72px) clamp(18px,3.6vw,60px)",
        borderTop: `1px solid ${LINE}`,
      }}
    >
      <div data-depth-inner="dim">
        <p
          data-rv="up"
          style={{
            margin: 0,
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: "clamp(15px,1.5vw,19px)",
            letterSpacing: "-.01em",
            color: BODY_MUTED,
          }}
        >
          {message || `${label} isn’t available right now.`}
        </p>
        <p
          data-rv="up"
          style={{
            ["--rv-i" as string]: 1,
            margin: "8px 0 0",
            fontSize: "clamp(13px,1.05vw,15px)",
            lineHeight: 1.6,
            color: MUTED,
          }}
        >
          Please check back shortly.
        </p>
      </div>
    </section>
  );
}
