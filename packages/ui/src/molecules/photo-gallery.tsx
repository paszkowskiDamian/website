"use client";

import { useState } from "react";
import { Lightbox, type LightboxPhoto } from "./lightbox";

export type GalleryPhoto = LightboxPhoto;

export interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  className?: string;
}

/**
 * Masonry-column photo grid. Each photo is a button that opens the
 * {@link Lightbox} at that image; captions/meta stay outside the button so
 * the grid reads exactly like the original static figures.
 */
export function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div
        className={`columns-[clamp(180px,26vw,300px)] gap-[clamp(12px,1.8vw,20px)] ${className ?? ""}`}
      >
        {photos.map((photo, i) => (
          <figure key={photo.caption} className="mb-[clamp(12px,1.8vw,20px)] break-inside-avoid">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`View “${photo.caption}” in lightbox`}
              onClick={() => setOpenIndex(i)}
              className="relative block w-full cursor-zoom-in overflow-hidden bg-[#E7E3DA]"
              style={{ aspectRatio: photo.ratio }}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt ?? ""}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-meta uppercase text-muted">
                  {photo.placeholder}
                </span>
              )}
            </button>
            <figcaption className="mt-2 flex justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              <span>{photo.caption}</span>
              <span>{photo.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
