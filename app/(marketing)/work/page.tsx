import { SITE_URL, SITE_NAME, pageMetadata } from "@/lib/seo/config";
import WorkPage from "@/components/pages/Work";
import { projects } from "@/data/projects";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID } from "@/lib/seo/jsonLd";

const pageTitle = "Our Work — Web Design & Development Projects";
const pageDesc =
  "See how Meteoric builds SaaS MVPs, dashboards, and full-stack products for startups. Real projects, real code, real outcomes.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/work",
  image: undefined,
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Work", path: "/work" }
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

const creativeWorkSchema = {
  "@context": "https://schema.org",
  "@graph": projects
    .filter((p) => p.slug && p.draft !== true)
    .map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      description: p.description,
      url: `${SITE_URL}/work/${p.slug}`,
      image: `${SITE_URL}${p.image}`,
      keywords: p.technology.join(", "),
      author: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
      },
      inLanguage: "en-US",
    })),
};

export default function Work() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={creativeWorkSchema} />
      <WorkPage />
    </>
  );
}
