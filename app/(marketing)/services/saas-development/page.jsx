import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import SaaSDevelopmentPage from "@/components/pages/SaaSDevelopment";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "SaaS Development Agency | Custom SaaS Products for Startups — Meteoric";
const pageDesc =
  "Meteoric is a SaaS development agency that builds scalable SaaS products from MVP to production. Auth, billing, dashboards, APIs — built with Next.js, Supabase, and modern tooling.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/saas-development`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/saas-development`,
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
    creator: "@prashantkhuva_",
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
    { "@type": "ListItem", position: 3, name: "SaaS Development", item: `${SITE_URL}/services/saas-development` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — SaaS Development",
  url: `${SITE_URL}/services/saas-development`,
  description: "SaaS product development from MVP to production. We build auth, billing, dashboards, APIs, and full-stack SaaS platforms with Next.js, Supabase, and Stripe.",
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "SaaS Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SaaS MVP Development",
          description: "Fast, focused MVPs built around your core value proposition — production-ready in 3-6 weeks.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full-Stack SaaS Platforms",
          description: "Complete SaaS products with multi-tenant architecture, subscription billing, auth, dashboards, and APIs.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SaaS Scaling & Optimization",
          description: "Performance optimization, feature additions, and scaling support for growing SaaS products.",
        },
      },
    ],
  },
};

const serviceFaqs = [
  {
    question: "How much does it cost to build a SaaS product?",
    answer: "SaaS MVPs typically start from a lower budget and ship in 3-6 weeks. Full-featured SaaS platforms range from 4-10 weeks depending on complexity. We provide a fixed quote after a free discovery call based on your feature requirements.",
  },
  {
    question: "What technologies does Meteoric use for SaaS development?",
    answer: "Our core SaaS stack is Next.js, React, Node.js, Supabase, and Stripe. We use PostgreSQL for databases, Tailwind CSS for styling, and deploy to Vercel. We adapt to your existing stack if needed.",
  },
  {
    question: "Do you build multi-tenant SaaS platforms?",
    answer: "Yes. We architect multi-tenant SaaS with proper data isolation, role-based access control, and per-tenant customization. Every query is automatically scoped to the authenticated tenant for security.",
  },
  {
    question: "How long does it take to build a SaaS MVP?",
    answer: "A focused SaaS MVP with auth, billing, core features, and a polished UI typically takes 3-6 weeks. We ship usable increments every two weeks so you can validate with real users early.",
  },
  {
    question: "Do you handle subscription billing and payments?",
    answer: "Yes. We integrate Stripe for subscription management — plan creation, free trials, usage-based billing, invoice generation, and upgrade/downgrade flows. The billing logic is built directly into your SaaS platform.",
  },
];

const faqJsonLd = buildFaqJsonLd(serviceFaqs);

export default function SaaSDevelopment() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SaaSDevelopmentPage />
    </>
  );
}
