"use client";

import React, { useEffect, useRef, useState } from "react";
import InfiniteMover from "./InfiniteMover";
import { INK, LINE, BRAND, BODY_MUTED, displayFont } from "./tokens";

/** Luminance at or above this (0-255) is treated as background plate and
 *  erased. Only applied to images that actually have a plate — see the
 *  `hasPlate` test below, which is what keeps a legitimately pale mark on
 *  transparency from being erased as though it were background. */
const PLATE_LUMA = 246;
/** Width of the soft ramp below the cutoff, so edges stay anti-aliased
 *  instead of turning into a hard 1px stair. Wide enough that a plate
 *  sitting a little below pure white still washes out rather than leaving
 *  a faint grey rectangle behind the mark. */
const EDGE_SOFTNESS = 34;
/** Fraction of edge pixels that must be opaque for the image to count as
 *  plated. A mark delivered on transparency has a clear border; a JPEG or
 *  a flattened PNG is opaque right to the corners. */
const PLATE_EDGE_RATIO = 0.9;

/**
 * Renders a client logo with its own colours, on transparency.
 *
 * Sources arrive as whatever the client sent: JPEGs, PNGs saved without an
 * alpha channel, marks sitting on a light-grey or tinted plate. Those all
 * show as visible rectangles in the row, and `mix-blend-mode: multiply`
 * only removes a plate that is genuinely white.
 *
 * So the alpha is rebuilt from the image itself: each pixel's luminance is
 * mapped to transparency (light → gone, dark → opaque). The RGB is left
 * untouched, so the plate drops out but the mark keeps its brand colour —
 * which is what lets the row read greyscale at rest and bloom back to
 * colour on hover, via a CSS `grayscale()` filter rather than a bake-in.
 *
 * The canvas is same-origin (data: URLs and same-host images), so no taint
 * issue; if a cross-origin URL ever makes reading pixels throw, the raw
 * image is shown instead rather than rendering nothing.
 */
function LogoSilhouette({ logo }: { logo: LogoItem }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const raw = logo.imageUrl;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!raw) return;
    setSrc(null);
    setFailed(false);

    // Two attempts. The first requests CORS so the canvas stays readable and
    // the plate can be stripped properly. If the CMS host returns no
    // Access-Control-Allow-Origin the image fails to load AT ALL under that
    // request — which used to drop straight to the raw <img>, plate and all,
    // making every plate-stripping constant here dead code for CMS logos.
    // The retry loads without CORS so the mark at least appears, and the
    // blend-mode fallback below removes a white-ish plate without needing
    // pixel access.
    let triedPlainLoad = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!mounted.current) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("no 2d context");
        ctx.drawImage(img, 0, 0);

        const w = canvas.width;
        const h = canvas.height;
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;

        // Does this image sit on an opaque plate, or was it delivered on
        // transparency? Sampling the border answers it: a plated image is
        // opaque at its edges, a cut-out one is not. This matters because
        // some marks are themselves pale — running the luma pass on a light
        // grey logo that already has transparency would erase the logo.
        let edgeSamples = 0;
        let edgeOpaque = 0;
        const stepX = Math.max(1, Math.floor(w / 64));
        const stepY = Math.max(1, Math.floor(h / 64));
        for (let x = 0; x < w; x += stepX) {
          for (const y of [0, h - 1]) {
            edgeSamples++;
            if (px[(y * w + x) * 4 + 3] > 10) edgeOpaque++;
          }
        }
        for (let y = 0; y < h; y += stepY) {
          for (const x of [0, w - 1]) {
            edgeSamples++;
            if (px[(y * w + x) * 4 + 3] > 10) edgeOpaque++;
          }
        }
        const hasPlate =
          edgeSamples > 0 && edgeOpaque / edgeSamples >= PLATE_EDGE_RATIO;

        // Already delivered on transparency — nothing to strip, so show the
        // source rather than re-encoding it through a data: URL.
        if (!hasPlate) {
          setSrc(raw);
          return;
        }

        // Only the alpha channel is rewritten. The mark keeps its own RGB,
        // so `filter: grayscale()` on the tile can be lifted on hover to
        // reveal the real brand colours.
        for (let i = 0; i < px.length; i += 4) {
          const srcAlpha = px[i + 3] / 255;
          // Rec. 601 luma — cheap and good enough for plate vs mark.
          const luma = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
          // Ramp from fully opaque below the softness window to fully
          // clear at the cutoff, preserving anti-aliased glyph edges.
          let k = (PLATE_LUMA - luma) / EDGE_SOFTNESS;
          k = k < 0 ? 0 : k > 1 ? 1 : k;
          px[i + 3] = Math.round(k * srcAlpha * 255);
        }

        ctx.putImageData(data, 0, 0);
        setSrc(canvas.toDataURL("image/png"));
      } catch {
        // Tainted canvas or an unreadable image — fall back to the original.
        setFailed(true);
      }
    };
    img.onerror = () => {
      if (!mounted.current) return;
      if (!triedPlainLoad) {
        // Almost always a missing CORS header rather than a missing file:
        // retry without the credentials-mode request.
        triedPlainLoad = true;
        img.removeAttribute("crossorigin");
        img.src = raw;
        return;
      }
      setFailed(true);
    };
    img.src = raw;
  }, [raw]);

  const shared: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
    display: "block",
  };

  // Until the silhouette is ready nothing is painted, so a half-processed
  // plate never flashes in the row.
  if (!src) {
    return failed ? (
      // Pixels were unreadable (a tainted canvas from a non-CORS host), so
      // the plate could not be stripped. `multiply` against the cream ground
      // drops a white or near-white plate without needing pixel access — it
      // cannot remove a mid-grey one, but it is strictly better than showing
      // the raw rectangle.
      <img
        src={raw}
        alt={logo.name}
        draggable={false}
        style={{ ...shared, mixBlendMode: "multiply" }}
      />
    ) : (
      <span style={{ ...shared, width: "100%", height: "100%" }} aria-hidden="true" />
    );
  }

  return <img src={src} alt={logo.name} draggable={false} style={shared} />;
}

interface LogoItem {
  id?: number;
  name: string;
  imageUrl?: string;
}

interface StatItem {
  value: number;
  suffix?: string;
  display?: string;
  label: string;
}

interface TrustedByV2Props {
  data?: LogoItem[];
  /** Rendered inside the same panel, under the logo row. Omit to show the
   *  marquee alone. */
  stats?: StatItem[];
}

// One full set per copy; the InfiniteMover renders the set five times, and
// the set itself must out-width the viewport for the loop to stay covered.
const MIN_TILES_PER_SET = 12;
const TILE_GAP = 36;

function buildSet(items: LogoItem[]): LogoItem[] {
  if (!items.length) return [];
  const set: LogoItem[] = [];
  while (set.length < MIN_TILES_PER_SET) set.push(...items);
  return set;
}

/** Uniform slot, logo contained inside it — mismatched source crops all end
 *  up optically the same size, which is what keeps a single row of client
 *  marks reading as one strip rather than a ransom note.
 *
 *  Logos sit greyscale at rest and return to full colour on hover. The
 *  greyscale is a CSS filter, not baked into the pixels, which is what
 *  makes the hover reversible.
 *
 *  The background plate still has to be stripped in canvas, because of the
 *  source files we actually get: of the four current marks one is a JPEG
 *  and one is a PNG saved without an alpha channel — both opaque
 *  rectangles, and no amount of blending removes a plate that is light
 *  *grey* rather than white. `LogoSilhouette` rebuilds alpha from each
 *  image's own luminance while leaving its RGB alone. */
function LogoTile({ logo }: { logo: LogoItem }) {
  return (
    <div
      className="ab-logo-tile"
      style={{
        flex: "0 0 auto",
        position: "relative",
        width: 230,
        height: 124,
        marginLeft: TILE_GAP,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {logo.imageUrl ? (
        <LogoSilhouette logo={logo} />
      ) : (
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#6F6E68",
            textAlign: "center",
            padding: "0 10px",
          }}
        >
          {logo.name}
        </span>
      )}
    </div>
  );
}

export default function TrustedByV2({ data, stats }: TrustedByV2Props) {
  const logos = data && data.length ? data : [];
  if (logos.length === 0) return null;

  const set = buildSet(logos);
  const statItems = stats || [];

  return (
    <section
      data-reveal="1"
      data-depth="flat"
      data-screen-label="Trusted by"
      style={{
        // Hairline rules top and bottom band the whole block off from the
        // sections around it, the way the reference does — proof and
        // numbers read as one unit rather than two stacked sections.
        borderTop: `1px solid ${LINE}`,
        borderBottom: `1px solid ${LINE}`,
        padding: "clamp(52px,8vh,88px) 0",
        overflow: "hidden",
      }}
    >
      <div data-depth-inner="1" style={{ width: "100%" }}>
        <div style={{ textAlign: "center", padding: "0 clamp(18px,3.6vw,60px)", marginBottom: "clamp(44px,6vh,68px)" }}>
          <span
            data-rv="eyebrow"
            style={{
              fontSize: "clamp(15px,1.5vw,19px)",
              fontWeight: 600,
              letterSpacing: ".01em",
              color: INK,
            }}
          >
            Trusted by studios and founders in Nepal &amp; the US
          </span>
        </div>

        {/* Solid-colour edge fades sit above the row rather than masking it,
            so tiles slide out cleanly against the page ground. */}
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <div className="ab-marquee-fade ab-marquee-fade--l" />
          <div className="ab-marquee-fade ab-marquee-fade--r" />
          <InfiniteMover move="RL" duration={52} maskEdges={false}>
            {set.map((logo, i) => (
              <LogoTile key={i} logo={logo} />
            ))}
          </InfiniteMover>
        </div>

        {statItems.length > 0 && (
          <div
            className="ab-stat-row"
            style={{
              maxWidth: 1280,
              margin: "clamp(52px,7vh,84px) auto 0",
              padding: "0 clamp(18px,3.6vw,60px)",
              display: "grid",
              gridTemplateColumns: `repeat(${statItems.length}, minmax(0,1fr))`,
            }}
          >
            {statItems.map((stat, i) => (
              <div
                key={i}
                data-r="1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px clamp(8px,1.5vw,24px)",
                  // Dividers between columns only — no rule before the
                  // first or after the last, as in the reference.
                  borderLeft: i === 0 ? "none" : `1px solid ${LINE}`,
                  opacity: 0,
                  transform: "translateY(20px)",
                  transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${i * 0.08}s,transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.08}s`,
                }}
              >
                <span
                  // A `display` stat carries no data-stat, so the count-up
                  // observer skips it and the glyph renders as authored.
                  data-stat={stat.display ? undefined : stat.value}
                  data-suffix={stat.display ? undefined : stat.suffix || ""}
                  style={{
                    fontFamily: displayFont,
                    fontWeight: 700,
                    fontSize: "clamp(30px,3.4vw,50px)",
                    lineHeight: 1,
                    letterSpacing: "-.03em",
                    color: BRAND,
                  }}
                >
                  {stat.display ?? 0}
                </span>
                <span
                  style={{
                    fontSize: "clamp(12px,1vw,14px)",
                    fontWeight: 500,
                    color: BODY_MUTED,
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
