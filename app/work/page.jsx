export const metadata = {
  title: "Our Work — Meteoric Portfolio | Web Development Projects",
  description:
    "Browse Meteoric's portfolio of shipped projects — landing pages, SaaS platforms, VS Code extensions, and more. Built for founders who ship.",
  openGraph: {
    title: "Our Work — Meteoric Portfolio | Web Development Projects",
    description:
      "Browse Meteoric's portfolio of shipped projects — landing pages, SaaS platforms, VS Code extensions, and more. Built for founders who ship.",
    url: "https://withmeteoric.vercel.app/work",
    images: [
      {
        url: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
        secureUrl: "https://withmeteoric.vercel.app/og-image.png?v=20260508",
        width: 1635,
        height: 962,
        alt: "Our Work — Meteoric Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    title: "Our Work — Meteoric Portfolio | Web Development Projects",
    description:
      "Browse Meteoric's portfolio of shipped projects — landing pages, SaaS platforms, VS Code extensions, and more. Built for founders who ship.",
    images: ["https://withmeteoric.vercel.app/og-image.png?v=20260508"],
  },
};

import WorkPage from "@/page-content/Work";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://withmeteoric.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "Work", item: "https://withmeteoric.vercel.app/work" },
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
