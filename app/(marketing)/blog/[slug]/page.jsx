import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/seo/config";
import { blogPosts, getBlogPost } from "@/data/blog-posts";
import { slugToImage, FALLBACK_BLOG_IMAGE } from "@/data/blog-images";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildArticleJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/jsonLd";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
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

function renderBold(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, j) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    if (!match) return part;
    return (
      <strong
        key={`${key}-b${j}`}
        className="font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {match[1]}
      </strong>
    );
  });
}

function renderInline(text, key) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g).filter(Boolean);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (match) {
      return (
        <Link
          key={`${key}-a${i}`}
          href={match[2]}
          className="underline underline-offset-4 transition-all duration-200 hover:text-[var(--text-primary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          {match[1]}
        </Link>
      );
    }
    return renderBold(part, `${key}-p${i}`);
  });
}

const PARA_CLASS = "text-[15px] leading-[1.7]";
const LIST_CLASS =
  "text-[15px] leading-[1.7] list-disc pl-5 space-y-2 marker:text-[var(--text-muted)]";
const LIST_ITEM_CLASS = "pl-1";

function renderBlocks(text, keyPrefix) {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, i) => {
    const key = `${keyPrefix}-${i}`;
    const lines = block.split("\n").map((l) => l.trim());

    if (lines[0].startsWith(">")) {
      const quoteLines = lines.map((l) => l.replace(/^>\s?/, ""));
      const items = quoteLines
        .slice(1)
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2));
      const paras = quoteLines
        .slice(1)
        .filter((l) => !l.startsWith("- ") && l.length > 0);
      return (
        <blockquote
          key={key}
          className="rounded-[14px] px-5 py-4 my-2"
          style={{
            border: "1px solid var(--border-color)",
            background: "var(--accent-dim)",
          }}
        >
          <p className={`${PARA_CLASS} mb-2`} style={{ color: "var(--text-primary)" }}>
            {renderInline(quoteLines[0], `${key}-q`)}
          </p>
          {items.length > 0 && (
            <ul className={LIST_CLASS} style={{ color: "var(--text-secondary)" }}>
              {items.map((item, j) => (
                <li key={`${key}-qi${j}`} className={LIST_ITEM_CLASS}>
                  {renderInline(item, `${key}-qi${j}`)}
                </li>
              ))}
            </ul>
          )}
          {paras.map((p, j) => (
            <p
              key={`${key}-qp${j}`}
              className={`${PARA_CLASS} mt-2`}
              style={{ color: "var(--text-secondary)" }}
            >
              {renderInline(p, `${key}-qp${j}`)}
            </p>
          ))}
        </blockquote>
      );
    }

    if (lines.some((l) => l.startsWith("- ")) && lines.every((l) => l.startsWith("- ") || l.length === 0)) {
      return (
        <ul key={key} className={LIST_CLASS} style={{ color: "var(--text-secondary)" }}>
          {lines
            .filter((l) => l.startsWith("- "))
            .map((l, j) => (
              <li key={`${key}-li${j}`} className={LIST_ITEM_CLASS}>
                {renderInline(l.slice(2), `${key}-li${j}`)}
              </li>
            ))}
        </ul>
      );
    }

    if (lines.some((l) => /^\d+\.\s/.test(l)) && lines.every((l) => /^\d+\.\s/.test(l) || l.length === 0)) {
      return (
        <ol
          key={key}
          className={LIST_CLASS.replace("list-disc", "list-decimal")}
          style={{ color: "var(--text-secondary)" }}
        >
          {lines
            .filter((l) => /^\d+\.\s/.test(l))
            .map((l, j) => (
              <li key={`${key}-oi${j}`} className={LIST_ITEM_CLASS}>
                {renderInline(l.replace(/^\d+\.\s/, ""), `${key}-oi${j}`)}
              </li>
            ))}
        </ol>
      );
    }

    return (
      <p key={key} className={PARA_CLASS} style={{ color: "var(--text-secondary)" }}>
        {renderInline(block, key)}
      </p>
    );
  });
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const readTime = readingTime(post.sections);
  const image = slugToImage[slug] || FALLBACK_BLOG_IMAGE;
  const relatedLinks = post.relatedLinks?.length
    ? post.relatedLinks
    : postService[post.slug]
      ? [postService[post.slug]]
      : [{ href: "/services", label: "Explore Services" }];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` }
  ]);

  const articleJsonLd = buildArticleJsonLd({
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${image}`,
    datePublished: post.published,
    dateModified: post.dateModified || post.published,
    path: `/blog/${slug}`,
    keywords: post.tags,
  });

  const faqSchema =
    post.faqs?.length > 0 ? buildFaqJsonLd(post.faqs) : null;

  const speakableJsonLd = { "@context": "https://schema.org", "@type": "WebPage", name: post.title, speakable: { "@type": "SpeakableSpecification", cssSelector: [".sr-only", "h1"] } };

  const relatedPosts = post.relatedBlogPosts?.length
    ? post.relatedBlogPosts.map((rp) => blogPosts.find((p) => p.slug === rp.slug)).filter(Boolean).slice(0, 3)
    : blogPosts.filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={speakableJsonLd} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <article className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* Back link */}
          <div className="mb-14">
            <Link href="/blog" className="group inline-flex items-center gap-2 min-h-6 text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
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
          <ScrollReveal direction="up" className="relative rounded-[24px] overflow-hidden mb-16 aspect-[16/10]" style={{ border: "1px solid var(--border-color)" }}>
            <Image src={image} alt={post.title} fill priority fetchPriority="high" sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
          </ScrollReveal>

          {/* Article body */}
          <div className="max-w-[720px] mx-auto">
            {post.intro && (
              <ScrollReveal direction="up" className="mb-12">
                <div className="space-y-4">
                  {renderBlocks(post.intro, "intro")}
                </div>
              </ScrollReveal>
            )}
            {post.sections.map((section, i) => (
              <ScrollReveal key={i} direction="up" className="mb-12 last:mb-0">
                <h2 className="text-[24px] font-semibold mb-4 leading-[1.3]" style={{ color: "var(--text-primary)" }}>
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {renderBlocks(section.body, `s${i}`)}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* FAQ */}
          {post.faqs?.length > 0 && (
            <div className="mt-20 pt-12 max-w-[720px] mx-auto" style={{ borderTop: "1px solid var(--border-color)" }}>
              <ScrollReveal direction="right" className="mb-8">
                <h2 className="text-[24px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  Frequently Asked Questions
                </h2>
              </ScrollReveal>
              <FaqAccordion items={post.faqs} />
            </div>
          )}

          {/* Author bio */}
          <ScrollReveal direction="up" className="mt-20 pt-12 max-w-[720px] mx-auto" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: "var(--accent-dim)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                PK
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Written by{" "}
                  <Link
                    href="/author/prashant-khuva"
                    className="inline-block py-1 underline-offset-4 hover:underline transition-all duration-200 hover:opacity-70"
                  >
                    Prashant Khuva
                  </Link>
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
          </ScrollReveal>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12" style={{ borderTop: "1px solid var(--border-color)" }}>
              <ScrollReveal direction="right" className="mb-8">
                <h2 className="text-[24px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  Continue Reading
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp, i) => {
                  const rpImage = slugToImage[rp.slug] || FALLBACK_BLOG_IMAGE;
                  return (
                    <ScrollReveal key={rp.slug} direction="up" delay={0.08 * i}>
                      <Link href={`/blog/${rp.slug}`} className="group block">
                        <div className="relative rounded-[14px] overflow-hidden mb-3 aspect-[373/234]" style={{ border: "1px solid var(--border-color)" }}>
                          <Image src={rpImage} alt={rp.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1 transition-opacity duration-300 group-hover:opacity-65" style={{ color: "var(--text-primary)" }}>
                          {rp.title}
                        </h3>
                        <p className="text-[11px] line-clamp-2" style={{ color: "var(--text-muted)" }}>
                          {rp.tagline}
                        </p>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <ScrollReveal direction="up" className="mt-20 p-8 md:p-12 rounded-[24px] text-center" style={{ border: "1px solid var(--border-color)", background: "var(--accent-glow)" }}>
            <h3 className="text-2xl md:text-3xl font-display tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
              Have a project in mind?
            </h3>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              From landing pages to full SaaS platforms — let&apos;s build something exceptional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {relatedLinks.map((rs) => (
                <Link key={rs.href} href={rs.href} className="min-h-6 inline-flex items-center text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
                  {rs.label} →
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Back link */}
          <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
            <Link href="/blog" className="group inline-flex items-center gap-2 min-h-6 text-xs transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
