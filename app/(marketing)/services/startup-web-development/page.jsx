import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import StartupWebDevelopmentPage from "@/components/pages/StartupWebDevelopment";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "Startup Web Development Agency | MVP & Product Launch — Meteoric";
const pageDesc =
  "Meteoric is a startup web development agency that builds fast, production-ready websites and MVPs. From idea to launch in weeks — built with Next.js, React, and modern tooling.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/startup-web-development`,
  },
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
    { "@type": "ListItem", position: 3, name: "Startup Web Development", item: `${SITE_URL}/services/startup-web-development` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Startup Web Development",
  url: `${SITE_URL}/services/startup-web-development`,
  description: "Startup web development agency. We build MVPs, landing pages, and full-stack web applications for founders who need to launch fast.",
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Startup Web Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "MVP Development",
          description: "Production-ready MVPs built in 2-6 weeks. Auth, dashboards, APIs — everything you need to validate with real users.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Startup Websites & Landing Pages",
          description: "High-converting marketing sites built with Next.js. SEO-optimized, fast-loading, and designed to convert visitors into users.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full-Stack Web Applications",
          description: "Custom web applications with React, Next.js, Node.js, and Supabase. Dashboards, internal tools, and customer-facing platforms.",
        },
      },
    ],
  },
};

const serviceFaqs = [
  {
    question: "How much does it cost to build a startup website or MVP?",
    answer: "Landing pages start at lower budgets and ship in 3-7 days. MVPs with auth, dashboards, and core features take 2-6 weeks. We provide a fixed quote after a free discovery call based on your specific requirements.",
  },
  {
    question: "How long does it take to build an MVP?",
    answer: "A focused MVP with core features typically takes 2-6 weeks. We ship usable increments every week so you can validate with real users early and iterate based on feedback.",
  },
  {
    question: "What technologies does Meteoric use?",
    answer: "Our core stack is React, Next.js, Node.js, and the MERN stack. We also use Supabase, Stripe, Tailwind CSS, and PostgreSQL. We adapt to your existing tech stack if needed.",
  },
  {
    question: "Do you work with non-technical founders?",
    answer: "Yes. We communicate in plain English, handle all technical complexity, and provide weekly updates. You focus on your vision and customers — we handle the code.",
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes. Every project includes post-launch support for bug fixes, tweaks, and guidance. We don't disappear after delivery — we treat every product as a long-term partnership.",
  },
];

const faqJsonLd = buildFaqJsonLd(serviceFaqs);

export default function StartupWebDevelopment() {
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
      <StartupWebDevelopmentPage />
    </>
  );
}
