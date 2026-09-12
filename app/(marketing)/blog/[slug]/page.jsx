import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { blogPosts, getBlogPost } from "@/data/blog-posts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.dateModified || post.published,
      authors: [post.author?.name || "Prashant Khuva"],
      tags: post.tags,
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

const postService = {
  "mongodb-schema-design-for-saas-billing": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "how-to-build-a-saas-mvp-step-by-step-guide": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "mongodb-vs-postgresql-for-saas": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "gsap-vs-framer-motion-production-guide": {
    href: "/services/landing-pages",
    label: "Landing Page Design",
  },
  "supabase-vs-firebase-2026-comparison": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "nextjs-vs-remix-2026-comparison": {
    href: "/services/nextjs-development",
    label: "Next.js Development",
  },
  "what-is-a-web-development-agency": {
    href: "/services/startup-web-development",
    label: "Startup Web Development",
  },
  "how-much-does-a-startup-website-cost": {
    href: "/services/startup-web-development",
    label: "Startup Web Development",
  },
  "building-a-saas-prototype-in-3-weeks-a-case-study": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "the-meteoric-guide-to-choosing-your-tech-stack": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "how-to-choose-a-web-development-agency": {
    href: "/services/startup-web-development",
    label: "Startup Web Development",
  },
  "react-vs-nextjs-for-startup-websites": {
    href: "/services/startup-web-development",
    label: "Startup Web Development",
  },
  "how-to-implement-aeo-answer-engine-optimization-for-saas": {
    href: "/services/saas-development",
    label: "SaaS Development",
  },
  "why-visitors-leave-your-website-issues-and-solutions": {
    href: "/services/landing-pages",
    label: "Landing Page Design",
  },
  "high-converting-landing-page-structure-for-saas": {
    href: "/services/landing-pages",
    label: "Landing Page Design",
  },
  "long-tail-seo-strategy-for-funded-startups": {
    href: "/services/startup-web-development",
    label: "Startup Web Development",
  },
  "ai-search-optimization-how-to-get-cited-by-chatgpt": {
    href: "/services/landing-pages",
    label: "Landing Page Design",
  },
  "startup-seo-on-a-budget-what-to-do-first": {
    href: "/services/startup-web-development",
    label: "Startup Web Development",
  },
};

function readingTime(sections) {
  const words = sections.reduce(
    (acc, s) => acc + s.body.split(/\s+/).length,
    0,
  );
  return Math.max(1, Math.ceil(words / 200));
}

function renderRichBody(text) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g).filter(Boolean);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (!match) return part;
    return (
      <Link
        key={i}
        href={match[2]}
        className="text-[#EAEFFF]/60 hover:text-[#EAEFFF] underline underline-offset-4 decoration-[#EAEFFF]/25 hover:decoration-[#EAEFFF]/60 transition-all duration-200"
      >
        {match[1]}
      </Link>
    );
  });
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const readTime = readingTime(post.sections);
  const relatedLinks = post.relatedLinks?.length
    ? post.relatedLinks
    : postService[post.slug]
      ? [postService[post.slug]]
      : [{ href: "/services", label: "Explore Services" }];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}/og.jpg`,
    datePublished: post.published,
    dateModified: post.dateModified || post.published,
    author: {
      "@type": "Person",
      name: post.author?.name || "Prashant Khuva",
      url: post.author?.url || `${SITE_URL}/about`,
      jobTitle: "Founder & Full-Stack Developer",
      sameAs: [
        "https://x.com/prashantkhuva_",
        "https://linkedin.com/in/prashantkhuva",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
  };

  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: { "@type": "Answer", text: q.answer },
          })),
        }
      : null;

  const howToSchema = post.howTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.howTo.name,
        description: post.howTo.description,
        step: post.howTo.step.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: post.title,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".sr-only", "h1"],
    },
  };

  const relatedPosts = post.relatedBlogPosts?.length
    ? post.relatedBlogPosts
        .map((rp) => blogPosts.find((p) => p.slug === rp.slug))
        .filter(Boolean)
        .slice(0, 3)
    : blogPosts
        .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
        .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <article className="min-h-screen bg-black text-white">
        {/* Ambient glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(234,239,255,0.02)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">
          {/* ── Back Link ── */}
          <div className="mb-14">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/18 hover:text-white/45 transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              Back to all articles
            </Link>
          </div>

          {/* ═══ HERO ═══ */}
          <header className="mb-20 md:mb-24">
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-wider text-[#EAEFFF]/40 bg-[#EAEFFF]/[0.04] border border-[#EAEFFF]/[0.07] px-3.5 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-secondary-italic font-normal leading-[1.05] tracking-tight mb-8 max-w-4xl">
              {post.title}
            </h1>

            <p className="text-white/35 text-base md:text-lg leading-[1.8] mb-10 max-w-3xl font-[350]">
              {post.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono tracking-wider">
              <div className="flex items-center gap-3">
                <span className="relative w-9 h-9 rounded-full bg-[#0a0a0a] border border-white/[0.07] flex items-center justify-center text-[10px] text-white/35 overflow-hidden">
                  <svg
                    viewBox="0 0 32 32"
                    className="absolute inset-0 w-full h-full"
                  >
                    <circle
                      cx="16"
                      cy="12"
                      r="5"
                      fill="rgba(255,255,255,0.05)"
                    />
                    <ellipse
                      cx="16"
                      cy="26"
                      rx="9"
                      ry="6"
                      fill="rgba(255,255,255,0.03)"
                    />
                  </svg>
                  <span className="relative z-10">PK</span>
                </span>
                <div>
                  <span className="text-white/40 block leading-none mb-1">
                    Prashant Khuva
                  </span>
                  <span className="text-white/10 text-[10px]">
                    Founder &amp; Full-Stack Developer
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 ml-2">
                <span className="w-px h-4 bg-white/6" />
                <time dateTime={post.published} className="text-white/22">
                  {new Date(post.published).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="w-px h-4 bg-white/6" />
                <span className="text-white/12">{readTime} min read</span>
              </div>
              <div className="flex sm:hidden items-center gap-3 text-white/18 ml-1">
                <time dateTime={post.published}>{post.published}</time>
                <span className="w-px h-3 bg-white/8" />
                <span className="text-white/12">{readTime} min</span>
              </div>
            </div>
          </header>

          {/* ═══ CONTENT ═══ */}
          <div className="max-w-3xl">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-16 last:mb-0">
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex shrink-0 flex-col items-center pt-0.5">
                    <span className="text-white/6 text-[10px] font-mono tracking-wider tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="w-px flex-1 bg-gradient-to-b from-white/[0.04] to-transparent mt-2 min-h-[2rem]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-secondary-italic font-normal text-white/80 mb-6 leading-[1.3]">
                      {section.heading}
                    </h2>
                    <p className="text-white/28 text-[15px] md:text-[16px] leading-[1.9] font-[350]">
                      {renderRichBody(section.body)}
                    </p>
                    {i < post.sections.length - 1 && (
                      <div className="mt-16 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent" />
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* ═══ FAQ ═══ */}
          {post.faqs.length > 0 && (
            <div className="mt-24 pt-16 border-t border-white/[0.05] max-w-3xl">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[#EAEFFF]/25 uppercase tracking-[0.3em] text-[10px] font-medium">
                  FAQ
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
              </div>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="group p-6 md:p-8 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.08] hover:shadow-[0_0_30px_rgba(234,239,255,0.02)] transition-all duration-400"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-[#EAEFFF]/25 text-[11px] font-mono shrink-0 mt-0.5 tabular-nums">
                        Q{i + 1}
                      </span>
                      <h3 className="text-base md:text-lg font-medium text-white/65 leading-[1.45]">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex items-start gap-4 pl-9">
                      <p className="text-white/25 text-[15px] leading-[1.85] font-[350]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ KEY METRICS ═══ */}
          {post.metrics && post.metrics.length > 0 && (
            <div className="mt-24 pt-16 border-t border-white/[0.05] max-w-3xl">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#EAEFFF]/25 uppercase tracking-[0.3em] text-[10px] font-medium">
                  Key Metrics
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {post.metrics.map((metric, i) => (
                  <div key={i} className="p-5 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05]">
                    <div className="text-lg font-medium text-white/65 mb-1">{metric.value}</div>
                    <div className="text-[11px] text-white/20 tracking-wide">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ FURTHER READING ═══ */}
          {post.furtherReading && post.furtherReading.length > 0 && (
            <div className="mt-24 pt-16 border-t border-white/[0.05] max-w-3xl">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#EAEFFF]/25 uppercase tracking-[0.3em] text-[10px] font-medium">
                  Further Reading
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
              </div>
              <div className="space-y-3">
                {post.furtherReading.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_0_20px_rgba(234,239,255,0.02)] transition-all duration-300"
                  >
                    <svg className="w-4 h-4 text-white/12 group-hover:text-white/25 transition-colors shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3H13V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-white/45 group-hover:text-white/65 transition-colors truncate">{link.title}</div>
                      <div className="text-[10px] text-white/15 tracking-wider mt-0.5">{link.source}</div>
                    </div>
                    <svg className="w-3 h-3 text-white/8 group-hover:text-white/20 transition-colors shrink-0" viewBox="0 0 12 12" fill="none">
                      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ═══ AUTHOR BIO ═══ */}
          <div className="mt-24 pt-16 border-t border-white/[0.05] max-w-3xl">
            <div className="flex items-start gap-6">
              <span className="relative w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/[0.07] flex items-center justify-center text-xs text-white/35 overflow-hidden shrink-0">
                <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                  <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.05)" />
                  <ellipse cx="16" cy="26" rx="9" ry="6" fill="rgba(255,255,255,0.03)" />
                </svg>
                <span className="relative z-10">PK</span>
              </span>
              <div>
                <h3 className="text-sm font-medium text-white/55 mb-1.5">
                  <a href="/author/prashant-khuva" className="hover:text-white/75 transition-colors">
                    Written by Prashant Khuva
                  </a>
                </h3>
                <p className="text-white/22 text-[13px] leading-[1.75] font-[350]">
                  Founder &amp; Full-Stack Developer at Meteoric. Building SaaS products and high-performance web applications for startups since 2020.
                </p>
                <div className="flex items-center gap-5 mt-4">
                  <a href="https://x.com/prashantkhuva_" target="_blank" rel="noopener noreferrer" className="text-white/12 hover:text-white/35 text-[11px] font-mono tracking-wider transition-colors duration-200">
                    @prashantkhuva_
                  </a>
                  <a href="https://linkedin.com/in/prashantkhuva" target="_blank" rel="noopener noreferrer" className="text-white/12 hover:text-white/35 text-[11px] font-mono tracking-wider transition-colors duration-200">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RELATED ═══ */}
          {relatedPosts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-white/[0.05]">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[#EAEFFF]/25 uppercase tracking-[0.3em] text-[10px] font-medium">
                  Continue Reading
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group relative p-6 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] hover:border-[#EAEFFF]/[0.1] hover:shadow-[0_0_30px_rgba(234,239,255,0.02)] transition-all duration-400 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#EAEFFF]/[0.015] to-transparent rounded-bl-[100px] pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3.5">
                        {rp.tags.slice(0, 1).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-mono tracking-wider text-white/18 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                        <span className="text-white/8 text-[9px] font-mono">
                          {rp.published}
                        </span>
                      </div>
                      <h3 className="text-sm font-secondary-italic text-white/65 group-hover:text-[#EAEFFF] transition-colors duration-400 mb-2.5 leading-[1.35]">
                        {rp.title}
                      </h3>
                      <p className="text-white/18 text-xs font-mono leading-[1.6] line-clamp-2">
                        {rp.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ═══ CTA ═══ */}
          <div className="relative mt-24 p-8 md:p-14 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] max-w-3xl overflow-hidden hover:border-white/[0.08] transition-all duration-500">
            <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#EAEFFF]/[0.03] to-transparent rounded-bl-[180px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-white/[0.015] to-transparent pointer-events-none" />

            <div className="relative">
              <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase mb-4">
                Let&apos;s work together
              </p>
              <p className="text-2xl md:text-3xl font-secondary-italic font-normal text-white/85 mb-3 leading-[1.2]">
                Have a project in mind?
              </p>
              <p className="text-white/25 text-sm leading-[1.8] mb-10 max-w-lg">
                From landing pages to full SaaS platforms — let&apos;s build
                something exceptional.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-black text-xs font-mono tracking-wider rounded-full hover:bg-[#EAEFFF] transition-colors duration-200"
                >
                  Book a Free Call
                  <span className="text-black/40">→</span>
                </Link>
                {relatedLinks.map((rs) => (
                  <Link
                    key={rs.href}
                    href={rs.href}
                    className="inline-flex items-center gap-2 text-white/18 hover:text-white/45 text-xs font-mono tracking-wider transition-colors duration-200 group"
                  >
                    {rs.label}
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Back Link ── */}
          <div className="mt-14 pt-8 border-t border-white/[0.05]">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-white/12 hover:text-white/35 text-[11px] font-mono tracking-wider transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
