import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo, Mark } from "./logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lockup: Story = {};

export const MarkOnly: Story = {
  args: { wordmark: false },
};

export const OnBlack: Story = {
  render: () => (
    <div className="inline-flex bg-ink p-6">
      <Logo color="#F6F3ED" className="text-paper" />
    </div>
  ),
};

export const IconTile: Story = {
  render: () => (
    <div className="flex h-24 w-24 items-center justify-center bg-accent">
      <Mark color="#fff" className="h-14 w-10" />
    </div>
  ),
};
