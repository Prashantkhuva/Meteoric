import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { buildHowToJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonLd";
import { homeFaqs } from "@/data/faqs";

const pageTitle =
  "Meteoric — Web & Software Development Agency for Startups & SaaS";
const pageDesc =
   "Meteoric is a founder-led web development agency for startups and SaaS. We design and ship high-performance websites and software that convert — fast, and built to last.";

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

const fallbackTestimonials = [
  {
    rating: 5,
    author: "Rohan Mehta",
    quote:
      "Meteoric redesigned our entire SaaS dashboard and the result was exceptional — cleaner UX, faster load times, and our users actually noticed the difference.",
  },
  {
    rating: 5,
    author: "Sarah Mitchell",
    quote:
      "Working with Meteoric felt more like a partnership than a vendor relationship. They understood our B2B SaaS vision from day one and brought UX ideas we hadn't even considered.",
  },
  {
    rating: 5,
    author: "James Park",
    quote:
      "We needed a complete brand website redesign and got way more than we expected. The attention to detail in both design and performance is rare to find.",
  },
];

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Meteoric",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    ratingCount: "3",
    datePublished: "2026-07-25",
  },
  review: fallbackTestimonials.map((t, i) => ({
    "@type": "Review",
    "@id": `${SITE_URL}/#review-${i + 1}`,
    itemReviewed: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5" },
    author: { "@type": "Person", name: t.author },
    reviewBody: t.quote,
    datePublished: "2026-07-25",
  })),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "Meteoric Agency",
      url: SITE_URL,
      logo: `${SITE_URL}/m.png`,
      image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      description:
        "Meteoric is a web development agency that builds high-performance websites, SaaS platforms, and full-stack applications for startups and founders.",
      founder: { "@type": "Person", name: "Prashant Khuva" },
      foundingDate: "2026",
      areaServed: "Worldwide",
      knowsAbout: [
        "Web Development",
        "SaaS Development",
        "React Development",
        "Next.js Development",
        "Node.js Development",
        "Full-Stack Development",
        "Landing Page Design",
        "Startup Web Development",
      ],
      sameAs: [
        "https://github.com/Prashantkhuva",
        "https://www.linkedin.com/company/withmeteoric",
        "https://x.com/prashantkhuva_",
        "https://www.instagram.com/officialmeteoric/",
        "https://www.wikidata.org/wiki/Q140453413",
      ],
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <HomePage />
      <HomeHashScroll />
    </>
  );
}
