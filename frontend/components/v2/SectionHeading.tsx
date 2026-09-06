import React from "react";
import { BRAND, BRAND_LIGHT } from "./tokens";

interface SectionHeadingProps {
  /** Full heading text. The last `accent` words are painted in brand. */
  children: string;
  /** How many trailing words take the brand colour. */
  accent?: number;
  /** Dark sections need the lighter brand tint to stay legible on ink. */
  tone?: "light" | "dark";
}

/**
 * Two-tone section heading: the phrase runs in the section's ink colour and
 * its final word (or words) picks up brand purple, so every heading on the
 * site carries the same accent without each section hardcoding the split.
 *
 * The text is emitted as two spans inside one flow rather than as separate
 * blocks, so it still wraps as a single paragraph of type at any width and
 * the accent can fall mid-line on a narrow viewport.
 */
export default function SectionHeading({ children, accent = 1, tone = "light" }: SectionHeadingProps) {
  const words = children.trim().split(/\s+/);
  // A heading shorter than the requested accent would go entirely brand,
  // which reads as a colour change rather than an accent — keep one word
  // in ink so the two-tone contrast always survives.
  const take = Math.min(Math.max(accent, 0), Math.max(words.length - 1, 0));
  const head = words.slice(0, words.length - take).join(" ");
  const tail = words.slice(words.length - take).join(" ");

  if (!tail) return <>{head}</>;

  return (
    <>
      {head}{" "}
      <span style={{ color: tone === "dark" ? BRAND_LIGHT : BRAND }}>{tail}</span>
    </>
  );
}
