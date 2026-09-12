import { Fragment } from "react";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { ContactCta } from "@repo/ui/molecules/contact-cta";
import { EssayListItem } from "@repo/ui/molecules/essay-list-item";
import { FeaturedEssay } from "@repo/ui/molecules/featured-essay";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { SectionHeading } from "@repo/ui/molecules/section-heading";
import { getAllEssays, getHomePage, getSite } from "../lib/content";

export default function Home() {
  const site = getSite();
  const page = getHomePage();
  const essays = getAllEssays();
  const featured = essays.find((e) => e.featured) ?? essays[0]!;

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
      {/* HERO */}
      <section className="relative z-10 flex flex-wrap items-start gap-[clamp(16px,4vw,40px)] pb-[clamp(28px,4vw,44px)] pt-[clamp(24px,4vw,48px)]">
        <div className="hidden flex-none self-stretch sm:block">
          <GlyphGrid cols={3} rows={26} />
        </div>

        <div className="min-w-[280px] flex-1 basis-[340px]">
          <h1 className="text-hero font-black leading-[0.86] text-ink">
            {page.hero.titleLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <p className="mb-5 mt-6 max-w-[34ch] font-serif text-lede text-copy">
            {page.hero.lede}
          </p>
          <ArrowLink href={page.hero.cta.href}>{page.hero.cta.label}</ArrowLink>
        </div>

        <div className="hidden flex-none pt-2 sm:block">
          <GlyphGrid cols={16} rows={10} />
        </div>
      </section>

      {/* FEATURED ESSAY — full-bleed band, photo runs up under the hero */}
      <FeaturedEssay
        className="mb-[clamp(48px,7vw,90px)]"
        title={featured.title}
        excerpt={featured.excerpt}
        readTime={featured.readTime}
        href={`/essays/${featured.slug}/`}
        imageSrc={featured.heroImage ?? page.featured.fallbackImage}
        imageAlt={featured.heroAlt ?? ""}
      />

      {/* RECENT ESSAYS */}
      <section id="essays" className="pt-8 sm:pt-12">
        <SectionHeading viewAllHref={page.sections.essays.viewAllHref} className="mb-2">
          {page.sections.essays.title}
        </SectionHeading>
        {essays.map((essay, i) => (
          <EssayListItem
            key={essay.slug}
            index={String(i + 1).padStart(2, "0")}
            date={essay.displayDate}
            title={essay.title}
            excerpt={essay.excerpt}
            readTime={essay.readTime}
            href={`/essays/${essay.slug}/`}
          />
        ))}
      </section>

      {/* CONTACT CTA */}
      <ContactCta
        {...page.contact}
        links={site.connect}
        className="mt-12 sm:mt-[88px]"
      />
      </main>

      <Footer copyright={site.footer.copyright} className="mt-10 sm:mt-16" />
    </Container>
  );
}
