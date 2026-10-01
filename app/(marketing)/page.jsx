import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL, pageMetadata } from "@/lib/seo/config";
import JsonLd from "@/components/seo/JsonLd";
import { buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { homeFaqs } from "@/data/faqs";
import { processSteps } from "@/data/process-steps";

const pageDesc =
  "Meteoric is a founder-led software development studio building SaaS products, web applications, and high-performance websites for startups and growing businesses.";

// No `title` here — inherits the site default (SITE_TITLE) from the root layout.
export const metadata = pageMetadata({
  description: pageDesc,
  path: "/",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Home", path: "" }]);

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Meteoric — Web & Software Development Agency",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

const howToSchema = buildHowToJsonLd(
  processSteps.map((step) => ({
    name: step.title,
    text: step.description,
  }))
);

const faqSchema = buildFaqJsonLd(homeFaqs);

const navigationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SiteNavigationElement",
      name: "Main Navigation",
      description: "Primary site navigation links",
      url: SITE_URL,
      hasPart: [
        {
          "@type": "SiteNavigationElement",
          name: "Work",
          url: `${SITE_URL}/work`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Services",
          url: `${SITE_URL}/services`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "About",
          url: `${SITE_URL}/about`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Blog",
          url: `${SITE_URL}/blog`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Case Studies",
          url: `${SITE_URL}/case-studies`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Contact",
          url: `${SITE_URL}/contact`,
        },
      ],
    },
  ],
};

export default async function Home() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={navigationSchema} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
      <HomePage />
      <HomeHashScroll />
    </>
  );
}
