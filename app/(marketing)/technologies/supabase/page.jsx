import { SITE_URL } from "@/lib/seo/config";
import SupabasePage from "@/components/pages/SupabaseTech";

const pageTitle = "Supabase Agency & Consultants | Meteoric — PostgreSQL Backend Experts";
const pageDesc =
  "Meteoric is a Supabase development agency. We build full-stack applications on Supabase — authentication, realtime, Row Level Security, and PostgreSQL. Expert Supabase consulting for startups and SaaS products.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/technologies/supabase`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/technologies/supabase`,
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
    { "@type": "ListItem", position: 2, name: "Technologies", item: `${SITE_URL}/technologies/supabase` },
    { "@type": "ListItem", position: 3, name: "Supabase", item: `${SITE_URL}/technologies/supabase` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Meteoric — Supabase Development Agency",
  description: pageDesc,
  url: `${SITE_URL}/technologies/supabase`,
  provider: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: "Supabase Development",
};

export default function Supabase() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <SupabasePage />
    </>
  );
}
