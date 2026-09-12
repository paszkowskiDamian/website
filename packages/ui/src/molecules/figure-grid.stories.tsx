import type { Meta, StoryObj } from "@storybook/react-vite";
import { FigureGrid } from "./figure-grid";

const FIGURES = [
  {
    ratio: "16/10",
    caption: "Draw the section; it revolves a solid",
    meta: "01 Profile",
    placeholder: "Product screenshot",
  },
  {
    ratio: "16/10",
    caption: "Ornament generated on device from a prompt",
    meta: "02 Relief",
    placeholder: "Product screenshot",
  },
  {
    ratio: "4/3",
    caption: "A photograph in the same strip, kept grayscale",
    meta: "03 On site",
    src: "/mountain-hero.jpg",
    alt: "A mountain peak breaking through cloud cover",
  },
];

const meta = {
  title: "Molecules/FigureGrid",
  component: FigureGrid,
  args: { figures: FIGURES },
} satisfies Meta<typeof FigureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnInk: Story = {
  render: () => (
    <div className="bg-ink p-8">
      <FigureGrid figures={FIGURES} dark />
    </div>
  ),
};
