import Link from "next/link";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { blogPosts, blogTags } from "@/data/blog-posts";

const pageTitle = "Blog | Meteoric — Web Development & SaaS Insights";
const pageDesc =
  "Practical guides on SaaS development, web development, tech stack decisions, and building products that grow. Written by Meteoric's founder with real project experience.";

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

export default function BlogIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="min-h-screen bg-[#070707] text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="mb-6">
            <span className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-xs font-bold">Articles</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-white/35 text-[15px] leading-[1.8] max-w-2xl mb-12">
            {pageDesc}
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            {blogTags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-mono tracking-wider text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-0">
            {blogPosts.map((post, i) => (
              <article key={post.slug} className={`py-8 ${i > 0 ? "border-t border-white/[0.06]" : ""}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-lg md:text-xl font-secondary-italic font-normal text-white/80 hover:text-[#EAEFFF] transition-colors duration-200 mb-2 block"
                    >
                      {post.title}
                    </Link>
                    <p className="text-white/35 text-sm leading-[1.7] mt-1 mb-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-white/20 text-xs font-mono tracking-wider">
                      <time dateTime={post.published}>{post.published}</time>
                      <span className="w-px h-3 bg-white/10" />
                      {post.tags.slice(0, 3).join(" · ")}
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="shrink-0 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200 self-start mt-1"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/[0.06] text-center">
            <Link href="/" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
