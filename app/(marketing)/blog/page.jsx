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

const tagIcons = {
  "SaaS": "◇", "MongoDB": "⎔", "Database Design": "⊞", "Billing": "₿",
  "Development": "⌘", "Startup": "▲", "Database": "◈", "PostgreSQL": "▤",
  "MVP": "◆", "GSAP": "▸", "Framer Motion": "◉", "Animation": "▽",
  "React": "⚛", "Next.js": "◈", "Supabase": "▣", "Firebase": "▥",
  "Backend": "◀", "Remix": "▦", "Frameworks": "⊡", "Web Development": "◎",
  "Agency": "◯", "Freelancer": "○", "Business": "□", "Website": "▢",
  "Cost": "₡", "Pricing": "₵", "Prototype": "▣", "Case Study": "◈",
  "Tech Stack": "⊟", "Hiring": "⊕", "Vendor Selection": "⊖",
};

function getIcon(tag) {
  return tagIcons[tag] || "◇";
}

function readingTime(sections) {
  const words = sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogIndex() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="min-h-screen bg-black text-white">
        {/* Ambient glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(234,239,255,0.02)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* ═══ HERO ═══ */}
          <div className="mb-20 md:mb-28">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-gradient-to-r from-[#EAEFFF]/50 to-transparent" />
              <span className="text-[#EAEFFF]/40 uppercase tracking-[0.3em] text-[10px] font-medium">The Journal</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-secondary-italic font-normal leading-[0.92] tracking-tight mb-8">
              <span className="text-white/90">Thoughts on</span>
              <br />
              <span className="text-[#EAEFFF]">building&nbsp;products</span>
            </h1>

            <p className="text-white/30 text-base md:text-lg leading-[1.8] max-w-xl mb-14 font-[350]">
              {pageDesc}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {blogTags.map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-wider text-white/20 bg-white/[0.015] border border-white/[0.04] rounded-full hover:bg-[#EAEFFF]/[0.03] hover:text-[#EAEFFF]/40 hover:border-[#EAEFFF]/[0.08] transition-all duration-300 cursor-default"
                >
                  <span className="text-[#EAEFFF]/20 text-[8px]">{getIcon(tag)}</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ═══ FEATURED POST ═══ */}
          <section className="mb-28">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-[10px] font-medium">Featured</span>
              <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] hover:border-[#EAEFFF]/[0.12] bg-gradient-to-b from-white/[0.03] to-transparent transition-all duration-500 hover:shadow-[0_0_60px_rgba(234,239,255,0.03)]"
            >
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#EAEFFF]/[0.025] to-transparent rounded-bl-[250px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/[0.015] to-transparent pointer-events-none" />

              <div className="relative p-8 md:p-14">
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  {featured.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] font-mono tracking-wider text-[#EAEFFF]/45 bg-[#EAEFFF]/[0.05] border border-[#EAEFFF]/[0.07] px-3 py-1.5 rounded-full">
                      {getIcon(tag)} {tag}
                    </span>
                  ))}
                  <span className="text-white/12 text-[10px] font-mono tracking-wider ml-1">{featured.published}</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-secondary-italic font-normal leading-[1.1] tracking-tight text-white/85 group-hover:text-[#EAEFFF] transition-colors duration-500 mb-5 max-w-3xl">
                  {featured.title}
                </h2>

                <p className="text-white/28 text-sm md:text-base leading-[1.85] max-w-2xl mb-8">
                  {featured.description}
                </p>

                <div className="flex flex-wrap items-center gap-5 text-[11px] font-mono tracking-wider text-white/18">
                  <span className="text-white/25">{readingTime(featured.sections)} min read</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span className="inline-flex items-center gap-2.5 text-[#EAEFFF]/35 group-hover:text-[#EAEFFF]/70 transition-colors duration-300">
                    Read article
                    <span className="w-5 h-px bg-[#EAEFFF]/25 group-hover:w-10 transition-all duration-300 inline-block" />
                  </span>
                </div>
              </div>
            </Link>
          </section>

          {/* ═══ ALL POSTS ═══ */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-[10px] font-medium">All Articles</span>
              <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              <span className="text-white/10 text-[10px] font-mono tracking-wider">{rest.length} articles</span>
            </div>

            <div className="space-y-0">
              {rest.map((post, i) => (
                <article key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative block py-8 md:py-10 border-t border-white/[0.05] hover:border-white/[0.08] transition-all duration-400"
                  >
                    {/* Hover glow strip */}
                    <div className="absolute inset-x-0 top-0 h-0 bg-gradient-to-r from-transparent via-[#EAEFFF]/[0.02] to-transparent group-hover:h-full transition-all duration-600 pointer-events-none" />

                    <div className="relative grid grid-cols-12 gap-4 md:gap-8 items-start">
                      {/* Number */}
                      <div className="hidden md:flex md:col-span-1 items-center gap-3 pt-1">
                        <span className="text-white/6 text-[11px] font-mono tracking-wider tabular-nums">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span className="w-px h-5 bg-white/[0.04]" />
                      </div>

                      {/* Content */}
                      <div className="col-span-12 md:col-span-8 lg:col-span-7">
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[9px] font-mono tracking-wider text-white/18 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded-full">
                              {getIcon(tag)} {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-secondary-italic font-normal text-white/75 group-hover:text-[#EAEFFF] transition-colors duration-400 mb-2 leading-[1.25]">
                          {post.title}
                        </h2>
                        <p className="text-white/22 text-sm leading-[1.75] line-clamp-2 max-w-xl">
                          {post.description}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="col-span-12 md:col-span-3 lg:col-span-4 flex md:flex-col items-center md:items-end gap-3 md:gap-2">
                        <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-wider text-white/12">
                          <time dateTime={post.published}>{post.published}</time>
                          <span className="w-px h-2.5 bg-white/8" />
                          <span className="text-white/8">{readingTime(post.sections)} min</span>
                        </div>
                        <span className="hidden md:inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/6 group-hover:text-[#EAEFFF]/35 transition-all duration-300">
                          Read
                          <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* ── Bottom Nav ── */}
          <div className="mt-28 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="group inline-flex items-center gap-2 text-white/12 hover:text-white/35 text-[11px] font-mono tracking-wider transition-colors duration-200">
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to Home
            </Link>
            <Link href="/services" className="group inline-flex items-center gap-2 text-white/12 hover:text-white/35 text-[11px] font-mono tracking-wider transition-colors duration-200">
              Services
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
