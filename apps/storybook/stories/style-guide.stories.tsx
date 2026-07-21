import type { Meta, StoryObj } from "@storybook/react-vite";

const SWATCHES = [
  { name: "paper", hex: "#F6F3ED", usage: "Background", bordered: true, bg: "bg-paper", text: "text-ink" },
  { name: "accent", hex: "#C52B34", usage: "Accent / brand red", bg: "bg-accent", text: "text-white" },
  { name: "accent-hover", hex: "#9C1F27", usage: "Accent hover state", bg: "bg-accent-hover", text: "text-white" },
  { name: "ink", hex: "#111111", usage: "Type / blocks / knockout bg", bg: "bg-ink", text: "text-paper" },
  { name: "copy", hex: "#2A2A2A", usage: "Body copy ink", bg: "bg-copy", text: "text-paper" },
  { name: "line", hex: "#D9D9D6", usage: "Panels / rules / borders", bg: "bg-line", text: "text-ink" },
  { name: "muted", hex: "#6F6F6A", usage: "Metadata / secondary text", bordered: true, bg: "bg-paper", text: "text-muted" },
  { name: "code-amber", hex: "#E8A04A", usage: "Code block keyword highlight", bg: "bg-code-amber", text: "text-ink" },
];

const TYPE_SCALE = [
  { token: "text-hero", role: "Homepage hero", weight: "font-black (900)", className: "text-hero font-black leading-[0.86] tracking-[-0.02em]", sample: "ideas" },
  { token: "text-display", role: "Cover / essay headline", weight: "font-black (900)", className: "text-display font-black leading-none tracking-[-0.02em]", sample: "Building digital folklore." },
  { token: "text-h1", role: "Section headline", weight: "font-extrabold (800)", className: "text-h1 font-extrabold tracking-[-0.02em]", sample: "Designing with intent" },
  { token: "text-h2", role: "Sub-section headline", weight: "font-bold (700)", className: "text-h2 font-bold tracking-[-0.01em]", sample: "Building systems that scale" },
  { token: "text-h3", role: "In-body headline", weight: "font-bold (700)", className: "text-h3 font-bold tracking-[-0.01em]", sample: "Constraints are a design tool" },
  { token: "text-lede", role: "Intro / lede paragraphs", weight: "font-serif, regular", className: "font-serif text-lede text-copy", sample: "Good design isn't decoration — it's decision-making." },
  { token: "text-body", role: "Baseline body copy", weight: "font-serif, regular", className: "font-serif text-body text-copy", sample: "Good design isn't decoration — it's decision-making." },
  { token: "text-label", role: "Buttons, tags, nav", weight: "font-mono, uppercase", className: "font-mono text-label uppercase text-accent", sample: "Featured essay" },
  { token: "text-meta", role: "Dates, byline, metadata", weight: "font-mono, uppercase", className: "font-mono text-meta uppercase text-muted", sample: "May 12, 2025 · 6 min read" },
];

const SPACING = [
  { token: "max-w-page", value: "1180px", usage: "Page content max-width" },
  { token: "px-gutter", value: "clamp(1.25rem, 5vw, 4rem)", usage: "Page horizontal padding (20–64px)" },
  { token: "py-section", value: "clamp(3.5rem, 8vw, 6.875rem)", usage: "Major section vertical rhythm (56–110px)" },
  { token: "py-section-sm", value: "clamp(2.75rem, 6vw, 5rem)", usage: "Minor section vertical rhythm (44–80px)" },
];

const RADII = [
  { token: "rounded-none", value: "0px", usage: "Default — the system is sharp-edged" },
  { token: "rounded-xs", value: "2px", usage: "Code blocks only" },
  { token: "rounded-full", value: "9999px", usage: "Pills (Tag) and circles (avatars, dots)" },
];

function StyleGuide() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 p-8 text-ink">
      <div>
        <h1 className="mb-2 text-h1 font-extrabold tracking-[-0.02em]">Design tokens</h1>
        <p className="max-w-[60ch] font-serif text-lede text-copy">
          Reference for the codeberg design system, encoded as Tailwind theme
          tokens in <code className="font-mono text-sm">packages/ui/src/styles.css</code>.
          See the &ldquo;Brand System&rdquo; page in the web app for the full
          narrative version of this doc.
        </p>
      </div>

      <section>
        <h2 className="mb-6 text-h2 font-bold tracking-[-0.01em]">Color</h2>
        <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-4">
          {SWATCHES.map((s) => (
            <div
              key={s.name}
              className={`flex aspect-[1/1.15] flex-col justify-end p-4 ${s.bg} ${s.text} ${
                s.bordered ? "border border-line" : ""
              }`}
            >
              <span className="font-mono text-sm font-bold">{s.name}</span>
              <span className="mt-1 font-mono text-xs opacity-80">{s.hex}</span>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] opacity-80">
                {s.usage}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-h2 font-bold tracking-[-0.01em]">Type scale</h2>
        <div className="border-t border-line">
          {TYPE_SCALE.map((row) => (
            <div
              key={row.token}
              className="flex flex-wrap items-baseline gap-4 border-b border-line py-5"
            >
              <div className="w-36 flex-none">
                <div className="font-mono text-xs text-accent">{row.token}</div>
                <div className="font-mono text-[11px] text-muted">{row.role}</div>
              </div>
              <span className={row.className}>{row.sample}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-h2 font-bold tracking-[-0.01em]">Layout &amp; spacing</h2>
        <div className="border-t border-line">
          {SPACING.map((row) => (
            <div key={row.token} className="flex flex-wrap gap-4 border-b border-line py-4">
              <span className="w-32 flex-none font-mono text-sm text-accent">{row.token}</span>
              <span className="w-56 flex-none font-mono text-sm text-muted">{row.value}</span>
              <span className="font-serif text-copy">{row.usage}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-h2 font-bold tracking-[-0.01em]">Radii</h2>
        <div className="border-t border-line">
          {RADII.map((row) => (
            <div key={row.token} className="flex flex-wrap items-center gap-4 border-b border-line py-4">
              <div
                className={`h-10 w-10 flex-none border-2 border-ink ${row.token}`}
                aria-hidden="true"
              />
              <span className="w-28 flex-none font-mono text-sm text-accent">{row.token}</span>
              <span className="w-16 flex-none font-mono text-sm text-muted">{row.value}</span>
              <span className="font-serif text-copy">{row.usage}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Style Guide/Design Tokens",
  component: StyleGuide,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StyleGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
