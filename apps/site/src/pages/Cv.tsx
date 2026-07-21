import { Link } from "react-router-dom";
import { Logo } from "@repo/ui/atoms/logo";
import { Tag } from "@repo/ui/atoms/tag";
import { useDocumentTitle } from "../useDocumentTitle";

const EXPERIENCE = [
  {
    role: "Founder & Principal Designer",
    dates: "2021 — Now",
    org: "codeberg — Studio",
    bullets: [
      "Designed and shipped brand systems and product UIs for 20+ studios and startups.",
      "Built a reusable component library and design-token pipeline adopted across client teams.",
    ],
  },
  {
    role: "Senior Product Designer",
    dates: "2017 — 2021",
    org: "Satori — Berlin",
    bullets: [
      "Led the design system that unified five product lines under one visual language.",
      "Partnered with engineering to ship an accessible React component kit.",
    ],
  },
  {
    role: "Front-End Developer",
    dates: "2014 — 2017",
    org: "Firelight — Remote",
    bullets: [
      "Built editorial and CMS front-ends for content-focused publishers.",
      "Introduced a testing and performance culture that cut load times in half.",
    ],
  },
];

const SKILLS = ["Design Systems", "React", "TypeScript", "Typography", "Figma", "Motion"];

function SidebarLabel({ children }: { children: string }) {
  return (
    <h2 className="mb-3.5 border-b border-line pb-2 font-mono text-meta uppercase tracking-[0.2em] text-accent">
      {children}
    </h2>
  );
}

export default function Cv() {
  useDocumentTitle("CV — Alex Berg — codeberg");

  return (
    <div className="min-h-screen bg-[#8a8780] py-10 sm:py-16">
      <div className="mx-auto mb-6 max-w-[880px] px-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <Logo />
        </Link>
      </div>

      <div className="mx-auto max-w-[880px] bg-paper p-8 text-ink sm:p-14">
        {/* MASTHEAD */}
        <header className="flex items-start justify-between gap-6 border-b-2 border-ink pb-5">
          <div>
            <h1 className="text-h1 font-black leading-[0.92] tracking-[-0.02em] text-ink">
              Alex Berg
            </h1>
            <div className="mt-2.5 font-mono text-meta uppercase tracking-[0.18em] text-accent">
              Designer &amp; Front-End Developer
            </div>
          </div>
          <Logo wordmark={false} markClassName="h-[50px] w-9" />
        </header>

        {/* CONTACT ROW */}
        <div className="my-4 flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-xs tracking-wide text-copy">
          <span>alex@codeberg.dev</span>
          <span>codeberg.dev</span>
          <span>github.com/codeberg</span>
          <span>Berlin, DE</span>
        </div>

        {/* SUMMARY */}
        <p className="mb-7 max-w-[66ch] font-serif text-sm leading-relaxed text-copy">
          Designer-developer building codeberg — a one-person studio working
          where code, design, and culture meet. Ten years shipping design
          systems, front-end architecture, and editorial products with an eye
          for constraint, craft, and typographic detail.
        </p>

        {/* BODY GRID */}
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-[1.9fr_1fr]">
          {/* EXPERIENCE */}
          <div>
            <SidebarLabel>Experience</SidebarLabel>
            {EXPERIENCE.map((job) => (
              <div key={job.role} className="mb-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="text-base font-bold text-ink">{job.role}</span>
                  <span className="flex-none font-mono text-[10px] text-muted">{job.dates}</span>
                </div>
                <div className="mt-1 mb-2 font-mono text-xs text-accent">{job.org}</div>
                <ul className="m-0 list-disc space-y-1 pl-4 font-serif text-[13.5px] leading-relaxed text-copy">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* SIDEBAR */}
          <div>
            <SidebarLabel>Skills</SidebarLabel>
            <div className="mb-6 flex flex-wrap gap-1.5">
              {SKILLS.map((skill) => (
                <Tag key={skill} className="px-2.5 py-1 text-[10.5px]">
                  {skill}
                </Tag>
              ))}
            </div>

            <SidebarLabel>Education</SidebarLabel>
            <div className="mb-6">
              <div className="text-sm font-bold leading-tight text-ink">BA, Communication Design</div>
              <div className="mt-1 font-mono text-[10.5px] text-muted">UdK Berlin · 2010—2014</div>
            </div>

            <SidebarLabel>Recognition</SidebarLabel>
            <ul className="m-0 list-disc space-y-1 pl-4 font-serif text-[13px] leading-relaxed text-copy">
              <li>Awwwards — Site of the Day, 2023</li>
              <li>CSS Design Awards, 2022</li>
            </ul>
          </div>
        </div>

        {/* RUNNING FOOTER */}
        <div className="mt-10 flex items-center justify-between border-t border-line pt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          <span>Alex Berg — Curriculum Vitae</span>
          <span>alex@codeberg.dev</span>
        </div>
      </div>
    </div>
  );
}
