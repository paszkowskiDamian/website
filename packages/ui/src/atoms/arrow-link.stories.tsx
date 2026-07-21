import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLink } from "./arrow-link";

const meta = {
  title: "Atoms/ArrowLink",
  component: ArrowLink,
  args: { children: "About codeberg", href: "#" },
  argTypes: {
    variant: { control: "radio", options: ["accent", "inverted"] },
  },
} satisfies Meta<typeof ArrowLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {};

export const Inverted: Story = {
  args: { variant: "inverted" },
  render: (args) => (
    <div className="bg-ink p-8">
      <ArrowLink {...args} />
    </div>
  ),
};
