import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConnectRow } from "./connect-row";

const meta = {
  title: "Molecules/ConnectRow",
  component: ConnectRow,
} satisfies Meta<typeof ConnectRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
