import type { Metadata } from "next";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { Newsletter } from "@repo/ui/molecules/newsletter";
import { ProjectCard } from "@repo/ui/molecules/project-card";
import { getAllProjectDetails, getProjectsPage, getSite } from "../../lib/content";

const pageMeta = getProjectsPage().meta;

export const metadata: Metadata = {
  title: pageMeta.title,
  description: pageMeta.description,
};

/** Renders line breaks from "\n" in JSON strings. */
function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function Projects() {
  const page = getProjectsPage();
  const projects = getAllProjectDetails();
  const site = getSite();

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
        {/* HERO */}
        <section className="flex flex-wrap items-end justify-between gap-[clamp(16px,4vw,40px)] pb-[clamp(28px,4vw,48px)] pt-1">
          <div className="min-w-[280px] flex-1 basis-[480px]">
            <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
              {page.kicker}
            </div>
            <h1 className="text-hero font-black leading-[0.86] text-ink">
              <Lines text={page.title} />
            </h1>
            <p className="mt-8 max-w-[56ch] font-serif text-lede leading-relaxed text-copy">
              {page.intro}
            </p>
            <div className="mt-6">
              <ArrowLink href="/portfolio/">Read the portfolio</ArrowLink>
            </div>
          </div>
          <div className="hidden flex-none self-stretch overflow-hidden sm:block">
            <GlyphGrid cols={10} rows={8} />
          </div>
        </section>

        {/* GRID */}
        <section className="border-t-2 border-ink pt-8 sm:pt-12">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                description={project.description}
                href={`/projects/${project.slug}/`}
              />
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
