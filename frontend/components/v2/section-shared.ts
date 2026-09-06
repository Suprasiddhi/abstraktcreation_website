/**
 * Shared vocabulary for the sections ported from the "Abstrakt Creations
 * Work Section" handoff — today just the bento grid (CapabilitiesGridV2);
 * the index list that sat beside it was removed 2026-09-06.
 *
 * The handoff was authored as a work section and the components were first
 * built that way, fed the CMS `work` payload. They were always meant to be
 * capability variants: the layouts are the handoff's, the content is the
 * same `pillars` the petal flower renders. The Project/WorkData shape below
 * is kept because WorksCarousel and SelectedWorkV2 still use it.
 *
 * The theme constants and the content flattening live here rather than in
 * the component so a future variant picks up the same palette instead of
 * redefining one that drifts.
 *
 * The handoff's own palette (#14140F ground, #D97742 terracotta, #F0E9DC
 * cream) belongs to the mock; these are the studio's tokens tuned to the
 * same roles.
 */

/** Section ground. */
export const INK = "#0E0E0E";
/** One step off the ground so an empty or still-loading tile reads as a
 *  deliberate plate rather than a hole punched in the section. */
export const TILE = "#191919";
export const CREAM = "#F7F6F3";
export const RULE = "rgba(247,246,243,0.14)";

export const serif = "var(--font-instrument-serif), 'Instrument Serif', serif";

/** Cream at a given alpha — the handoff leans on translucent cream for its
 *  whole secondary-text scale rather than a set of fixed greys. */
export function dim(a: number): string {
  return `rgba(247,246,243,${a})`;
}

/* ------------------------------------------------------------------
 * Capabilities
 *
 * The two sections below the petal flower are capability variants, not
 * work: they present the same four CMS pillars the flower does, as a
 * bento grid and as an index list. The `capabilities` table carries a
 * real `image_url` column, so a pillar can be illustrated — but it
 * defaults to "" and is empty for most rows today.
 *
 * Unlike the work sections, these must NOT filter out unillustrated
 * entries: a capability is defined by its copy, and dropping the three
 * pillars that have no artwork yet would silently shrink the section to
 * one. Missing images fall back to a rendered placeholder instead.
 * ------------------------------------------------------------------ */

export interface Pillar {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
}

export interface CapabilityData {
  pillars?: Record<string, Pillar>;
}

/** One capability as the two sections below consume it — the CMS shape
 *  flattened, ordered, and numbered. */
export interface Capability {
  key: string;
  num: string;
  /** "DIGITAL" — the pillar's name. */
  title: string;
  /** "LEADING" — the verb the CMS pairs with the title. */
  label: string;
  description: string;
  /** `tag` is comma-separated in the CMS; kept as a list here so each
   *  section can join or render the items as it needs. */
  tags: string[];
  image?: string;
}

/** Pillars in CMS slot order, flattened for display. Entries with no
 *  title AND no label are dropped — those are empty CMS rows rather than
 *  capabilities awaiting artwork. */
export function toCapabilities(data?: CapabilityData): Capability[] {
  return Object.entries(data?.pillars || {})
    .filter(([, p]) => p && (p.title || p.label))
    .sort(([, a], [, b]) => (a.id || "").localeCompare(b.id || ""))
    .map(([key, p], i) => ({
      key,
      num: p.id || String(i + 1).padStart(2, "0"),
      title: p.title || p.label || "",
      label: p.label || "",
      description: p.description || "",
      tags: (p.tag || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: p.imageUrl || undefined,
    }));
}
