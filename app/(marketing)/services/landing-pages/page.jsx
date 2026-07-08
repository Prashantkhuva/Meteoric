import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import LandingPagesPage from "@/components/pages/LandingPages";

const pageTitle = "Landing Page Design & Development Agency | Meteoric";
const pageDesc =
  "Meteoric is a landing page design and development agency. We build high-converting, beautifully animated landing pages for startups and founders — optimized for SEO, speed, and AI citations. Next.js, GSAP, Tailwind CSS.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services/landing-pages`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services/landing-pages`,
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
    { "@type": "ListItem", position: 3, name: "Landing Pages", item: `${SITE_URL}/services/landing-pages` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to design and build a landing page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A single landing page typically takes 5-10 days from kickoff to launch. Multi-page marketing sites take 2-4 weeks. We move fast without sacrificing quality.",
      },
    },
    {
      "@type": "Question",
      name: "Do you optimize landing pages for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every landing page ships with proper semantic HTML, meta tags, Open Graph cards, structured data (JSON-LD), and fast Core Web Vitals. We also optimize for GEO (Generative Engine Optimization) to get cited by AI chatbots like ChatGPT and Perplexity.",
      },
    },
    {
      "@type": "Question",
      name: "Can you redesign an existing landing page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We regularly audit and redesign existing pages to improve conversion rates, load speed, and visual impact. We keep what works and elevate what doesn't.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a landing page cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A single high-converting landing page starts at $4,000-$8,000. Multi-page marketing sites range from $10,000-$20,000. Every project includes design, development, animations, SEO setup, and one round of revisions.",
      },
    },
    {
      "@type": "Question",
      name: "Do you include animations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Scroll-triggered animations, micro-interactions, and page transitions using GSAP and Framer Motion. Every animation is purposeful and performance-optimized, never decorative fluff.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Landing Page Design & Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/services/landing-pages`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Landing Page Development",
};

export default function LandingPages() {
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
      <LandingPagesPage />
    </>
  );
}
