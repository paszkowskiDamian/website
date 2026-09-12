import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactCta } from "./contact-cta";

const meta = {
  title: "Molecules/ContactCta",
  component: ContactCta,
  parameters: { layout: "fullscreen" },
  args: {
    titleLines: ["Let's build", "something"],
    text: "I take on a small number of design and build engagements each year. Tell me what you're making.",
    button: { label: "Get in touch", href: "#" },
    links: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Email", href: "#" },
    ],
  },
  render: (args) => (
    <div className="mx-auto max-w-page px-gutter py-16">
      <ContactCta {...args} />
    </div>
  ),
} satisfies Meta<typeof ContactCta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutLinks: Story = { args: { links: [] } };
