import React from "react";
import { INK, BG } from "./tokens";

export default function CustomCursor() {
  return (
    <div
      data-cursor="1"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 34,
        height: 34,
        borderRadius: 999,
        background: INK,
        color: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 200,
        opacity: 0,
        transform: "translate3d(-50%,-50%,0)",
        transition:
          "width .34s cubic-bezier(.22,1,.36,1),height .34s cubic-bezier(.22,1,.36,1),opacity .25s,background .3s",
      }}
    >
      <span
        data-cursor-label="1"
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          opacity: 0,
          transition: "opacity .2s",
        }}
      >
        Drag
      </span>
    </div>
  );
}
