import { displayFont } from "./tokens";
import SectionHeading from "./SectionHeading";
import {
  CREAM,
  Capability,
  CapabilityData,
  INK,
  RULE,
  TILE,
  dim,
  serif,
  toCapabilities,
} from "./section-shared";

/**
 * Capabilities — bento variant.
 *
 * The homepage's capability section, rendering the four CMS `pillars` as the
 * composed look. Layout and motion come from the "Abstrakt Creations Work
 * Section" Claude Design handoff, re-themed onto the studio's tokens (ink
 * ground, brand purple accent, cream type).
 *
 * The `capabilities` table carries a real `image_url` column, so a pillar can
 * be illustrated. It defaults to "" and is empty for most rows today, so a
 * pillar without artwork renders a typographic plate built from its own
 * number and title rather than being dropped or showing an empty rectangle —
 * a capability is defined by its copy, not by whether a photo exists yet.
 *
 * Four pillars fill a six-column grid as one 4-wide hero, a stacked pair, and
 * one square crop.
 */

interface CapabilitiesGridV2Props {
  data?: CapabilityData;
}

/**
 * Capability tile. The name is withheld until hover so the grid reads as one
 * composition at rest, then the scrim, title and tag arrive on a short
 * stagger. `@media (hover: none)` pins the captions open on touch, so the
 * pillars always read in full there; on pointer devices they are hover-only.
 * (The capabilities list that used to state every pillar below this grid was
 * removed 2026-09-06 — if the names need to read at rest on desktop too, this
 * is the gate to drop.)
 *
 * `size` scales the caption with the tile: the 4-wide hero carries
 * display-sized type where a quarter-width crop would have it wrap.
 */
function Tile({
  item,
  height,
  size = "sm",
}: {
  item?: Capability;
  height: number | string;
  size?: "sm" | "lg";
}) {
  const large = size === "lg";
  if (!item) return null;
  return (
    <a
      className="ab-tile"
      href="#capabilities-list"
      aria-label={`${item.title} — see capability`}
      style={{
        position: "relative",
        display: "block",
        height,
        overflow: "hidden",
        borderRadius: 4,
        background: TILE,
        color: CREAM,
      }}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="ab-tile__img"
          src={item.image}
          alt={item.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        /* Placeholder plate for a pillar with no artwork in the CMS. Built
           from the pillar's own number and title so it reads as deliberate
           rather than as a failed image — and it still carries the tile's
           hover treatment, so the grid behaves uniformly either way. */
        <div
          className="ab-tile__img"
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle at 32% 24%, rgba(154,120,245,.16), rgba(25,25,25,0) 62%), ${TILE}`,
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: large ? "clamp(80px,11vw,170px)" : "clamp(48px,6vw,92px)",
              lineHeight: 1,
              color: dim(0.13),
              letterSpacing: "-.03em",
            }}
          >
            {item.num}
          </span>
        </div>
      )}

      <div className="ab-tile__scrim" aria-hidden />
      <div className="ab-tile__edge" aria-hidden />
      <div
        style={{
          position: "absolute",
          left: large ? 28 : 20,
          right: large ? 28 : 20,
          bottom: large ? 26 : 20,
          pointerEvents: "none",
        }}
      >
        {/* Title and tag animate as separate elements rather than one caption
            block, so they can arrive on a short stagger. */}
        <span
          className="ab-tile__t"
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            letterSpacing: "-.03em",
            fontSize: large ? "clamp(24px,2.4vw,32px)" : "clamp(18px,1.6vw,22px)",
            lineHeight: 1.1,
          }}
        >
          {item.title}
        </span>
        {item.tags.length > 0 && (
          <span
            className="ab-tile__c"
            style={{
              fontSize: large ? 12 : 11,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: dim(0.6),
              marginTop: large ? 8 : 6,
            }}
          >
            {item.tags.join(" · ")}
          </span>
        )}
      </div>
    </a>
  );
}

export default function CapabilitiesGridV2({ data }: CapabilitiesGridV2Props) {
  const items = toCapabilities(data);
  if (!items.length) return null;

  // Four slots. Fewer pillars cycle rather than leaving holes in the bento.
  const at = (i: number) => items[i % items.length];

  return (
    <section
      id="capabilities-grid"
      data-reveal="1"
      data-depth="1"
      data-screen-label="Capabilities"
      data-nav-tone="dark"
      style={{
        position: "relative",
        background: INK,
        color: CREAM,
        padding: "clamp(70px,12vh,150px) clamp(18px,3.6vw,60px)",
        overflow: "hidden",
      }}
    >
      <div data-depth-inner="1" style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Columns are sized `auto` and pushed apart with space-between, so
            the right column hugs the container's right edge instead of
            starting at the halfway line — with two equal fractions the
            standfirst began mid-canvas and left a gutter of dead space
            beside it. */}
        <div
          className="ab-grid-split ab-cap-head"
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            justifyContent: "space-between",
            gap: "clamp(28px,4vw,64px)",
            alignItems: "end",
            paddingBottom: "clamp(32px,5vh,56px)",
            borderBottom: `1px solid ${RULE}`,
          }}
        >
          {/* One word, in the same system every other section heading uses:
              displayFont at 700 with the site's tight tracking, wrapped in
              SectionHeading so the brand accent falls the same way it does on
              "Rating and reviews, in their words" and "Asked often". This was
              briefly set in Instrument Serif at 132px, which made the two
              capability sections the only headings on the page in a different
              family and weight to everything around them. */}
          <h2
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "clamp(44px,7vw,104px)",
              lineHeight: 0.94,
              letterSpacing: "-.04em",
              margin: 0,
            }}
          >
            {/* Two words, not one: SectionHeading keeps at least one word in
                ink so the two-tone accent always survives, which means a
                bare "Capabilities" would render with no accent at all. */}
            <span data-rv="line">
              <span>
                <SectionHeading tone="dark" accent={1}>
                  Our capabilities
                </SectionHeading>
              </span>
            </span>
          </h2>

          <p
            data-rv="up"
            style={{
              ["--rv-i" as string]: 2,
              margin: "0 0 10px",
              /* Body sans at the site's standfirst size, matching FaqV2 and
                 TestimonialsV2 — these were briefly set in Instrument Serif,
                 which made them the only standfirsts on the page not in the
                 body face. */
              fontSize: "clamp(14px,1.15vw,17px)",
              lineHeight: 1.6,
              color: dim(0.62),
              maxWidth: "26ch",
              textAlign: "right",
              justifySelf: "end",
            }}
          >
            Four disciplines, one team — from first sketch through launch, and sharp long after.
          </p>
        </div>

        <div className="ab-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 20, marginTop: 20 }}>
          <div data-rv="up" style={{ gridColumn: "span 4" }}>
            <Tile item={at(0)} height="clamp(320px,42vw,520px)" size="lg" />
          </div>

          <div data-rv="up" style={{ ["--rv-i" as string]: 1, gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 20 }}>
            <Tile item={at(1)} height="clamp(150px,20vw,250px)" />
            <Tile item={at(2)} height="clamp(150px,20vw,250px)" />
          </div>

          <div data-rv="up" style={{ ["--rv-i" as string]: 2, gridColumn: "span 6" }}>
            <Tile item={at(3)} height="clamp(240px,26vw,340px)" />
          </div>
        </div>
      </div>
    </section>
  );
}
