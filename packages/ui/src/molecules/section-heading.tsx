import type { ReactNode } from "react";
import { ArrowLink } from "../atoms/arrow-link";

export interface SectionHeadingProps {
  children: ReactNode;
  /** Numbered kicker rendered before the title, e.g. "01". */
  index?: string;
  /** Renders a "View all" arrow-link on the right when set. */
  viewAllHref?: string;
  viewAllLabel?: string;
  /** 2px top rule above the heading. Defaults to true. */
  border?: boolean;
  className?: string;
}

/** The recurring "kicker + title (+ view all)" pattern used above every major section. */
export function SectionHeading({
  children,
  index,
  viewAllHref,
  viewAllLabel = "View all",
  border = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-4 pt-[18px] ${
        border ? "border-t-2 border-ink" : ""
      } ${className ?? ""}`}
    >
      <div className="flex items-baseline gap-4">
        {index && (
          <span className="font-mono text-label text-accent">{index}</span>
        )}
        <h2 className="text-h1 font-extrabold text-ink">{children}</h2>
      </div>
      {viewAllHref && <ArrowLink href={viewAllHref}>{viewAllLabel}</ArrowLink>}
    </div>
  );
}
