import type { Meta, StoryObj } from "@storybook/react-vite";
import { MockupFrame } from "./mockup-frame";

const Screen = () => (
  <div className="flex aspect-[16/10] items-center justify-center bg-[#E7E3DA] font-mono text-meta uppercase text-muted">
    Product screenshot
  </div>
);

const meta = {
  title: "Atoms/MockupFrame",
  component: MockupFrame,
  args: { label: "FORM · Unwrapped surface", children: <Screen /> },
} satisfies Meta<typeof MockupFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPaper: Story = {};

export const OnInk: Story = {
  render: () => (
    <div className="bg-ink p-8">
      <MockupFrame label="FORM · Unwrapped surface" dark>
        <Screen />
      </MockupFrame>
    </div>
  ),
};
