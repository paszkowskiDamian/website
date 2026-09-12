"use client";

import { useState } from "react";
import { MockupFrame } from "../atoms/mockup-frame";
import { Lightbox, type LightboxPhoto } from "./lightbox";

export interface Figure extends LightboxPhoto {
  /** Window title; set it to show the figure inside a {@link MockupFrame}. */
  frame?: string;
}

export interface FigureGridProps {
  figures: Figure[];
  /** Dark chapters sit on ink, so the empty slots and captions invert. */
  dark?: boolean;
  className?: string;
}

/**
 * Numbered figure strip for a project chapter — a responsive grid of equal
 * columns, each figure clickable into the shared {@link Lightbox} so a
 * screenshot can be read at full size. Sibling of {@link PhotoGallery}, which
 * uses masonry columns for photographs; this one keeps figures in document
 * order because the captions number them.
 */
export function FigureGrid({ figures, dark = false, className }: FigureGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div
        className={`grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-[clamp(12px,1.6vw,20px)] ${className ?? ""}`}
      >
        {figures.map((figure, i) => {
          const slot = (
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`View “${figure.caption}” in lightbox`}
              onClick={() => setOpenIndex(i)}
              className={`relative block w-full cursor-zoom-in overflow-hidden ${dark ? "bg-copy" : "bg-[#E7E3DA]"}`}
              style={{ aspectRatio: figure.ratio }}
            >
              {figure.src ? (
                <img
                  src={figure.src}
                  alt={figure.alt ?? ""}
                  className={`absolute inset-0 h-full w-full object-cover ${figure.color ? "" : "grayscale"}`}
                />
              ) : (
                <span
                  className={`absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-meta uppercase ${dark ? "text-line/60" : "text-muted"}`}
                >
                  {figure.placeholder}
                </span>
              )}
            </button>
          );
          return (
            <figure key={figure.caption}>
              {figure.frame ? (
                <MockupFrame label={figure.frame} dark={dark}>
                  {slot}
                </MockupFrame>
              ) : (
                slot
              )}
              <figcaption
                className={`mt-2 flex justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] ${dark ? "text-[#8A8A85]" : "text-muted"}`}
              >
                <span>{figure.caption}</span>
                <span className={dark ? "text-line/70" : "text-accent"}>{figure.meta}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {openIndex !== null && (
        <Lightbox
          photos={figures}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
