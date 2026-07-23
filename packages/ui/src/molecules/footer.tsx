import { Logo } from "../atoms/logo";

export interface FooterProps {
  /** Copy shown after the © year, e.g. "codeberg. All rights reserved." */
  copyright: string;
  className?: string;
}

export function Footer({ copyright, className }: FooterProps) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-between gap-5 border-t-2 border-ink py-10 ${className ?? ""}`}
    >
      <Logo markClassName="h-8 w-5" />
      <span className="font-mono text-meta uppercase text-muted">
        © {new Date().getFullYear()} {copyright}
      </span>
    </footer>
  );
}
