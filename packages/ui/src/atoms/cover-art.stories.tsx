import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoverArt } from "./cover-art";

const meta = {
  title: "Atoms/CoverArt",
  component: CoverArt,
  args: { title: "Peakfolio" },
  render: (args) => (
    <div className="w-48">
      <CoverArt {...args} />
    </div>
  ),
} satisfies Meta<typeof CoverArt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

/** Covers derive from the title (FNV-1a hash) — same title, same cover, no stored seeds. */
export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-0.5 border border-line bg-line">
      {[
        "Peakfolio",
        "Satori UI",
        "Firelight CMS",
        "Gridly",
        "Code as Folk Ornament",
        "Designing with Intent, Not Templates",
        "Building Design Systems That Scale",
        "Redux-Observable: A Practical Guide",
      ].map((title) => (
        <CoverArt key={title} title={title} />
      ))}
    </div>
  ),
};

/**
 * The three tile-pattern compositions (mid-century folk tiles + glyph
 * ornament rows), pinned via the `seed` override: mirrored full-bleed tiles,
 * tiles over a glyph band, and glyph rows framing a tile band.
 */
export const TilePatterns: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-0.5 border border-line bg-line">
      {[5, 26, 9, 25, 10, 24].map((seed) => (
        <CoverArt key={seed} title="ignored-when-seed-set" seed={seed} />
      ))}
    </div>
  ),
};

/** An explicit integer seed overrides the title hash. */
export const SeedOverride: Story = {
  args: { title: "Peakfolio", seed: 47 },
};
