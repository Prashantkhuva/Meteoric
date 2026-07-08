import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import WebApplicationsPage from "@/components/pages/WebApplications";

const pageTitle = "Web Application Development Agency | Meteoric — Build Custom Web Apps";
const pageDesc =
  "Meteoric is a web application development company. We build custom web apps, dashboards, and internal tools for startups and founders — fast, scalable, and modern. Next.js, Supabase, PostgreSQL.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/web-applications`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/web-applications`,
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
    { "@type": "ListItem", position: 3, name: "Web Applications", item: `${SITE_URL}/services/web-applications` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What kind of web applications do you build?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We build a wide range of web applications — internal tools and admin dashboards, customer-facing SaaS platforms, real-time collaboration apps, data visualization dashboards, and API-first backends. If it runs in a browser, we can build it.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a web application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A typical MVP can be shipped in 2-4 weeks. More complex applications with real-time features, dashboards, and multiple user roles typically take 6-10 weeks. We provide a detailed timeline after our free scoping call.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with existing codebases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We regularly take over and modernize existing web applications. Whether you need to add features, fix performance issues, or migrate from a legacy framework — we handle it.",
      },
    },
    {
      "@type": "Question",
      name: "What does a web application cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A focused internal tool or dashboard starts around $10,000-$20,000. Full-featured customer-facing applications range from $25,000-$60,000. We provide a fixed-price quote after understanding your requirements.",
      },
    },
    {
      "@type": "Question",
      name: "How do you handle scalability?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every application is built with scalability in mind from day one. We use serverless infrastructure (Vercel, Supabase) that auto-scales, implement database indexing and query optimization, and set up monitoring and alerting so you know before users do.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Web Application Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/services/web-applications`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Web Application Development",
};

export default function WebApplications() {
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
      <WebApplicationsPage />
    </>
  );
}
