import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import ServicesPage from "@/components/pages/Services";
import { buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo/jsonLd";
import { serviceFaqs } from "@/data/faqs";

const pageTitle = "Software Development Services | SaaS, Web Apps & Next.js | Meteoric";
const pageDesc =
  "Explore Meteoric's software development services for startups and businesses, from SaaS development and Next.js applications to landing pages and full-stack web development.";

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
        width: 1200,
        height: 630,
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
  name: "Web Development Agency for Startups & SaaS | Meteoric",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

const faqJsonLd = buildFaqJsonLd(serviceFaqs);

const howToSchema = buildHowToJsonLd([
  {
    name: "Discovery & Strategy",
    text: "We align on the product vision, audience, requirements, and goals before development begins. This includes a free strategy call to scope your project.",
  },
  {
    name: "Design Direction",
    text: "Interfaces and user flows designed around clarity, usability, and modern interaction patterns. We create wireframes and visual designs tailored to your brand.",
  },
  {
    name: "Development Sprints",
    text: "Frontend and backend systems engineered for performance, scalability, and maintainability. We build in 10-day sprints with weekly updates and transparent communication.",
  },
  {
    name: "Launch & Support",
    text: "Deployment, optimization, and final polishing before the product goes live. Post-launch support and maintenance included with every project.",
  },
]);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ServicesPage />
    </>
  );
}
