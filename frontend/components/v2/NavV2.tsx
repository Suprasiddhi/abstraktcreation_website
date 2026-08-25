import React from "react";
import { displayFont } from "./tokens";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Studio", href: "#studio" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export default function NavV2() {
  return (
    <>
      <div
        data-nav="1"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          mixBlendMode: "difference",
          transition: "transform .55s cubic-bezier(.22,1,.36,1)",
          willChange: "transform",
        }}
      >
        <div
          style={{
            maxWidth: 1680,
            margin: "0 auto",
            padding: "20px clamp(18px,3.6vw,60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <a
            href="#top"
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "clamp(18px,2vw,23px)",
              letterSpacing: "-.03em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            ABSTRAKT<span>.</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href="#work"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 42,
                padding: "0 20px",
                borderRadius: 999,
                background: "#ffffff",
                color: "#000000",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".01em",
                whiteSpace: "nowrap",
              }}
            >
              See the work
            </a>
            <button
              type="button"
              data-action="toggle-menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                height: 42,
                padding: "0 18px",
                borderRadius: 999,
                background: "#ffffff",
                color: "#000000",
                border: 0,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "block", width: 15, height: 1.6, background: "#000000" }} />
                <span style={{ display: "block", width: 15, height: 1.6, background: "#000000" }} />
              </span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div
        data-menu="1"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          background: "#0E0E0E",
          color: "#F7F6F3",
          transform: "translate3d(0,-101%,0)",
          transition: "transform .72s cubic-bezier(.76,0,.24,1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px clamp(18px,3.6vw,60px)",
            maxWidth: 1680,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(18px,2vw,23px)", letterSpacing: "-.03em" }}>
            ABSTRAKT<span style={{ color: "#9A78F5" }}>.</span>
          </span>
          <button
            type="button"
            data-action="close-menu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 42,
              padding: "0 18px",
              borderRadius: 999,
              background: "#F7F6F3",
              color: "#0E0E0E",
              border: 0,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span style={{ position: "relative", width: 14, height: 14, display: "block" }}>
              <span style={{ position: "absolute", top: 6, left: 0, width: 14, height: 1.6, background: "#0E0E0E", transform: "rotate(45deg)" }} />
              <span style={{ position: "absolute", top: 6, left: 0, width: 14, height: 1.6, background: "#0E0E0E", transform: "rotate(-45deg)" }} />
            </span>
            <span>Close</span>
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)",
            gap: "clamp(24px,5vw,80px)",
            alignItems: "end",
            padding: "0 clamp(18px,3.6vw,60px) clamp(36px,6vh,72px)",
            maxWidth: 1680,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                data-mi="1"
                data-action="close-menu"
                href={link.href}
                style={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: "clamp(38px,7.4vw,104px)",
                  lineHeight: 1.02,
                  letterSpacing: "-.035em",
                  color: "#F7F6F3",
                  padding: "2px 0",
                  transform: "translate3d(0,110%,0)",
                  transition: "transform .7s cubic-bezier(.22,1,.36,1),color .25s",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, paddingBottom: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "#5C5C5C" }}>STUDIOS</span>
              <span style={{ fontSize: 15, color: "#C9C9C4", lineHeight: 1.6 }}>
                Sanepa, Lalitpur, Nepal
                <br />
                3620 Adelaide, The Colony, TX
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "#5C5C5C" }}>DIRECT</span>
              <a href="mailto:abstraktcreation@gmail.com" style={{ fontSize: 15, color: "#F7F6F3" }}>
                abstraktcreation@gmail.com
              </a>
              <a href="tel:+9779823901866" style={{ fontSize: 15, color: "#C9C9C4" }}>
                +977 9823901866
              </a>
              <a href="tel:+18173309194" style={{ fontSize: 15, color: "#C9C9C4" }}>
                +1 (817) 330-9194
              </a>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 600 }}>
              <a href="https://instagram.com" style={{ color: "#C9C9C4" }}>Instagram</a>
              <a href="https://linkedin.com" style={{ color: "#C9C9C4" }}>LinkedIn</a>
              <a href="https://facebook.com" style={{ color: "#C9C9C4" }}>Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
