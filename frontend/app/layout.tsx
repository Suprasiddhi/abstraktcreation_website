import type { Metadata } from "next";
import { Manrope, Noto_Sans_Devanagari, Space_Grotesk } from "next/font/google";
import "./globals.css";
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

// Only the menu overlay's vertical locale rail ("ललितपुर — नेपाल") uses this.
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Abstrakt — One studio for the site, the brand, and everything that carries it.",
  description:
    "Web solutions, brand systems, campaigns, video, 3D and sound. Built in house, from the first call to the thing that ships.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
