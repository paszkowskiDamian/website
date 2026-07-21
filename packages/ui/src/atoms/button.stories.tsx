import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Subscribe" },
  argTypes: {
    variant: { control: "radio", options: ["primary", "outline"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Read essay" },
};

export const Both: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary">Subscribe</Button>
      <Button variant="outline">Read essay</Button>
    </div>
  ),
};
