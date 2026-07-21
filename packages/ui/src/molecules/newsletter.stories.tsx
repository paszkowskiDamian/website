import type { Meta, StoryObj } from "@storybook/react-vite";
import { Newsletter } from "./newsletter";

const meta = {
  title: "Molecules/Newsletter",
  component: Newsletter,
} satisfies Meta<typeof Newsletter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
