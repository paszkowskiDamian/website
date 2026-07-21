import type { ReactNode } from "react";

export interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

/** A dark code panel. Mark up keywords/strings in `children` with `text-code-amber` or `text-accent` for the source's two-tone highlighting. */
export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={`overflow-x-auto rounded-xs bg-ink p-5 font-mono text-[13px] leading-[1.6] text-paper ${className ?? ""}`}
    >
      {children}
    </pre>
  );
}
