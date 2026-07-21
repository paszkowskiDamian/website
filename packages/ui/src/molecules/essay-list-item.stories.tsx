import type { Meta, StoryObj } from "@storybook/react-vite";
import { EssayListItem } from "./essay-list-item";

const meta = {
  title: "Molecules/EssayListItem",
  component: EssayListItem,
  args: {
    index: "02",
    date: "May 12, 2025",
    title: "Designing with intent, not templates",
    excerpt: "How constraints lead to stronger, more original design solutions.",
    readTime: "6 min read",
    href: "#",
  },
} satisfies Meta<typeof EssayListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
