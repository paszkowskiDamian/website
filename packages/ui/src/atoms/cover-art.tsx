import type { CSSProperties, ReactNode } from "react";
import {
  fnv1a,
  makeRng,
  makeTilePattern,
  tilePath,
  type TileTone,
} from "./cover-tiles";
import { BERG_PATH } from "./logo";

// Reference the brand's CSS custom properties (defined once in styles.css)
// rather than duplicating hex values here.
const RED = "var(--color-accent)";
const RED_HOVER = "var(--color-accent-hover)";
const BLACK = "var(--color-ink)";
const GRAY = "var(--color-muted)";
const SOFT = "var(--color-line)";
const PAPER = "var(--color-paper)";

const PALETTES = [
  { bg: PAPER, a: RED, b: BLACK, sub: SOFT },
  { bg: BLACK, a: RED, b: PAPER, sub: GRAY },
  { bg: RED, a: PAPER, b: BLACK, sub: RED_HOVER },
  { bg: SOFT, a: RED, b: BLACK, sub: PAPER },
  { bg: PAPER, a: BLACK, b: RED, sub: SOFT },
  { bg: BLACK, a: PAPER, b: RED, sub: GRAY },
];

// Each clip leaves the panel covering ~60% of the card (was 79-92% in some
// orientations, which combined with the mark-contrast issue below could
// read as an almost-empty card).
const PANEL_CLIPS = [
  "polygon(0 0,100% 0,20% 100%,0 100%)",
  "polygon(0 0,100% 0,100% 20%,0 100%)",
  "polygon(0 0,20% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 0,100% 100%,80% 100%)",
];

const QUARTER_CORNERS = ["tl", "tr", "bl", "br"] as const;
type Corner = (typeof QUARTER_CORNERS)[number];

const QUARTER_STYLES: Record<Corner, CSSProperties> = {
  tl: { left: 0, top: 0, borderRadius: "0 0 100% 0" },
  tr: { right: 0, top: 0, borderRadius: "0 0 0 100%" },
  bl: { left: 0, bottom: 0, borderRadius: "0 100% 0 0" },
  br: { right: 0, bottom: 0, borderRadius: "100% 0 0 0" },
};

/** Tone roles from the shared tile generator, mapped onto the brand CSS variables. */
const TILE_TONES: Record<TileTone, string> = { quiet: SOFT, mid: GRAY, accent: RED };

/** Glyph kit for the static ornament rows ("code as folk ornament"). */
const ORNAMENT_GLYPHS = ["+", "×", "·", "^", "⌄", "/", "\\", ":", "—", "x", "<", ">"] as const;

export interface CoverArtProps {
  /** Drives the artwork: the cover is derived deterministically from this text (FNV-1a hash). */
  title: string;
  /** Optional override — bypasses the title hash. The same seed always renders the same cover. */
  seed?: number;
  className?: string;
}

/**
 * The "cover system": generative project/essay art built from a tight kit of
 * parts (circles, arcs, quarter-rounds, dot fields, angular panels, glyph
 * ornament rows, mid-century tile patterns, the berg mark) recombined on a
 * seeded grid across the brand's four-color palette.
 */
export function CoverArt({ title, seed, className }: CoverArtProps) {
  const rng = makeRng(seed ?? fnv1a(title));
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)] as T;
  const s = pick(PALETTES);

  const shapes: ReactNode[] = [];
  let key = 0;

  const circle = (c: string, sz: number, x: number, y: number) =>
    shapes.push(
      <div
        key={key++}
        style={{ position: "absolute", width: `${sz}%`, height: `${sz}%`, left: `${x}%`, top: `${y}%`, borderRadius: "50%", background: c }}
      />,
    );
  const ring = (c: string, sz: number, x: number, y: number, bw: number) =>
    shapes.push(
      <div
        key={key++}
        style={{ position: "absolute", width: `${sz}%`, height: `${sz}%`, left: `${x}%`, top: `${y}%`, borderRadius: "50%", border: `${bw}px solid ${c}`, boxSizing: "border-box" }}
      />,
    );
  const semi = (c: string, sz: number, x: number, y: number) =>
    shapes.push(
      <div
        key={key++}
        style={{ position: "absolute", width: `${sz}%`, height: `${sz / 2}%`, left: `${x}%`, top: `${y}%`, borderRadius: "999px 999px 0 0", background: c }}
      />,
    );
  const quarter = (c: string, sz: number, corner: Corner) =>
    shapes.push(
      <div key={key++} style={{ position: "absolute", width: `${sz}%`, height: `${sz}%`, background: c, ...QUARTER_STYLES[corner] }} />,
    );
  const bars = (c: string) =>
    shapes.push(
      <div key={key++} style={{ position: "absolute", left: "18%", bottom: "20%", display: "flex", alignItems: "flex-end", gap: "6%", height: "52%", width: "54%" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, height: `${26 + i * 22}%`, background: c }} />
        ))}
      </div>,
    );
  const dots = (c: string, x: number, y: number, sz: number) =>
    shapes.push(
      <div
        key={key++}
        style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${sz}%`, height: `${sz}%`, backgroundImage: `radial-gradient(${c} 1.5px, transparent 1.7px)`, backgroundSize: "11px 11px" }}
      />,
    );
  const panel = (c: string) =>
    shapes.push(
      <div key={key++} style={{ position: "absolute", inset: 0, background: c, clipPath: pick(PANEL_CLIPS) }} />,
    );
  const mark = (c: string, wpct: number) =>
    shapes.push(
      <div key={key++} style={{ position: "absolute", left: "50%", top: "50%", width: `${wpct}%`, transform: "translate(-50%,-50%)" }}>
        <svg viewBox="0 0 285 285" width="100%" fill="none">
          <path d={BERG_PATH} fill={c} />
        </svg>
      </div>,
    );
  /**
   * Mid-century tile pattern (owner-confirmed direction): square grid of
   * rotated primitives on a paper field — muted neutral shapes, sparse red
   * accents, hairline ink tile seams. `region` must match the grid's aspect
   * ratio so the SVG fills it without letterboxing.
   */
  const tiles = (cols: number, rows: number, region: CSSProperties, mirrorX = false) => {
    const cell = 96;
    const seam = 1.2;
    const w = cols * cell;
    const h = rows * cell;
    const pattern = makeTilePattern(rng, cols, rows, { mirrorX });
    shapes.push(
      <svg
        key={key++}
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: "absolute", display: "block", ...region }}
        width="100%"
        aria-hidden="true"
      >
        <rect width={w} height={h} fill={PAPER} />
        {pattern.flatMap((row, ri) =>
          row.map((c, ci) => {
            const d = tilePath(c, ci * cell, ri * cell, cell);
            return d ? <path key={`${ri}-${ci}`} d={d} fill={TILE_TONES[c.tone]} /> : null;
          }),
        )}
        {/* hairline tile seams in ink */}
        {Array.from({ length: cols + 1 }, (_, i) => (
          <rect key={`v${i}`} x={Math.min(Math.max(i * cell - seam / 2, 0), w - seam)} y={0} width={seam} height={h} fill={BLACK} />
        ))}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <rect key={`h${i}`} x={0} y={Math.min(Math.max(i * cell - seam / 2, 0), h - seam)} width={w} height={seam} fill={BLACK} />
        ))}
      </svg>,
    );
  };
  /** Static row of ornament glyphs — the brand's folk-ornament texture, non-animated. */
  const glyphBand = (region: CSSProperties, count: number) =>
    shapes.push(
      <div
        key={key++}
        aria-hidden="true"
        className="select-none font-mono text-sm font-bold tracking-[0.1em]"
        style={{ position: "absolute", left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-evenly", ...region }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} style={{ color: rng() < 0.22 ? BLACK : RED }}>{pick(ORNAMENT_GLYPHS)}</span>
        ))}
      </div>,
    );

  const comp = Math.floor(rng() * 9);
  if (comp === 0) {
    circle(s.a, 62, rng() * 26 - 6, rng() * 16 + 4);
    circle(s.b, 32, rng() * 24 + 42, rng() * 26 + 40);
    dots(s.sub, 8, 70, 40);
  } else if (comp === 1) {
    semi(s.a, 92, 4, 54);
    dots(s.b, rng() * 34 + 46, 12, 32);
    circle(s.b, 16, 14, 14);
  } else if (comp === 2) {
    panel(s.a);
    // Contrast against the panel color the mark actually sits on (s.a) —
    // not the container background (s.bg), which the panel mostly covers.
    mark(s.a === PAPER || s.a === SOFT ? s.b : PAPER, 40);
  } else if (comp === 3) {
    quarter(s.a, 72, pick(QUARTER_CORNERS));
    bars(s.b);
  } else if (comp === 4) {
    ring(s.a, 76, 12, 8, 7);
    ring(s.b, 40, 30, 30, 5);
    circle(s.a, 12, 44, 44);
  } else if (comp === 5) {
    circle(s.a, 46, rng() * 18 + 8, rng() * 12 + 8);
    mark(s.b, 30);
    dots(s.sub, 8, 64, 84);
  } else if (comp === 6) {
    // Full-bleed folk tiles, mirrored for a symmetric ornament read.
    tiles(6, 6, { inset: 0 }, true);
  } else if (comp === 7) {
    // Tile field with a glyph ornament band along the base.
    tiles(5, 4, { left: 0, top: 0, width: "100%", height: "80%" });
    glyphBand({ top: "80%", bottom: 0 }, 9);
  } else {
    // Glyph rows framing a mirrored tile band — code as folk ornament.
    glyphBand({ top: 0, height: "20%" }, 7);
    tiles(5, 3, { left: 0, top: "20%", width: "100%", height: "60%" }, true);
    glyphBand({ bottom: 0, height: "20%" }, 7);
  }

  // The tile compositions always sit on the paper field (minimal variant of
  // the reference patterns); the legacy compositions keep their seeded palette.
  const bg = comp >= 6 ? PAPER : s.bg;

  return (
    <div className={`relative aspect-square w-full overflow-hidden ${className ?? ""}`} style={{ background: bg }}>
      {shapes}
    </div>
  );
}
