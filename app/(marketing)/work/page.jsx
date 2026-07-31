import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import WorkPage from "@/components/pages/Work";
import { projects } from "@/data/projects";

const pageTitle = "Selected Work — Websites, SaaS & Web Apps | Meteoric";
const pageDesc =
   "A curated portfolio of products Meteoric has designed, built, and launched — SaaS platforms, marketing sites, and full-stack applications for founders.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/work`,
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        secureUrl: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: 1635,
        height: 962,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    creator: "@prashantkhuva_",
    title: pageTitle,
    description: pageDesc,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
  ],
};

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
  "@graph": projects.map((p) => ({
    "@type": "CreativeWork",
    name: p.name,
    description: p.description,
    url: p.link,
    keywords: p.tags.join(", "),
    author: {
      "@type": "Organization",
      name: "Meteoric",
      url: SITE_URL,
    },
    datePublished: "2026-01-15",
    inLanguage: "en-US",
  })),
};

export default function Work() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <WorkPage />
    </>
  );
}
