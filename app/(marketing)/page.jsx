import HomePage from "@/components/pages/Home";
import HomeHashScroll from "./HomeHashScroll";
import { SITE_URL } from "@/lib/seo/config";
import { buildHowToJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "Meteoric — Web & Software Development Agency for Startups & SaaS";
const pageDesc =
  "Meteoric is a software development agency that designs and builds high-performance websites, SaaS platforms, and full-stack applications that convert. Book a free strategy call.";

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
  { name: "Discovery", text: "We align on the product vision, audience, requirements, and goals before development begins." },
  { name: "Design Direction", text: "Interfaces and user flows designed around clarity, usability, and modern interaction patterns." },
  { name: "Development", text: "Frontend and backend systems engineered for performance, scalability, and maintainability." },
  { name: "Launch", text: "Deployment, optimization, and final polishing before the product goes live." },
]);

const faqs = [
  {
    question: "What's your typical development process?",
    answer: "We start with a discovery call to understand your vision and requirements. Then we move through design direction, development sprints, and finally launch. The entire process is transparent with weekly updates and a clear timeline.",
  },
  {
    question: "How long does it take to build a website or SaaS?",
    answer: "Landing pages typically take 3–7 days. Web applications range from 2–6 weeks depending on complexity. SaaS products take 4–10 weeks. We'll give you a precise timeline after our discovery call.",
  },
  {
    question: "Do you only work with MERN stack?",
    answer: "MERN is our core stack, but we're flexible. We've worked with Appwrite, Supabase, various databases, and can adapt to your existing tech stack if needed.",
  },
  {
    question: "What happens after launch? Do you provide support?",
    answer: "Yes. We include post-launch support for bug fixes, tweaks, and guidance. We don't disappear after delivery — we treat every product as a long-term partnership.",
  },
  {
    question: "How do I get started?",
    answer: "Book a free strategy call using the button below. We'll discuss your project, give you a timeline and estimate, and if we're a good fit, we'll start within the week.",
  },
];

const faqSchema = buildFaqJsonLd(faqs);

const fallbackTestimonials = [
  { rating: 5, author: "Rohan Mehta", quote: "Meteoric redesigned our entire SaaS dashboard and the result was exceptional — cleaner UX, faster load times, and our users actually noticed the difference." },
  { rating: 5, author: "Sarah Mitchell", quote: "Working with Meteoric felt more like a partnership than a vendor relationship. They understood our B2B SaaS vision from day one and brought UX ideas we hadn't even considered." },
  { rating: 5, author: "James Park", quote: "We needed a complete brand website redesign and got way more than we expected. The attention to detail in both design and performance is rare to find." },
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

export default function Home() {
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
