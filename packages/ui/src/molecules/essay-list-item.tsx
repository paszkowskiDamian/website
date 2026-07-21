import { ArrowLink } from "../atoms/arrow-link";

export interface EssayListItemProps {
  /** Displayed index, e.g. "01". */
  index: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
  href?: string;
  className?: string;
}

export function EssayListItem({
  index,
  date,
  title,
  excerpt,
  readTime,
  href = "#",
  className,
}: EssayListItemProps) {
  return (
    <div
      className={`flex flex-wrap items-start gap-5 border-b border-line py-6 ${className ?? ""}`}
    >
      <span className="w-16 flex-none text-h1 font-extrabold leading-none text-accent">
        {index}
      </span>
      <div className="min-w-[240px] flex-1">
        <div className="mb-1.5 font-mono text-meta uppercase text-muted">{date}</div>
        <h3 className="text-h3 font-bold leading-tight text-ink">{title}</h3>
        <p className="mt-2 max-w-[46ch] font-serif text-copy">{excerpt}</p>
      </div>
      <ArrowLink href={href} aria-label={`Read: ${title} (${readTime})`} className="flex-none">
        {readTime}
      </ArrowLink>
    </div>
  );
}
