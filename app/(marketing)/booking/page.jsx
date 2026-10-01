import { pageMetadata } from "@/lib/seo/config";
import CalBooking from "@/components/pages/CalBooking";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "Book a Free Strategy Call — Start a Project";
const pageDesc =
  "Talk through your project with Meteoric before you commit. 20-minute call, no pressure, straight answers on scope and stack.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/booking",
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
