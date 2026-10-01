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
export function brandedTitle(title) {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

/** Open Graph image entry with the true intrinsic size of /og.jpg. */
export function ogImage(title, image = DEFAULT_OG_IMAGE) {
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
    path: "/saas-mvp-development",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/nextjs-development-agency",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/startup-landing-page-design",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: today,
  },
  {
    path: "/web-app-development",
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
    path: "/contact",
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
