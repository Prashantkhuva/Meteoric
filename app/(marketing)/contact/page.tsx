import { pageMetadata, absoluteUrl } from "@/lib/seo/config";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonLd";
import Contact from "@/components/pages/Contact";
import type { Faq } from "@/data/types";

const pageTitle = "Contact — Email or Book a Free Call";
const pageDesc =
  "Reach Meteoric by email or book a call. What happens after you get in touch, the project types we take on, and answers to common questions.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/contact",
  image: undefined,
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Contact", path: "/contact" },
]);

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  url: absoluteUrl("/contact"),
  description: pageDesc,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1"],
  },
};

const contactFaqs: Faq[] = [
  {
    question: "Is the strategy call free?",
    answer:
      "Yes. The video call is free and there is no obligation — discuss your goals, timeline, and budget, and decide afterwards.",
  },
  {
    question: "Do I work directly with the founder?",
    answer:
      "Yes. Every project is built directly by Prashant Khuva — no account managers, no agency layers.",
  },
  {
    question: "What happens after the call?",
    answer:
      "If the project is a fit, pricing is fixed and agreed after the scoping call, then work runs in 10-day sprint cycles with weekly demos.",
  },
  {
    question: "Can I email instead of booking?",
    answer:
      "Yes — email contact@withmeteoric.com with your project type, rough timeline, and budget range.",
  },
];

const faqJsonLd = buildFaqJsonLd(contactFaqs);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={faqJsonLd} />
      <Contact faqs={contactFaqs} />
    </>
  );
}
