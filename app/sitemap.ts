import { SITE_URL, sitemapRoutes } from "@/lib/seo/config";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog-posts";
import { services } from "@/data/services";

export default function sitemap() {
  // Canonical, public, indexable URLs only — no drafts, no unpublished posts.
  const staticRoutes = sitemapRoutes.map((route) => ({
    url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
    lastModified: route.lastmod,
    changeFrequency: route.changefreq,
    priority: parseFloat(route.priority),
  }));

  const projectRoutes = projects
    .filter((project) => project.slug && project.draft !== true)
    .map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified: "2026-07-25",
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const serviceRoutes = services
    .filter((service) => service.slug && service.draft !== true)
    .map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: "2026-09-06",
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const blogRoutes = blogPosts
    .filter((post) => post.slug && post.published && post.draft !== true)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.published,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...blogRoutes];
}
