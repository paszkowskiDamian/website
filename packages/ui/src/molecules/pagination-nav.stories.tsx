import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationNav } from "./pagination-nav";

const meta = {
  title: "Molecules/PaginationNav",
  component: PaginationNav,
  args: {
    prev: { label: "Designing with intent", href: "#" },
    next: { label: "Building systems that scale", href: "#" },
  },
} satisfies Meta<typeof PaginationNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
