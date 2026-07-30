import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo/config";
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
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}/og.png`],
    },
  };
}

function readingTime(sections) {
  const words = sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const readTime = readingTime(post.sections);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  const faqSchema = post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  } : null;

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: post.title,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".sr-only", "h1"] },
  };

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <article className="min-h-screen bg-[#070707] text-white">
        {/* ── Top decorative gradient ── */}
        <div className="fixed top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#EAEFFF]/[0.015] via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* ── Back Link ── */}
          <div className="mb-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to all articles
            </Link>
          </div>

          {/* ═══════════════════════════════════════
               HERO
             ═══════════════════════════════════════ */}
          <header className="mb-16 md:mb-20">
            <div className="flex flex-wrap gap-2 mb-7">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-wider text-[#EAEFFF]/40 bg-[#EAEFFF]/[0.04] border border-[#EAEFFF]/[0.08] px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-secondary-italic font-normal leading-[1.05] tracking-tight mb-6 max-w-4xl">
              {post.title}
            </h1>

            <p className="text-white/40 text-base md:text-lg leading-[1.7] mb-8 max-w-3xl font-[350]">
              {post.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono tracking-wider">
              <div className="flex items-center gap-3">
                <span className="relative w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center text-[10px] text-white/40 overflow-hidden">
                  <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                    <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.06)" />
                    <ellipse cx="16" cy="26" rx="9" ry="6" fill="rgba(255,255,255,0.04)" />
                  </svg>
                  <span className="relative z-10">PK</span>
                </span>
                <div>
                  <span className="text-white/45 block leading-none mb-1">Prashant Khuva</span>
                  <span className="text-white/12 text-[10px]">Founder &amp; Full-Stack Developer</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 ml-2">
                <span className="w-px h-4 bg-white/8" />
                <time dateTime={post.published} className="text-white/25">
                  {new Date(post.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
                <span className="w-px h-4 bg-white/8" />
                <span className="text-white/15">{readTime} min read</span>
              </div>
              <div className="flex sm:hidden items-center gap-3 text-white/20 ml-1">
                <time dateTime={post.published}>{post.published}</time>
                <span className="w-px h-3 bg-white/10" />
                <span className="text-white/15">{readTime} min</span>
              </div>
            </div>
          </header>

          {/* ═══════════════════════════════════════
               CONTENT
             ═══════════════════════════════════════ */}
          <div className="max-w-3xl">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-14 last:mb-0">
                <div className="flex items-start gap-5">
                  <div className="hidden md:flex shrink-0 flex-col items-center pt-0.5">
                    <span className="text-white/8 text-[10px] font-mono tracking-wider tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="w-px flex-1 bg-gradient-to-b from-white/[0.04] to-transparent mt-2 min-h-[2rem]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-secondary-italic font-normal text-white/80 mb-5 leading-[1.25]">
                      {section.heading}
                    </h2>
                    <p className="text-white/30 text-[15px] md:text-base leading-[1.85] font-[350]">
                      {section.body}
                    </p>
                    {i < post.sections.length - 1 && (
                      <div className="mt-14 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent" />
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* ═══════════════════════════════════════
               FAQ
             ═══════════════════════════════════════ */}
          {post.faqs.length > 0 && (
            <div className="mt-20 pt-14 border-t border-white/[0.06] max-w-3xl">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#EAEFFF]/30 uppercase tracking-[0.25em] text-[11px] font-medium">FAQ</span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              </div>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="group p-6 md:p-8 rounded-xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-[#EAEFFF]/30 text-sm font-mono shrink-0 mt-0.5 tabular-nums">Q{i + 1}</span>
                      <h3 className="text-base md:text-lg font-medium text-white/70 leading-[1.4]">{faq.question}</h3>
                    </div>
                    <div className="flex items-start gap-4 pl-9">
                      <p className="text-white/30 text-[15px] leading-[1.8] font-[350]">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
               RELATED
             ═══════════════════════════════════════ */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-14 border-t border-white/[0.06]">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#EAEFFF]/30 uppercase tracking-[0.25em] text-[11px] font-medium">Continue Reading</span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group relative p-6 rounded-xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#EAEFFF]/[0.02] to-transparent rounded-bl-[80px] pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        {rp.tags.slice(0, 1).map((t) => (
                          <span key={t} className="text-[9px] font-mono tracking-wider text-white/20 bg-white/[0.03] border border-white/[0.05] px-1.5 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                        <span className="text-white/10 text-[9px] font-mono">{rp.published}</span>
                      </div>
                      <h3 className="text-sm font-secondary-italic text-white/70 group-hover:text-[#EAEFFF] transition-colors duration-300 mb-2 leading-[1.3]">
                        {rp.title}
                      </h3>
                      <p className="text-white/20 text-xs font-mono leading-[1.5] line-clamp-2">
                        {rp.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
               CTA
             ═══════════════════════════════════════ */}
          <div className="relative mt-20 p-8 md:p-12 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] max-w-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#EAEFFF]/[0.04] to-transparent rounded-bl-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />

            <div className="relative">
              <p className="text-white/40 text-xs font-mono tracking-wider uppercase mb-3">Let&apos;s work together</p>
              <p className="text-xl md:text-2xl font-secondary-italic font-normal text-white/85 mb-2 leading-[1.2]">
                Have a project in mind?
              </p>
              <p className="text-white/30 text-sm leading-[1.7] mb-8 max-w-lg">
                From landing pages to full SaaS platforms — let&apos;s build something exceptional.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-mono tracking-wider rounded-full hover:bg-[#EAEFFF] transition-colors duration-200"
                >
                  Book a Free Call
                  <span className="text-black/40">→</span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200 group"
                >
                  Explore Services
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Back Link ── */}
          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-white/15 hover:text-white/40 text-xs font-mono tracking-wider transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
