import type { CSSProperties, ReactNode } from "react";
import {
  fnv1a,
  makeMotifStack,
  makeRng,
  makeTickerRows,
  type OrnamentTone,
} from "./cover-ornament";
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

/** Ticker/motif tone roles, mapped onto the brand CSS variables (paper field only). */
const ORNAMENT_TONES: Record<OrnamentTone, string> = { accent: RED, ink: BLACK, muted: GRAY };

export interface CoverArtProps {
  /** Drives the artwork: the cover is derived deterministically from this text (FNV-1a hash). */
  title: string;
  /** Optional override — bypasses the title hash. The same seed always renders the same cover. */
  seed?: number;
  className?: string;
}

/**
 * The "cover system": generative project/essay art built from the design
 * system's own vocabulary — the geometry section's shapes (circles, arcs,
 * quarter-rounds, dot fields, angular red panel + cut), the pattern
 * system's ticker rows and motif sets, and the berg mark — recombined on a
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
   * A "texture field" of ticker rows — the brand-system pattern section's
   * signature ASCII ornament, stacked to fill `region`. Rhythmic, not random:
   * each row cycles through a fixed tone sequence (see `cover-ornament`).
   */
  const tickerBand = (region: CSSProperties, rowCount: number) => {
    const rows = makeTickerRows(rng, rowCount, { length: 40 });
    shapes.push(
      <div
        key={key++}
        aria-hidden="true"
        className="flex select-none flex-col justify-between font-mono text-sm font-bold tracking-[0.08em]"
        style={{ position: "absolute", ...region }}
      >
        {rows.map((row, i) => (
          <div key={i} style={{ overflow: "hidden", whiteSpace: "nowrap", color: ORNAMENT_TONES[row.tone] }}>
            {row.text}
          </div>
        ))}
      </div>,
    );
  };
  /** A short centered stack of distinct motif-set lines, like the brand-system "motif sets" cell. */
  const motifStack = (region: CSSProperties, count: number) =>
    shapes.push(
      <div
        key={key++}
        aria-hidden="true"
        className="flex select-none flex-col items-center justify-center gap-2.5 font-mono text-sm font-bold tracking-[0.08em] text-ink"
        style={{ position: "absolute", ...region }}
      >
        {makeMotifStack(rng, count, { length: 8 }).map((line, i) => (
          <div key={i} style={{ overflow: "hidden", whiteSpace: "nowrap" }}>{line}</div>
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
    // Texture field: a full-bleed stack of ticker rows, echoing the
    // brand-system pattern section directly.
    tickerBand({ inset: "9%" }, 7);
  } else if (comp === 7) {
    // Vertical rail: a motif-set column beside the berg mark, split by a
    // hairline rule — the "rail" + mark cells combined.
    shapes.push(<div key={key++} style={{ position: "absolute", left: "38%", top: "12%", bottom: "12%", width: 1.5, background: BLACK }} />);
    motifStack({ left: 0, width: "38%", top: 0, bottom: 0 }, 3);
    mark(RED, 34);
  } else {
    // Ticker rows framing the berg mark — pattern and mark together.
    tickerBand({ top: "8%", height: "22%" }, 3);
    mark(BLACK, 30);
    tickerBand({ bottom: "8%", height: "22%" }, 3);
  }

  // The pattern-system compositions render on the paper field, matching the
  // brand-system pattern section itself; the geometric compositions keep
  // their seeded palette.
  const bg = comp >= 6 ? PAPER : s.bg;

  return (
    <div className={`relative aspect-square w-full overflow-hidden ${className ?? ""}`} style={{ background: bg }}>
      {shapes}
    </div>
  );
}
