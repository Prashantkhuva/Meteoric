import { pageMetadata } from "@/lib/seo/config";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/jsonLd";
import AboutPage from "@/components/pages/About";

const pageTitle = "About Meteoric — Founder-Led Web Development Studio";
const pageDesc =
  "Meteoric is a founder-led web development studio for startups and SaaS. Founded in 2026 by Prashant Khuva, full-stack developer based in India.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/about",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "About", path: "/about" },
]);

const personJsonLd = buildPersonJsonLd();

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "About Meteoric — Founder-Led Web Development Studio",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

const aboutFaqs = [
  {
    question: "Who is behind Meteoric?",
    answer: "Meteoric was founded in 2026 by Prashant Khuva, a full-stack developer based in India who previously built FullStack Craft. Every project at Meteoric is built directly by the founder — no account managers, no agency layers.",
  },
  {
    question: "What kind of projects does Meteoric take on?",
    answer: "Meteoric builds SaaS platforms, landing pages, full-stack web applications, and MVPs for startups and founders. Every project is built directly by the founder.",
  },
  {
    question: "How does Meteoric differ from other agencies?",
    answer: "Direct founder involvement on every project from first conversation to final deploy — no account managers or layers. Clean code, clear timelines, 10-day sprint cycles, and a ship mentality focused on production-ready work that launches on time.",
  },
  {
    question: "What technologies does Meteoric specialize in?",
    answer: "Core stack: React, Next.js, Node.js, Tailwind CSS, Supabase, Stripe, Framer Motion, and GSAP. The agency adapts to existing tech stacks when needed and has experience with various databases and backend services.",
  },
];

const faqSchema = buildFaqJsonLd(aboutFaqs);

export default function About() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={personJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={faqSchema} />
      <AboutPage faqs={aboutFaqs} />
    </>
  );
}
