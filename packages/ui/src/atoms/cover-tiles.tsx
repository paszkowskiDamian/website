/**
 * Shared generator for the brand's tile-pattern covers: mid-century /
 * Scandinavian geometric tiles ("code as folk ornament"). A square grid where
 * each cell holds one rotated primitive — half-circle, quarter-circle, full
 * circle, or petal/leaf lens — with every shape snapped to the cell edges so
 * circles and waves form across tile seams.
 *
 * This module is deliberately dependency-free and knows nothing about colors:
 * it emits cell data (shape + rotation + tone role) and SVG path strings.
 * Consumers map tones to actual colors — CoverArt uses the brand CSS custom
 * properties, while the build-time OG renderer inlines the brand hexes
 * (satori cannot resolve CSS variables).
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

/** Deterministic PRNG (mulberry32) — the same seed always reproduces the same pattern. */
export function makeRng(seed: number): () => number {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type TileShape = "empty" | "half" | "quarter" | "circle" | "leaf";

/**
 * Color role, not a color: "quiet" and "mid" are the muted neutrals that make
 * up most of the field; "accent" is the sparse brand red (~10–15% of cells).
 */
export type TileTone = "quiet" | "mid" | "accent";

export interface TileCell {
  shape: TileShape;
  /** Rotation in quarter turns, 0–3. */
  rotation: number;
  tone: TileTone;
}

export interface TilePatternOptions {
  /** Mirror the pattern around the vertical axis for a symmetric, folk-ornament read. */
  mirrorX?: boolean;
}

/** Horizontal-mirror rotation mapping per shape (for `mirrorX`). */
const MIRROR: Record<TileShape, (r: number) => number> = {
  empty: (r) => r,
  circle: (r) => r,
  // flat edge: 0 bottom, 1 left, 2 top, 3 right — left/right swap.
  half: (r) => (r === 1 ? 3 : r === 3 ? 1 : r),
  // corner: 0 tl, 1 tr, 2 br, 3 bl — tl/tr and br/bl swap.
  quarter: (r) => [1, 0, 3, 2][r]!,
  // diagonal parity: even tl–br, odd tr–bl.
  leaf: (r) => (r + 1) % 4,
};

/**
 * Generate a cols × rows tile pattern. Every cell consumes the same number of
 * rng draws, so patterns with the same seed share their opening cells.
 */
export function makeTilePattern(
  rng: () => number,
  cols: number,
  rows: number,
  { mirrorX = false }: TilePatternOptions = {},
): TileCell[][] {
  const genCols = mirrorX ? Math.ceil(cols / 2) : cols;
  const grid: TileCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: TileCell[] = [];
    for (let c = 0; c < genCols; c++) {
      const shapeRoll = rng();
      const shape: TileShape =
        shapeRoll < 0.14
          ? "empty"
          : shapeRoll < 0.4
            ? "half"
            : shapeRoll < 0.66
              ? "quarter"
              : shapeRoll < 0.8
                ? "circle"
                : "leaf";
      const rotation = Math.floor(rng() * 4);
      // Red stays a sparse accent (~12% of cells); the rest are muted neutrals.
      const toneRoll = rng();
      const tone: TileTone = toneRoll < 0.12 ? "accent" : toneRoll < 0.52 ? "mid" : "quiet";
      row.push({ shape, rotation, tone });
    }
    if (mirrorX) {
      for (let c = cols - genCols - 1; c >= 0; c--) {
        const src = row[c]!;
        row.push({ ...src, rotation: MIRROR[src.shape](src.rotation) });
      }
    }
    grid.push(row);
  }
  return grid;
}

/**
 * SVG path for one cell, in absolute coordinates: cell origin (x, y), size s.
 * Paths are written per-rotation (no transforms) so they render identically in
 * the browser and in satori. Returns null for empty cells.
 */
export function tilePath(cell: TileCell, x: number, y: number, s: number): string | null {
  const r = s / 2;
  const rot = ((cell.rotation % 4) + 4) % 4;
  switch (cell.shape) {
    case "empty":
      return null;
    case "circle":
      // Inscribed circle, touching all four edges.
      return `M ${x} ${y + r} A ${r} ${r} 0 1 1 ${x + s} ${y + r} A ${r} ${r} 0 1 1 ${x} ${y + r} Z`;
    case "half":
      // Semicircle spanning a full cell edge, bulging into the cell.
      if (rot === 0) return `M ${x} ${y + s} A ${r} ${r} 0 0 1 ${x + s} ${y + s} Z`; // flat bottom
      if (rot === 1) return `M ${x} ${y} A ${r} ${r} 0 0 1 ${x} ${y + s} Z`; // flat left
      if (rot === 2) return `M ${x + s} ${y} A ${r} ${r} 0 0 1 ${x} ${y} Z`; // flat top
      return `M ${x + s} ${y + s} A ${r} ${r} 0 0 1 ${x + s} ${y} Z`; // flat right
    case "quarter":
      // Quarter disc anchored in a corner, radius = full cell.
      if (rot === 0) return `M ${x} ${y} L ${x + s} ${y} A ${s} ${s} 0 0 1 ${x} ${y + s} Z`; // tl
      if (rot === 1) return `M ${x + s} ${y} L ${x + s} ${y + s} A ${s} ${s} 0 0 1 ${x} ${y} Z`; // tr
      if (rot === 2) return `M ${x + s} ${y + s} L ${x} ${y + s} A ${s} ${s} 0 0 1 ${x + s} ${y} Z`; // br
      return `M ${x} ${y + s} L ${x} ${y} A ${s} ${s} 0 0 1 ${x + s} ${y + s} Z`; // bl
    case "leaf":
      // Petal/leaf lens between opposite corners (two radius-s arcs).
      return rot % 2 === 0
        ? `M ${x} ${y} A ${s} ${s} 0 0 1 ${x + s} ${y + s} A ${s} ${s} 0 0 1 ${x} ${y} Z`
        : `M ${x + s} ${y} A ${s} ${s} 0 0 1 ${x} ${y + s} A ${s} ${s} 0 0 1 ${x + s} ${y} Z`;
  }
}
