/**
 * Shared generator for the brand's generative covers, built strictly from the
 * design system's own vocabulary (see /brand-system/):
 *
 * - the pattern system — folk ornament rebuilt from the documented ASCII glyph
 *   set (/ \ < > [ ] + : . ^ v x { } ⌃ ⌄ ·), as rhythmic ticker rows, motif
 *   sets, and rails ("always rhythmic, never random")
 * - the red panel + angular cut from the geometric language
 * - sparse accent use per the palette rules (paper dominates, red is ornament,
 *   black appears sparingly)
 *
 * This module is dependency-free and knows nothing about colors or fonts: it
 * emits row/panel data that CoverArt renders with the brand CSS variables and
 * the build-time OG renderer draws with inlined brand hexes (satori cannot
 * resolve CSS custom properties).
 */

/** FNV-1a 32-bit hash — turns a title into a stable cover seed. */
export function fnv1a(text: string): number {
  let hash = 0x811c9dc9;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic PRNG (mulberry32) — the same seed always reproduces the same cover. */
export function makeRng(seed: number): () => number {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Row color role, mirroring the brand-system ticker tones. */
export type OrnamentTone = "accent" | "ink" | "muted";

export interface TickerRow {
  text: string;
  tone: OrnamentTone;
}

/**
 * Periodic motif units from the documented glyph set. `safe` marks units whose
 * characters exist in the vendored OG fonts (satori has no font fallback, so
 * the OG renderer sticks to those; the browser can use the full set).
 */
const MOTIFS: { unit: string; safe: boolean }[] = [
  { unit: "/\\", safe: true },
  { unit: "<>", safe: true },
  { unit: "[] ", safe: true },
  { unit: ":: ", safe: true },
  { unit: "^^", safe: true },
  { unit: "+ × ", safe: true },
  { unit: "· + · × ", safe: true },
  { unit: "{} ", safe: true },
  { unit: "x · ", safe: true },
  { unit: "+ ⌃ + ⌄ ", safe: false },
];

/**
 * Fixed tone cycles — rows step through one of these, so color placement is
 * rhythmic rather than random, and red stays sparse.
 */
const TONE_CYCLES: OrnamentTone[][] = [
  ["accent", "ink", "muted"],
  ["ink", "muted", "accent", "muted"],
  ["muted", "accent", "muted", "ink"],
];

export interface TickerOptions {
  /** Restrict to motifs whose glyphs exist in the vendored OG fonts. */
  safeOnly?: boolean;
  /** Approximate character length of each row (rows overflow-hide the rest). */
  length?: number;
}

/** A stack of rhythmic ticker rows, like the brand-system pattern specimen. */
export function makeTickerRows(
  rng: () => number,
  count: number,
  { safeOnly = false, length = 48 }: TickerOptions = {},
): TickerRow[] {
  const pool = safeOnly ? MOTIFS.filter((m) => m.safe) : MOTIFS;
  const cycle = TONE_CYCLES[Math.floor(rng() * TONE_CYCLES.length)]!;
  const rows: TickerRow[] = [];
  for (let i = 0; i < count; i++) {
    const motif = pool[Math.floor(rng() * pool.length)]!;
    const phase = Math.floor(rng() * motif.unit.length);
    const text = motif.unit
      .repeat(Math.ceil((length + phase) / motif.unit.length) + 1)
      .slice(phase, phase + length);
    rows.push({ text, tone: cycle[i % cycle.length]! });
  }
  return rows;
}

/**
 * A short "motif sets" sampler — a handful of distinct centered motif rows,
 * like the textile-border specimen on the brand-system page.
 */
export function makeMotifStack(
  rng: () => number,
  count: number,
  { safeOnly = false, length = 14 }: TickerOptions = {},
): string[] {
  const pool = (safeOnly ? MOTIFS.filter((m) => m.safe) : MOTIFS).slice();
  const rows: string[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const motif = pool.splice(Math.floor(rng() * pool.length), 1)[0]!;
    rows.push(motif.unit.repeat(Math.ceil(length / motif.unit.length)).slice(0, length).trimEnd());
  }
  return rows;
}

/**
 * Red panel with one angular cut ("red geometric blocks cut into imagery,
 * echoing the faceted logo"). Returns SVG polygon points for a w×h panel with
 * a seeded corner chamfer.
 */
export function cutPanelPoints(rng: () => number, w: number, h: number): string {
  const cut = (0.22 + rng() * 0.2) * Math.min(w, h);
  const corner = Math.floor(rng() * 4);
  if (corner === 0) return `${cut},0 ${w},0 ${w},${h} 0,${h} 0,${cut}`; // top-left
  if (corner === 1) return `0,0 ${w - cut},0 ${w},${cut} ${w},${h} 0,${h}`; // top-right
  if (corner === 2) return `0,0 ${w},0 ${w},${h - cut} ${w - cut},${h} 0,${h}`; // bottom-right
  return `0,0 ${w},0 ${w},${h} ${cut},${h} 0,${h - cut}`; // bottom-left
}
