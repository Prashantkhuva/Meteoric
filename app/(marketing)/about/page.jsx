import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import AboutPage from "@/components/pages/About";

const pageTitle = "About Meteoric | Web & Product Development Studio for Founders";
const pageDesc =
  "Meteoric is a product development studio that partners with founders to design, build, and launch modern web products and SaaS platforms. No bloat, no agencies — just production-ready work that ships on time.";

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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prashant Khuva",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/prashant.png`,
  jobTitle: "Founder & Full-Stack Developer",
  sameAs: [
    "https://github.com/Prashantkhuva",
    "https://www.linkedin.com/in/prashantkhuva",
    "https://x.com/prashantkhuva_",
    "https://www.instagram.com/prashant.khuva/",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "MERN Stack",
    "SaaS Development",
    "Web Development",
    "Full-Stack Development",
    "Product Design",
  ],
  description:
    "Founder of Meteoric, a product development studio. Full-stack developer with expertise in React, Next.js, Node.js, and the MERN stack. Previously built FullStack Craft. Has shipped 12+ production projects for startups and founders.",
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AboutPage />
    </>
  );
}
