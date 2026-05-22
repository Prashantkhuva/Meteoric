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
  title: "Meteoric — Building Modern Products for Startups",
  description:
    "Meteoric builds premium web experiences, scalable full-stack applications, and modern digital products for startups and internet businesses.",
  keywords: [
    "Meteoric",
    "React developer",
    "Vite developer",
    "full-stack developer",
    "web development agency",
    "SaaS development",
    "landing page development",
    "MERN stack developer",
  ],
  path: "/",
};

export const pageSeo = {
  home: {
    title: "Meteoric — Building Modern Products for Startups",
    description:
      "Meteoric builds premium web experiences, scalable full-stack applications, and modern digital products for startups and internet businesses.",
    keywords: [
      "Meteoric",
      "web development agency",
      "React development",
      "full-stack web apps",
      "SaaS development",
      "landing page developer",
    ],
    path: "/",
  },
  projects: {
    title: "Projects | Meteoric",
    description:
      "Explore shipped Meteoric projects including SaaS products, developer tools, and full-stack React applications built for real users.",
    keywords: [
      "Meteoric projects",
      "React portfolio",
      "SaaS projects",
      "full-stack projects",
      "MERN stack portfolio",
      "Vite React apps",
    ],
    path: "/projects",
  },
  contact: {
    title: "Contact | Meteoric",
    description:
      "Start a project with Meteoric for landing pages, SaaS products, full-stack web apps, and production-ready React development.",
    keywords: [
      "contact Meteoric",
      "hire React developer",
      "hire full-stack developer",
      "web app development",
      "SaaS developer for founders",
    ],
    path: "/contact",
  },
  about: {
    title: "About Prashant Khuva | Meteoric",
    description:
      "Learn about Prashant Khuva, the full-stack developer behind Meteoric, building clean React and MERN products for founders.",
    keywords: [
      "Prashant Khuva",
      "Meteoric founder",
      "full-stack developer",
      "React developer",
      "MERN stack developer",
    ],
    path: "/about",
  },
};

/** Only real standalone pages — /projects and /contact are homepage sections (#work, #contact). */
export const sitemapRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
];
