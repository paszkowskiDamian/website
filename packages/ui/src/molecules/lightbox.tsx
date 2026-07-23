"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface LightboxPhoto {
  /** CSS aspect-ratio, e.g. "3/4" */
  ratio: string;
  /** Hint shown in the slot until a real image is dropped in. */
  placeholder?: string;
  src?: string;
  alt?: string;
  caption: string;
  meta: string;
}

export interface LightboxProps {
  photos: LightboxPhoto[];
  /** Index of the photo shown when the lightbox opens. */
  initialIndex?: number;
  onClose: () => void;
}

const navButtonClass =
  "flex h-11 w-11 flex-none cursor-pointer items-center justify-center border border-paper/30 font-mono text-lg text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink";

/**
 * Full-page photo viewer. Arrow buttons and ←/→ keys navigate (wrapping at
 * both ends), Esc / the close button / a backdrop click dismiss. While open,
 * body scroll is locked and Tab focus is trapped inside the dialog; focus
 * returns to the triggering element on close.
 */
export function Lightbox({ photos, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);

  const count = photos.length;
  const photo = photos[index];

  const showPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const showNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  // Move focus into the dialog on open; restore it to the trigger on close.
  useEffect(() => {
    const trigger = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Keyboard: arrows navigate, Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showPrev, showNext]);

  // Keep Tab focus cycling through the dialog's buttons.
  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!photo) return null;

  return (
    // Any click that bubbles up to the backdrop closes; the figure stops
    // propagation so clicking the photo or its caption keeps the dialog open.
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo lightbox — ${photo.caption}`}
      tabIndex={-1}
      onKeyDown={trapFocus}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col gap-[clamp(14px,2vw,24px)] bg-ink/95 p-[clamp(16px,3vw,40px)] text-paper outline-none"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-meta uppercase text-paper/60">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Close lightbox"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={navButtonClass}
        >
          ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-[clamp(10px,2vw,24px)]">
        <button
          type="button"
          aria-label="Previous photo"
          onClick={(e) => {
            e.stopPropagation();
            showPrev();
          }}
          className={navButtonClass}
        >
          ←
        </button>

        <figure
          onClick={(e) => e.stopPropagation()}
          className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-3"
        >
          {photo.src ? (
            <img
              src={photo.src}
              alt={photo.alt ?? ""}
              className="min-h-0 max-w-full object-contain grayscale"
            />
          ) : (
            <span
              className="flex max-h-full max-w-full items-center justify-center bg-copy p-4 text-center font-mono text-meta uppercase text-line/60"
              style={{ aspectRatio: photo.ratio, height: "min(68dvh, 640px)" }}
            >
              {photo.placeholder}
            </span>
          )}
          <figcaption
            aria-live="polite"
            className="flex w-full max-w-[640px] justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/70"
          >
            <span>{photo.caption}</span>
            <span>{photo.meta}</span>
          </figcaption>
        </figure>

        <button
          type="button"
          aria-label="Next photo"
          onClick={(e) => {
            e.stopPropagation();
            showNext();
          }}
          className={navButtonClass}
        >
          →
        </button>
      </div>
    </div>
  );
}
