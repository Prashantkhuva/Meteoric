import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-20">
        <ScrollReveal direction="up">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p
                className="uppercase tracking-[0.15em] text-caption font-medium mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Popular Services
              </p>
              <h2
                id="popular-services-heading"
                className="text-2xl sm:text-3xl font-normal tracking-[-0.02em]"
                style={{ color: "var(--text-primary)" }}
              >
                Start with a proven engagement
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 hover:opacity-70 shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              All services
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>
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
                  className="group relative block h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]"
                  style={{
                    borderColor: "var(--border-color)",
                    background: "var(--card-bg)",
                  }}
                >
                  <span
                    className="absolute font-semibold tabular-nums opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.14] right-5 top-4 text-4xl leading-none select-none"
                    style={{ color: "var(--text-primary)" }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="block text-base font-medium pr-10 leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {service.label}
                  </span>
                  <span
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors duration-300"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="transition-colors duration-300 group-hover:text-[var(--text-primary)]">
                      View service
                    </span>
                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span
                    className="absolute left-6 right-6 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    style={{ background: "var(--border-hover)" }}
                    aria-hidden="true"
                  />
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
        <ScrollReveal direction="up" delay={0.1}>
          <Link
            href="/services"
            className="sm:hidden mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            All services
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </ScrollReveal>
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
