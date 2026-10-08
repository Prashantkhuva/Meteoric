import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo/config";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildFaqJsonLd,
  buildHowToJsonLd,
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo/jsonLd";
import ServiceLanding from "@/components/pages/ServiceLanding";
import {
  getRelatedServices,
  getService,
  services,
} from "@/data/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.metadataTitle,
    description: service.metadataDescription,
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
    openGraph: {
      title: service.metadataTitle,
      description: service.metadataDescription,
      url: `${SITE_URL}/services/${slug}`,
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: service.metadataTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: service.metadataTitle,
      description: service.metadataDescription,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const faqJsonLd = buildFaqJsonLd(service.faqs);

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: service.metadataTitle,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".sr-only"],
    },
  };

  const howToJsonLd = buildHowToJsonLd(
    (service.sections || []).map((s) => ({
      name: s.heading,
      text: s.body,
    })),
    `How Meteoric builds ${service.h1.join(" ")} products`,
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Services", path: "/services" },
    { name: service.h1.join(" "), path: `/services/${slug}` },
  ]);

  const serviceJsonLd = buildServiceJsonLd({
    name: service.h1.join(" "),
    description: service.metadataDescription,
    path: `/services/${slug}`,
    serviceType: service.h1.join(" "),
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <ServiceLanding
        service={service}
        relatedServices={getRelatedServices(slug)}
      />
    </>
  );
}
