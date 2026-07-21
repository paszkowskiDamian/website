import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@repo/ui/atoms/logo";

export const metadata: Metadata = {
  title: "Cover Letter — Alex Berg — codeberg",
  description: "Cover letter from Alex Berg, designer & front-end developer.",
};

export default function CoverLetter() {
  return (
    <div className="min-h-screen bg-[#8a8780] py-10 sm:py-16">
      <div className="mx-auto mb-6 max-w-[880px] px-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo />
        </Link>
      </div>

      <main id="main" className="mx-auto max-w-[880px] bg-paper p-8 text-ink sm:p-16">
        {/* LETTERHEAD */}
        <header className="mb-9 flex items-center justify-between gap-6 border-b-2 border-ink pb-[18px]">
          <div className="flex items-center gap-3.5">
            <Logo wordmark={false} markClassName="h-10 w-7" />
            <div>
              <div className="text-lg font-extrabold leading-none tracking-[-0.01em] text-ink">
                Alex Berg
              </div>
              <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                Designer &amp; Front-End Developer
              </div>
            </div>
          </div>
          <div className="text-right font-mono text-[10.5px] leading-[1.7] text-copy">
            <div>alex@codeberg.dev</div>
            <div>codeberg.dev</div>
            <div>Berlin, DE</div>
          </div>
        </header>

        {/* DATE + RECIPIENT */}
        <div className="mb-6 font-mono text-xs text-muted">May 12, 2025</div>
        <div className="mb-7 leading-relaxed">
          <div className="text-sm font-bold text-ink">Hiring Team</div>
          <div className="font-serif text-sm text-copy">Satori Labs</div>
          <div className="font-serif text-sm text-copy">Prenzlauer Allee 42, Berlin</div>
        </div>

        {/* BODY */}
        <div className="space-y-4 font-serif text-[15.5px] leading-[1.7] text-[#1a1a1a]">
          <p>Dear Hiring Team,</p>
          <p>
            I&apos;m writing to express my interest in the Senior Product
            Designer role at Satori Labs. Over the past decade I&apos;ve built
            a practice at the intersection of design and code — the exact
            overlap your posting describes — and I&apos;ve followed
            Satori&apos;s work on systematic, content-first products with
            genuine admiration.
          </p>
          <p>
            At codeberg, the studio I founded, I design brand systems and ship
            the front-ends that carry them. I care less about adding features
            than about removing the ones that don&apos;t earn their place —
            constraint, in my experience, is what makes a product feel
            considered rather than assembled. That belief has shaped design
            systems now used across dozens of teams.
          </p>
          <p>
            What draws me to Satori specifically is the discipline of your
            editorial tools: the sense that every typographic and interaction
            decision was made once, deliberately, and then trusted. I&apos;d
            relish the chance to help extend that system and mentor the team
            building on top of it.
          </p>
          <p>
            Thank you for your time and consideration. I&apos;ve attached my
            CV and a selection of recent work, and I&apos;d welcome the
            opportunity to talk further.
          </p>
        </div>

        {/* SIGN-OFF */}
        <div className="mt-6">
          <div className="mb-2.5 font-serif text-[15.5px] text-[#1a1a1a]">Warm regards,</div>
          <div className="text-lg font-extrabold tracking-[-0.01em] text-ink">Alex Berg</div>
          <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
            codeberg — Studio
          </div>
        </div>

        {/* RUNNING FOOTER */}
        <div className="mt-12 flex items-center justify-between border-t border-line pt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          <span>Alex Berg</span>
          <span>alex@codeberg.dev</span>
        </div>
      </main>
    </div>
  );
}
