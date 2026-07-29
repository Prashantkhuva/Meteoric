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
        <div className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="mb-12">
            <Link href="/blog" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              ← Back to Blog
            </Link>
          </div>

          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-mono tracking-wider text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-white/50 text-base leading-[1.7] mb-4">
              {post.tagline}
            </p>
            <div className="flex items-center gap-3 text-white/20 text-xs font-mono tracking-wider">
              <span>Prashant Khuva</span>
              <span className="w-px h-3 bg-white/10" />
              <time dateTime={post.published}>{post.published}</time>
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-10">
                <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-4">
                  {section.heading}
                </h2>
                <p className="text-white/35 text-[15px] leading-[1.8] mb-4">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {post.faqs.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/[0.06]">
              <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {post.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-base font-medium text-white/70 mb-2">{faq.question}</h3>
                    <p className="text-white/35 text-[15px] leading-[1.8]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/[0.06]">
              <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-8">
                Related Articles
              </h2>
              <div className="space-y-4">
                {relatedPosts.map((rp) => (
                  <div key={rp.slug}>
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="text-white/70 hover:text-[#EAEFFF] transition-colors duration-200 text-[15px] font-medium"
                    >
                      {rp.title}
                    </Link>
                    <p className="text-white/25 text-xs font-mono tracking-wider mt-0.5">{rp.tagline}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/blog" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              ← Back to Blog
            </Link>
            <Link href="/services" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              Our Services →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
