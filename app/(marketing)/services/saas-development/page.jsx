import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import SaaSDevelopmentPage from "@/components/pages/SaaSDevelopment";

const pageTitle = "SaaS Development Agency | Meteoric — Build Your SaaS Product";
const pageDesc =
  "Meteoric is a SaaS development agency for startups and founders. We design, build, and launch SaaS products — from MVP prototypes to production platforms. Next.js, Supabase, Stripe. Ship fast, scale smart.";

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a SaaS development agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A SaaS development agency specializes in building cloud-based software products delivered via subscription. Unlike general web development agencies, SaaS agencies understand multi-tenant architecture, subscription billing, usage metering, and the unique challenges of building products that need to scale from 10 to 10,000 users.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a SaaS MVP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most SaaS MVPs take 3-6 weeks depending on scope. The record is 21 days for a fintech prototype that went on to close a seed round. We focus on the core 20% of features that deliver 80% of the value.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Meteoric different from other SaaS agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every project ships directly with the founder — no account managers, no layers. We work like a product studio, not an agency. This means faster decisions, fewer meetings, and a final product that actually reflects your vision.",
      },
    },
    {
      "@type": "Question",
      name: "Do you handle ongoing maintenance after launch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After launch, we offer retainer-based maintenance, feature additions, and performance optimization. We treat every project as a long-term partnership.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a SaaS development agency cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Costs vary based on scope. A focused MVP typically starts around $15,000-$30,000. Full production platforms range from $30,000-$80,000 depending on complexity. We provide a detailed scope and fixed-price quote after a free strategy call.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — SaaS Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/services/saas-development`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "SaaS Development",
};

export default function SaaSDev() {
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
      <SaaSDevelopmentPage />
    </>
  );
}
