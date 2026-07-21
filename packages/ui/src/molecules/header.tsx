"use client";

import { useState } from "react";
import { Logo } from "../atoms/logo";

export interface NavLink {
  label: string;
  href: string;
  accent?: boolean;
}

export interface HeaderProps {
  links: NavLink[];
  homeHref?: string;
  className?: string;
}

export function Header({ links, homeHref = "/", className }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`relative flex items-center justify-between py-[26px] ${className ?? ""}`}>
      <a href={homeHref} aria-label="codeberg home">
        <Logo />
      </a>

      <nav className="hidden items-center gap-8 sm:flex">
        {links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            className={`font-mono text-label uppercase ${link.accent ? "text-accent" : "text-ink"}`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col gap-1.5 sm:hidden"
      >
        <span className="h-[1.5px] w-6 bg-ink" />
        <span className="h-[1.5px] w-6 bg-ink" />
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-10 flex flex-col gap-1 border-t-2 border-ink bg-paper py-4 sm:hidden">
          {links.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className={`px-1 py-2 font-mono text-label uppercase ${link.accent ? "text-accent" : "text-ink"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
