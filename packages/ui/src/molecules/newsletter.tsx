"use client";

import { useState } from "react";
import { Button } from "../atoms/button";
import { GlyphGrid } from "../atoms/glyph-grid";

export interface NewsletterProps {
  className?: string;
  onSubscribe?: (email: string) => void;
}

export function Newsletter({ className, onSubscribe }: NewsletterProps) {
  const [message, setMessage] = useState("No spam. Unsubscribe anytime.");

  return (
    <section
      className={`flex flex-wrap items-center gap-9 border border-line p-8 ${className ?? ""}`}
    >
      <div className="hidden flex-none sm:block">
        <GlyphGrid cols={3} rows={8} />
      </div>
      <div className="min-w-[260px] flex-1">
        <h2 className="mb-2 text-h2 font-extrabold text-ink">Stay in the loop</h2>
        <p className="mb-5 max-w-[46ch] font-serif text-copy">
          Notes on new essays, projects, and experiments — straight to your inbox.
        </p>
        <form
          className="flex max-w-[460px] flex-wrap border-[1.5px] border-ink"
          onSubmit={(e) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email");
            if (typeof email === "string") onSubscribe?.(email);
            setMessage("✓ Thanks — check your inbox to confirm.");
            e.currentTarget.reset();
          }}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="min-w-[200px] flex-1 bg-transparent px-4 py-[15px] font-mono text-label text-ink outline-none placeholder:text-muted"
          />
          <Button type="submit" variant="primary">
            Subscribe
          </Button>
        </form>
        <p className="mt-3 font-mono text-meta text-muted">{message}</p>
      </div>
    </section>
  );
}
