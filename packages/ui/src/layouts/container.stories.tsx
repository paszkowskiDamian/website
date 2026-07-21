import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./container";

const meta = {
  title: "Layouts/Container",
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Container>
      <div className="border border-line bg-paper py-6 text-center font-mono text-sm text-muted">
        max-w-page (1180px) · px-gutter
      </div>
    </Container>
  ),
};
