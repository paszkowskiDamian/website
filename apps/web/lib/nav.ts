import type { NavLink } from "@repo/ui/molecules/header";

export const NAV_LINKS: NavLink[] = [
  { label: "Essays", href: "/#essays" },
  { label: "Portfolio", href: "/portfolio/" },
  { label: "System", href: "/brand-system/" },
  { label: "Letter", href: "/cover-letter/" },
  { label: "Contact", href: "/portfolio/#connect", accent: true },
];
