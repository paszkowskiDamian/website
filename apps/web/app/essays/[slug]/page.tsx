import type { Metadata } from "next";
import Link from "next/link";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Tag } from "@repo/ui/atoms/tag";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { Newsletter } from "@repo/ui/molecules/newsletter";
import { PaginationNav } from "@repo/ui/molecules/pagination-nav";
import { getAllEssays, getEssay, getSite } from "../../../lib/content";
import { mdxComponents } from "../../../lib/mdx-components";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getAllEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const essay = getEssay((await params).slug);
  const site = getSite();
  return {
    title: `${essay.title} — ${site.meta.title}`,
    description: essay.excerpt,
  };
}

export default async function EssayPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const essays = getAllEssays();
  const essay = getEssay(slug);
  const site = getSite();

  // Neighbors in the newest-first list: "previous" = older, "next" = newer.
  const i = essays.findIndex((e) => e.slug === slug);
  const older = essays[i + 1];
  const newer = essays[i - 1];

  const { default: MDXContent } = await evaluate(essay.body, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="border-t-2 border-ink py-3.5 font-mono text-meta uppercase text-muted"
      >
        <Link href="/#essays" className="text-muted">
          Essays
        </Link>
        <span aria-hidden="true" className="px-2 text-accent">
          /
        </span>
        {essay.category}
      </nav>

      <article>
        {/* ARTICLE HEADER */}
        <header className="flex flex-wrap gap-8 py-10 sm:py-14">
          <div className="hidden self-stretch sm:block">
            <GlyphGrid cols={2} rows={16} />
          </div>
          <div className="min-w-[280px] flex-1 basis-[420px]">
            <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
              Essay No. {essay.number}
            </div>
            <h1 className="max-w-[16ch] text-display font-black leading-[0.92] tracking-[-0.02em] text-ink">
              {essay.title}
            </h1>
            <p className="mt-6 max-w-[52ch] font-serif text-lede text-copy">{essay.excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center gap-5 border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 flex-none rounded-full bg-ink" />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-ink">{site.author.name}</div>
                  <div className="font-mono text-xs text-muted">{site.author.role}</div>
                </div>
              </div>
              <div className="font-mono text-meta uppercase text-muted">
                {essay.displayDate} · {essay.readTime}
              </div>
            </div>
          </div>
        </header>

        {/* HERO IMAGE */}
        {essay.heroImage && (
          <figure className="relative mb-9 sm:mb-14">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={essay.heroImage}
                alt={essay.heroAlt ?? ""}
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
            </div>
            {essay.heroCaption && (
              <figcaption className="mt-3 font-mono text-xs text-muted">
                {essay.heroCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* BODY — the container also applies the design's drop cap to the
            opening paragraph */}
        <div className="mx-auto max-w-[720px] [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:pr-3.5 [&>p:first-of-type]:first-letter:pt-1.5 [&>p:first-of-type]:first-letter:font-sans [&>p:first-of-type]:first-letter:text-[76px] [&>p:first-of-type]:first-letter:font-extrabold [&>p:first-of-type]:first-letter:leading-[0.72] [&>p:first-of-type]:first-letter:text-accent">
          <MDXContent components={mdxComponents} />

          {essay.tags.length > 0 && (
            <div className="mt-9 flex flex-wrap gap-2 border-t border-line pt-6">
              {essay.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* MATRIX DIVIDER */}
      <div className="my-14 overflow-hidden sm:my-20">
        <GlyphGrid cols={44} rows={1} />
      </div>

      {/* AUTHOR BIO */}
      <section className="mx-auto mb-14 flex max-w-[840px] flex-wrap items-center gap-6 border border-line p-7 sm:mb-20">
        <span className="h-16 w-16 flex-none rounded-full bg-ink" />
        <div className="min-w-[240px] flex-1">
          <div className="mb-2 font-mono text-meta uppercase text-muted">Written by</div>
          <div className="mb-1.5 text-xl font-bold text-ink">{site.author.name}</div>
          <p className="mb-2.5 max-w-[52ch] font-serif text-base text-copy">{site.author.bio}</p>
          <ArrowLink href="/#essays">More essays</ArrowLink>
        </div>
      </section>

      {/* PREV / NEXT */}
      {(older || newer) && (
        <div className="mx-auto mb-14 max-w-[840px] sm:mb-20">
          <PaginationNav
            prev={older && { label: older.title, href: `/essays/${older.slug}/` }}
            next={newer && { label: newer.title, href: `/essays/${newer.slug}/` }}
          />
        </div>
      )}

      {/* NEWSLETTER */}
      <Newsletter {...site.newsletter} className="mb-14 sm:mb-20" />
      </main>

      <Footer copyright={site.footer.copyright} className="mb-10" />
    </Container>
  );
}
