import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo/config";
import { posts } from "@/data/blog";
import BlogPostPage from "@/components/pages/BlogPost";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

function toIsoDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toISOString();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const title = `${post.title} — Meteoric Blog`;
  const ogImage = `${SITE_URL}${post.image}`;
  return {
    title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: toIsoDate(post.date),
      modifiedTime: toIsoDate(post.dateModified || post.date),
      authors: [`${SITE_URL}/about`],
      section: post.section || "Blog",
      tags: post.tag ? [post.tag] : [],
      images: [{ url: ogImage, width: 1635, height: 962, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

const articleJsonLd = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.date,
  dateModified: post.dateModified || post.date,
  image: `${SITE_URL}${post.image}`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/blog/${post.slug}`,
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".post-headline", ".post-excerpt"],
  },
  author: {
    "@id": `${SITE_URL}/about#person`,
  },
  publisher: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
});

const breadcrumbJsonLd = (post) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    {
      "@type": "ListItem",
      position: 3,
      name: post.title,
      item: `${SITE_URL}/blog/${post.slug}`,
    },
  ],
});

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(post)) }}
      />
      <BlogPostPage post={post} />
    </>
  );
}
