"use client";

import { useState } from "react";
import { Button } from "@repo/ui/atoms/button";
import type { ContactFormCopy } from "../../lib/content";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
// Public by design: a Web3Forms access key only routes submissions to the
// verified inbox, so inlining it into the static bundle is fine.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full border-[1.5px] border-ink bg-transparent px-4 py-[13px] font-mono text-label text-ink outline-none placeholder:text-muted focus:border-accent";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mono text-meta uppercase tracking-[0.16em] text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [status, setStatus] = useState<Status>("idle");

  const message =
    status === "success"
      ? copy.successMessage
      : status === "error"
        ? copy.errorMessage
        : copy.idleMessage;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: ACCESS_KEY, ...data }),
      });
      if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot — Web3Forms drops submissions where this is filled in. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <Field label={copy.nameLabel} htmlFor="contact-name">
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          placeholder={copy.namePlaceholder}
          className={fieldClass}
        />
      </Field>
      <Field label={copy.emailLabel} htmlFor="contact-email">
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          placeholder={copy.emailPlaceholder}
          className={fieldClass}
        />
      </Field>
      <Field label={copy.messageLabel} htmlFor="contact-message">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={7}
          placeholder={copy.messagePlaceholder}
          className={`${fieldClass} resize-y`}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? copy.sendingLabel : copy.submitLabel}
        </Button>
        <p aria-live="polite" className="font-mono text-meta text-muted">
          {message}
        </p>
      </div>
    </form>
  );
}
