import Link from "next/link";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { blogPosts, blogTags } from "@/data/blog-posts";

const pageTitle = "Blog | Meteoric — Web Development & SaaS Insights";
const pageDesc =
  "Practical guides on SaaS development, web development, tech stack decisions, and building products that grow. Written by Meteoric's founder with real project experience.";

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
      <main className="min-h-screen bg-[#070707] text-white">
        {/* ── Decorative header gradient ── */}
        <div className="fixed top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[#EAEFFF]/[0.015] via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* ═══════════════════════════════════════
               HERO
             ═══════════════════════════════════════ */}
          <div className="mb-20 md:mb-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-px bg-gradient-to-r from-[#EAEFFF]/60 to-transparent" />
              <span className="text-[#EAEFFF]/40 uppercase tracking-[0.25em] text-[11px] font-medium">The Journal</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-secondary-italic font-normal leading-[0.95] tracking-tight mb-6">
              <span className="text-white/90">Thoughts on</span>
              <br />
              <span className="text-[#EAEFFF]">building&nbsp;products</span>
            </h1>

            <p className="text-white/30 text-base md:text-lg leading-[1.7] max-w-2xl mb-12 font-[350]">
              {pageDesc}
            </p>

            <div className="flex flex-wrap gap-2 md:gap-2.5">
              {blogTags.map((tag) => (
                <span
                  key={tag}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider text-white/25 bg-white/[0.02] border border-white/[0.06] rounded-full hover:bg-white/[0.06] hover:text-white/50 hover:border-white/[0.12] transition-all duration-300 cursor-default"
                >
                  <span className="text-[#EAEFFF]/30 text-[10px]">{getIcon(tag)}</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════
               FEATURED POST
             ═══════════════════════════════════════ */}
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[#EAEFFF]/30 uppercase tracking-[0.25em] text-[11px] font-medium">Featured</span>
              <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group relative block overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-[#EAEFFF]/20 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#EAEFFF]/[0.03] to-transparent rounded-bl-[200px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  {featured.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] font-mono tracking-wider text-[#EAEFFF]/50 bg-[#EAEFFF]/[0.06] border border-[#EAEFFF]/[0.08] px-2.5 py-1 rounded-full">
                      {getIcon(tag)} {tag}
                    </span>
                  ))}
                  <span className="text-white/15 text-[10px] font-mono tracking-wider ml-1">{featured.published}</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-secondary-italic font-normal leading-[1.15] tracking-tight text-white/85 group-hover:text-[#EAEFFF] transition-colors duration-300 mb-4 max-w-3xl">
                  {featured.title}
                </h2>

                <p className="text-white/30 text-sm md:text-base leading-[1.8] max-w-2xl mb-6">
                  {featured.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono tracking-wider text-white/20">
                  <span className="text-white/30">{readingTime(featured.sections)} min read</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span className="inline-flex items-center gap-2 text-[#EAEFFF]/40 group-hover:text-[#EAEFFF]/80 transition-colors duration-300">
                    Read article
                    <span className="w-5 h-px bg-[#EAEFFF]/30 group-hover:w-8 transition-all duration-300 inline-block" />
                  </span>
                </div>
              </div>
            </Link>
          </section>

          {/* ═══════════════════════════════════════
               ALL POSTS
             ═══════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[#EAEFFF]/30 uppercase tracking-[0.25em] text-[11px] font-medium">All Articles</span>
              <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              <span className="text-white/12 text-xs font-mono tracking-wider">{rest.length} articles</span>
            </div>

            <div className="space-y-0">
              {rest.map((post, i) => (
                <article key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative block py-7 md:py-9 border-t border-white/[0.06] hover:border-transparent transition-colors duration-300"
                  >
                    <div className="absolute inset-x-0 top-0 h-0 bg-gradient-to-r from-transparent via-[#EAEFFF]/[0.03] to-transparent group-hover:h-full transition-all duration-500 pointer-events-none" />

                    <div className="relative grid grid-cols-12 gap-4 md:gap-6 items-start">
                      {/* Number */}
                      <div className="hidden md:flex md:col-span-1 items-center gap-3 pt-0.5">
                        <span className="text-white/8 text-xs font-mono tracking-wider tabular-nums">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span className="w-px h-4 bg-white/[0.04]" />
                      </div>

                      {/* Content */}
                      <div className="col-span-12 md:col-span-8 lg:col-span-7">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[9px] font-mono tracking-wider text-white/20 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full">
                              {getIcon(tag)} {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-secondary-italic font-normal text-white/80 group-hover:text-[#EAEFFF] transition-colors duration-300 mb-1.5 leading-[1.2]">
                          {post.title}
                        </h2>
                        <p className="text-white/25 text-sm leading-[1.7] line-clamp-2 max-w-xl">
                          {post.description}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="col-span-12 md:col-span-3 lg:col-span-4 flex md:flex-col items-center md:items-end gap-3 md:gap-1.5">
                        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/15">
                          <time dateTime={post.published}>{post.published}</time>
                          <span className="w-px h-2.5 bg-white/10" />
                          <span className="text-white/10">{readingTime(post.sections)} min</span>
                        </div>
                        <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-white/8 group-hover:text-[#EAEFFF]/40 transition-all duration-300">
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

          {/* ═══════════════════════════════════════
               FOOTER
             ═══════════════════════════════════════ */}
          <div className="mt-24 pt-10 border-t border-white/[0.06]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="font-secondary-italic text-white/60 text-lg mb-2">Meteoric</p>
                <p className="text-white/20 text-xs font-mono leading-[1.7]">Web development &amp; SaaS insights from real project experience.</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-white/12 text-[10px] font-mono tracking-wider uppercase mb-1">Navigate</span>
                <Link href="/" className="text-white/25 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">Home</Link>
                <Link href="/work" className="text-white/25 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">Work</Link>
                <Link href="/services" className="text-white/25 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">Services</Link>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 justify-end">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-[11px] font-mono tracking-wider rounded-full hover:bg-[#EAEFFF] transition-colors duration-200"
                >
                  Book a Call
                  <span className="text-black/40">→</span>
                </Link>
                <Link href="/" className="text-white/15 hover:text-white/35 text-[10px] font-mono tracking-wider transition-colors duration-200">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
