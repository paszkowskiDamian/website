import type { MetadataRoute } from "next";
import { getAllEssayMetas, getAllProjectDetails } from "../lib/content";
import { SITE_URL } from "../lib/site-url";

const STATIC_ROUTES = ["/", "/essays/", "/portfolio/", "/projects/", "/brand-system/"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const essayRoutes = getAllEssayMetas().map((essay) => `/essays/${essay.slug}/`);
  const projectRoutes = getAllProjectDetails().map((project) => `/projects/${project.slug}/`);

  return [...STATIC_ROUTES, ...essayRoutes, ...projectRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
