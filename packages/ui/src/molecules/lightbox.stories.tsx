import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Lightbox, type LightboxProps } from "./lightbox";

const PHOTOS = [
  {
    ratio: "3/4",
    caption: "Dolomites",
    meta: "35mm",
    placeholder: "Portrait photo",
  },
  {
    ratio: "4/3",
    caption: "Coastline",
    meta: "Digital",
    src: "/mountain-hero.jpg",
    alt: "A mountain peak breaking through cloud cover",
  },
  {
    ratio: "1/1",
    caption: "Concrete study",
    meta: "35mm",
    placeholder: "Square photo",
  },
];

/** Story-only wrapper: a trigger button so open/close (and focus restore) can be exercised. */
function LightboxDemo(args: LightboxProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-10">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="border-[1.5px] border-ink px-5 py-3 font-mono text-label uppercase text-ink hover:bg-ink hover:text-paper"
      >
        Open lightbox
      </button>
      {open && <Lightbox {...args} onClose={() => setOpen(false)} />}
    </div>
  );
}

const meta = {
  title: "Molecules/Lightbox",
  component: Lightbox,
  parameters: { layout: "fullscreen" },
  args: {
    photos: PHOTOS,
    initialIndex: 1,
    onClose: () => {},
  },
  render: (args) => <LightboxDemo {...args} />,
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placeholder: Story = {
  args: { initialIndex: 0 },
};
