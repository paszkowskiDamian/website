import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhotoGallery } from "./photo-gallery";

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
  {
    ratio: "4/3",
    caption: "Fog line",
    meta: "35mm",
    placeholder: "Landscape photo",
  },
  {
    ratio: "3/4",
    caption: "Ridge at dawn",
    meta: "Digital",
    placeholder: "Portrait photo",
  },
  {
    ratio: "1/1",
    caption: "Window grid",
    meta: "Digital",
    placeholder: "Square photo",
  },
];

const meta = {
  title: "Molecules/PhotoGallery",
  component: PhotoGallery,
  args: { photos: PHOTOS },
} satisfies Meta<typeof PhotoGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
