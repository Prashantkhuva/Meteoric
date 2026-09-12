import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { buildHowToJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonLd";
import { homeFaqs } from "@/data/faqs";

const pageTitle =
  "Meteoric — Web & Software Development Agency for Startups & SaaS";
const pageDesc =
  "Meteoric is a founder-led software development studio for startups and SaaS. We design and ship high-performance websites, apps, and platforms that convert.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/`,
    siteName: "Meteoric",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Meteoric — Web & Software Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDesc,
    images: [`${SITE_URL}/og.jpg`],
    creator: "@prashantkhuva_",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
  ],
};

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Meteoric — Web & Software Development Agency",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

const howToSchema = buildHowToJsonLd([
  {
    name: "Discovery",
    text: "We align on the product vision, audience, requirements, and goals before development begins.",
  },
  {
    name: "Design Direction",
    text: "Interfaces and user flows designed around clarity, usability, and modern interaction patterns.",
  },
  {
    name: "Development",
    text: "Frontend and backend systems engineered for performance, scalability, and maintainability.",
  },
  {
    name: "Launch",
    text: "Deployment, optimization, and final polishing before the product goes live.",
  },
]);

const faqSchema = buildFaqJsonLd(homeFaqs);

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Full-stack web development, SaaS products, and landing pages for startups.",
      areaServed: "Worldwide",
      priceRange: "$$",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "English",
        email: "contact@withmeteoric.com",
      },
      serviceType: [
        "Software Development",
        "Web Development",
        "SaaS Development",
        "Landing Page Design",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Landing Pages",
              description:
                "High-converting, fast-loading landing pages designed to make a lasting impression. Built with Next.js and optimized for SEO, speed, and conversion.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS Development",
              description:
                "From MVP prototypes to production SaaS platforms. We design, build, and launch complete products — auth, dashboards, payments, and everything in between.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Web Applications",
              description:
                "Custom web applications — dashboards, internal tools, and customer-facing platforms. Clean UI, solid backend, built to perform at scale.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Full-Stack Development",
              description:
                "Frontend to backend, database to deployment. We build complete systems — APIs, auth, integrations, and polished interfaces — all under one roof.",
            },
          },
        ],
      },
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${SITE_URL}/#navigation`,
      name: "Main Navigation",
      description: "Primary site navigation links",
      url: SITE_URL,
      hasPart: [
        {
          "@type": "SiteNavigationElement",
          name: "Work",
          url: `${SITE_URL}/work`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Services",
          url: `${SITE_URL}/services`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "About",
          url: `${SITE_URL}/about`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Case Studies",
          url: `${SITE_URL}/case-studies`,
        },
      ],
    },
  ],
};

export default async function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage />
      <HomeHashScroll />
    </>
  );
}
