import { getSite } from "../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogCover } from "../lib/og-image";

/**
 * Site-wide OG image — rendered once at build time (static export) and
 * emitted as a PNG; Next wires up the og:image/twitter:image meta tags.
 */

const site = getSite();

// Required for `output: "export"` — render once at build time.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${site.meta.title} — ${site.meta.description}`;

export default function OpenGraphImage() {
  return ogCover({
    kicker: site.meta.description,
    title: site.meta.title,
    footer: site.author.name,
    seedText: site.meta.title,
  });
}
