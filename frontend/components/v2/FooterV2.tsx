import React from "react";
import SpotlightWordmark from "./SpotlightWordmark";
import { displayFont } from "./tokens";

/** Colour and the hover wipe live in `.ab-flink`; only the type scale is
 *  set here, so the twelve links cannot drift apart from each other. */
const LINK: React.CSSProperties = { fontSize: 15, fontWeight: 600 };

export default function FooterV2() {
  // The footer sizes to its own content rather than being pinned to 100vh.
  // A fixed viewport height clipped the wordmark mid-letterform on any
  // viewport shorter than the three stacked rows, and since the wordmark is
  // the last thing on the page there was no scroll left to reveal it — the
  // page simply appeared to end early.
  // `overflow: hidden` on the footer clips the wordmark's torch glow, which
  // deliberately bleeds past its own box so its falloff completes in open
  // space. The footer is the boundary it should not escape, and clipping
  // here rather than around the wordmark keeps the glow's own edges soft.
  return (
    <footer data-nav-tone="dark" style={{ background: "#100A1E", color: "#F7F6F3", padding: "clamp(50px,8vh,96px) clamp(18px,3.6vw,60px) clamp(20px,3vh,40px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "clamp(20px,4vh,48px)", overflow: "hidden" }}>
      <div className="ab-grid-footer" style={{ maxWidth: 1680, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.5fr) repeat(3,minmax(0,.8fr))", gap: "clamp(24px,3vw,48px)", paddingBottom: "clamp(36px,6vh,72px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22, letterSpacing: "-.03em" }}>
            ABSTRAKT<span style={{ color: "#9A78F5" }}>.</span>
          </span>
          <p style={{ margin: 0, maxWidth: "34ch", fontSize: 15, lineHeight: 1.6, color: "rgba(250,250,250,.68)" }}>
            Sanepa, Lalitpur, Nepal
            <br />
            3620 Adelaide, The Colony, TX
          </p>
          <span data-clock="1" style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".12em", color: "rgba(250,250,250,.45)" }}>
            — NPT · — CT
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".24em", color: "rgba(250,250,250,.42)" }}>PAGES</span>
          <a className="ab-flink" href="#work" style={LINK}>Work</a>
          <a className="ab-flink" href="#capabilities" style={LINK}>Capabilities</a>
          <a className="ab-flink" href="#studio" style={LINK}>Studio</a>
          <a className="ab-flink" href="#careers" style={LINK}>Careers</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".24em", color: "rgba(250,250,250,.42)" }}>SOCIAL</span>
          {/* External destinations, so they open in a new tab and carry
              rel=noreferrer — the PAGES column above is in-page anchors. */}
          <a className="ab-flink" href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={LINK}>Instagram</a>
          <a className="ab-flink" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={LINK}>LinkedIn</a>
          <a className="ab-flink" href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={LINK}>Facebook</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".24em", color: "rgba(250,250,250,.42)" }}>DIRECT</span>
          <a className="ab-flink" href="mailto:abstraktcreation@gmail.com" style={{ ...LINK, wordBreak: "break-all" }}>
            abstraktcreation@gmail.com
          </a>
          <a className="ab-flink" href="tel:+9779823901866" style={LINK}>+977 9823901866</a>
          <a className="ab-flink" href="tel:+18173309194" style={LINK}>+1 (817) 330-9194</a>
        </div>
      </div>
      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "20px 0", borderTop: "1px solid rgba(250,250,250,.14)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", color: "rgba(250,250,250,.42)" }}>
        <span>© 2026 ABSTRAKT CREATION</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a className="ab-flink ab-flink--quiet" href="#privacy">PRIVACY</a>
          <a className="ab-flink ab-flink--quiet" href="#legal">LEGAL</a>
        </div>
      </div>
      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", paddingTop: "clamp(10px,2vh,26px)" }}>
        <SpotlightWordmark />
      </div>
    </footer>
  );
}
