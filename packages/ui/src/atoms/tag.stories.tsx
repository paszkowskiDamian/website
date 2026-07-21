import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./tag";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  args: { children: "Design systems" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>Redux</Tag>
      <Tag>RxJS</Tag>
      <Tag>React</Tag>
    </div>
  ),
};
