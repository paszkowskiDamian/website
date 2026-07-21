import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "./section-heading";

const meta = {
  title: "Molecules/SectionHeading",
  component: SectionHeading,
  args: { children: "Recent Essays" },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithViewAll: Story = {
  args: { viewAllHref: "#" },
};

export const NumberedKicker: Story = {
  args: { children: "The mark", index: "01", border: false, viewAllHref: undefined },
};

export const Plain: Story = {
  args: { border: false },
};
