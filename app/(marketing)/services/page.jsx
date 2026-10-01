import { pageMetadata } from "@/lib/seo/config";
import ServicesPage from "@/components/pages/Services";
import { buildFaqJsonLd, buildHowToJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { serviceFaqs } from "@/data/faqs";
import JsonLd from "@/components/seo/JsonLd";

const pageTitle = "Software Development Services — SaaS & Web Apps";
const pageDesc =
  "Explore Meteoric's software development services for startups and businesses, from SaaS development and Next.js applications to landing pages and full-stack web development.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/services",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Services", path: "/services" }
]);

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
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={howToSchema} />
      <JsonLd data={faqJsonLd} />
      <ServicesPage />
    </>
  );
}
