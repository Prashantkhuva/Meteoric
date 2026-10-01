import { SITE_URL, pageMetadata } from "@/lib/seo/config";
import CaseStudiesPage from "@/components/pages/CaseStudies";
import { caseStudies } from "@/data/case-studies";
import { projects } from "@/data/projects";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "Case Studies — SaaS MVP & Full-Stack Breakdowns";
const pageDesc =
  "In-depth breakdowns of how Meteoric ships SaaS MVPs and full-stack apps for startups — architecture, stack choices, and results.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/case-studies",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Case Studies", path: "/case-studies" }
]);

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  description: pageDesc,
  url: `${SITE_URL}/case-studies`,
  hasPart: caseStudies
    .filter((cs) => {
      if (cs.draft === true) return false;
      return projects.some((p) => p.caseStudySlug === cs.slug && p.draft !== true);
    })
    .map((cs) => {
      const project = projects.find((p) => p.caseStudySlug === cs.slug);
      return {
        "@type": "CreativeWork",
        name: cs.name,
        description: cs.tagline,
        url: `${SITE_URL}/work/${project.slug}`,
      };
    }),
};

export default function CaseStudiesRoute() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <CaseStudiesPage />
    </>
  );
}
