import React from "react";
import { displayFont, MUTED } from "./tokens";

interface Testimonial {
  quote: string;
  authorName: string;
  authorRole: string;
  theme?: "light" | "dark";
}

interface TestimonialsV2Props {
  data?: Testimonial[];
}

export default function TestimonialsV2({ data }: TestimonialsV2Props) {
  const quotes = data && data.length ? data : [];
  if (quotes.length === 0) return null;

  return (
    <section data-reveal="1" data-depth="1" data-screen-label="Testimonials" style={{ padding: "clamp(60px,9vh,110px) 0", overflow: "hidden" }}>
      <div data-depth-inner="1" style={{ maxWidth: 1680, margin: "0 auto", padding: "0 clamp(18px,3.6vw,60px)", display: "grid", gridTemplateColumns: "minmax(0,.85fr) minmax(0,1.6fr)", gap: "clamp(24px,4vw,64px)", alignItems: "center" }}>
        <div>
          <span data-rv="eyebrow" style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, marginBottom: 14 }}>
            (06) CLIENTS
          </span>
          <h2 style={{ margin: "0 0 26px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(30px,4.4vw,64px)", lineHeight: 0.98, letterSpacing: "-.04em", maxWidth: "16ch" }}>
            <span data-rv="line"><span>Rating and reviews, in their words</span></span>
          </h2>
          <div data-rv="up" style={{ ["--rv-i" as string]: 2, display: "flex", gap: 12 }}>
            <button
              type="button"
              data-action="prev-quote"
              aria-label="Previous"
              style={{ width: 66, height: 52, borderRadius: 999, border: "1px solid #D6D5CF", background: "transparent", color: "#0E0E0E", fontSize: 18, cursor: "pointer" }}
            >
              ←
            </button>
            <button
              type="button"
              data-action="next-quote"
              aria-label="Next"
              style={{ width: 66, height: 52, borderRadius: 999, border: "1px solid #D6D5CF", background: "transparent", color: "#0E0E0E", fontSize: 18, cursor: "pointer" }}
            >
              →
            </button>
          </div>
        </div>
        <div data-rv="up" data-drag-zone="1" style={{ ["--rv-i" as string]: 3, position: "relative", width: "100%", height: 480, overflow: "hidden", touchAction: "pan-y" }}>
          {quotes.map((t, i) => {
            const dark = t.theme === "dark";
            return (
              <blockquote
                key={i}
                data-quote="1"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "min(calc(100vw - 40px),450px)",
                  height: "100%",
                  margin: 0,
                  padding: 34,
                  borderRadius: 20,
                  background: dark ? "#0E0E0E" : "#EAE9E4",
                  color: dark ? "#F7F6F3" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  userSelect: "none",
                  willChange: "transform",
                  transition: "transform .6s ease-in-out,opacity .6s ease-in-out",
                }}
              >
                <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 46, lineHeight: 0.6, color: dark ? "#9A78F5" : "#501EBD" }}>
                  &ldquo;
                </span>
                <p style={{ margin: 0, fontSize: "clamp(16px,1.35vw,21px)", lineHeight: 1.55, color: dark ? undefined : "#2A2A28" }}>{t.quote}</p>
                <footer style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "auto" }}>
                  <span style={{ width: 52, height: 52, borderRadius: 999, background: dark ? "#2A2A2A" : "#D6D5CF", flex: "0 0 auto" }} />
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{t.authorName}</span>
                    <span style={{ fontSize: 14, color: dark ? "#9C9B95" : "#6B7280" }}>{t.authorRole}</span>
                  </span>
                </footer>
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}
