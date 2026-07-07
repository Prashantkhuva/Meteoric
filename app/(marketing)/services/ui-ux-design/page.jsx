import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import UIDesignPage from "@/components/pages/UIDesign";

const pageTitle = "UI/UX Design Agency | Meteoric";
const pageDesc =
  "Meteoric offers UI/UX design services for startups and founders. Clean, conversion-focused interfaces designed in Figma and built with Next.js. From wireframes to production-ready designs.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/ui-ux-design`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/ui-ux-design`,
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
    { "@type": "ListItem", position: 3, name: "UI/UX Design", item: `${SITE_URL}/services/ui-ux-design` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does a UI/UX design agency do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A UI/UX design agency creates user interfaces and experiences for digital products. UI (User Interface) focuses on the visual design — colors, typography, layouts, and interactive elements. UX (User Experience) focuses on the overall feel — user flows, information architecture, usability, and how users accomplish their goals.",
      },
    },
    {
      "@type": "Question",
      name: "Do you design for both marketing sites and web apps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We design landing pages, marketing sites, SaaS dashboards, onboarding flows, and complex web applications. Our design process adapts to the context — conversion-focused for marketing, clarity-focused for product interfaces.",
      },
    },
    {
      "@type": "Question",
      name: "What tools do you use for design?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We design exclusively in Figma for prototyping, collaboration, and developer handoff. We also use Tailwind CSS design tokens to ensure pixel-perfect alignment between design and code.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide design-only services, or only full builds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer both. You can engage us for design-only (wireframes, prototypes, UI kits) or full design + development. Many clients start with design, then extend into build once the vision is clear.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the design phase typically take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard 5-page website design takes 1-2 weeks. SaaS dashboard and app design typically takes 2-4 weeks depending on complexity. We work in sprint cycles with regular reviews.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — UI/UX Design",
  description: pageDesc,
  url: `${SITE_URL}/services/ui-ux-design`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "UI/UX Design",
};

export default function UIDesign() {
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
      <UIDesignPage />
    </>
  );
}
