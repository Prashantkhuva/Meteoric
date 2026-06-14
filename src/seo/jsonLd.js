import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../seo.config.js";

const SITE_WEBSITE_ID = `${SITE_URL}/#website`;
const SITE_ORG_ID = `${SITE_URL}/#organization`;
const SITE_LOGO_URL = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

export function buildSeoJsonLd({ title, description, canonicalUrl }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": SITE_ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
        description:
          "Web development agency building high-performance websites, SaaS platforms, and full-stack applications for startups and founders.",
        foundingDate: "2024",
        founder: {
          "@type": "Person",
          name: "Prashant Khuva",
          url: `${SITE_URL}/about`,
        },
        sameAs: [
          "https://github.com/Prashantkhuva",
          "https://www.linkedin.com/in/prashantkhuva",
          "https://x.com/prashantkhuva_",
          "https://www.instagram.com/prashant.khuva/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": SITE_WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": SITE_ORG_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: { "@id": SITE_WEBSITE_ID },
        about: { "@id": SITE_ORG_ID },
      },
    ],
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO_URL,
    image: SITE_LOGO_URL,
    priceRange: "$$",
    description:
      "Web development agency specializing in React, Node.js, SaaS products, and full-stack web applications for startups and founders.",
    areaServed: { "@type": "Country", name: "India" },
    availableLanguage: ["English", "Hindi"],
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Prashant Khuva",
      url: `${SITE_URL}/about`,
    },
    sameAs: [
      "https://github.com/Prashantkhuva",
      "https://www.linkedin.com/in/prashantkhuva",
      "https://x.com/prashantkhuva_",
      "https://www.instagram.com/prashant.khuva/",
    ],
  };
}

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

export function buildProductJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: product.url,
    image: product.image
      ? { "@type": "ImageObject", url: product.image }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price || "0",
      priceCurrency: product.currency || "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
