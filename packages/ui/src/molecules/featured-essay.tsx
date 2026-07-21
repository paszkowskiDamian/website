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
  /** How far the photo bleeds up past the top of the band, into the section
   * above (the design lets it run under the hero). */
  bleedClassName?: string;
  className?: string;
}

/**
 * The homepage's "featured essay" band, straight from the design handoff:
 * a full-width B&W photo behind, bleeding upward into the hero above, with
 * the stepped red panel on the left echoing the faceted logo, and a glyph
 * field burned into the photo's bottom-right corner.
 */
export function FeaturedEssay({
  kicker = "Featured essay",
  title,
  excerpt,
  readTime,
  href = "#",
  imageSrc,
  imageAlt,
  bleedClassName = "top-[clamp(-96px,-9vw,-56px)]",
  className,
}: FeaturedEssayProps) {
  return (
    <div className={`relative min-h-[clamp(380px,46vw,500px)] ${className ?? ""}`}>
      {/* Full-bleed photo behind, extending above the band */}
      <div className={`absolute inset-x-0 bottom-0 ${bleedClassName}`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover grayscale"
        />
        <div className="pointer-events-none absolute bottom-[clamp(14px,3vw,34px)] right-[clamp(16px,3vw,44px)] mix-blend-screen">
          <GlyphGrid
            cols={11}
            rows={4}
            baseClassName="text-paper/85"
            hotClassName="text-accent"
          />
        </div>
      </div>

      {/* Stepped red panel */}
      <div
        className="relative z-10 flex min-h-[clamp(380px,46vw,500px)] w-[clamp(280px,56%,600px)] flex-col justify-between bg-accent p-[clamp(28px,4vw,44px)] text-white"
        style={{
          clipPath:
            "polygon(0 0,100% 0,100% 56%,80% 56%,80% 80%,60% 80%,60% 100%,0 100%)",
        }}
      >
        <div>
          <div className="mb-[clamp(20px,4vw,34px)] font-mono text-meta uppercase tracking-[0.22em] opacity-85">
            {kicker}
          </div>
          <h2 className="text-[clamp(34px,5vw,62px)] font-black leading-[0.96] tracking-[-0.02em]">
            {title}
          </h2>
          <p className="mt-[clamp(18px,2.5vw,26px)] max-w-[34ch] font-serif text-[clamp(15px,1.4vw,17px)] leading-normal opacity-95">
            {excerpt}
          </p>
        </div>
        <ArrowLink href={href} variant="inverted" className="mt-8">
          {readTime}
        </ArrowLink>
      </div>
    </div>
  );
}
