import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./header";

const NAV_LINKS = [
  { label: "Essays", href: "#" },
  { label: "Projects", href: "#" },
  { label: "System", href: "#" },
  { label: "Contact", href: "#", accent: true },
];

const meta = {
  title: "Molecules/Header",
  component: Header,
  args: { links: NAV_LINKS },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="mx-auto max-w-page px-gutter">
      <Header {...args} />
    </div>
  ),
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
