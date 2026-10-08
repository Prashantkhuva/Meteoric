import { pageMetadata, absoluteUrl } from "@/lib/seo/config";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import Contact from "@/components/pages/Contact";

const pageTitle = "Contact Meteoric — Start a Project";
const pageDesc =
  "Book a free 20-minute strategy call with Meteoric or email contact@withmeteoric.com. Talk through your scope, stack, and timeline before you commit.";

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

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webPageJsonLd} />
      <Contact />
    </>
  );
}
