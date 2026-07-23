import type { Metadata } from "next";
import Link from "next/link";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { CoverArt } from "@repo/ui/atoms/cover-art";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { PaginationNav } from "@repo/ui/molecules/pagination-nav";
import { getAllProjectDetails, getProjectDetail, getSite } from "../../../lib/content";
import { mdxComponents } from "../../../lib/mdx-components";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getAllProjectDetails().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = getProjectDetail((await params).slug);
  const site = getSite();
  return {
    title: `${project.title} — ${site.meta.title}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const projects = getAllProjectDetails();
  const project = getProjectDetail(slug);
  const site = getSite();

  // Neighbors in index order.
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[i - 1];
  const next = projects[i + 1];

  const facts: { label: string; text: string }[] = [
    project.year && { label: "Year", text: project.year },
    project.role && { label: "Role", text: project.role },
    project.stack?.length && { label: "Stack", text: project.stack.join(", ") },
    project.outcome && { label: "Where it landed", text: project.outcome },
  ].filter((f): f is { label: string; text: string } => Boolean(f));

  const { default: MDXContent } = await evaluate(project.body, {
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
          <Link href="/projects/" className="text-muted">
            Projects
          </Link>
          <span aria-hidden="true" className="px-2 text-accent">
            /
          </span>
          {project.kind}
        </nav>

        <article>
          {/* PROJECT HEADER */}
          <header className="flex flex-wrap items-start gap-8 py-10 sm:py-14">
            <div className="min-w-[280px] flex-1 basis-[420px]">
              <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
                {[project.kind, project.year].filter(Boolean).join(" — ")}
              </div>
              <h1 className="max-w-[16ch] text-display font-black leading-[0.92] tracking-[-0.02em] text-ink">
                {project.title}
              </h1>
              <p className="mt-6 max-w-[52ch] font-serif text-lede text-copy">
                {project.description}
              </p>
            </div>
            <div className="w-[200px] flex-none sm:w-[280px]">
              <CoverArt title={project.title} />
            </div>
          </header>

          {/* FACTS RAIL + LINKS */}
          {(facts.length > 0 || project.links.length > 0) && (
            <div className="mb-10 flex flex-wrap gap-x-10 gap-y-5 border-y border-line py-6 sm:mb-14">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-[160px]">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {fact.label}
                  </div>
                  <p className="max-w-[36ch] font-serif text-base leading-relaxed text-copy">
                    {fact.text}
                  </p>
                </div>
              ))}
              {project.links.length > 0 && (
                <div className="flex flex-col gap-2.5 sm:ml-auto">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-mono text-label uppercase text-accent hover:text-accent-hover"
                    >
                      {link.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BODY */}
          <div className="mx-auto max-w-[720px]">
            <MDXContent components={mdxComponents} />
          </div>
        </article>

        {/* MATRIX DIVIDER */}
        <div className="my-14 overflow-hidden sm:my-20">
          <GlyphGrid cols={44} rows={1} />
        </div>

        {/* BACK LINKS */}
        <section className="mx-auto mb-10 flex max-w-[840px] flex-wrap items-center gap-x-8 gap-y-3 sm:mb-14">
          <ArrowLink href="/projects/">All projects</ArrowLink>
          <ArrowLink href="/portfolio/">Read the portfolio</ArrowLink>
        </section>

        {/* PREV / NEXT */}
        {(prev || next) && (
          <div className="mx-auto mb-14 max-w-[840px] sm:mb-20">
            <PaginationNav
              prev={prev && { label: prev.title, href: `/projects/${prev.slug}/` }}
              next={next && { label: next.title, href: `/projects/${next.slug}/` }}
            />
          </div>
        )}
      </main>

      <Footer copyright={site.footer.copyright} className="mb-10" />
    </Container>
  );
}
