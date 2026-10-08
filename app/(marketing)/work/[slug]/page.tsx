import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { caseStudies } from "@/data/case-studies";
import type { Project } from "@/data/types";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import CaseStudy from "@/components/pages/CaseStudy";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID } from "@/lib/seo/jsonLd";

export function generateStaticParams() {
  return projects
    .filter((p) => p.slug && p.draft !== true)
    .map((p) => ({ slug: p.slug }));
}

function findProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project || project.draft === true) return null;
  return project;
}

function findCaseStudy(project: Project) {
  if (!project.caseStudySlug) return null;
  const cs = caseStudies.find((c) => c.slug === project.caseStudySlug);
  if (!cs || cs.draft === true) return null;
  return cs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  const cs = findCaseStudy(project);

  const title =
    cs?.metaTitle ??
    project.metaTitle ??
    `${project.name} — Case Study`;
  const desc =
    cs?.metaDescription ??
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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const cs = findCaseStudy(project);

  const pageTitle = cs?.metaTitle ?? `${project.name} — Case Study`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Work", path: "/work" },
    { name: project.name, path: `/work/${slug}` },
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

  // CreativeWork only carries facts visible on the page (name, tagline,
  // tech stack, preview image, author). No AggregateRating/review/offer.
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: cs?.metaDescription ?? project.metaDescription ?? project.tagline,
    url: `${SITE_URL}/work/${project.slug}`,
    image: `${SITE_URL}${project.image}`,
    keywords: project.technology?.join(", "),
    author: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: project.tagline,
    inLanguage: "en-US",
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={creativeWorkSchema} />
      <CaseStudy project={project} caseStudy={cs} />
    </>
  );
}
