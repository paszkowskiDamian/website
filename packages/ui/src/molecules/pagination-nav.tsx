interface PaginationEntry {
  label: string;
  href: string;
}

export interface PaginationNavProps {
  prev?: PaginationEntry;
  next?: PaginationEntry;
  className?: string;
}

export function PaginationNav({ prev, next, className }: PaginationNavProps) {
  return (
    <div className={`flex flex-wrap gap-0.5 ${className ?? ""}`}>
      {prev && (
        <a
          href={prev.href}
          className="group min-w-[240px] flex-1 border border-line p-5 hover:bg-ink"
        >
          <div className="mb-2.5 font-mono text-meta uppercase text-accent">← Previous</div>
          <div className="text-base font-bold leading-tight text-ink group-hover:text-paper">
            {prev.label}
          </div>
        </a>
      )}
      {next && (
        <a
          href={next.href}
          className="group min-w-[240px] flex-1 border border-line p-5 text-right hover:bg-ink"
        >
          <div className="mb-2.5 font-mono text-meta uppercase text-accent">Next →</div>
          <div className="text-base font-bold leading-tight text-ink group-hover:text-paper">
            {next.label}
          </div>
        </a>
      )}
    </div>
  );
}
