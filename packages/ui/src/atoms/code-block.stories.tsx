import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./code-block";

const meta = {
  title: "Atoms/CodeBlock",
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <CodeBlock>
      <span className="text-muted">{"// one scale, no magic numbers\n"}</span>
      <span className="text-code-amber">const</span>
      {" space = {\n  xs: "}
      <span className="text-accent">4</span>
      {", sm: "}
      <span className="text-accent">8</span>
      {", md: "}
      <span className="text-accent">16</span>
      {",\n  lg: "}
      <span className="text-accent">32</span>
      {", xl: "}
      <span className="text-accent">64</span>
      {",\n};\n"}
      <span className="text-code-amber">export const</span>
      {" gap = (k) => space[k] ?? space.md;"}
    </CodeBlock>
  ),
};
