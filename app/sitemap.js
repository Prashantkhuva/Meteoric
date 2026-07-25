import { SITE_URL } from "@/lib/seo/config";
import { sitemapRoutes } from "@/lib/seo/config";
import { projects } from "@/data/projects";

export default function sitemap() {
  const staticRoutes = sitemapRoutes.map((route) => ({
    url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
    lastModified: route.lastmod,
    changeFrequency: route.changefreq,
    priority: parseFloat(route.priority),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: "2026-07-23",
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
