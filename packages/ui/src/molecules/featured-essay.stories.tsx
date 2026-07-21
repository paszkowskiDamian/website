import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturedEssay } from "./featured-essay";

const meta = {
  title: "Molecules/FeaturedEssay",
  component: FeaturedEssay,
  parameters: { layout: "fullscreen" },
  args: {
    title: (
      <>
        Code as
        <br />
        folk ornament
      </>
    ),
    excerpt: "On treating loops, glyphs, and grids as the embroidery of the modern web.",
    readTime: "8 min read",
    href: "#",
    imageSrc: "/mountain-hero.jpg",
    imageAlt: "A mountain peak breaking through cloud cover",
  },
  render: (args) => (
    <div className="mx-auto max-w-page px-gutter pt-32">
      <FeaturedEssay {...args} />
    </div>
  ),
} satisfies Meta<typeof FeaturedEssay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
