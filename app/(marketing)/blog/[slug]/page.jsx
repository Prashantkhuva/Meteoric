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

const PARA_CLASS = "text-[16px] md:text-[17px] leading-[1.75] text-pretty";
const LIST_CLASS =
  "text-[16px] md:text-[17px] leading-[1.7] list-disc pl-6 space-y-2.5 marker:text-[var(--text-muted)] marker:font-medium";
const LIST_ITEM_CLASS = "pl-1.5";

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
          className="relative rounded-r-[14px] rounded-l-[4px] px-6 py-5 my-4"
          style={{
            borderLeft: "2px solid var(--border-hover)",
            background: "var(--accent-dim)",
          }}
        >
          <p className={`${PARA_CLASS} mb-2.5`} style={{ color: "var(--text-primary)" }}>
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
          <div className="mb-10">
            <Link href="/blog" className="group inline-flex items-center gap-2.5 min-h-6 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200 hover:text-[var(--text-primary)]" style={{ color: "var(--text-muted)" }}>
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              All articles
            </Link>
          </div>

          {/* Header */}
          <header className="mb-14 max-w-[820px]">
            <div className="flex flex-wrap items-center gap-2 mb-7">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] font-medium uppercase tracking-[0.14em] px-3 py-1.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] leading-[1.06] tracking-[-0.02em] mb-6 text-balance" style={{ color: "var(--text-primary)" }}>
              {post.title}
            </h1>

            <p className="text-[17px] md:text-[19px] leading-[1.65] max-w-[680px] mb-9" style={{ color: "var(--text-secondary)" }}>
              {post.tagline}
            </p>

            {/* Author card */}
            <div className="flex items-center gap-3.5 pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-[13px] tracking-wide" style={{ background: "var(--accent-dim)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                PK
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Prashant Khuva</p>
                <div className="flex items-center gap-2 text-[11px] tracking-wide" style={{ color: "var(--text-muted)" }}>
                  <time dateTime={post.published}>
                    {new Date(post.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                  <span className="w-[3px] h-[3px] rounded-full" style={{ background: "var(--text-muted)" }} />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured image */}
          <ScrollReveal direction="up" className="relative rounded-[20px] overflow-hidden mb-16 aspect-[16/9]" style={{ border: "1px solid var(--border-color)", boxShadow: "0 24px 60px -32px rgba(0,0,0,0.35)" }}>
            <Image src={image} alt={post.title} fill priority fetchPriority="high" sizes="(max-width: 768px) 100vw, 896px" className="object-cover" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18) 100%)" }} />
          </ScrollReveal>

          {/* Article body */}
          <div className="max-w-[700px] mx-auto">
            {post.intro && (
              <ScrollReveal direction="up" className="mb-14">
                <div className="space-y-5 text-[17px] md:text-[18px] leading-[1.7] [&_p]:text-[inherit] [&_p]:leading-[inherit] [&_ul]:text-[inherit] [&_ol]:text-[inherit]" style={{ color: "var(--text-secondary)" }}>
                  {renderBlocks(post.intro, "intro")}
                </div>
              </ScrollReveal>
            )}
            {post.sections.map((section, i) => (
              <ScrollReveal key={i} direction="up" className="mb-14 md:mb-16 last:mb-0">
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="font-display text-[13px] tabular-nums shrink-0 pt-1" style={{ color: "var(--text-muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-[24px] sm:text-[26px] md:text-[30px] leading-[1.2] tracking-[-0.015em] text-balance" style={{ color: "var(--text-primary)" }}>
                    {section.heading}
                  </h2>
                </div>
                <div className="space-y-5 md:space-y-6 pl-0 sm:pl-9">
                  {renderBlocks(section.body, `s${i}`)}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* FAQ */}
          {post.faqs?.length > 0 && (
            <div className="mt-20 pt-14 max-w-[700px] mx-auto" style={{ borderTop: "1px solid var(--border-color)" }}>
              <ScrollReveal direction="right" className="mb-8">
                <h2 className="font-display text-[26px] sm:text-[30px] leading-[1.2] tracking-[-0.015em]" style={{ color: "var(--text-primary)" }}>
                  Frequently Asked Questions
                </h2>
              </ScrollReveal>
              <FaqAccordion items={post.faqs} />
            </div>
          )}

          {/* Author bio */}
          <ScrollReveal direction="up" className="mt-20 max-w-[700px] mx-auto rounded-[20px] p-6 md:p-8" style={{ border: "1px solid var(--border-color)", background: "var(--accent-dim)" }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-base tracking-wide shrink-0" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                PK
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] mb-2" style={{ color: "var(--text-muted)" }}>
                  Written by
                </p>
                <h3 className="font-display text-lg mb-1.5" style={{ color: "var(--text-primary)" }}>
                  <Link
                    href="/author/prashant-khuva"
                    className="underline-offset-4 hover:underline transition-all duration-200 hover:opacity-70"
                  >
                    Prashant Khuva
                  </Link>
                </h3>
                <p className="text-[14px] leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                  Founder &amp; Full-Stack Developer at Meteoric. Building SaaS products and high-performance web applications for startups.
                </p>
                <div className="flex items-center gap-5 mt-4">
                  <a href="https://x.com/prashantkhuva_" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 hover:text-[var(--text-primary)]" style={{ color: "var(--text-muted)" }}>
                    X / Twitter
                  </a>
                  <a href="https://linkedin.com/in/prashantkhuva" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 hover:text-[var(--text-primary)]" style={{ color: "var(--text-muted)" }}>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-14" style={{ borderTop: "1px solid var(--border-color)" }}>
              <ScrollReveal direction="right" className="mb-9">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] mb-3" style={{ color: "var(--text-muted)" }}>
                  Keep reading
                </p>
                <h2 className="font-display text-[26px] sm:text-[30px] leading-[1.2] tracking-[-0.015em]" style={{ color: "var(--text-primary)" }}>
                  Continue Reading
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
                {relatedPosts.map((rp, i) => {
                  const rpImage = slugToImage[rp.slug] || FALLBACK_BLOG_IMAGE;
                  return (
                    <ScrollReveal key={rp.slug} direction="up" delay={0.08 * i}>
                      <Link href={`/blog/${rp.slug}`} className="group block">
                        <div className="relative rounded-[16px] overflow-hidden mb-4 aspect-[16/10]" style={{ border: "1px solid var(--border-color)" }}>
                          <Image src={rpImage} alt={rp.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                          <span>{rp.tags[0]}</span>
                          <span className="w-[3px] h-[3px] rounded-full" style={{ background: "var(--text-muted)" }} />
                          <span>{Math.max(1, Math.ceil(rp.sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0) / 200))} min</span>
                        </div>
                        <h3 className="text-[15px] font-medium leading-[1.45] mb-1.5 transition-opacity duration-300 group-hover:opacity-65 text-pretty" style={{ color: "var(--text-primary)" }}>
                          {rp.title}
                        </h3>
                        <p className="text-[13px] line-clamp-2 leading-[1.6]" style={{ color: "var(--text-muted)" }}>
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
          <ScrollReveal direction="up" className="mt-20 px-7 py-12 md:px-14 md:py-16 rounded-[24px] text-center relative overflow-hidden" style={{ border: "1px solid var(--border-color)", background: "var(--accent-glow)" }}>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] mb-4" style={{ color: "var(--text-muted)" }}>
              Meteoric
            </p>
            <h3 className="font-display text-[26px] sm:text-[32px] md:text-[38px] leading-[1.15] tracking-[-0.015em] mb-4 text-balance" style={{ color: "var(--text-primary)" }}>
              Have a project in mind?
            </h3>
            <p className="text-[15px] leading-[1.7] mb-9 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              From landing pages to full SaaS platforms — let&apos;s build something exceptional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {relatedLinks.map((rs) => (
                <Link key={rs.href} href={rs.href} className="min-h-10 px-6 py-2.5 inline-flex items-center text-[12px] font-medium uppercase tracking-[0.12em] rounded-full transition-colors duration-200 hover:bg-[var(--accent-dim)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]" style={{ color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
                  {rs.label}
                  <span className="ml-2">→</span>
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Back link */}
          <div className="mt-14 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
            <Link href="/blog" className="group inline-flex items-center gap-2.5 min-h-6 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200 hover:text-[var(--text-primary)]" style={{ color: "var(--text-muted)" }}>
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              All articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
