import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  fnv1a,
  makeRng,
  makeTilePattern,
  tilePath,
  type TileTone,
} from "@repo/ui/atoms/cover-tiles";

/**
 * Build-time OG image renderer. Runs under `output: "export"` — every image is
 * rendered once during `next build` and emitted as a static PNG in out/.
 *
 * satori cannot resolve CSS custom properties, so the brand hexes are inlined
 * here (this is the one place outside styles.css where they may appear). The
 * tile-pattern geometry itself comes from the shared generator in
 * @repo/ui/atoms/cover-tiles so OG images and site covers share one language.
 */
const PAPER = "#F6F3ED";
const INK = "#111111";
const ACCENT = "#C52B34";
const MUTED = "#6F6F6A";
const LINE = "#D9D9D6";

const TILE_TONES: Record<TileTone, string> = { quiet: LINE, mid: MUTED, accent: ACCENT };

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

function loadFont(file: string): Buffer {
  // process.cwd() is apps/web during `next build`; the fonts live outside
  // public/ on purpose so they are not shipped with the static export.
  return readFileSync(path.join(process.cwd(), "assets", "fonts", file));
}

/** The tile pattern as plain SVG — satori renders SVG elements natively. */
function TileBand({ seed, cols, rows, cell }: { seed: number; cols: number; rows: number; cell: number }) {
  const w = cols * cell;
  const h = rows * cell;
  const seam = 2;
  const pattern = makeTilePattern(makeRng(seed), cols, rows);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect width={w} height={h} fill={PAPER} />
      {pattern.flatMap((row, ri) =>
        row.map((c, ci) => {
          const d = tilePath(c, ci * cell, ri * cell, cell);
          return d ? <path key={`${ri}-${ci}`} d={d} fill={TILE_TONES[c.tone]} /> : null;
        }),
      )}
      {/* hairline tile seams in ink */}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <rect key={`v${i}`} x={Math.min(Math.max(i * cell - seam / 2, 0), w - seam)} y={0} width={seam} height={h} fill={INK} />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <rect key={`h${i}`} x={0} y={Math.min(Math.max(i * cell - seam / 2, 0), h - seam)} width={w} height={seam} fill={INK} />
      ))}
    </svg>
  );
}

export interface OgCoverProps {
  /** Small mono line above the title, rendered uppercase in brand red. */
  kicker: string;
  title: string;
  /** Small mono line at the bottom of the card. */
  footer: string;
  /** Text hashed (FNV-1a) into the tile-pattern seed — pass the page's title. */
  seedText: string;
}

export function ogCover({ kicker, title, footer, seedText }: OgCoverProps): ImageResponse {
  // 6 rows × 105px = 630px: the tile band spans the full card height.
  const cell = 105;
  const cols = 4;
  const titleSize = title.length > 44 ? 54 : title.length > 26 ? 66 : 88;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: PAPER }}>
        {/* text panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 56px 48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 24,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              {kicker}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 30,
                fontFamily: "Archivo",
                fontWeight: 800,
                fontSize: titleSize,
                lineHeight: 1.02,
                letterSpacing: -2,
                color: INK,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", width: 16, height: 16, backgroundColor: ACCENT }} />
            <div style={{ display: "flex", marginLeft: 14, fontFamily: "JetBrains Mono", fontSize: 22, color: MUTED }}>
              {footer}
            </div>
          </div>
        </div>
        {/* ink hairline between panel and tiles */}
        <div style={{ display: "flex", width: 2, backgroundColor: INK }} />
        {/* generative tile band, seeded by the page title */}
        <TileBand seed={fnv1a(seedText)} cols={cols} rows={6} cell={cell} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: loadFont("archivo-extrabold.ttf"), weight: 800, style: "normal" },
        { name: "JetBrains Mono", data: loadFont("jetbrains-mono-medium.ttf"), weight: 500, style: "normal" },
      ],
    },
  );
}
