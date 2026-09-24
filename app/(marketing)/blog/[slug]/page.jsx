import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { blogPosts, getBlogPost } from "@/data/blog-posts";
import FaqAccordion from "@/components/sections/FaqAccordion";
import RevealImg from "@/components/ui/RevealImg";

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

const postService = {
  "mongodb-schema-design-for-saas-billing": { href: "/services/saas-development", label: "SaaS Development" },
  "how-to-build-a-saas-mvp-step-by-step-guide": { href: "/services/saas-development", label: "SaaS Development" },
  "mongodb-vs-postgresql-for-saas": { href: "/services/saas-development", label: "SaaS Development" },
  "gsap-vs-framer-motion-production-guide": { href: "/services/landing-pages", label: "Landing Pages" },
  "supabase-vs-firebase-2026-comparison": { href: "/services/saas-development", label: "SaaS Development" },
  "what-is-a-web-development-agency": { href: "/services/startup-web-development", label: "Startup Web Development" },
  "the-meteoric-guide-to-choosing-your-tech-stack": { href: "/services/saas-development", label: "SaaS Development" },
  "how-to-implement-aeo-answer-engine-optimization-for-saas": { href: "/services/saas-development", label: "SaaS Development" },
  "why-visitors-leave-your-website-issues-and-solutions": { href: "/services/landing-pages", label: "Landing Pages" },
  "high-converting-landing-page-structure-for-saas": { href: "/services/landing-pages", label: "Landing Pages" },
  "long-tail-seo-strategy-for-funded-startups": { href: "/services/startup-web-development", label: "Startup Web Development" },
  "ai-search-optimization-how-to-get-cited-by-chatgpt": { href: "/services/landing-pages", label: "Landing Pages" },
  "startup-seo-on-a-budget-what-to-do-first": { href: "/services/startup-web-development", label: "Startup Web Development" },
};

function readingTime(sections) {
  const words = sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0);
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
        className="underline underline-offset-4 transition-all duration-200 hover:text-[var(--text-primary)]"
        style={{ color: "var(--text-secondary)" }}
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
  const image = slugToImage[slug] || "/images/blog/blog-tech-stack.webp";
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
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${image}`,
    datePublished: post.published,
    dateModified: post.dateModified || post.published,
    author: {
      "@type": "Person",
      name: post.author?.name || "Prashant Khuva",
      url: post.author?.url || `${SITE_URL}/about`,
      jobTitle: "Founder & Full-Stack Developer",
      sameAs: ["https://x.com/prashantkhuva_", "https://linkedin.com/in/prashantkhuva"],
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
  };

  const faqSchema = post.faqs.length > 0
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })) }
    : null;

  const speakableJsonLd = { "@context": "https://schema.org", "@type": "WebPage", name: post.title, speakable: { "@type": "SpeakableSpecification", cssSelector: [".sr-only", "h1"] } };

  const relatedPosts = post.relatedBlogPosts?.length
    ? post.relatedBlogPosts.map((rp) => blogPosts.find((p) => p.slug === rp.slug)).filter(Boolean).slice(0, 3)
    : blogPosts.filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <article className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* Back link */}
          <div className="mb-14">
            <Link href="/blog" className="group inline-flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to all articles
            </Link>
          </div>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-display leading-[1.1] tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
              {post.title}
            </h1>

            <p className="text-base leading-[1.7] mb-8 max-w-3xl" style={{ color: "var(--text-secondary)" }}>
              {post.tagline}
            </p>

            {/* Author card */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: "var(--accent-dim)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                PK
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Prashant Khuva</p>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  <time dateTime={post.published}>
                    {new Date(post.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--text-muted)" }} />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured image */}
          <div className="relative rounded-[24px] overflow-hidden mb-16 aspect-[16/10]" style={{ border: "1px solid var(--border-color)" }}>
            <RevealImg src={image} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
          </div>

          {/* Article body */}
          <div className="max-w-[720px] mx-auto">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-12 last:mb-0">
                <h2 className="text-[24px] font-semibold mb-4 leading-[1.3]" style={{ color: "var(--text-primary)" }}>
                  {section.heading}
                </h2>
                <p className="text-[15px] leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                  {renderRichBody(section.body)}
                </p>
              </section>
            ))}
          </div>

          {/* FAQ */}
          {post.faqs.length > 0 && (
            <div className="mt-20 pt-12 max-w-[720px] mx-auto" style={{ borderTop: "1px solid var(--border-color)" }}>
              <h2 className="text-[24px] font-semibold mb-8" style={{ color: "var(--text-primary)" }}>
                Frequently Asked Questions
              </h2>
              <FaqAccordion items={post.faqs} />
            </div>
          )}

          {/* Author bio */}
          <div className="mt-20 pt-12 max-w-[720px] mx-auto" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: "var(--accent-dim)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                PK
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Written by Prashant Khuva
                </h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                  Founder &amp; Full-Stack Developer at Meteoric. Building SaaS products and high-performance web applications for startups.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <a href="https://x.com/prashantkhuva_" target="_blank" rel="noopener noreferrer" className="text-[11px] transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
                    @prashantkhuva_
                  </a>
                  <a href="https://linkedin.com/in/prashantkhuva" target="_blank" rel="noopener noreferrer" className="text-[11px] transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12" style={{ borderTop: "1px solid var(--border-color)" }}>
              <h2 className="text-[24px] font-semibold mb-8" style={{ color: "var(--text-primary)" }}>
                Continue Reading
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => {
                  const rpImage = slugToImage[rp.slug] || "/images/blog/blog-tech-stack.webp";
                  return (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                      <div className="relative rounded-[14px] overflow-hidden mb-3 aspect-[373/234]" style={{ border: "1px solid var(--border-color)" }}>
                        <RevealImg src={rpImage} alt={rp.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1 transition-opacity duration-300 group-hover:opacity-65" style={{ color: "var(--text-primary)" }}>
                        {rp.title}
                      </h3>
                      <p className="text-[11px] line-clamp-2" style={{ color: "var(--text-muted)" }}>
                        {rp.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-20 p-8 md:p-12 rounded-[24px] text-center" style={{ border: "1px solid var(--border-color)", background: "var(--accent-glow)" }}>
            <h3 className="text-2xl md:text-3xl font-display tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
              Have a project in mind?
            </h3>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              From landing pages to full SaaS platforms — let&apos;s build something exceptional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {relatedLinks.map((rs) => (
                <Link key={rs.href} href={rs.href} className="text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
                  {rs.label} →
                </Link>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
            <Link href="/blog" className="group inline-flex items-center gap-2 text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
