import type { Metadata } from "next";
import { ArrowLink } from "@repo/ui/atoms/arrow-link";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { getNotFoundPage, getSite } from "../lib/content";

const pageMeta = getNotFoundPage().meta;

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

export default function NotFound() {
  const page = getNotFoundPage();
  const site = getSite();

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
        <section className="flex flex-wrap items-center justify-between gap-[clamp(16px,4vw,40px)] py-[clamp(56px,12vw,140px)]">
          <div className="min-w-[280px] flex-1 basis-[480px]">
            <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
              {page.kicker}
            </div>
            <h1 className="text-hero font-black leading-[0.86] text-ink">
              <Lines text={page.title} />
            </h1>
            <p className="mt-8 max-w-[48ch] font-serif text-lede leading-relaxed text-copy">
              {page.text}
            </p>
            <div className="mt-8">
              <ArrowLink href={page.cta.href}>{page.cta.label}</ArrowLink>
            </div>
          </div>
          <div className="hidden flex-none self-stretch overflow-hidden sm:block">
            <GlyphGrid cols={10} rows={10} />
          </div>
        </section>
      </main>

      <Footer copyright={site.footer.copyright} className="mt-10 sm:mt-16" />
    </Container>
  );
}
