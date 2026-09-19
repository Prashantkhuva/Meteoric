import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { blogPosts } from "@/data/blog-posts";
import BlogContent from "@/components/pages/BlogContent";

const pageTitle = "Blog — SaaS, Web Development & Design Insights | Meteoric";
const pageDesc =
  "Notes on building products that convert — written by the founder from real shipped work. No fluff, no recycled content, no filler.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: { canonical: `${SITE_URL}/blog` },
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

const blogIndexJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Blog — SaaS, Web Development & Design Insights | Meteoric",
  description:
    "Notes on building products that convert — written by the founder from real shipped work.",
  url: `${SITE_URL}/blog`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: blogPosts.length,
    itemListElement: blogPosts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  },
};

export default function BlogIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexJsonLd) }} />
      <BlogContent />
    </>
  );
}
