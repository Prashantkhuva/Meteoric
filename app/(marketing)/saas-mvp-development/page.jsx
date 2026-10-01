import { pageMetadata } from "@/lib/seo/config";
import { buildFaqJsonLd, buildBreadcrumbJsonLd, buildServiceJsonLd } from "@/lib/seo/jsonLd";
import ServiceIntentLanding from "@/components/pages/ServiceIntentLanding";
import { getIntentPage } from "@/data/service-intents";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog-posts";
import { getService } from "@/data/services";
import JsonLd from "@/components/seo/JsonLd";

const page = getIntentPage("/saas-mvp-development");

export const metadata = pageMetadata({
  title: page.metadataTitle,
  description: page.metadataDescription,
  path: page.path,
});

const pageProjects = page.projectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter(Boolean)
  .map((project) => ({
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    projectType: project.projectType,
    technology: project.technology,
  }));

const insights = page.insightSlugs
  .map((slug) => blogPosts.find((post) => post.slug === slug))
  .filter(Boolean)
  .map((post) => ({ slug: post.slug, title: post.title }));

const fullService = getService(page.relatedServiceSlug);
const relatedService = fullService
  ? { slug: fullService.slug, title: fullService.title }
  : null;

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Services", path: "/services" },
  { name: page.h1, path: page.path }
]);

const faqJsonLd = buildFaqJsonLd(page.faqs);

const serviceJsonLd = buildServiceJsonLd({
  name: page.h1,
  description: page.metadataDescription,
  path: page.path,
});

export default function IntentServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <ServiceIntentLanding
        page={page}
        projects={pageProjects}
        insights={insights}
        relatedService={relatedService}
      />
    </>
  );
}
