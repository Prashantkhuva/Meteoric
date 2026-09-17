import Link from "next/link";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { blogPosts, blogTags } from "@/data/blog-posts";

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

const slugToImage = {
  "mongodb-schema-design-for-saas-billing": "/images/blog/blog-mongodb-schema.webp",
  "how-to-build-a-saas-mvp-step-by-step-guide": "/images/blog/blog-saas-mvp.webp",
  "mongodb-vs-postgresql-for-saas": "/images/blog/blog-mongodb-vs-postgres.webp",
  "gsap-vs-framer-motion-production-guide": "/images/blog/blog-gsap-vs-framer.webp",
  "supabase-vs-firebase-2026-comparison": "/images/blog/blog-supabase-vs-firebase.webp",
  "what-is-a-web-development-agency": "/images/blog/blog-web-agency.webp",
  "the-meteoric-guide-to-choosing-your-tech-stack": "/images/blog/blog-tech-stack.webp",
  "how-to-implement-aeo-answer-engine-optimization-for-saas": "/images/blog/blog-aeo.webp",
  "why-visitors-leave-your-website-issues-and-solutions": "/images/blog/blog-website-issues.webp",
  "high-converting-landing-page-structure-for-saas": "/images/blog/blog-landing-page.webp",
  "long-tail-seo-strategy-for-funded-startups": "/images/blog/blog-long-tail-seo.webp",
  "ai-search-optimization-how-to-get-cited-by-chatgpt": "/images/blog/blog-ai-search.webp",
  "startup-seo-on-a-budget-what-to-do-first": "/images/blog/blog-startup-seo.webp",
  "nextjs-vs-remix-2026-comparison": "/images/blog/blog-tech-stack.webp",
  "react-vs-nextjs-for-startup-websites": "/images/blog/blog-tech-stack.webp",
  "conversion-focused-web-design-beyond-pretty-ui": "/images/blog/blog-landing-page.webp",
  "building-a-saas-prototype-in-3-weeks-a-case-study": "/images/blog/blog-saas-mvp.webp",
  "how-much-does-a-startup-website-cost": "/images/blog/blog-startup-seo.webp",
  "how-to-choose-a-web-development-agency": "/images/blog/blog-web-agency.webp",
  "complete-website-audit-checklist-for-startups": "/images/blog/blog-website-issues.webp",
};

function readingTime(sections) {
  const words = sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCard({ post }) {
  const image = slugToImage[post.slug] || "/images/blog/blog-tech-stack.webp";
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-[14px] overflow-hidden mb-4 aspect-[373/234] relative" style={{ border: "1px solid var(--border-color)" }}>
        <img
          src={image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          {post.tags[0]}
        </span>
        <span className="w-1 h-1 rounded-full" style={{ background: "var(--text-muted)" }} />
        <time className="text-[11px]" style={{ color: "var(--text-muted)" }} dateTime={post.published}>
          {formatDate(post.published)}
        </time>
        <span className="w-1 h-1 rounded-full" style={{ background: "var(--text-muted)" }} />
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {readingTime(post.sections)} min
        </span>
      </div>
      <h2 className="text-[18px] font-semibold leading-[1.3] mb-1.5 transition-opacity duration-300 group-hover:opacity-65" style={{ color: "var(--text-primary)" }}>
        {post.title}
      </h2>
      <p className="text-[13px] leading-[1.6] line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>
        {post.description}
      </p>
    </Link>
  );
}

export default function BlogIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexJsonLd) }} />
      <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <h1 className="text-4xl md:text-6xl font-display tracking-tight leading-[1.05]" style={{ color: "var(--text-primary)" }}>
                Blog
              </h1>
            </div>
            <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
              {pageDesc}
            </p>
          </div>

          {/* Tag filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-12 hide-scrollbar">
            {blogTags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full transition-all duration-300 cursor-default"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-muted)" }} />
                {tag}
              </span>
            ))}
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Bottom nav */}
          <div className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <Link href="/" className="group inline-flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to Home
            </Link>
            <Link href="/services" className="group inline-flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
              Services
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
