import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectCard } from "./project-card";

const meta = {
  title: "Molecules/ProjectCard",
  component: ProjectCard,
  args: {
    seed: 11,
    title: "Peakfolio",
    description: "A minimal portfolio starter for developers.",
  },
  render: (args) => (
    <div className="w-56">
      <ProjectCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
