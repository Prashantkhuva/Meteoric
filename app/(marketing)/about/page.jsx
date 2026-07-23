import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import AboutPage from "@/components/pages/About";

const pageTitle = "About Meteoric | Web & Product Development Studio for Founders";
const pageDesc =
   "Meteoric partners with founders to design, build, and launch modern web products and SaaS platforms. Direct founder involvement on every project.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
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
    { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about#person`,
  name: "Prashant Khuva",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/prashant.png`,
  jobTitle: "Founder & Full-Stack Developer",
  sameAs: [
    "https://github.com/Prashantkhuva",
    "https://www.linkedin.com/company/withmeteoric",
    "https://x.com/prashantkhuva_",
    "https://www.instagram.com/officialmeteoric/",
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

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "About Meteoric | Web & Product Development Studio for Founders",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only"],
  },
};

const aboutFaqs = [
  {
    question: "Who is behind Meteoric?",
    answer: "Meteoric was founded in 2026 by Prashant Khuva, a full-stack developer and product builder based in India. Previously built FullStack Craft. Every project at Meteoric is built directly by the founder — no account managers, no agency layers.",
  },
  {
    question: "What kind of projects does Meteoric take on?",
    answer: "Meteoric builds SaaS platforms, landing pages, full-stack web applications, and MVPs for startups and founders. The agency has shipped 12+ production projects with clients including Finlytix, LaunchBright, and Stellar Labs.",
  },
  {
    question: "How does Meteoric differ from other agencies?",
    answer: "Direct founder involvement on every project from first conversation to final deploy — no account managers or layers. Clean code, clear timelines, 10-day sprint cycles, and a ship mentality focused on production-ready work that launches on time.",
  },
  {
    question: "What technologies does Meteoric specialize in?",
    answer: "Core stack: React, Next.js, Node.js, Tailwind CSS, Supabase, Stripe, Framer Motion, and GSAP. The agency adapts to existing tech stacks when needed and has experience with various databases and backend services.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: aboutFaqs.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.answer },
  })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutPage faqs={aboutFaqs} />
    </>
  );
}
