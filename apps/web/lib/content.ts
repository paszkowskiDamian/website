import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ConnectLink } from "@repo/ui/molecules/connect-row";

/**
 * File-based content layer. Everything here runs at build time only
 * (server components + `output: "export"`), so plain `fs` is fine.
 *
 * - content/essays/*.mdx — one file per essay, frontmatter + MDX body
 * - content/projects.json — the "Selected Projects" grid
 * - content/site.json — author, social links, shared site copy
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface EssayMeta {
  slug: string;
  title: string;
  /** ISO date from frontmatter, e.g. "2025-05-12" */
  date: string;
  /** Human form, e.g. "May 12, 2025" */
  displayDate: string;
  excerpt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  /** Chronological ordinal across all essays, e.g. "04" */
  number: string;
  heroImage?: string;
  heroAlt?: string;
  heroCaption?: string;
}

export interface Essay extends EssayMeta {
  body: string;
}

function parseEssayFile(filename: string): Essay {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "essays", filename), "utf8");
  const { data, content } = matter(raw);

  for (const key of ["title", "date", "excerpt", "readTime", "category"]) {
    if (!data[key]) throw new Error(`essays/${filename}: missing frontmatter field "${key}"`);
  }

  const date = new Date(data.date as string);
  return {
    slug,
    title: data.title as string,
    date: date.toISOString().slice(0, 10),
    displayDate: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
    excerpt: data.excerpt as string,
    readTime: data.readTime as string,
    category: data.category as string,
    tags: (data.tags as string[] | undefined) ?? [],
    featured: Boolean(data.featured),
    number: "00", // patched below once the whole list is known
    heroImage: data.heroImage as string | undefined,
    heroAlt: data.heroAlt as string | undefined,
    heroCaption: data.heroCaption as string | undefined,
    body: content,
  };
}

/** All essays, newest first, with chronological ordinals assigned. */
export function getAllEssays(): Essay[] {
  const files = fs
    .readdirSync(path.join(CONTENT_DIR, "essays"))
    .filter((f) => f.endsWith(".mdx"));

  const essays = files.map(parseEssayFile);
  essays.sort((a, b) => a.date.localeCompare(b.date));
  essays.forEach((e, i) => {
    e.number = String(i + 1).padStart(2, "0");
  });
  return essays.reverse();
}

export function getEssay(slug: string): Essay {
  const essay = getAllEssays().find((e) => e.slug === slug);
  if (!essay) throw new Error(`Unknown essay slug: ${slug}`);
  return essay;
}

export interface Project {
  seed: number;
  title: string;
  description: string;
  href?: string;
}

export function getProjects(): Project[] {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "projects.json"), "utf8"),
  ) as Project[];
}

export interface PortfolioImage {
  /** CSS aspect-ratio, e.g. "21/9" */
  ratio: string;
  /** Hint shown in the slot until a real image is dropped in. */
  placeholder?: string;
  src?: string;
  alt?: string;
}

export interface PortfolioChapter {
  id: string;
  layout: "feature" | "split" | "dark" | "pair";
  title: string;
  meta: string;
  paragraphs: { label?: string; text: string }[];
  links: { label: string; href: string; variant?: "accent" | "paper" }[];
  aside?: { label: string; text: string }[];
  quote?: string;
  heroImage?: PortfolioImage;
  inlineImage?: PortfolioImage;
  tallImage?: PortfolioImage;
  sideImage?: PortfolioImage;
  pairImages?: PortfolioImage[];
}

export interface PortfolioConfig {
  kicker: string;
  title: string;
  intro: string;
  chapters: PortfolioChapter[];
  interlude: string[];
  photography: {
    id: string;
    title: string;
    intro: string;
    photos: (PortfolioImage & { caption: string; meta: string })[];
  };
  cta: {
    title: string;
    text: string;
    button: { label: string; href: string };
  };
}

export function getPortfolio(): PortfolioConfig {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "portfolio.json"), "utf8"),
  ) as PortfolioConfig;
}

export interface SiteConfig {
  author: {
    name: string;
    role: string;
    bio: string;
  };
  connect: ConnectLink[];
}

export function getSite(): SiteConfig {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "site.json"), "utf8"),
  ) as SiteConfig;
}
