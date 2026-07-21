"use client";

import { useEffect, useRef, useState } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`relative flex items-center justify-between py-[26px] ${className ?? ""}`}>
      <a href={homeHref} aria-label="codeberg home">
        <Logo />
      </a>

      {/* Desktop nav */}
      <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
        {links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            className={`font-mono text-label uppercase ${link.accent ? "text-accent" : "text-ink"} hover:text-accent-hover`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile toggle: two bars that morph into an × */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
        className="-m-3 flex flex-col items-center justify-center gap-1.5 p-3 sm:hidden"
      >
        <span
          aria-hidden="true"
          className={`h-[1.5px] w-6 bg-ink transition-transform duration-300 motion-reduce:transition-none ${
            open ? "translate-y-[3.75px] rotate-45" : ""
          }`}
        />
        <span
          aria-hidden="true"
          className={`h-[1.5px] w-6 bg-ink transition-transform duration-300 motion-reduce:transition-none ${
            open ? "translate-y-[-3.75px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile nav — stays mounted so both open and close animate. The
          grid-rows 0fr→1fr transition slides the panel; links fade/settle
          with a small stagger. `inert` removes the closed menu from the
          focus order and accessibility tree. */}
      <nav
        id="mobile-nav"
        aria-label="Main"
        inert={!open}
        className={`absolute inset-x-0 top-full z-20 grid overflow-hidden bg-paper transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none sm:hidden ${
          open
            ? "grid-rows-[1fr] border-b border-t-2 border-b-line border-t-ink"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="flex flex-col py-3">
            {links.map((link, i) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                  className={`block px-1 py-3 font-mono text-label uppercase transition-[opacity,translate] duration-300 motion-reduce:transition-none motion-reduce:translate-y-0 ${
                    link.accent ? "text-accent" : "text-ink"
                  } ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
