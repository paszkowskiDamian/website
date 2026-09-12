import { Fragment } from "react";
import type { ConnectLink } from "./connect-row";

export interface ContactCtaCopy {
  /** Rendered as one heading with a line break between entries. */
  titleLines: string[];
  text: string;
  button: { label: string; href: string };
}

export interface ContactCtaProps extends ContactCtaCopy {
  /** Secondary links (GitHub, LinkedIn, email) shown under the button. */
  links?: ConnectLink[];
  className?: string;
}

/**
 * The closing "get in touch" band: an accent block carrying the invitation,
 * one primary route to the contact page, and the direct channels beneath it.
 */
export function ContactCta({
  titleLines,
  text,
  button,
  links = [],
  className,
}: ContactCtaProps) {
  return (
    <section
      className={`flex flex-wrap items-center justify-between gap-[clamp(24px,4vw,48px)] bg-accent p-[clamp(28px,5vw,56px)] text-white ${className ?? ""}`}
    >
      <div className="min-w-[280px] flex-1 basis-[360px]">
        <h2 className="text-[clamp(30px,4.4vw,56px)] font-black leading-[0.98] tracking-[-0.02em]">
          {titleLines.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
        <p className="mt-5 max-w-[40ch] font-serif text-[clamp(16px,1.6vw,19px)] leading-normal opacity-95">
          {text}
        </p>
      </div>
      <div className="flex flex-none flex-col gap-3.5">
        <a
          href={button.href}
          className="inline-flex items-center gap-2.5 bg-paper px-7 py-4 font-mono text-[13px] uppercase tracking-[0.12em] text-ink hover:bg-line"
        >
          {button.label} <span aria-hidden="true">↗</span>
        </a>
        <div className="flex flex-wrap gap-5 font-mono text-xs tracking-wide">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-white hover:text-paper/80">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
