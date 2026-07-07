import { SITE_URL } from "@/lib/seo/config";
import NextJsPage from "@/components/pages/NextJsTech";

const pageTitle = "Next.js Development Agency | Meteoric — React & Next.js Experts";
const pageDesc =
  "Meteoric is a Next.js development agency specializing in high-performance React applications. From landing pages to full-stack SaaS platforms — built with Next.js 16, App Router, and modern React patterns.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/technologies/next-js`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/technologies/next-js`,
    images: [
      {
        url: `${SITE_URL}/og-image.png?v=20260706`,
        secureUrl: `${SITE_URL}/og-image.png?v=20260706`,
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
    images: [`${SITE_URL}/og-image.png?v=20260706`],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Technologies", item: `${SITE_URL}/technologies/next-js` },
    { "@type": "ListItem", position: 3, name: "Next.js", item: `${SITE_URL}/technologies/next-js` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Next.js Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/technologies/next-js`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Next.js Development",
};

export default function NextJs() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <NextJsPage />
    </>
  );
}
