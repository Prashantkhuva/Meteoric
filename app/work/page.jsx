import { SITE_URL, DEFAULT_OG_IMAGE } from "@/seo.config";
import WorkPage from "@/page-content/Work";

const pageTitle = "Our Work — Meteoric Portfolio | Web Development Projects";
const pageDesc =
  "Browse Meteoric's portfolio of shipped projects — landing pages, SaaS platforms, VS Code extensions, and more. Built for founders who ship.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
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

export default function Work() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WorkPage />
    </>
  );
}
