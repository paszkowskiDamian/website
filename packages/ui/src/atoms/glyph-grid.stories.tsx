import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlyphGrid } from "./glyph-grid";

const meta = {
  title: "Atoms/GlyphGrid",
  component: GlyphGrid,
  args: { cols: 9, rows: 5 },
} satisfies Meta<typeof GlyphGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Field: Story = {};

export const VerticalRail: Story = {
  args: { cols: 2, rows: 14 },
};

export const Strip: Story = {
  args: { cols: 40, rows: 1 },
};

export const Static: Story = {
  args: { cols: 9, rows: 5, interval: 0 },
};

export const OnPhoto: Story = {
  args: {
    cols: 9,
    rows: 5,
    baseClassName: "text-paper/85",
    hotClassName: "text-accent",
  },
  render: (args) => (
    <div className="bg-ink p-8">
      <GlyphGrid {...args} />
    </div>
  ),
};
