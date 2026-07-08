import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import ApiDevelopmentPage from "@/components/pages/ApiDevelopment";

const pageTitle = "API Development Agency | Meteoric — Build REST & GraphQL APIs";
const pageDesc =
  "Meteoric is an API development agency. We design and build RESTful and GraphQL APIs for startups and founders — secure, documented, and built to scale. Node.js, Next.js, Supabase, PostgreSQL.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/api-development`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/api-development`,
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
    { "@type": "ListItem", position: 3, name: "API Development", item: `${SITE_URL}/services/api-development` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you build REST or GraphQL APIs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. We recommend REST for simple resource-based APIs and GraphQL for complex data requirements or when building with React/Next.js frontends. We can also build hybrid systems that expose both.",
      },
    },
    {
      "@type": "Question",
      name: "How do you document APIs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "APIs are documented with OpenAPI (Swagger) for REST and auto-generated GraphQL docs. We also provide Postman collections, integration guides, and example code snippets for common use cases.",
      },
    },
    {
      "@type": "Question",
      name: "Can you integrate with existing third-party services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We regularly integrate with Stripe, Resend, Supabase, Cal.com, Google APIs, Slack, WhatsApp, and more. We handle webhooks, OAuth flows, and error handling so integrations stay reliable.",
      },
    },
    {
      "@type": "Question",
      name: "How do you handle API security?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every API we build includes rate limiting, input validation (Zod), authentication via JWT or OAuth 2.0, CORS configuration, SQL injection prevention, and request logging. We also implement proper error handling that never leaks implementation details.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a custom API cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A focused API with 10-15 endpoints typically ranges from $8,000-$15,000. Complex integrations or real-time APIs with WebSockets range from $15,000-$30,000. We provide a detailed scope after our discovery call.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — API Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/services/api-development`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "API Development",
};

export default function ApiDevelopment() {
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
      <ApiDevelopmentPage />
    </>
  );
}
