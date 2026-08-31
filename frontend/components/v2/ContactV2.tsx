import React from "react";
import { displayFont } from "./tokens";

export default function ContactV2() {
  return (
    <section
      id="contact"
      data-reveal="1"
      data-depth="1"
      data-screen-label="Contact"
      style={{ position: "relative", background: "#0E0E0E", color: "#F7F6F3", padding: "clamp(70px,12vh,150px) clamp(18px,3.6vw,60px)", scrollMarginTop: 0, overflow: "hidden" }}
    >
      <div data-depth-inner="1" style={{ position: "relative", maxWidth: 1680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,5vh,56px)" }}>
        <span data-rv="eyebrow" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "#9A78F5" }}>(09) NEXT STEP</span>
        <a
          href="mailto:abstraktcreation@gmail.com"
          style={{ display: "block", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(40px,10vw,168px)", lineHeight: 0.9, letterSpacing: "-.045em", color: "#F7F6F3" }}
        >
          <span data-rv="line" style={{ ["--rv-i" as string]: 1 }}><span>Let&apos;s make</span></span>
          <span data-rv="line" style={{ ["--rv-i" as string]: 2 }}><span>the thing.</span></span>
        </a>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 26, paddingTop: "clamp(24px,4vh,44px)", borderTop: "1px solid #242424" }}>
          <p data-rv="up" style={{ ["--rv-i" as string]: 4, margin: 0, maxWidth: "44ch", fontSize: "clamp(15px,1.25vw,19px)", lineHeight: 1.6, color: "#9C9B95" }}>
            Tell us what you are trying to launch and roughly when. You will get a scope and a number, not a deck.
          </p>
          <div data-rv="up" style={{ ["--rv-i" as string]: 5, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a
              href="mailto:abstraktcreation@gmail.com"
              style={{ display: "inline-flex", alignItems: "center", height: 56, padding: "0 30px", borderRadius: 999, background: "#501EBD", color: "#ffffff", fontSize: 16, fontWeight: 600 }}
            >
              abstraktcreation@gmail.com
            </a>
            <a
              href="tel:+9779823901866"
              style={{ display: "inline-flex", alignItems: "center", height: 56, padding: "0 30px", borderRadius: 999, border: "1px solid #2A2A2A", color: "#F7F6F3", fontSize: 16, fontWeight: 600 }}
            >
              +977 9823901866
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
