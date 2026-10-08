import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import {
  organization,
  founder,
  founderProfiles,
} from "@/data/organization";

type JsonLd = Record<string, unknown>;

/** Person.sameAs — the profile links shown on /about (verified 2026-09-29). */
const PERSON_SAME_AS = founderProfiles.map((p) => p.url);

/**
 * Reusable JSON-LD builders — single source for every structured-data object
 * on the site. All @id values are anchored on https://withmeteoric.com.
 *
 * Rules encoded here (see AGENTS.md / content constraints):
 * - Canonical Organization + WebSite live in the root layout only — pages
 *   reference them by @id instead of redefining them.
 * - sameAs comes only from verified profile config (src/data/social.ts,
 *   src/data/organization.ts).
 * - No AggregateRating, Review, price, availability, or geo anywhere.
 *
 * @typedef {Record<string, unknown>} JsonLd
 */

/** Canonical Organization @id. */
export const ORG_ID = `${SITE_URL}/#organization`;
/** Canonical WebSite @id. */
export const WEBSITE_ID = `${SITE_URL}/#website`;
/** Canonical Person @id (Prashant Khuva). */
export const PERSON_ID = `${SITE_URL}/#prashant-khuva`;

/**
 * XSS-safe serialization for JSON-LD script tags.
 * Escapes `<`, `>`, `&`, and U+2028/U+2029 so user-influenced strings
 * (post titles, FAQ answers) can never close the script tag early.
 * Pattern recommended by the Next.js docs for inline JSON.
 *
 * @param {JsonLd} data
 * @returns {string}
 */
export function serializeJsonLd(data: JsonLd) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/[\u2028]/g, "\u2028")
    .replace(/[\u2029]/g, "\u2029");
}

/**
 * Canonical Organization — rendered once in the root layout (every route).
 * @returns {JsonLd}
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: organization.name,
    url: SITE_URL,
    logo: `${SITE_URL}${organization.logo}`,
    image: `${SITE_URL}${organization.image}`,
    description: organization.description,
    founder: { "@type": "Person", "@id": PERSON_ID, name: founder.name },
    foundingDate: organization.foundingDate,
    areaServed: organization.areaServed,
    knowsAbout: organization.knowsAbout,
    sameAs: organization.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: organization.contactEmail,
    },
  };
}

/**
 * Canonical WebSite — rendered once in the root layout (every route).
 * @returns {JsonLd}
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Person schema for Prashant Khuva — /about page.
 * @returns {JsonLd}
 */
export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: founder.name,
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/prashant.png`,
    jobTitle: founder.jobTitle,
    sameAs: PERSON_SAME_AS,
    knowsAbout: founder.knowsAbout,
    description: founder.description,
    affiliation: { "@id": ORG_ID },
    worksFor: { "@id": ORG_ID },
  };
}

/**
 * BreadcrumbList from a visible/logical trail.
 * @param {{ name: string, path: string }[]} trail — path "" = home ("/").
 * @returns {JsonLd}
 */
export function buildBreadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.path === "" ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * Service schema — used by /services/[slug] and the intent landing pages.
 * @param {{ name: string, description: string, path: string, serviceType?: string }} args
 * @returns {JsonLd}
 */
export function buildServiceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${path}#service`,
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: organization.areaServed,
    serviceType: serviceType || name,
  };
}

/**
 * Article schema for published blog posts.
 * @param {object} args
 * @param {string} args.headline
 * @param {string} args.description
 * @param {string} args.image — absolute URL
 * @param {string} args.datePublished — ISO date
 * @param {string} args.dateModified — ISO date
 * @param {string} args.path — e.g. "/blog/my-post"
 * @param {string[]} args.keywords
 * @returns {JsonLd}
 */
export function buildArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  path,
  keywords,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  path: string;
  keywords: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: founder.name,
      jobTitle: founder.jobTitle,
      url: `${SITE_URL}/about`,
      sameAs: PERSON_SAME_AS,
    },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: organization.name,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}${organization.logo}` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    keywords: keywords.join(", "),
    inLanguage: "en-US",
  };
}

/**
 * @param {{ question: string, answer: string }[]} questions
 * @returns {JsonLd}
 */
export function buildFaqJsonLd(
  questions: { question: string; answer: string }[] | undefined,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions!.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

/**
 * @param {{ name: string, text: string }[]} steps
 * @param {string} [name]
 * @returns {JsonLd}
 */
export function buildHowToJsonLd(
  steps: { name: string; text: string }[],
  name?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name || "How Meteoric builds web products",
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
