import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import StartupWebDevelopmentPage from "@/components/pages/StartupWebDevelopment";

const pageTitle = "Startup Web Development Agency | Meteoric — Websites That Work";
const pageDesc =
  "Meteoric is a startup web development studio. We build fast, beautiful, and conversion-optimized websites for early-stage and funded startups. Next.js, Tailwind CSS, SEO-ready.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/startup-web-development`,
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        secureUrl: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: 1635,
        height: 962,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    title: pageTitle,
    description: pageDesc,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "Startup Web Development", item: `${SITE_URL}/services/startup-web-development` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does a startup web development agency do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A startup web development agency builds websites and web applications specifically for early-stage and growing startups. Unlike traditional agencies that build brochure sites, startup agencies focus on speed, conversion, SEO readiness, and growth infrastructure.",
      },
    },
    {
      "@type": "Question",
      name: "How fast can you build a startup website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most startup websites launch in 3-6 weeks. A standard 5-page site with blog, SEO setup, and analytics typically takes 3-4 weeks. More complex projects with custom functionality take 5-6 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build both marketing sites and web apps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build marketing sites, landing pages, documentation hubs, and full SaaS web applications. Our stack (Next.js + Supabase) handles everything from a 5-page startup site to a multi-tenant SaaS platform.",
      },
    },
    {
      "@type": "Question",
      name: "Do you handle SEO and analytics setup?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every project ships with technical SEO (structured data, meta tags, sitemaps), Core Web Vitals optimization, and analytics infrastructure. We also offer GEO (Generative Engine Optimization) to make your site citeable by AI chatbots like ChatGPT and Claude.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a startup website cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard startup marketing site starts around $5,000-$12,000. Complex web applications and custom platforms range from $15,000-$50,000. We provide a transparent quote after understanding your needs.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Startup Web Development",
  description: pageDesc,
  url: `${SITE_URL}/services/startup-web-development`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Startup Web Development",
};

export default function StartupWebDev() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <StartupWebDevelopmentPage />
    </>
  );
}
