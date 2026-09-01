import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo/config";
import CaseStudy from "@/components/pages/CaseStudy";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = project.metaTitle ?? `${project.name} — Case Study | Meteoric`;
  const desc =
    project.metaDescription ??
    (project.description
      ? project.description.split(". ").slice(0, 2).join(". ") + "."
      : project.tagline);
  return {
    title,
    description: desc,
    alternates: { canonical: `${SITE_URL}/work/${project.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/work/${project.slug}`,
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title,
      description: desc,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const pageTitle = `${project.name} — Case Study | Meteoric`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: `${SITE_URL}/work`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${SITE_URL}/work/${project.slug}`,
      },
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

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    url: `${SITE_URL}/work/${project.slug}`,
    keywords: project.tags?.join(", "),
    author: { "@type": "Organization", name: "Meteoric", url: SITE_URL },
    about: project.tagline,
    datePublished: "2026-01-15",
    inLanguage: "en-US",
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <CaseStudy project={project} />
    </>
  );
}
