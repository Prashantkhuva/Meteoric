"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "@/data/blog-posts";

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

const categories = [
  "All",
  "SaaS",
  "Web Dev",
  "SEO",
  "Design",
  "Startup",
];

const categoryMap = {
  All: () => true,
  SaaS: (p) => p.tags.some((t) => ["SaaS", "MongoDB", "PostgreSQL", "Database Design", "Billing", "MVP", "Backend", "Database"].includes(t)),
  "Web Dev": (p) => p.tags.some((t) => ["React", "Next.js", "GSAP", "Framer Motion", "Animation", "Frameworks", "Performance"].includes(t)),
  SEO: (p) => p.tags.some((t) => ["SEO", "AEO", "AI Search", "GEO", "Technical SEO", "Keywords", "Content Strategy"].includes(t)),
  Design: (p) => p.tags.some((t) => ["Landing Pages", "CRO", "Conversion", "UI/UX", "Web Design"].includes(t)),
  Startup: (p) => p.tags.some((t) => ["Startup", "Agency", "Startups", "Website Audit"].includes(t)),
};

function BlogCard({ post, index }) {
  const image = slugToImage[post.slug] || "/images/blog/blog-tech-stack.webp";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <div
          className="rounded-2xl overflow-hidden mb-4 aspect-[16/10] relative transition-all duration-500"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
        >
          <img
            src={image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            {post.tags[0]}
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <time className="text-[11px] text-[var(--text-muted)]" dateTime={post.published}>
            {formatDate(post.published)}
          </time>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span className="text-[11px] text-[var(--text-muted)]">
            {readingTime(post.sections)} min
          </span>
        </div>
        <h2 className="text-lg font-semibold leading-[1.3] mb-1.5 text-[var(--text-primary)] transition-opacity duration-300 group-hover:opacity-65">
          {post.title}
        </h2>
        <p className="text-[13px] leading-[1.6] line-clamp-2 text-[var(--text-secondary)]">
          {post.description}
        </p>
      </Link>
    </motion.div>
  );
}

export default function BlogContent() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = blogPosts.filter((p) => categoryMap[activeCategory](p));

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header — Atomik style */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1] text-[var(--text-primary)]">
              Blog
            </h1>
          </div>
          <p className="text-sm max-w-md leading-relaxed text-[var(--text-secondary)]">
            Notes on building products that convert — written by the founder
            from real shipped work. No fluff, no filler.
          </p>
        </div>

        {/* Category Filters — atomikgrowth style */}
        <div className="flex flex-wrap gap-2 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                  : "ring-1 ring-[var(--border-color)] text-[var(--text-secondary)] hover:ring-[var(--border-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-sm">
              No posts found for this category.
            </p>
          </div>
        )}

        {/* Bottom nav */}
        <div
          className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
              ←
            </span>
            Back to Home
          </Link>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            Services
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
