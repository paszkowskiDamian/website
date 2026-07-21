import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { ConnectRow } from "@repo/ui/molecules/connect-row";
import { EssayListItem } from "@repo/ui/molecules/essay-list-item";
import { FeaturedEssay } from "@repo/ui/molecules/featured-essay";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { Newsletter } from "@repo/ui/molecules/newsletter";
import { ProjectCard } from "@repo/ui/molecules/project-card";
import { SectionHeading } from "@repo/ui/molecules/section-heading";
import { getAllEssays, getProjects, getSite } from "../lib/content";
import { NAV_LINKS } from "../lib/nav";

export default function Home() {
  const essays = getAllEssays();
  const featured = essays.find((e) => e.featured) ?? essays[0]!;
  const recent = essays.filter((e) => e !== featured);
  const projects = getProjects();
  const site = getSite();

  return (
    <Container>
      <Header links={NAV_LINKS} />

      {/* HERO + FEATURED ESSAY */}
      <section className="grid grid-cols-1 gap-10 py-8 sm:grid-cols-[auto_1fr_1.15fr] sm:items-stretch sm:py-10">
        <div className="hidden self-stretch sm:block">
          <GlyphGrid cols={2} rows={28} />
        </div>

        <div className="flex min-w-[260px] flex-col justify-center">
          <h1 className="text-hero font-black leading-[0.86] text-ink">
            ideas
            <br />
            in code
            <br />
            &amp; design
          </h1>
          <p className="mb-5 mt-6 max-w-[34ch] font-serif text-lede text-copy">
            Essays on design systems, front-end development, creative process,
            and the tools that shape digital products.
          </p>
          <ArrowLink href="/brand-system/">About codeberg</ArrowLink>
        </div>

        <div className="flex flex-col gap-5">
          <div className="hidden justify-end sm:flex">
            <GlyphGrid cols={11} rows={6} />
          </div>
          <FeaturedEssay
            className="min-h-[420px] sm:min-h-[560px]"
            title={featured.title}
            excerpt={featured.excerpt}
            readTime={featured.readTime}
            href={`/essays/${featured.slug}/`}
            imageSrc={featured.heroImage ?? "/mountain-hero.jpg"}
            imageAlt={featured.heroAlt ?? ""}
          />
        </div>
      </section>

      {/* RECENT ESSAYS */}
      <section id="essays" className="pt-8 sm:pt-12">
        <SectionHeading viewAllHref="/#essays" className="mb-2">
          Recent Essays
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
        <SectionHeading viewAllHref="/#projects" className="mb-7">
          Selected Projects
        </SectionHeading>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.seed} {...project} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter className="mt-12 sm:mt-[88px]" />

      {/* CONNECT */}
      <section id="connect" className="pt-11 sm:pt-20">
        <h2 className="mb-6 text-h2 font-extrabold text-ink">Let&apos;s connect</h2>
        <ConnectRow links={site.connect} />
        <div className="mt-7 overflow-hidden">
          <GlyphGrid cols={40} rows={1} />
        </div>
      </section>

      <Footer className="mt-10 sm:mt-16" />
    </Container>
  );
}
