import { SITE_URL, DEFAULT_OG_IMAGE } from "@/seo.config";
import AboutPage from "@/page-content/About";

const pageTitle = "About Meteoric | Web Development Agency for Founders";
const pageDesc =
  "Meteoric is a product studio that partners with founders to design, develop, and launch modern web products. No bloat, no agencies — just production-ready work that ships on time.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/about`,
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
    { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
  ],
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutPage />
    </>
  );
}
