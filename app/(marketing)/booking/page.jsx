import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import CalBooking from "@/components/pages/CalBooking";

const pageTitle = "Book a Free Web Development Strategy Call | Meteoric";
const pageDesc =
  "Schedule a free 30-minute strategy call with Meteoric. Discuss your web development, SaaS, or startup project and get expert guidance.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/booking`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/booking`,
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent(pageTitle)}&description=${encodeURIComponent(pageDesc)}&type=booking`,
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
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent(pageTitle)}&description=${encodeURIComponent(pageDesc)}&type=booking`],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Book a Call", item: `${SITE_URL}/booking` },
  ],
};

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

export default function BookingPage() {
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
      <CalBooking />
    </>
  );
}
