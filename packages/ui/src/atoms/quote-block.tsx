export interface QuoteBlockProps {
  quote: string;
  attribution?: string;
  className?: string;
}

export function QuoteBlock({ quote, attribution, className }: QuoteBlockProps) {
  return (
    <blockquote className={`flex gap-4 ${className ?? ""}`}>
      <span aria-hidden="true" className="flex-none font-serif text-[56px] leading-[0.7] text-accent">
        &ldquo;
      </span>
      <div>
        <p className="mb-2.5 text-h3 font-bold leading-tight text-ink">{quote}</p>
        {attribution ? (
          <span className="font-mono text-meta text-accent">— {attribution}</span>
        ) : null}
      </div>
    </blockquote>
  );
}
