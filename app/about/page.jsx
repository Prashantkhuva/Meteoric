export const metadata = {
  title: "About Meteoric | Web Development Agency for Founders",
  description:
    "Meteoric is a product studio that partners with founders to design, develop, and launch modern web products. No bloat, no agencies — just production-ready work that ships on time.",
  openGraph: {
    title: "About Meteoric | Web Development Agency for Founders",
    description:
      "Meteoric is a product studio that partners with founders to design, develop, and launch modern web products. No bloat, no agencies — just production-ready work that ships on time.",
    url: "https://withmeteoric.vercel.app/about",
    images: [
      {
        url: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
        secureUrl: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
        width: 1635,
        height: 962,
        alt: "About Meteoric — Web Development Agency for Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    title: "About Meteoric | Web Development Agency for Founders",
    description:
      "Meteoric is a product studio that partners with founders to design, develop, and launch modern web products. No bloat, no agencies — just production-ready work that ships on time.",
    images: ["https://withmeteoric.vercel.app/og-image.png?v=20260508"],
  },
};

import AboutPage from "@/page-content/About";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://withmeteoric.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://withmeteoric.vercel.app/about" },
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
