import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
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

const popularServices = [
  { label: "SaaS MVP Development", to: "/saas-mvp-development" },
  { label: "Next.js Development Agency", to: "/nextjs-development-agency" },
  { label: "Startup Landing Page Design", to: "/startup-landing-page-design" },
  { label: "Web App Development", to: "/web-app-development" },
];

function PopularServices() {
  return (
    <section
      aria-labelledby="popular-services-heading"
      className="border-t"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <h2
          id="popular-services-heading"
          className="text-xs font-semibold uppercase tracking-wider mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Popular services
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((service, i) => (
            <li key={service.to}>
              <ScrollReveal
                direction="up"
                delay={0.08 * i}
                className="h-full"
              >
                <Link
                  href={service.to}
                  className="block h-full rounded-xl border p-5 transition-colors hover:border-[var(--border-hover)]"
                  style={{
                    borderColor: "var(--border-color)",
                    background: "var(--card-bg)",
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-body)" }}
                  >
                    {service.label}
                  </span>
                  <span
                    className="mt-1 block text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    View service
                  </span>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={navigationSchema} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
      <HomePage />
      <PopularServices />
      <HomeHashScroll />
    </>
  );
}
