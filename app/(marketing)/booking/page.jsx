import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import CalBooking from "@/components/pages/CalBooking";

const pageTitle = "Book a Call with Meteoric — Free Consult";
const pageDesc =
  "Talk through your project with Meteoric before you commit. 20-minute call, no pressure, straight answers on scope and stack.";

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
