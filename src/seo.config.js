export const SITE_URL = "https://withmeteoric.vercel.app";
export const SITE_NAME = "Meteoric";
export const DEFAULT_OG_IMAGE = "/og-image.png?v=20260508";

/** PNG dimensions for public/og-image.png used by og:image / Twitter. */
export const OG_IMAGE_WIDTH = 1635;
export const OG_IMAGE_HEIGHT = 962;

export const OG_LOCALE = "en_US";

/** Twitter @handle for twitter:site (brand account). */
export const TWITTER_SITE = "@prashantkhuva_";

export const seoDefaults = {
  title: "Meteoric — Web Development Agency for Startups & SaaS",
  description:
    "Meteoric is a web development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that convert. Book a free strategy call.",
  keywords: [
    "web development agency",
    "SaaS development company",
    "React development agency",
    "custom web application development",
    "landing page design services",
    "full-stack development services",
    "Meteoric",
    "hire web developer",
    "startup web development",
  ],
  path: "/",
};

export const pageSeo = {
  home: {
    title: "Meteoric — Web Development Agency for Startups & SaaS",
    description:
      "Meteoric is a web development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that actually convert. Book a free strategy call.",
    keywords: [
      "web development agency",
      "SaaS development company",
      "React development agency",
      "custom web application development",
      "landing page design services",
      "full-stack development services",
      "Meteoric",
      "hire web developer",
    ],
    path: "/",
  },
  about: {
    title: "About Meteoric | Web Development Agency for Founders",
    description:
      "Meteoric is a product studio that partners with founders to design, develop, and launch modern web products. No bloat, no agencies — just production-ready work that ships on time.",
    keywords: [
      "Meteoric",
      "web development agency founder",
      "product studio",
      "React development",
      "SaaS development",
      "founder web developer",
    ],
    path: "/about",
  },
};

export const sitemapRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
];
