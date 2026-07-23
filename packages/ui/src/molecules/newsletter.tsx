"use client";

import { useState } from "react";
import { Button } from "../atoms/button";
import { GlyphGrid } from "../atoms/glyph-grid";

export interface NewsletterCopy {
  heading: string;
  text: string;
  placeholder: string;
  buttonLabel: string;
  idleMessage: string;
  successMessage: string;
}

export interface NewsletterProps extends NewsletterCopy {
  className?: string;
  onSubscribe?: (email: string) => void;
}

export function Newsletter({
  heading,
  text,
  placeholder,
  buttonLabel,
  idleMessage,
  successMessage,
  className,
  onSubscribe,
}: NewsletterProps) {
  const [message, setMessage] = useState(idleMessage);

  return (
    <section
      className={`flex flex-wrap items-center gap-9 border border-line p-8 ${className ?? ""}`}
    >
      <div className="hidden flex-none sm:block">
        <GlyphGrid cols={3} rows={8} />
      </div>
      <div className="min-w-[260px] flex-1">
        <h2 className="mb-2 text-h2 font-extrabold text-ink">{heading}</h2>
        <p className="mb-5 max-w-[46ch] font-serif text-copy">{text}</p>
        <form
          className="flex max-w-[460px] flex-wrap border-[1.5px] border-ink"
          onSubmit={(e) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email");
            if (typeof email === "string") onSubscribe?.(email);
            setMessage(successMessage);
            e.currentTarget.reset();
          }}
        >
          <input
            type="email"
            name="email"
            required
            aria-label="Email address"
            placeholder={placeholder}
            className="min-w-[200px] flex-1 bg-transparent px-4 py-[15px] font-mono text-label text-ink outline-none placeholder:text-muted"
          />
          <Button type="submit" variant="primary" className="max-sm:w-full">
            {buttonLabel}
          </Button>
        </form>
        <p aria-live="polite" className="mt-3 font-mono text-meta text-muted">
          {message}
        </p>
      </div>
    </section>
  );
}
