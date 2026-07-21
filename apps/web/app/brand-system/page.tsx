import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { Button } from "@repo/ui/atoms/button";
import { CodeBlock } from "@repo/ui/atoms/code-block";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Logo, Mark } from "@repo/ui/atoms/logo";
import { QuoteBlock } from "@repo/ui/atoms/quote-block";
import { Tag } from "@repo/ui/atoms/tag";
import { Container } from "@repo/ui/layouts/container";
import { EssayListItem } from "@repo/ui/molecules/essay-list-item";
import { Header } from "@repo/ui/molecules/header";
import { PaginationNav } from "@repo/ui/molecules/pagination-nav";
import { ProjectCard } from "@repo/ui/molecules/project-card";
import { SectionHeading } from "@repo/ui/molecules/section-heading";

export const metadata: Metadata = {
  title: "Brand System — codeberg",
  description: "The complete brand identity and design system for codeberg.",
};

const NAV_LINKS = [
  { label: "Essays", href: "/#essays" },
  { label: "Projects", href: "/#projects" },
  { label: "System", href: "/brand-system", accent: true },
  { label: "Contact", href: "/#connect" },
];

const SWATCHES = [
  { name: "Off-white", hex: "#F6F3ED", usage: "Background", bordered: true, bg: "bg-paper", text: "text-ink" },
  { name: "codeberg red", hex: "#C52B34", usage: "Accent", bordered: false, bg: "bg-accent", text: "text-white" },
  { name: "Near-black", hex: "#111111", usage: "Type / blocks", bordered: false, bg: "bg-ink", text: "text-paper" },
  { name: "Dark gray", hex: "#2A2A2A", usage: "Body ink", bordered: false, bg: "bg-copy", text: "text-paper" },
  { name: "Soft gray", hex: "#D9D9D6", usage: "Panels / rules", bordered: false, bg: "bg-line", text: "text-ink" },
  { name: "Muted text", hex: "#6F6F6A", usage: "Metadata", bordered: true, bg: "bg-paper", text: "text-muted" },
];

const TYPE_SCALE = [
  { label: "Display", sample: "ideas in code", className: "text-display font-black leading-none tracking-[-0.02em] text-ink" },
  { label: "H1", sample: "Designing with intent", className: "text-h1 font-extrabold tracking-[-0.02em] text-ink" },
  { label: "H2", sample: "Building systems that scale", className: "text-h2 font-bold tracking-[-0.01em] text-ink" },
  { label: "Body", sample: "Good design isn't decoration — it's decision-making.", className: "font-serif text-lede text-copy" },
  { label: "Label", sample: "Featured essay", className: "font-mono text-label uppercase tracking-[0.2em] text-accent" },
  { label: "Meta", sample: "May 12, 2025 · 6 min read", className: "font-mono text-meta uppercase text-muted" },
];

export default function BrandSystemPage() {
  return (
    <>
      <Container>
        <Header links={NAV_LINKS} className="border-b-2 border-ink" />

        {/* COVER */}
        <section className="py-10 sm:py-16">
          <div className="mb-5 font-mono text-meta uppercase tracking-[0.28em] text-accent">
            Digital folklore × deconstructivist web
          </div>
          <h1 className="max-w-[14ch] text-hero font-black leading-[0.9] tracking-[-0.02em] text-ink">
            Building digital folklore.
          </h1>
          <p className="mt-7 max-w-[52ch] font-serif text-lede text-copy">
            The complete brand identity and design system for{" "}
            <strong className="font-semibold">codeberg</strong> — a one-person
            studio working where code, design, and culture meet. Code, type,
            and symbols treated as modern folk ornament.
          </p>
        </section>

        {/* CONCEPT STRIP */}
        <section className="flex flex-wrap border-t-2 border-b border-t-ink border-b-line">
          {[
            "Modern tools, old patterns",
            "Ideas in code & design",
            "Where code becomes pattern",
          ].map((phrase) => (
            <div
              key={phrase}
              className="flex-1 border-r border-line px-6 py-5 font-mono text-sm text-copy last:border-r-0"
              style={{ flexBasis: "220px" }}
            >
              {phrase}
            </div>
          ))}
          <div
            className="flex-1 px-6 py-5 font-mono text-sm text-accent"
            style={{ flexBasis: "220px" }}
          >
            Crafted systems for digital culture
          </div>
        </section>

        {/* 01 — THE MARK */}
        <section className="pt-14 sm:pt-24">
          <SectionHeading index="01" border={false} className="mb-11">
            The mark
          </SectionHeading>
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 bg-paper p-11">
              <Mark color="var(--color-accent)" className="h-[94px] w-[68px]" />
              <span className="font-mono text-meta uppercase text-muted">Primary mark</span>
            </div>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 bg-paper p-11">
              <Logo color="var(--color-accent)" markClassName="h-[50px] w-9" className="gap-3" />
              <span className="font-mono text-meta uppercase text-muted">Horizontal lockup</span>
            </div>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 bg-ink p-11">
              <Mark color="var(--color-paper)" className="h-[94px] w-[68px]" />
              <span className="font-mono text-meta uppercase text-line">On black</span>
            </div>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 bg-paper p-11">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-xs bg-accent">
                <Mark color="#fff" className="h-14 w-10" />
              </div>
              <span className="font-mono text-meta uppercase text-muted">App icon / tile</span>
            </div>
          </div>
          <p className="mt-6 max-w-[60ch] font-serif text-copy">
            A faceted berg — the peak that gives <strong className="font-semibold">code·berg</strong> its
            name. Built from a single pentagon split by one vertical fold and a
            central sub-peak, it reads as mountain, prism, and cursor caret at
            once. Minimum size 24px; keep clearspace equal to the width of one
            facet on all sides.
          </p>
        </section>

        {/* 02 — PALETTE */}
        <section className="pt-14 sm:pt-24">
          <SectionHeading index="02" border={false} className="mb-11">
            Palette
          </SectionHeading>
          <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 lg:grid-cols-6">
            {SWATCHES.map((s) => (
              <div
                key={s.hex}
                className={`flex aspect-[1/1.15] flex-col justify-end p-[18px] ${s.bg} ${s.text} ${
                  s.bordered ? "border border-line" : ""
                }`}
              >
                <span className="text-[15px] font-bold">{s.name}</span>
                <span className="mt-1 font-mono text-xs opacity-80">{s.hex}</span>
                <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] opacity-80">
                  {s.usage}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[60ch] font-serif text-copy">
            Off-white dominates. Red is bold but never neon — reserved for
            panels, labels, links, and ornament. Black appears sparingly for
            maximum contrast. Resist adding accent colors; the identity is
            strongest when the palette stays tight.
          </p>
        </section>

        {/* 03 — TYPOGRAPHY */}
        <section className="pt-14 sm:pt-24">
          <SectionHeading index="03" border={false} className="mb-11">
            Typography
          </SectionHeading>
          <div className="mb-11 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
            <div className="bg-paper p-8">
              <div className="mb-4 font-mono text-meta uppercase text-accent">Display · Archivo</div>
              <div className="text-[64px] font-black leading-none tracking-[-0.02em]">Aa</div>
              <div className="mt-3.5 font-mono text-xs text-muted">700 / 800 / 900 · headlines</div>
            </div>
            <div className="bg-paper p-8">
              <div className="mb-4 font-mono text-meta uppercase text-accent">Reading · Newsreader</div>
              <div className="font-serif text-[64px] leading-none">Aa</div>
              <div className="mt-3.5 font-mono text-xs text-muted">400 / 500 · essay body</div>
            </div>
            <div className="bg-paper p-8">
              <div className="mb-4 font-mono text-meta uppercase text-accent">Mono · JetBrains Mono</div>
              <div className="font-mono text-[60px] font-medium leading-none">Aa</div>
              <div className="mt-3.5 font-mono text-xs text-muted">Labels, metadata, code</div>
            </div>
          </div>
          <div className="border-t border-line">
            {TYPE_SCALE.map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-baseline gap-5 border-b border-line py-5"
              >
                <span className="w-20 flex-none font-mono text-xs text-muted">{row.label}</span>
                <span className={row.className}>{row.sample}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — PATTERN SYSTEM */}
        <section className="pt-14 sm:pt-24">
          <SectionHeading index="04" border={false} className="mb-4">
            Pattern system
          </SectionHeading>
          <p className="mb-10 max-w-[60ch] font-serif text-copy">
            The soul of the identity. Folk ornament — embroidery, runes,
            textile borders — rebuilt from ASCII marks. Repetitive, geometric,
            modular, typographic. Always rhythmic, never random.
          </p>

          <div className="mb-0.5 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
            <div className="flex min-h-[220px] gap-5 bg-paper p-7">
              <GlyphGrid cols={2} rows={12} />
              <div
                className="font-mono text-meta uppercase text-muted"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Vertical rail
              </div>
            </div>
            <div className="flex min-h-[220px] flex-col justify-between bg-paper p-7">
              <GlyphGrid cols={9} rows={5} />
              <div className="font-mono text-meta uppercase text-muted">Texture field</div>
            </div>
            <div className="flex min-h-[220px] flex-col justify-center gap-3.5 bg-paper p-7">
              <pre className="m-0 font-mono text-[15px] leading-[1.7] text-ink">
                {"/\\/\\ /\\/\\ /\\/\\\n<> <> <> <>\n[] [] [] []\n:: :: :: ::\n^ v ^ v ^ v"}
              </pre>
              <div className="font-mono text-meta uppercase text-muted">Motif sets</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-line bg-paper p-7">
            <div className="overflow-hidden whitespace-nowrap font-mono text-[15px] text-accent">
              + ⌃ + ⌄ + × + ⌃ + ⌄ + × + ⌃ + ⌄ + × + ⌃ + ⌄ + × + ⌃ + ⌄ + × +
            </div>
            <div className="overflow-hidden whitespace-nowrap font-mono text-[15px] text-ink">
              {"<><><><><><><><><><><><><><><><><><><><>"}
            </div>
            <div className="overflow-hidden whitespace-nowrap font-mono text-[15px] text-muted">
              {"^".repeat(60)}
            </div>
            <div className="overflow-hidden whitespace-nowrap font-mono text-[15px] text-accent">
              · + · × · + · · + · × · + · · + · × · + · · + · × · + · · + · × · +
            </div>
          </div>
          <p className="mt-3.5 font-mono text-xs text-muted">
            Glyph set: / \ &lt; &gt; [ ] + + : : . . ^ ^ v v x x {"{"} {"}"} ⌃ ⌄ ⌵ · —
          </p>
        </section>

        {/* 05 — GEOMETRY */}
        <section className="pt-14 sm:pt-24">
          <SectionHeading index="05" border={false} className="mb-11">
            Geometric language
          </SectionHeading>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px border border-line bg-line">
            <div className="flex aspect-square items-center justify-center bg-paper p-6">
              <div className="h-[74px] w-[74px] rounded-full bg-accent" />
            </div>
            <div className="flex aspect-square items-center justify-center bg-paper p-6">
              <div className="h-[37px] w-[74px] rounded-t-[74px] bg-ink" />
            </div>
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-paper p-6">
              <div className="h-[74px] w-[74px] rounded-tr-[74px] bg-accent" />
            </div>
            <div className="flex aspect-square items-end justify-center bg-paper p-6">
              <div className="flex items-end gap-0">
                <div className="h-[26px] w-[22px] bg-ink" />
                <div className="h-11 w-[22px] bg-ink" />
                <div className="h-[62px] w-[22px] bg-ink" />
              </div>
            </div>
            <div
              className="aspect-square bg-paper p-6"
              style={{
                backgroundImage: "radial-gradient(#111 1.6px, transparent 1.8px)",
                backgroundSize: "14px 14px",
                backgroundOrigin: "content-box",
              }}
            />
          </div>
          <div className="relative mt-0.5 flex min-h-[200px] items-center overflow-hidden bg-ink px-6 sm:px-14">
            <div
              className="absolute inset-y-0 left-0 w-[42%] bg-accent"
              style={{ clipPath: "polygon(0 0,100% 0,72% 100%,0 100%)" }}
            />
            <div className="relative ml-auto max-w-[44ch] text-paper">
              <div className="mb-2.5 font-mono text-meta uppercase tracking-[0.2em] opacity-70">
                Red panel + angular cut
              </div>
              <p className="text-lede font-bold leading-snug">
                Red geometric blocks cut into grayscale imagery to create
                energy and contrast — echoing the faceted logo.
              </p>
            </div>
          </div>
        </section>

        {/* 06 — COMPONENTS */}
        <section className="pt-14 sm:pt-24">
          <SectionHeading index="06" border={false} className="mb-11">
            Components
          </SectionHeading>
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
            <div className="border border-line bg-paper p-7">
              <div className="mb-[22px] font-mono text-meta uppercase text-muted">
                Buttons · Labels · Tags
              </div>
              <div className="mb-[22px] flex flex-wrap items-center gap-3">
                <Button variant="primary">Subscribe</Button>
                <Button variant="outline">Read essay</Button>
              </div>
              <div className="mb-[22px] flex items-center gap-4">
                <ArrowLink href="/brand-system">About codeberg</ArrowLink>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag>Redux</Tag>
                <Tag>RxJS</Tag>
                <Tag>React</Tag>
              </div>
            </div>

            <div className="border border-line bg-paper p-7">
              <div className="mb-[22px] font-mono text-meta uppercase text-muted">
                Essay list item
              </div>
              <EssayListItem
                index="02"
                date="May 12, 2025"
                title="Designing with intent, not templates"
                excerpt="How constraints lead to stronger, more original design solutions."
                readTime="6 min read"
                className="border-b-0 py-0"
              />
            </div>

            <div className="border border-line bg-paper p-7">
              <div className="mb-[22px] font-mono text-meta uppercase text-muted">Pull quote</div>
              <QuoteBlock
                quote="Simplicity is the ultimate sophistication."
                attribution="Leonardo da Vinci"
              />
            </div>

            <div className="border border-line bg-paper p-7">
              <div className="mb-[22px] font-mono text-meta uppercase text-muted">Project card</div>
              <ProjectCard
                seed={7}
                title="Peakfolio"
                description="A minimal portfolio starter for developers."
              />
            </div>

            <div className="border border-line bg-paper p-7">
              <div className="mb-[22px] font-mono text-meta uppercase text-muted">Code block</div>
              <CodeBlock>
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
            </div>

            <div className="border border-line bg-paper p-7">
              <div className="mb-[22px] font-mono text-meta uppercase text-muted">Prev / next</div>
              <PaginationNav
                prev={{ label: "Designing with intent", href: "#" }}
                next={{ label: "Building systems that scale", href: "#" }}
              />
            </div>
          </div>
        </section>
      </Container>

      {/* FOOTER */}
      <footer className="mt-14 bg-ink py-10 text-paper sm:mt-24 sm:py-[72px]">
        <Container>
          <div className="mb-10 overflow-hidden">
            <GlyphGrid cols={40} rows={1} className="text-accent" />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Logo className="mb-4" markClassName="h-9 w-6" color="var(--color-accent)" />
              <p className="font-mono text-meta text-muted">
                © 2025 codeberg · Building digital folklore
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 bg-accent px-[22px] py-[13px] font-mono text-label uppercase text-white hover:bg-accent-hover"
            >
              View live homepage
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Container>
      </footer>
    </>
  );
}
