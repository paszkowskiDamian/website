import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuoteBlock } from "./quote-block";

const meta = {
  title: "Atoms/QuoteBlock",
  component: QuoteBlock,
  args: {
    quote: "Simplicity is the ultimate sophistication.",
    attribution: "Leonardo da Vinci",
  },
} satisfies Meta<typeof QuoteBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
