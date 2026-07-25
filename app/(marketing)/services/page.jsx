import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import ServicesPage from "@/components/pages/Services";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "SaaS MVP Development Services for Startups | Meteoric";
const pageDesc =
  "Meteoric ships SaaS MVPs in 3–6 weeks. From prototype to production — Next.js, Supabase, and modern full-stack tooling. Book a free strategy call to start.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services`,
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
  ],
};

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Services | Meteoric — SaaS & Startup Web Development Agency",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: "Meteoric",
      url: SITE_URL,
      description: "Web and SaaS development agency for startups. We build high-performance websites, SaaS platforms, and full-stack applications.",
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Landing Pages",
              description: "High-converting, fast-loading landing pages designed to make a lasting impression. Built with Next.js and optimized for SEO, speed, and conversion.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS Development",
              description: "From MVP prototypes to production SaaS platforms. We design, build, and launch complete products — auth, dashboards, payments, and everything in between.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Web Applications",
              description: "Custom web applications — dashboards, internal tools, and customer-facing platforms. Clean UI, solid backend, built to perform at scale.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Full-Stack Development",
              description: "Frontend to backend, database to deployment. We build complete systems — APIs, auth, integrations, and polished interfaces — all under one roof.",
            },
          },
        ],
      },
    },
  ],
};

const serviceFaqs = [
  {
    question: "How much does it cost to build a website or SaaS with Meteoric?",
    answer:
      "Pricing depends on project scope. Landing pages start at lower budgets and deliver in 3-7 days. Full-stack web applications range from 2-6 weeks, and SaaS products from 4-10 weeks. Contact us for a free custom quote based on your specific requirements.",
  },
  {
    question: "How long does it take to build a SaaS product?",
    answer:
      "SaaS products typically take 4-10 weeks from discovery to launch. MVP prototypes can ship in 3-6 weeks. We provide a precise timeline after our free strategy call based on your feature requirements and complexity.",
  },
  {
    question: "What technologies does Meteoric use?",
    answer:
      "Our core stack is React, Next.js, Node.js, and the MERN stack. We also use Supabase, Stripe, Tailwind CSS, Framer Motion, GSAP, and PostgreSQL. We adapt to your existing tech stack if needed.",
  },
  {
    question: "Do you work with startups or established companies?",
    answer:
      "Both. We specialize in helping startups launch MVPs and scale to production, but we also work with established companies on redesigns, performance optimization, and new product development. Our process adapts to your stage.",
  },
  {
    question: "What happens after my website or app launches?",
    answer:
      "Every project includes post-launch support for bug fixes, tweaks, and guidance. We don't disappear after delivery. We treat every product as a long-term partnership and offer ongoing maintenance and feature development.",
  },
  {
    question: "How is Meteoric different from other development agencies?",
    answer:
      "Direct founder involvement on every project — no account managers, no layers of abstraction. We ship 12+ production projects with 100% client satisfaction, using a structured 10-day sprint cycle with weekly updates and transparent communication.",
  },
  {
    question: "What is an MVP in SaaS?",
    answer:
      "An MVP (Minimum Viable Product) in SaaS is the leanest version of your product that still delivers core value to early users. It includes only the essential features needed to validate your idea, gather real feedback, and start generating revenue — without over-investing in polish before proving product-market fit.",
  },
  {
    question: "How do I go from MVP to a full SaaS product?",
    answer:
      "After validating your MVP with real users, we iterate based on feedback — adding features, improving performance, and scaling infrastructure. Meteoric handles the full lifecycle: MVP in 3–6 weeks, then ongoing sprints for feature expansion, analytics, billing, and team onboarding. No rebuilds, just continuous improvement.",
  },
];

const faqJsonLd = buildFaqJsonLd(serviceFaqs);

export default function Services() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ServicesPage />
    </>
  );
}
