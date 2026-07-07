import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import ServicesPage from "@/components/pages/Services";

const pageTitle = "Services | Meteoric — Web & SaaS Development for Startups";
const pageDesc =
  "Meteoric offers SaaS development and startup web development services. From MVP prototypes to production platforms — built with Next.js, Supabase, and modern tooling.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/services`,
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
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
  ],
};

export default function Services() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ServicesPage />
    </>
  );
}
