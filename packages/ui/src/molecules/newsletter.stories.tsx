import type { Meta, StoryObj } from "@storybook/react-vite";
import { Newsletter } from "./newsletter";

const meta = {
  title: "Molecules/Newsletter",
  component: Newsletter,
  args: {
    heading: "Stay in the loop",
    text: "Notes on new essays, projects, and experiments — straight to your inbox.",
    placeholder: "Your email address",
    buttonLabel: "Subscribe",
    idleMessage: "No spam. Unsubscribe anytime.",
    successMessage: "✓ Thanks — check your inbox to confirm.",
  },
} satisfies Meta<typeof Newsletter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
