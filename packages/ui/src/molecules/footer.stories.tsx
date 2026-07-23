import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta = {
  title: "Molecules/Footer",
  component: Footer,
  args: { copyright: "codeberg. All rights reserved." },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="mx-auto max-w-page px-gutter">
      <Footer {...args} />
    </div>
  ),
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
