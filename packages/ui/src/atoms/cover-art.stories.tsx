import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoverArt } from "./cover-art";

const meta = {
  title: "Atoms/CoverArt",
  component: CoverArt,
  args: { seed: 11 },
  render: (args) => (
    <div className="w-48">
      <CoverArt {...args} />
    </div>
  ),
} satisfies Meta<typeof CoverArt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-0.5 border border-line bg-line">
      {[11, 29, 47, 83, 7, 137, 244, 381].map((seed) => (
        <CoverArt key={seed} seed={seed} />
      ))}
    </div>
  ),
};
