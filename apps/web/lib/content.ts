import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ConnectLink } from "@repo/ui/molecules/connect-row";
import type { NavLink } from "@repo/ui/molecules/header";
import type { NewsletterCopy } from "@repo/ui/molecules/newsletter";

/**
 * File-based content layer. Everything here runs at build time only
 * (server components + `output: "export"`), so plain `fs` is fine.
 *
 * - content/essays/*.mdx — one file per essay, frontmatter + MDX body
 * - content/projects.json — the "Selected Projects" grid
 * - content/portfolio.json — the portfolio page
 * - content/site.json — site meta, nav, author, social links, shared copy
 * - content/pages/*.json — per-page copy (home, brand-system)
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Author {
  name: string;
  role: string;
  bio: string;
  /**
   * Path to a portrait under `public/`, e.g. "/avatar.jpg". Optional — the UI
   * falls back to a plain colored circle when unset.
   */
  avatar?: string;
}

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
  /**
   * Optional per-essay author override from frontmatter. Any provided fields
   * are merged over the site-wide author from site.json.
   */
  author?: Partial<Author>;
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
    author: data.author as Partial<Author> | undefined,
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

export interface PageMeta {
  title: string;
  description: string;
}

export interface PortfolioConfig {
  meta: PageMeta;
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
  meta: PageMeta;
  nav: NavLink[];
  author: Author;
  connect: ConnectLink[];
  newsletter: NewsletterCopy;
  footer: {
    /** Copy shown after the © year in the site footer. */
    copyright: string;
  };
}

export function getSite(): SiteConfig {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "site.json"), "utf8"),
  ) as SiteConfig;
}

export interface HomePageConfig {
  hero: {
    /** Rendered as one heading with a line break between entries. */
    titleLines: string[];
    lede: string;
    cta: { label: string; href: string };
  };
  featured: {
    /** Hero image used when the featured essay has none of its own. */
    fallbackImage: string;
  };
  sections: {
    essays: { title: string; viewAllHref: string };
    projects: { title: string; viewAllHref: string };
  };
}

export function getHomePage(): HomePageConfig {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "pages", "home.json"), "utf8"),
  ) as HomePageConfig;
}

export interface BrandSystemConfig {
  meta: PageMeta;
  cover: { kicker: string; title: string; intro: string };
  conceptStrip: { phrases: string[]; accentPhrase: string };
  mark: {
    heading: string;
    labels: { primary: string; lockup: string; onBlack: string; tile: string };
    note: string;
  };
  palette: {
    heading: string;
    swatches: {
      name: string;
      hex: string;
      usage: string;
      bordered: boolean;
      bg: string;
      text: string;
    }[];
    note: string;
  };
  typography: {
    heading: string;
    families: { label: string; sampleClassName: string; note: string }[];
    scale: { label: string; sample: string; className: string }[];
  };
  pattern: {
    heading: string;
    intro: string;
    cells: { rail: string; field: string; motifs: string };
    motifSample: string;
    tickerRows: { text: string; tone: "accent" | "ink" | "muted" }[];
    glyphSetNote: string;
  };
  geometry: {
    heading: string;
    panel: { kicker: string; text: string };
  };
  components: { heading: string };
  footer: {
    copyright: string;
    cta: { label: string; href: string };
  };
}

export function getBrandSystem(): BrandSystemConfig {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "pages", "brand-system.json"), "utf8"),
  ) as BrandSystemConfig;
}
