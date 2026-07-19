import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL } from "@/lib/seo/config";

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
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/`,
    siteName: "Meteoric",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1635,
        height: 962,
        alt: "Meteoric — Web & Software Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDesc,
    images: [`${SITE_URL}/og.png`],
    creator: "@prashantkhuva_",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
  ],
};

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Meteoric — Web & Software Development Agency",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only"],
  },
};

export default function Home() {
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
      <HomePage />
      <HomeHashScroll />
    </>
  );
}
