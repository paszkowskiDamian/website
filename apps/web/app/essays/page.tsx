import type { Metadata } from "next";
import { Suspense } from "react";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { Newsletter } from "@repo/ui/molecules/newsletter";
import { getAllEssayMetas, getEssaysPage, getSite } from "../../lib/content";
import { EssaysIndex, EssaysList } from "./essays-index";

const essaysMeta = getEssaysPage().meta;

export const metadata: Metadata = {
  title: essaysMeta.title,
  description: essaysMeta.description,
};

export default function EssaysPage() {
  const site = getSite();
  const page = getEssaysPage();
  const essays = getAllEssayMetas();

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
        {/* PAGE HEADER */}
        <section className="flex flex-wrap items-start gap-[clamp(16px,4vw,40px)] pb-[clamp(28px,4vw,44px)] pt-[clamp(24px,4vw,48px)]">
          <div className="hidden flex-none self-stretch sm:block">
            <GlyphGrid cols={2} rows={12} />
          </div>
          <div className="min-w-[280px] flex-1 basis-[340px]">
            <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
              {page.kicker}
            </div>
            <h1 className="text-hero font-black leading-[0.86] text-ink">{page.title}</h1>
            <p className="mt-6 max-w-[52ch] font-serif text-lede text-copy">{page.intro}</p>
          </div>
          <div className="hidden flex-none pt-2 sm:block">
            <GlyphGrid cols={8} rows={4} />
          </div>
        </section>

        {/* FILTER + LIST — the filter reads ?category= client-side
            (static export), so the interactive part sits behind Suspense with
            the full unfiltered list as the prerendered fallback. */}
        <section aria-label={page.title}>
          <Suspense
            fallback={
              <div className="border-t-2 border-ink">
                <EssaysList essays={essays} />
              </div>
            }
          >
            <EssaysIndex essays={essays} copy={page.filters} />
          </Suspense>
        </section>

        {/* NEWSLETTER */}
        <Newsletter {...site.newsletter} className="mt-12 sm:mt-[88px]" />
      </main>

      <Footer copyright={site.footer.copyright} className="mt-10 sm:mt-16" />
    </Container>
  );
}
