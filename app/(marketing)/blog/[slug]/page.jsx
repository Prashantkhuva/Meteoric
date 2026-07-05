import { notFound } from "next/navigation";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { posts } from "@/data/blog";
import BlogPostPage from "@/components/pages/BlogPost";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};

  const title = `${post.title} — Meteoric Blog`;
  return {
    title,
    description: post.excerpt,
    openGraph: {
      title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1635, height: 962, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      title,
      description: post.excerpt,
      images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    },
  };
}

const articleJsonLd = (post) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.date,
  author: {
    "@type": "Person",
    name: "Prashant Khuva",
    url: `${SITE_URL}/about`,
  },
  publisher: {
    "@type": "Organization",
    name: "Meteoric",
    url: SITE_URL,
  },
});

export default function BlogPost({ params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      <BlogPostPage post={post} />
    </>
  );
}
