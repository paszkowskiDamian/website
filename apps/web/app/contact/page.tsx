import type { Metadata } from "next";
import { Fragment } from "react";
import { GlyphGrid } from "@repo/ui/atoms/glyph-grid";
import { Container } from "@repo/ui/layouts/container";
import { Footer } from "@repo/ui/molecules/footer";
import { Header } from "@repo/ui/molecules/header";
import { getContactPage, getSite } from "../../lib/content";
import { ContactForm } from "./contact-form";

const contactMeta = getContactPage().meta;

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
};

export default function Contact() {
  const page = getContactPage();
  const site = getSite();

  return (
    <Container>
      <Header links={site.nav} />

      <main id="main">
        {/* HERO */}
        <section className="flex flex-wrap items-start gap-[clamp(16px,4vw,40px)] pb-[clamp(28px,4vw,44px)] pt-[clamp(24px,4vw,48px)]">
          <div className="min-w-[280px] flex-1 basis-[340px]">
            <div className="mb-5 font-mono text-meta uppercase tracking-[0.22em] text-accent">
              {page.kicker}
            </div>
            <h1 className="text-hero font-black leading-[0.86] text-ink">
              {page.titleLines.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h1>
            <p className="mt-6 max-w-[48ch] font-serif text-lede text-copy">{page.intro}</p>
          </div>
          <div className="hidden flex-none pt-2 sm:block">
            <GlyphGrid cols={8} rows={4} />
          </div>
        </section>

        {/* FORM + ASIDE */}
        <section className="flex flex-wrap gap-[clamp(24px,4vw,56px)] border-t-2 border-ink pt-[clamp(28px,4vw,44px)]">
          <div className="min-w-[280px] flex-1 basis-[420px]">
            <ContactForm copy={page.form} />
          </div>
          <aside className="flex min-w-[240px] flex-1 basis-[280px] flex-col gap-4 border-l-2 border-ink pl-[clamp(18px,2vw,28px)] sm:flex-none sm:basis-[300px]">
            {page.aside.map((item) => (
              <div key={item.label}>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </div>
                <p className="font-serif text-base leading-relaxed text-copy">{item.text}</p>
              </div>
            ))}
            <div className="mt-1.5 flex flex-wrap gap-5 font-mono text-label uppercase">
              {site.connect.map((link) => (
                <a key={link.label} href={link.href} className="text-accent hover:text-accent-hover">
                  {link.label}
                </a>
              ))}
            </div>
          </aside>
        </section>
      </main>

      <Footer copyright={site.footer.copyright} className="mt-10 sm:mt-16" />
    </Container>
  );
}
