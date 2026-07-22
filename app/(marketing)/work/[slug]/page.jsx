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
  const title = `${project.name} — Case Study | Meteoric`;
  const desc = project.tagline;
  return {
    title,
    description: desc,
    alternates: { canonical: `${SITE_URL}/work/${project.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/work/${project.slug}`,
      images: [{ url: `${SITE_URL}${project.image}`, width: 1280, height: 720, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title,
      description: desc,
      images: [`${SITE_URL}${project.image}`],
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}
