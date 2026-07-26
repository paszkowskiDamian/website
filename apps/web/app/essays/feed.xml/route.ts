import { getAllEssays } from "../../../lib/content";
import { SITE_URL } from "../../../lib/site-url";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const essays = getAllEssays();

  const items = essays
    .map((essay) => {
      const link = `${SITE_URL}/essays/${essay.slug}/`;
      const pubDate = new Date(essay.date).toUTCString();
      return `    <item>
      <title>${escapeXml(essay.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escapeXml(essay.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>codeberg — Essays</title>
    <link>${SITE_URL}/essays/</link>
    <description>Essays on design systems, front-end development, creative process, and the tools that shape digital products.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/essays/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
