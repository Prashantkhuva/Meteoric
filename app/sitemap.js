import { SITE_URL } from "@/lib/seo/config";
import { sitemapRoutes } from "@/lib/seo/config";

export default function sitemap() {
  return sitemapRoutes.map((route) => ({
    url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: parseFloat(route.priority),
  }));
}
