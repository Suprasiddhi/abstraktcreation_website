import React from "react";
import { displayFont } from "./tokens";

export default function FooterV2() {
  return (
    <footer style={{ minHeight: "100vh", background: "#100A1E", color: "#F7F6F3", padding: "clamp(50px,8vh,96px) clamp(18px,3.6vw,60px) 0", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.5fr) repeat(3,minmax(0,.8fr))", gap: "clamp(24px,3vw,48px)", paddingBottom: "clamp(36px,6vh,72px)" }}>
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
          <a href="#work" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>Work</a>
          <a href="#capabilities" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>Capabilities</a>
          <a href="#studio" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>Studio</a>
          <a href="#careers" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>Careers</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".24em", color: "rgba(250,250,250,.42)" }}>SOCIAL</span>
          <a href="https://instagram.com" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>Instagram</a>
          <a href="https://linkedin.com" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>LinkedIn</a>
          <a href="https://facebook.com" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>Facebook</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".24em", color: "rgba(250,250,250,.42)" }}>DIRECT</span>
          <a href="mailto:abstraktcreation@gmail.com" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)", wordBreak: "break-all" }}>
            abstraktcreation@gmail.com
          </a>
          <a href="tel:+9779823901866" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>+977 9823901866</a>
          <a href="tel:+18173309194" style={{ fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,.8)" }}>+1 (817) 330-9194</a>
        </div>
      </div>
      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "20px 0", borderTop: "1px solid rgba(250,250,250,.14)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", color: "rgba(250,250,250,.42)" }}>
        <span>© 2026 ABSTRAKT CREATION</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="#privacy" style={{ color: "rgba(250,250,250,.42)" }}>PRIVACY</a>
          <a href="#legal" style={{ color: "rgba(250,250,250,.42)" }}>LEGAL</a>
        </div>
      </div>
      <div style={{ maxWidth: 1680, margin: "0 auto", width: "100%", paddingTop: "clamp(10px,2vh,26px)" }}>
        <span
          data-wordmark="1"
          style={{ display: "block", fontFamily: displayFont, fontWeight: 700, fontSize: "19.4vw", lineHeight: 0.78, letterSpacing: "-.055em", color: "rgba(250,250,250,.1)", whiteSpace: "nowrap", userSelect: "none" }}
        >
          ABSTRAKT
        </span>
      </div>
    </footer>
  );
}
