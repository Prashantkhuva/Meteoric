export const SITE_URL = "https://withmeteoric.com";
export const SITE_NAME = "Meteoric";
export const DEFAULT_OG_IMAGE = "/og.jpg";

const today = new Date().toISOString().split("T")[0];

export const sitemapRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly", lastmod: today },
  {
    path: "/about",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/work",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: today,
  },
  {
    path: "/services",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/case-studies",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/privacy",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: "2026-07-25",
  },
  {
    path: "/blog",
    priority: "0.8",
    changefreq: "weekly",
    lastmod: today,
  },
  {
    path: "/booking",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/terms",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: "2026-07-25",
  },
  {
    path: "/editorial-policy",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: "2026-07-25",
  },
  {
    path: "/author/prashant-khuva",
    priority: "0.6",
    changefreq: "monthly",
    lastmod: today,
  },
];
