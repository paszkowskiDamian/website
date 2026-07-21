import type { AnchorHTMLAttributes } from "react";

type ArrowLinkVariant = "accent" | "inverted";

export interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** "accent" (default) for the standard red mono link; "inverted" for white text over dark/accent backgrounds. */
  variant?: ArrowLinkVariant;
}

const variants: Record<ArrowLinkVariant, string> = {
  accent: "text-accent hover:text-accent-hover",
  inverted: "text-white hover:text-white/80",
};

export function ArrowLink({
  variant = "accent",
  className,
  children,
  ...props
}: ArrowLinkProps) {
  return (
    <a
      className={`inline-flex items-center gap-2 font-mono text-label uppercase ${variants[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
