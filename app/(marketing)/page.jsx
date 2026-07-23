import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL } from "@/lib/seo/config";
import { buildHowToJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonLd";
import { homeFaqs } from "@/data/faqs";

const pageTitle =
  "Meteoric — Web & Software Development Agency for Startups & SaaS";
const pageDesc =
   "Meteoric builds high-performance websites, SaaS platforms, and full-stack applications for startups. Book a free strategy call.";

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

const howToSchema = buildHowToJsonLd([
  {
    name: "Discovery",
    text: "We align on the product vision, audience, requirements, and goals before development begins.",
  },
  {
    name: "Design Direction",
    text: "Interfaces and user flows designed around clarity, usability, and modern interaction patterns.",
  },
  {
    name: "Development",
    text: "Frontend and backend systems engineered for performance, scalability, and maintainability.",
  },
  {
    name: "Launch",
    text: "Deployment, optimization, and final polishing before the product goes live.",
  },
]);

const faqSchema = buildFaqJsonLd(homeFaqs);

const fallbackTestimonials = [
  {
    rating: 5,
    author: "Rohan Mehta",
    quote:
      "Meteoric redesigned our entire SaaS dashboard and the result was exceptional — cleaner UX, faster load times, and our users actually noticed the difference.",
  },
  {
    rating: 5,
    author: "Sarah Mitchell",
    quote:
      "Working with Meteoric felt more like a partnership than a vendor relationship. They understood our B2B SaaS vision from day one and brought UX ideas we hadn't even considered.",
  },
  {
    rating: 5,
    author: "James Park",
    quote:
      "We needed a complete brand website redesign and got way more than we expected. The attention to detail in both design and performance is rare to find.",
  },
];

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Meteoric",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    ratingCount: "3",
  },
  review: fallbackTestimonials.map((t) => ({
    "@type": "Review",
    itemReviewed: { "@type": "Organization", name: "Meteoric" },
    reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5" },
    author: { "@type": "Person", name: t.author },
    reviewBody: t.quote,
  })),
};

export default async function Home() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <HomePage />
      <HomeHashScroll />
    </>
  );
}
