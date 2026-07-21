import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { CodeBlock } from "@repo/ui/atoms/code-block";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { QuoteBlock } from "@repo/ui/atoms/quote-block";
import { Tag } from "@repo/ui/atoms/tag";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { Newsletter } from "@repo/ui/molecules/newsletter";
import { PaginationNav } from "@repo/ui/molecules/pagination-nav";
import { NAV_LINKS } from "../../lib/nav";

export const metadata: Metadata = {
  title: "Designing with intent, not templates — codeberg",
  description:
    "How constraints — not endless options — lead to stronger, more original design solutions.",
};

const QUESTIONS = [
  "What is the one job this screen must do well?",
  "What can I remove and still keep that job intact?",
  "Which single constraint will guide every later call?",
];

export default function Essay() {
  return (
    <Container>
      <Header links={NAV_LINKS} />

      {/* BREADCRUMB */}
      <div className="border-t-2 border-ink py-3.5 font-mono text-meta uppercase text-muted">
        <Link href="/#essays" className="text-muted">
          Essays
        </Link>
        <span className="px-2 text-accent">/</span>
        Design Systems
      </div>

      <article>
        {/* ARTICLE HEADER */}
        <header className="flex flex-wrap gap-8 py-10 sm:py-14">
          <div className="hidden self-stretch sm:block">
            <GlyphGrid cols={2} rows={16} />
          </div>
          <div className="min-w-[280px] flex-1 basis-[420px]">
            <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
              Essay No. 04
            </div>
            <h1 className="max-w-[16ch] text-display font-black leading-[0.92] tracking-[-0.02em] text-ink">
              Designing with intent, not templates
            </h1>
            <p className="mt-6 max-w-[52ch] font-serif text-lede text-copy">
              How constraints — not endless options — lead to stronger, more
              original design solutions.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5 border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 flex-none rounded-full bg-ink" />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-ink">Alex Berg</div>
                  <div className="font-mono text-xs text-muted">Founder, codeberg</div>
                </div>
              </div>
              <div className="font-mono text-meta uppercase text-muted">
                May 12, 2025 · 6 min read
              </div>
            </div>
          </div>
        </header>

        {/* HERO IMAGE */}
        <figure className="relative mb-9 sm:mb-14">
          <div className="relative aspect-video overflow-hidden">
            <img
              src="/mountain-hero.jpg"
              alt="A workspace stripped to essentials"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
          </div>
          <figcaption className="mt-3 font-mono text-xs text-muted">
            Fig. 01 — A workspace stripped to essentials.
          </figcaption>
        </figure>

        {/* BODY */}
        <div className="mx-auto max-w-[720px]">
          <p className="mb-6 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]">
            <span className="float-left pr-3.5 pt-1.5 font-sans text-[76px] font-extrabold leading-[0.72] text-accent">
              T
            </span>
            here&apos;s a quiet myth in product design that more options mean
            more freedom. Open any tool today and you&apos;re handed infinite
            templates, presets, and starting points. Yet the work that lasts
            almost never comes from that abundance — it comes from a designer
            who chose a constraint and followed it all the way down.
          </p>
          <p className="mb-6 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]">
            A template answers a question you haven&apos;t asked yet. It
            optimizes for the average of a thousand projects that aren&apos;t
            yours. Intent works the other way around: you decide what this
            specific thing needs to do, and every decision after that has
            something to push against.
          </p>

          <h2 className="mt-12 mb-[18px] text-h2 font-extrabold tracking-[-0.02em] text-ink">
            Constraints are a design tool
          </h2>
          <p className="mb-6 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]">
            When you limit the palette to two colors, every use of the accent
            has to earn its place. When you commit to a single typeface
            family, hierarchy comes from weight and scale instead of novelty.
            The limits do the editing for you.
          </p>

          <QuoteBlock
            quote="A constraint isn't the absence of choice. It's a decision you only have to make once."
            attribution="On working within a system"
            className="my-10"
          />

          <p className="mb-6 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]">
            The same logic scales to code. A design system encodes intent
            into defaults, so the easy path and the correct path are the same
            path. Here&apos;s a spacing scale expressed as tokens rather than
            magic numbers:
          </p>

          <CodeBlock className="mb-6 text-[13.5px] leading-[1.7]">
            <span className="text-muted">{"// one scale, no magic numbers\n"}</span>
            <span className="text-code-amber">const</span>
            {" space = {\n  xs: "}
            <span className="text-accent">4</span>
            {", sm: "}
            <span className="text-accent">8</span>
            {", md: "}
            <span className="text-accent">16</span>
            {",\n  lg: "}
            <span className="text-accent">32</span>
            {", xl: "}
            <span className="text-accent">64</span>
            {",\n};\n"}
            <span className="text-code-amber">export const</span>
            {" gap = (k) => space[k] ?? space.md;"}
          </CodeBlock>

          <h3 className="mt-10 mb-3.5 text-h3 font-bold tracking-[-0.01em] text-ink">
            Three questions before a template
          </h3>
          <ul className="mb-6 list-none space-y-3.5 p-0 font-serif text-[19px] leading-[1.55] text-[#1a1a1a]">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="flex gap-3.5">
                <span className="flex-none font-mono text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>

          <p className="mb-6 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]">
            None of this is about working harder. It&apos;s about moving the
            hard thinking to the front, where a few good decisions can
            quietly make a hundred small ones for you.
          </p>

          <figure className="my-10">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src="/mountain-hero.jpg"
                alt="The same layout, reduced to a single accent"
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs text-muted">
              Fig. 02 — The same layout, reduced to a single accent.
            </figcaption>
          </figure>

          <p className="mb-2 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]">
            Start with intent. Let the template be something you arrive at —
            never where you begin.
          </p>

          <div className="mt-9 flex flex-wrap gap-2 border-t border-line pt-6">
            <Tag>Design systems</Tag>
            <Tag>Process</Tag>
            <Tag>Craft</Tag>
          </div>
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
          <div className="mb-1.5 text-xl font-bold text-ink">Alex Berg</div>
          <p className="mb-2.5 max-w-[52ch] font-serif text-base text-copy">
            Designer and developer building codeberg — a one-person studio
            working where code, design, and culture meet.
          </p>
          <ArrowLink href="/#essays">More essays</ArrowLink>
        </div>
      </section>

      {/* PREV / NEXT */}
      <div className="mx-auto mb-14 max-w-[840px] sm:mb-20">
        <PaginationNav
          prev={{ label: "Building design systems that scale", href: "/#essays" }}
          next={{ label: "Redux Observable — a practical guide", href: "/#essays" }}
        />
      </div>

      {/* NEWSLETTER */}
      <Newsletter className="mb-14 sm:mb-20" />

      <Footer className="mb-10" />
    </Container>
  );
}
