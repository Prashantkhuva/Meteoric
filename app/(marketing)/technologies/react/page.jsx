import { SITE_URL } from "@/lib/seo/config";
import ReactTechPage from "@/components/pages/ReactTech";

const pageTitle = "React Development Agency | Meteoric — React.js Experts for Startups";
const pageDesc =
  "Meteoric is a React development agency building high-performance UI with React 19, Server Components, and modern patterns. From dashboards to full SaaS platforms — expert React development for startups.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: { canonical: `${SITE_URL}/technologies/react` },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/technologies/react`,
    images: [{ url: `${SITE_URL}/og-image.png?v=20260706`, width: 1635, height: 962, alt: pageTitle }],
  },
  twitter: { card: "summary_large_image", site: "@prashantkhuva_", creator: "@prashantkhuva_", title: pageTitle, description: pageDesc, images: [`${SITE_URL}/og-image.png?v=20260706`] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Technologies", item: `${SITE_URL}/technologies/react` },
    { "@type": "ListItem", position: 3, name: "React", item: `${SITE_URL}/technologies/react` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — React Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/technologies/react`,
  provider: { "@type": "Organization", name: "Meteoric", url: SITE_URL },
  areaServed: "Worldwide",
  serviceType: "React Development",
};

export default function ReactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ReactTechPage />
    </>
  );
}
