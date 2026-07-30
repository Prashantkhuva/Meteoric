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

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

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
        <div className="max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* ── Back Link ── */}
          <div className="mb-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to Blog
            </Link>
          </div>

          {/* ── Hero ── */}
          <header className="mb-16">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-[10px] font-mono tracking-wider text-[#EAEFFF]/60 bg-[#EAEFFF]/[0.06] border border-[#EAEFFF]/[0.08] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-6 max-w-4xl">
              {post.title}
            </h1>
            <p className="text-white/45 text-base md:text-lg leading-[1.7] mb-6 max-w-3xl">
              {post.tagline}
            </p>
            <div className="flex items-center gap-4 text-white/20 text-xs font-mono tracking-wider">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#0a0a0a] border border-white/[0.06] flex items-center justify-center text-[10px] text-white/40">
                  PK
                </span>
                <span className="text-white/40">Prashant Khuva</span>
              </div>
              <span className="w-px h-3 bg-white/10" />
              <time dateTime={post.published}>{post.published}</time>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-white/15">{post.sections.length} min read</span>
            </div>
          </header>

          {/* ── Content ── */}
          <div className="max-w-3xl">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-12 last:mb-0">
                <div className="flex items-start gap-4">
                  <span className="hidden md:flex shrink-0 w-8 h-8 rounded-full border border-white/[0.06] items-center justify-center text-[10px] font-mono text-white/15 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-4 leading-[1.3]">
                      {section.heading}
                    </h2>
                    <p className="text-white/35 text-[15px] leading-[1.9]">
                      {section.body}
                    </p>
                  </div>
                </div>
                {i < post.sections.length - 1 && (
                  <div className="ml-0 md:ml-12 mt-12 h-px bg-white/[0.04]" />
                )}
              </section>
            ))}
          </div>

          {/* ── FAQ ── */}
          {post.faqs.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/[0.06] max-w-3xl">
              <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-10">
                Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="p-6 rounded-xl bg-[#0a0a0a] border border-white/[0.06]">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-[#EAEFFF]/40 text-sm font-mono shrink-0 mt-0.5">Q:</span>
                      <h3 className="text-base font-medium text-white/70">{faq.question}</h3>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/15 text-sm font-mono shrink-0 mt-0.5">A:</span>
                      <p className="text-white/35 text-[15px] leading-[1.8]">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Related Articles ── */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/[0.06]">
              <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-10">
                Continue Reading
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rp.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[9px] font-mono tracking-wider text-white/20 bg-white/[0.03] px-1.5 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-secondary-italic text-white/75 group-hover:text-[#EAEFFF] transition-colors duration-300 mb-2 leading-[1.3]">
                      {rp.title}
                    </h3>
                    <p className="text-white/20 text-xs font-mono tracking-wider">{rp.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA ── */}
          <div className="relative mt-20 p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] max-w-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EAEFFF]/[0.03] to-transparent rounded-bl-[100px] pointer-events-none" />
            <p className="text-white/60 text-sm font-mono tracking-wider mb-2">Have a project in mind?</p>
            <p className="text-lg md:text-xl font-secondary-italic text-white/85 mb-6">
              Let&apos;s build something exceptional together.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-mono tracking-wider rounded-full hover:bg-[#EAEFFF] transition-colors duration-200"
              >
                Book a Free Call
                <span className="text-black/50">→</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200"
              >
                Explore Services
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* ── Footer Nav ── */}
          <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to Blog
            </Link>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200"
            >
              Our Services
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
