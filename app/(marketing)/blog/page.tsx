import { SITE_URL, pageMetadata } from "@/lib/seo/config";
import { blogPosts } from "@/data/blog-posts";
import BlogContent from "@/components/pages/BlogContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "SaaS, Web Development & Design Insights";
const pageDesc =
  "Notes on building products that convert — written by the founder from real shipped work. No fluff, no recycled content, no filler.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/blog",
  image: undefined,
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Blog", path: "/blog" }
]);

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
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={blogIndexJsonLd} />
      <BlogContent />
    </>
  );
}
