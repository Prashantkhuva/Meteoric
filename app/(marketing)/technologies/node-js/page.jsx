import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import NodeJsTechPage from "@/components/pages/NodeJsTech";

const pageTitle = "Node.js Development Agency | Meteoric — Backend & API Experts";
const pageDesc =
  "Meteoric is a Node.js development agency specializing in scalable backend systems, REST APIs, and full-stack JavaScript applications. Expert Node.js development for startups and SaaS products.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: { canonical: `${SITE_URL}/technologies/node-js` },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/technologies/node-js`,
    images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1635, height: 962, alt: pageTitle }],
  },
  twitter: { card: "summary_large_image", site: "@prashantkhuva_", creator: "@prashantkhuva_", title: pageTitle, description: pageDesc, images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Technologies", item: `${SITE_URL}/technologies/node-js` },
    { "@type": "ListItem", position: 3, name: "Node.js", item: `${SITE_URL}/technologies/node-js` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Node.js Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/technologies/node-js`,
  provider: { "@type": "Organization", name: "Meteoric", url: SITE_URL },
  areaServed: "Worldwide",
  serviceType: "Node.js Development",
};

export default function NodeJsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <NodeJsTechPage />
    </>
  );
}
