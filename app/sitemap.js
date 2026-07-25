import { SITE_URL } from "@/lib/seo/config";
import { sitemapRoutes } from "@/lib/seo/config";
import { projects } from "@/data/projects";

const serviceSlugs = [
  "saas-development",
  "startup-web-development",
  "nextjs-development",
  "web-applications",
];

export default function sitemap() {
  const staticRoutes = sitemapRoutes.map((route) => ({
    url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
    lastModified: route.lastmod,
    changeFrequency: route.changefreq,
    priority: parseFloat(route.priority),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: "2026-07-25",
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: "2026-07-25",
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
}
