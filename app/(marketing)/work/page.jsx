import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import WorkPage from "@/components/pages/Work";
import { projects } from "@/data/projects";

const pageTitle = "Our Work — Meteoric Portfolio | Software & Web Development Projects";
const pageDesc =
  "Browse Meteoric's portfolio of shipped software and web development projects — SaaS platforms, landing pages, MVPs, and full-stack applications. Built for founders who ship.";

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <WorkPage />
    </>
  );
}
