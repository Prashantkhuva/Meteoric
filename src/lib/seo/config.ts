/**
 * Central SEO configuration — single source of truth for the production
 * domain, brand, default title/description, social card data, and sitemap
 * routes.
 *
 * Only the canonical production domain belongs here. Never use deployment
 * domains (e.g. *.vercel.app) in canonicals, Open Graph URLs, structured
 * data, navigation, or the sitemap.
 */

export const SITE_URL = "https://withmeteoric.com";
export const SITE_NAME = "Meteoric";

/** Default <title>. Pages that do not export a title inherit this. */
export const SITE_TITLE =
  "Meteoric | Software Development Agency for Startups & SaaS";

/** Applied to every page title that exports a plain string. */
export const TITLE_TEMPLATE = "%s | Meteoric";

/** Default meta description (brand description). */
export const DEFAULT_DESCRIPTION =
  "Founder-led web and SaaS development studio for startups — high-performance websites, SaaS platforms, and full-stack applications.";

export const DEFAULT_OG_IMAGE = "/og.jpg";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const TWITTER = {
  card: "summary_large_image",
  site: "@prashantkhuva_",
  creator: "@prashantkhuva_",
};

/**
 * Search Console verification — placeholder, no token committed here.
 * File-based verification is live at
 * public/googlef11906b8cffcfe5f.html.
 * To use meta-tag verification instead, set in Vercel:
 * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token from Search Console>
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

/** Absolute URL for a path on the canonical production domain. */
export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Appends the brand once, unless the title already contains it. */
export function brandedTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

/** Open Graph image entry with the true intrinsic size of /og.jpg. */
export function ogImage(title: string, image = DEFAULT_OG_IMAGE) {
  const url = absoluteUrl(image);
  return [{ url, secureUrl: url, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: title }];
}

/**
 * Standard metadata block for a marketing page.
 * Omit `title` to inherit the site default (homepage).
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  type = "website",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  image?: string;
}) {
  const ogTitle = title ? brandedTitle(title) : SITE_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: ogTitle,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      images: ogImage(ogTitle, image),
    },
    twitter: {
      ...TWITTER,
      title: ogTitle,
      description,
      images: [absoluteUrl(image || DEFAULT_OG_IMAGE)],
    },
  };
}

/**
 * Last-edit dates per static route (ISO date only). Assumed from last known
 * content/audit touch — update when a route's content actually changes.
 */
const LASTMOD: Record<string, string> = {
  "/": "2026-10-12",
  "/about": "2026-09-29",
  "/work": "2026-07-25",
  "/services": "2026-09-06",
  "/saas-mvp-development": "2026-09-06",
  "/nextjs-development-agency": "2026-09-06",
  "/startup-landing-page-design": "2026-09-06",
  "/web-app-development": "2026-09-06",
  "/case-studies": "2026-07-25",
  "/privacy": "2026-07-25",
  "/blog": "2026-10-12",
  "/booking": "2026-09-06",
  "/contact": "2026-09-06",
  "/terms": "2026-07-25",
  "/editorial-policy": "2026-07-25",
  "/author/prashant-khuva": "2026-09-29",
};

export const sitemapRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly", lastmod: LASTMOD["/"] },
  {
    path: "/about",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: LASTMOD["/about"],
  },
  {
    path: "/work",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: LASTMOD["/work"],
  },
  {
    path: "/services",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: LASTMOD["/services"],
  },
  {
    path: "/saas-mvp-development",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: LASTMOD["/saas-mvp-development"],
  },
  {
    path: "/nextjs-development-agency",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: LASTMOD["/nextjs-development-agency"],
  },
  {
    path: "/startup-landing-page-design",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: LASTMOD["/startup-landing-page-design"],
  },
  {
    path: "/web-app-development",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: LASTMOD["/web-app-development"],
  },
  {
    path: "/case-studies",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: LASTMOD["/case-studies"],
  },
  {
    path: "/privacy",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: LASTMOD["/privacy"],
  },
  {
    path: "/blog",
    priority: "0.8",
    changefreq: "weekly",
    lastmod: LASTMOD["/blog"],
  },
  {
    path: "/booking",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: LASTMOD["/booking"],
  },
  {
    path: "/contact",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: LASTMOD["/contact"],
  },
  {
    path: "/terms",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: LASTMOD["/terms"],
  },
  {
    path: "/editorial-policy",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: LASTMOD["/editorial-policy"],
  },
  {
    path: "/author/prashant-khuva",
    priority: "0.6",
    changefreq: "monthly",
    lastmod: LASTMOD["/author/prashant-khuva"],
  },
];
