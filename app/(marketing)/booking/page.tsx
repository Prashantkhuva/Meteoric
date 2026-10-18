import { pageMetadata } from "@/lib/seo/config";
import CalBooking from "@/components/pages/CalBooking";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "Book a Free Web Development Strategy Call";
const pageDesc =
  "Schedule a free video call with Meteoric to talk through your project's scope, stack, and timeline. No obligation.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/booking",
  image: undefined,
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Book a Call", path: "/booking" }
]);

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
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <CalBooking />
    </>
  );
}
