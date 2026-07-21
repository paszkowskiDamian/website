import type { ReactNode } from "react";
import { ArrowLink } from "../atoms/arrow-link";
import { GlyphGrid } from "../atoms/glyph-grid";

export interface FeaturedEssayProps {
  kicker?: string;
  title: ReactNode;
  excerpt: string;
  readTime: string;
  href?: string;
  imageSrc: string;
  imageAlt: string;
  /** Sets this block's height — e.g. `min-h-[360px] sm:min-h-[520px]`. The component fills whatever height its container/className gives it. */
  className?: string;
}

/**
 * The red clipped panel over a full-bleed B&W photo — the homepage's
 * "featured essay" moment, echoing the faceted logo's angular cut.
 */
export function FeaturedEssay({
  kicker = "Featured essay",
  title,
  excerpt,
  readTime,
  href = "#",
  imageSrc,
  imageAlt,
  className,
}: FeaturedEssayProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className ?? ""}`}>
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      <div className="pointer-events-none absolute bottom-6 right-6 mix-blend-screen">
        <GlyphGrid
          cols={9}
          rows={5}
          baseClassName="text-paper/85"
          hotClassName="text-accent"
        />
      </div>
      <div
        className="absolute bottom-0 left-0 flex h-[82%] w-[88%] flex-col justify-between bg-accent p-7 text-white sm:w-[92%] sm:max-w-[520px] sm:p-11"
        style={{
          clipPath:
            "polygon(0 0,100% 0,100% 68%,80% 68%,80% 86%,60% 86%,60% 100%,0 100%)",
        }}
      >
        <div>
          <div className="mb-6 font-mono text-meta uppercase tracking-[0.22em] opacity-85">
            {kicker}
          </div>
          <h2 className="text-h1 font-black leading-[0.96]">{title}</h2>
          <p className="mt-6 max-w-[26ch] font-serif text-lede opacity-95">{excerpt}</p>
        </div>
        <ArrowLink href={href} variant="inverted" className="mt-8">
          {readTime}
        </ArrowLink>
      </div>
    </div>
  );
}
