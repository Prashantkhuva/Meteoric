import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/seo.config";

const SITE_WEBSITE_ID = `${SITE_URL}/#website`;
const SITE_ORG_ID = `${SITE_URL}/#organization`;
const SITE_LOGO_URL = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

export function buildFaqJsonLd(questions) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function buildHowToJsonLd(steps) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Meteoric builds web products",
    description:
      "A structured process for modern product development — from strategy and design to development and launch.",
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
