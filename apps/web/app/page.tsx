import { Fragment } from "react";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { EssayListItem } from "@repo/ui/molecules/essay-list-item";
import { FeaturedEssay } from "@repo/ui/molecules/featured-essay";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { Newsletter } from "@repo/ui/molecules/newsletter";
import { ProjectCard } from "@repo/ui/molecules/project-card";
import { SectionHeading } from "@repo/ui/molecules/section-heading";
import { getAllEssays, getHomePage, getProjects, getSite } from "../lib/content";

export default function Home() {
  const site = getSite();
  const page = getHomePage();
  const essays = getAllEssays();
  const featured = essays.find((e) => e.featured) ?? essays[0]!;
  const recent = essays.filter((e) => e !== featured);
  const projects = getProjects();

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
      {/* HERO */}
      <section className="relative z-10 flex flex-wrap items-start gap-[clamp(16px,4vw,40px)] pb-[clamp(28px,4vw,44px)] pt-[clamp(24px,4vw,48px)]">
        <div className="hidden flex-none self-stretch sm:block">
          <GlyphGrid cols={2} rows={18} />
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
          <GlyphGrid cols={8} rows={4} />
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
        {recent.map((essay, i) => (
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

      {/* SELECTED PROJECTS */}
      <section id="projects" className="pt-11 sm:pt-20">
        <SectionHeading viewAllHref={page.sections.projects.viewAllHref} className="mb-7">
          {page.sections.projects.title}
        </SectionHeading>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter {...site.newsletter} className="mt-12 sm:mt-[88px]" />
      </main>

      <Footer copyright={site.footer.copyright} className="mt-10 sm:mt-16" />
    </Container>
  );
}
