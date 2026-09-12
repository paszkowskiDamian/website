import type { ReactNode } from "react";

export interface MockupFrameProps {
  /** Window title, set in mono caps. Keep it short — it truncates. */
  label: string;
  /** Frame sitting on the ink band rather than on paper. */
  dark?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Window chrome around a product screenshot, so a screen reads as a mockup
 * rather than as a loose image. Hard edges and a mono title bar — no rounded
 * corners or gloss; the frame is a brand element, not a device impression.
 */
export function MockupFrame({ label, dark = false, className, children }: MockupFrameProps) {
  return (
    <div
      className={`${dark ? "border border-[#3A3A38] bg-copy" : "border-2 border-ink bg-[#E7E3DA]"} ${className ?? ""}`}
    >
      <div
        className={`flex items-center gap-[14px] px-3 py-2 ${
          dark ? "border-b border-[#3A3A38] bg-[#1C1C1B] text-line" : "bg-ink text-paper"
        }`}
      >
        <span aria-hidden="true" className="flex flex-none gap-[5px]">
          <span className={`h-[6px] w-[6px] ${dark ? "bg-line/35" : "bg-paper/40"}`} />
          <span className={`h-[6px] w-[6px] ${dark ? "bg-line/35" : "bg-paper/40"}`} />
          <span className={`h-[6px] w-[6px] ${dark ? "bg-line/35" : "bg-paper/40"}`} />
        </span>
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
