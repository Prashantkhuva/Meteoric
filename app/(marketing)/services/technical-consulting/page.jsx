import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import TechnicalConsultingPage from "@/components/pages/TechnicalConsulting";

const pageTitle = "Technical Consulting for Startups | Meteoric";
const pageDesc =
  "Get expert technical guidance for your startup. Stack selection, architecture planning, code audits, and fractional CTO services. Make the right decisions before writing a line of code.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/technical-consulting`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/technical-consulting`,
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
    { "@type": "ListItem", position: 3, name: "Technical Consulting", item: `${SITE_URL}/services/technical-consulting` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is technical consulting for startups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Technical consulting helps startups make informed decisions about technology stack, architecture, infrastructure, and engineering strategy. It is particularly valuable for non-technical founders who need guidance without hiring a full-time CTO, and for technical founders who want a second opinion on critical architecture decisions.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from hiring a CTO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fractional CTO consulting gives you access to experienced technical leadership on an as-needed basis — without the salary commitment of a full-time executive. You get strategy, code reviews, and roadmap guidance when you need it, and you only pay for the time you use.",
      },
    },
    {
      "@type": "Question",
      name: "What does a code audit include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We review your codebase for architecture quality, security vulnerabilities, performance bottlenecks, and technical debt. You get a prioritized list of issues with estimated effort and recommended fixes. Typical audits cover 10-20 key files plus overall architecture review.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a typical consulting engagement last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Engagements range from a single 2-hour strategy session to ongoing monthly advisory. Most founders start with a deep-dive session to establish the technical strategy, then move to a lighter monthly check-in cadence.",
      },
    },
    {
      "@type": "Question",
      name: "Do you only consult on projects you build?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We are happy to review existing codebases, advise on projects built by other teams, or help you evaluate vendors. Our consulting is independent and focused on what is best for your specific situation.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Technical Consulting",
  description: pageDesc,
  url: `${SITE_URL}/services/technical-consulting`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Technical Consulting",
};

export default function TechnicalConsulting() {
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
      <TechnicalConsultingPage />
    </>
  );
}
