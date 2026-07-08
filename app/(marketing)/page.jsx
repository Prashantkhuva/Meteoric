import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";

const pageTitle = "Meteoric — Web & Software Development Agency for Startups & SaaS";
const pageDesc =
  "Meteoric is a software development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that convert. Book a free strategy call.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    siteName: "Meteoric",
    locale: "en_US",
    type: "website",
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/`,
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
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomePage />
      <HomeHashScroll />
    </>
  );
}
