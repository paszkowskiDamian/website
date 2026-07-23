import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { fnv1a, makeRng, makeTickerRows, type OrnamentTone } from "@repo/ui/atoms/cover-ornament";

/**
 * Build-time OG image renderer. Runs under `output: "export"` — every image is
 * rendered once during `next build` and emitted as a static PNG in out/.
 *
 * satori cannot resolve CSS custom properties, so the brand hexes are inlined
 * here (this is the one place outside styles.css where they may appear). The
 * ticker-row ornament comes from the shared generator in
 * @repo/ui/atoms/cover-ornament so OG images and site covers share one
 * language — the brand-system page's own "pattern system" ticker rows.
 */
const PAPER = "#F6F3ED";
const INK = "#111111";
const ACCENT = "#C52B34";
const MUTED = "#6F6F6A";

const TICKER_TONES: Record<OrnamentTone, string> = { accent: ACCENT, ink: INK, muted: MUTED };

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

function loadFont(file: string): Buffer {
  // process.cwd() is apps/web during `next build`; the fonts live outside
  // public/ on purpose so they are not shipped with the static export.
  return readFileSync(path.join(process.cwd(), "assets", "fonts", file));
}

/** A stack of ticker rows as plain flex divs — satori renders these natively. */
function TickerBand({ seed, w, h, rowCount }: { seed: number; w: number; h: number; rowCount: number }) {
  // safeOnly: the vendored OG font may not carry every glyph in the full set.
  const rows = makeTickerRows(makeRng(seed), rowCount, { safeOnly: true, length: 20 });
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: w, height: h, padding: "0 36px" }}>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 500, letterSpacing: 2, overflow: "hidden", whiteSpace: "nowrap", color: TICKER_TONES[row.tone] }}
        >
          {row.text}
        </div>
      ))}
    </div>
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
  const bandWidth = 420;
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
        {/* ink hairline between panel and pattern */}
        <div style={{ display: "flex", width: 2, backgroundColor: INK }} />
        {/* generative ticker-row band, seeded by the page title */}
        <TickerBand seed={fnv1a(seedText)} w={bandWidth} h={OG_SIZE.height} rowCount={9} />
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
