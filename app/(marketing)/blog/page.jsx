import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { posts } from "@/data/blog";
import BlogPage from "@/components/pages/Blog";

const pageTitle = "Blog — Meteoric Insights | Web Dev & Design";
const pageDesc =
  "Insights on web development, product design, and startup strategy from Meteoric. Built for founders who ship.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/blog`,
    images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1635, height: 962, alt: pageTitle }],
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
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
  ],
};

const blogSchemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/blog`,
  name: "Meteoric Blog",
  description: pageDesc,
  url: `${SITE_URL}/blog`,
  publisher: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
  blogPost: posts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
  })),
};

export default function Blog() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchemaJsonLd) }}
      />
      <BlogPage />
    </>
  );
}
