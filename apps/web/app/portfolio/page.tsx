import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import {
  getPortfolio,
  getSite,
  type PortfolioChapter,
  type PortfolioImage,
} from "../../lib/content";
import { NAV_LINKS } from "../../lib/nav";

export const metadata: Metadata = {
  title: "Portfolio — codeberg",
  description:
    "Four projects, told properly — the problem, the decisions, and where each landed — plus photographs from away from the screen.",
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

/** An image if `src` is set; otherwise the design's gray slot with its hint. */
function ImageSlot({
  image,
  dark = false,
  className,
}: {
  image: PortfolioImage;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${dark ? "bg-copy" : "bg-[#E7E3DA]"} ${className ?? ""}`}
      style={{ aspectRatio: image.ratio }}
    >
      {image.src ? (
        <img
          src={image.src}
          alt={image.alt ?? ""}
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
      ) : (
        <span
          className={`absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-meta uppercase ${dark ? "text-line/60" : "text-muted"}`}
        >
          {image.placeholder}
        </span>
      )}
    </div>
  );
}

function ChapterHeading({
  number,
  title,
  meta,
  dark = false,
}: {
  number: string;
  title: string;
  meta: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-[clamp(20px,3vw,32px)] flex flex-wrap items-baseline gap-x-[18px] gap-y-2">
      <span className="font-mono text-[clamp(15px,1.6vw,18px)] font-bold text-accent">
        {number}
      </span>
      <h2 className="text-[clamp(38px,6vw,76px)] font-black leading-[0.94] tracking-[-0.02em]">
        {title}
      </h2>
      <span
        className={`font-mono text-meta uppercase sm:ml-auto ${dark ? "text-[#8A8A85]" : "text-muted"}`}
      >
        {meta}
      </span>
    </div>
  );
}

function LabeledParagraph({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <p className="font-serif text-[clamp(17px,1.8vw,21px)] leading-[1.65] text-copy">
      {label && (
        <span className="mb-2.5 block font-mono text-meta uppercase tracking-[0.18em] text-accent">
          {label}
        </span>
      )}
      {children}
    </p>
  );
}

function AsideRail({
  items,
  link,
}: {
  items: { label: string; text: string }[];
  link?: { label: string; href: string };
}) {
  return (
    <aside className="flex min-w-[240px] flex-1 basis-[280px] flex-col gap-4 border-l-2 border-ink pl-[clamp(18px,2vw,28px)] sm:flex-none sm:basis-[300px]">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {item.label}
          </div>
          <p className="font-serif text-base leading-relaxed text-copy">{item.text}</p>
        </div>
      ))}
      {link && (
        <a
          href={link.href}
          className="mt-1.5 font-mono text-label uppercase text-accent hover:text-accent-hover"
        >
          {link.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </aside>
  );
}

function ChapterLink({
  link,
}: {
  link: { label: string; href: string; variant?: "accent" | "paper" };
}) {
  return (
    <a
      href={link.href}
      className={`font-mono text-label uppercase ${
        link.variant === "paper"
          ? "text-paper hover:text-line"
          : "text-accent hover:text-accent-hover"
      }`}
    >
      {link.label} <span aria-hidden="true">↗</span>
    </a>
  );
}

function FeatureChapter({ chapter, number }: { chapter: PortfolioChapter; number: string }) {
  return (
    <section id={chapter.id} className="pt-[clamp(56px,8vw,110px)]">
      <ChapterHeading number={number} title={chapter.title} meta={chapter.meta} />
      {chapter.heroImage && <ImageSlot image={chapter.heroImage} />}
      <div className="mt-[clamp(24px,3vw,40px)] flex flex-wrap gap-[clamp(24px,4vw,56px)]">
        <div className="flex min-w-[280px] flex-1 basis-[420px] flex-col gap-[18px]">
          {chapter.paragraphs.map((p) => (
            <LabeledParagraph key={p.text.slice(0, 24)} label={p.label}>
              {p.text}
            </LabeledParagraph>
          ))}
        </div>
        {chapter.aside && <AsideRail items={chapter.aside} link={chapter.links[0]} />}
      </div>
    </section>
  );
}

function SplitChapter({ chapter, number }: { chapter: PortfolioChapter; number: string }) {
  const [first, second] = chapter.paragraphs;
  return (
    <section id={chapter.id} className="pt-[clamp(56px,8vw,110px)]">
      <ChapterHeading number={number} title={chapter.title} meta={chapter.meta} />
      <div className="flex flex-wrap gap-[clamp(24px,4vw,56px)]">
        <div className="flex min-w-[280px] flex-1 basis-[400px] flex-col gap-[18px]">
          {first && <LabeledParagraph>{first.text}</LabeledParagraph>}
          {chapter.quote && (
            <blockquote className="my-1.5 border-l-[3px] border-accent pl-[clamp(16px,2vw,24px)] font-serif text-[clamp(19px,2.2vw,25px)] italic leading-[1.45] text-ink">
              {chapter.quote}
            </blockquote>
          )}
          {second && <LabeledParagraph>{second.text}</LabeledParagraph>}
          {chapter.inlineImage && <ImageSlot image={chapter.inlineImage} className="mt-2" />}
          {chapter.links[0] && <ChapterLink link={chapter.links[0]} />}
        </div>
        {chapter.tallImage && (
          <ImageSlot
            image={chapter.tallImage}
            className="min-w-[260px] flex-1 basis-[340px] self-start"
          />
        )}
      </div>
    </section>
  );
}

function DarkChapter({ chapter, number }: { chapter: PortfolioChapter; number: string }) {
  return (
    <section
      id={chapter.id}
      className="-mx-gutter mt-[clamp(56px,8vw,110px)] bg-ink px-gutter py-[clamp(36px,6vw,72px)] text-paper"
    >
      <div className="mx-auto max-w-[1052px]">
        <ChapterHeading number={number} title={chapter.title} meta={chapter.meta} dark />
        <div className="flex flex-wrap items-start gap-[clamp(24px,4vw,56px)]">
          <div className="hidden flex-none sm:block">
            <GlyphGrid cols={3} rows={12} hotClassName="text-paper" />
          </div>
          <div className="flex min-w-[280px] flex-1 basis-[400px] flex-col gap-[18px]">
            {chapter.paragraphs.map((p) => (
              <p
                key={p.text.slice(0, 24)}
                className="font-serif text-[clamp(17px,1.8vw,21px)] leading-[1.65] text-line"
              >
                {p.text}
              </p>
            ))}
            <div className="mt-1.5 flex flex-wrap items-center gap-6">
              {chapter.links.map((link) => (
                <ChapterLink key={link.label} link={link} />
              ))}
            </div>
          </div>
          {chapter.sideImage && (
            <ImageSlot
              image={chapter.sideImage}
              dark
              className="min-w-[260px] flex-1 basis-[300px]"
            />
          )}
        </div>
      </div>
    </section>
  );
}

function PairChapter({ chapter, number }: { chapter: PortfolioChapter; number: string }) {
  return (
    <section id={chapter.id} className="pt-[clamp(56px,8vw,110px)]">
      <ChapterHeading number={number} title={chapter.title} meta={chapter.meta} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(12px,1.6vw,20px)]">
        {chapter.pairImages?.map((image) => (
          <ImageSlot key={image.placeholder ?? image.src} image={image} />
        ))}
      </div>
      <div className="mt-[clamp(24px,3vw,40px)] flex flex-wrap gap-[clamp(24px,4vw,56px)]">
        {chapter.paragraphs[0] && (
          <p className="min-w-[280px] flex-1 basis-[400px] font-serif text-[clamp(17px,1.8vw,21px)] leading-[1.65] text-copy">
            {chapter.paragraphs[0].text}
          </p>
        )}
        {chapter.aside && <AsideRail items={chapter.aside} link={chapter.links[0]} />}
      </div>
    </section>
  );
}

const LAYOUTS = {
  feature: FeatureChapter,
  split: SplitChapter,
  dark: DarkChapter,
  pair: PairChapter,
} as const;

export default function Portfolio() {
  const portfolio = getPortfolio();
  const site = getSite();
  const photographyNumber = String(portfolio.chapters.length + 1).padStart(2, "0");

  const index = [
    ...portfolio.chapters.map((c, i) => ({
      href: `#${c.id}`,
      number: String(i + 1).padStart(2, "0"),
      title: c.title,
      meta: c.meta.split(" — ").slice(0, 2).join(" — "),
    })),
    {
      href: `#${portfolio.photography.id}`,
      number: photographyNumber,
      title: portfolio.photography.title,
      meta: "Photography",
    },
  ];

  return (
    <Container className="overflow-hidden">
      <Header links={NAV_LINKS} />

      <main id="main">
        {/* HERO */}
        <section className="pb-[clamp(28px,4vw,48px)] pt-1">
          <div className="flex flex-wrap items-end justify-between gap-[clamp(16px,4vw,40px)]">
            <div className="relative min-w-[280px] flex-1 basis-[480px]">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-6 z-0 h-[200px] w-[200px] rounded-full bg-accent sm:-top-10 sm:left-[min(397px,60%)] sm:right-auto sm:h-[clamp(280px,34vw,460px)] sm:w-[clamp(280px,34vw,460px)] sm:translate-y-[10%]"
              />
              <div className="relative z-10 mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
                {portfolio.kicker}
              </div>
              <h1 className="relative z-10 text-hero font-black leading-[0.86] text-ink">
                <Lines text={portfolio.title} />
              </h1>
              <p className="relative z-10 mt-11 max-w-[56ch] font-serif text-[clamp(17px,1.8vw,21px)] leading-relaxed text-copy">
                {portfolio.intro}
              </p>
            </div>
            <div className="hidden flex-1 basis-[300px] items-end justify-start self-stretch overflow-hidden sm:flex">
              <GlyphGrid cols={14} rows={8} />
            </div>
          </div>

          {/* INDEX */}
          <nav
            aria-label="Portfolio chapters"
            className="mt-[clamp(28px,4vw,44px)] flex flex-col border-t-2 border-ink"
          >
            {index.map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                className="group flex flex-wrap items-baseline gap-x-[18px] gap-y-1 border-b border-line px-0.5 py-3.5 text-ink hover:text-accent"
              >
                <span className="font-mono text-xs text-accent">{entry.number}</span>
                <span className="text-[clamp(16px,1.8vw,20px)] font-bold">{entry.title}</span>
                <span className="font-mono text-meta uppercase text-muted sm:ml-auto">
                  {entry.meta}
                </span>
              </a>
            ))}
          </nav>
        </section>

        {/* CHAPTERS */}
        {portfolio.chapters.map((chapter, i) => {
          const Layout = LAYOUTS[chapter.layout];
          return (
            <Layout
              key={chapter.id}
              chapter={chapter}
              number={String(i + 1).padStart(2, "0")}
            />
          );
        })}

        {/* INTERLUDE */}
        <section className="pb-[clamp(20px,3vw,36px)] pt-[clamp(64px,10vw,130px)] text-center">
          <div className="mb-6 flex justify-center">
            <GlyphGrid cols={12} rows={2} />
          </div>
          <p className="mx-auto max-w-[34ch] font-serif text-[clamp(22px,3vw,34px)] italic leading-[1.4] text-ink">
            {portfolio.interlude.map((line, i) => (
              <span key={line}>
                {line}
                {i < portfolio.interlude.length - 1 && <br />}
              </span>
            ))}
          </p>
        </section>

        {/* PHOTOGRAPHY */}
        <section id={portfolio.photography.id} className="pt-[clamp(28px,4vw,52px)]">
          <div className="mb-[clamp(20px,3vw,32px)] flex flex-wrap items-baseline gap-x-[18px] gap-y-2 border-t-2 border-ink pt-[18px]">
            <span className="font-mono text-[clamp(15px,1.6vw,18px)] font-bold text-accent">
              {photographyNumber}
            </span>
            <h2 className="text-[clamp(38px,6vw,76px)] font-black leading-[0.94] tracking-[-0.02em]">
              {portfolio.photography.title}
            </h2>
          </div>
          <p className="mb-[clamp(26px,3vw,40px)] max-w-[56ch] font-serif text-[clamp(17px,1.8vw,21px)] leading-[1.65] text-copy">
            {portfolio.photography.intro}
          </p>
          <div className="columns-[clamp(180px,26vw,300px)] gap-[clamp(12px,1.8vw,20px)]">
            {portfolio.photography.photos.map((photo) => (
              <figure
                key={photo.caption}
                className="mb-[clamp(12px,1.8vw,20px)] break-inside-avoid"
              >
                <ImageSlot image={photo} />
                <figcaption className="mt-2 flex justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                  <span>{photo.caption}</span>
                  <span>{photo.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CONNECT CTA */}
        <section
          id="connect"
          className="mt-[clamp(48px,7vw,88px)] flex flex-wrap items-center justify-between gap-[clamp(24px,4vw,48px)] bg-accent p-[clamp(28px,5vw,56px)] text-white"
        >
          <div className="min-w-[280px] flex-1 basis-[360px]">
            <h2 className="text-[clamp(30px,4.4vw,56px)] font-black leading-[0.98] tracking-[-0.02em]">
              <Lines text={portfolio.cta.title} />
            </h2>
            <p className="mt-5 max-w-[40ch] font-serif text-[clamp(16px,1.6vw,19px)] leading-normal opacity-95">
              {portfolio.cta.text}
            </p>
          </div>
          <div className="flex flex-none flex-col gap-3.5">
            <a
              href={portfolio.cta.button.href}
              className="inline-flex items-center gap-2.5 bg-paper px-7 py-4 font-mono text-[13px] uppercase tracking-[0.12em] text-ink hover:bg-line"
            >
              {portfolio.cta.button.label} <span aria-hidden="true">↗</span>
            </a>
            <div className="flex flex-wrap gap-5 font-mono text-xs tracking-wide">
              {site.connect.map((link) => (
                <a key={link.label} href={link.href} className="text-white hover:text-paper/80">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer className="mt-10 sm:mt-16" />
    </Container>
  );
}
