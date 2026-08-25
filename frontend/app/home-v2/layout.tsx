import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./v2-animations.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Stand-in for Oakes Grotesk (the design's display font) until the licensed
// font files are available — see plan notes for the swap-in path.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abstrakt — One studio for the site, the brand, and everything that carries it.",
  description:
    "Web solutions, brand systems, campaigns, video, 3D and sound. Built in house, from the first call to the thing that ships.",
};

export default function HomeV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
      style={
        {
          "--ab-bg": "#F7F6F3",
          "--ab-ink": "#0E0E0E",
          "--ab-brand": "#501EBD",
          "--ab-brand-light": "#9A78F5",
          "--ab-card": "#EAE9E4",
          "--ab-ink-deep": "#100A1E",
          fontFamily: "var(--font-manrope), system-ui, sans-serif",
          background: "var(--ab-bg)",
          color: "var(--ab-ink)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
