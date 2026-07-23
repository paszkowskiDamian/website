import { getAllEssays, getEssay, getSite } from "../../../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogCover } from "../../../lib/og-image";

/**
 * Per-essay OG image — one PNG per essay, rendered at build time (static
 * export). The tile pattern is seeded by the essay title, so every essay gets
 * its own cover in the same visual language as the site's CoverArt.
 */

const site = getSite();

// Required for `output: "export"` — render once per essay at build time.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Essay cover";

export function generateStaticParams(): { slug: string }[] {
  return getAllEssays().map((e) => ({ slug: e.slug }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const essay = getEssay((await params).slug);
  return ogCover({
    kicker: `Essay No. ${essay.number} — ${essay.category}`,
    title: essay.title,
    footer: `${site.meta.title} · ${essay.displayDate} · ${essay.readTime}`,
    seedText: essay.title,
  });
}
