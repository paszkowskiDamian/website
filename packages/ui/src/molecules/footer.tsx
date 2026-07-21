import { Logo } from "../atoms/logo";

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-between gap-5 border-t-2 border-ink py-10 ${className ?? ""}`}
    >
      <Logo markClassName="h-8 w-5" />
      <span className="font-mono text-meta uppercase text-muted">
        © {new Date().getFullYear()} codeberg. All rights reserved.
      </span>
    </footer>
  );
}
