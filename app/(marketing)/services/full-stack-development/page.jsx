import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import FullStackDevelopmentPage from "@/components/pages/FullStackDevelopment";

const pageTitle = "Full-Stack Development Agency | Meteoric — Frontend to Backend";
const pageDesc =
  "Meteoric is a full-stack development agency. We build complete web systems — frontend, backend, APIs, databases, and integrations — for startups and founders. Next.js, Node.js, Supabase, PostgreSQL.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/full-stack-development`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/full-stack-development`,
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
    { "@type": "ListItem", position: 3, name: "Full-Stack Development", item: `${SITE_URL}/services/full-stack-development` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does a full-stack development agency do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A full-stack development agency builds complete web systems — frontend (UI/UX), backend (APIs, business logic), database (design, optimization), and third-party integrations. Unlike specialist agencies, we handle the entire stack so you don't need to coordinate multiple vendors. At Meteoric, we build with Next.js, Node.js, Supabase, and PostgreSQL.",
      },
    },
    {
      "@type": "Question",
      name: "How long does full-stack development take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A complete full-stack application typically takes 4-10 weeks depending on complexity. A focused MVP with auth, database, and core features can ship in 3-5 weeks. More complex systems with multiple integrations and real-time features take 6-10 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build both frontend and backend?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build everything from the database schema and API layer to the frontend UI and deployment infrastructure. You get a complete, production-ready system — not a half-built prototype that needs another team to finish.",
      },
    },
    {
      "@type": "Question",
      name: "Can you integrate third-party APIs and services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We regularly integrate Stripe for payments, Resend for transactional email, Supabase for auth and database, Cal.com for booking, and custom integrations via REST and webhooks. Every integration is built with proper error handling, retry logic, and observability.",
      },
    },
    {
      "@type": "Question",
      name: "How much does full-stack development cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on scope. A focused full-stack MVP starts around $15,000-$25,000. Complete production platforms with multiple integrations range from $30,000-$75,000. We provide a detailed scope and fixed-price quote after our discovery call.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Full-Stack Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/services/full-stack-development`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Full-Stack Development",
};

export default function FullStackDevelopment() {
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
      <FullStackDevelopmentPage />
    </>
  );
}
