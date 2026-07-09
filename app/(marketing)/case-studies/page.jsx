import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import CaseStudiesPage from "@/components/pages/CaseStudies";
import { caseStudies } from "@/data/case-studies";

const pageTitle = "Case Studies | Meteoric — Web Development Projects & Results";
const pageDesc =
  "Real projects, real results. See how Meteoric ships production web applications for startups — from SaaS platforms to marketing sites, with measurable outcomes.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: { canonical: `${SITE_URL}/case-studies` },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/case-studies`,
    images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1635, height: 962, alt: pageTitle }],
  },
  twitter: { card: "summary_large_image", site: "@prashantkhuva_", creator: "@prashantkhuva_", title: pageTitle, description: pageDesc, images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Case Studies", item: `${SITE_URL}/case-studies` },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  description: pageDesc,
  url: `${SITE_URL}/case-studies`,
  hasPart: caseStudies.map((cs) => ({
    "@type": "CreativeWork",
    name: cs.name,
    description: cs.tagline,
    url: `${SITE_URL}/case-studies#${cs.slug}`,
  })),
};

export default function CaseStudiesRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <CaseStudiesPage />
    </>
  );
}
