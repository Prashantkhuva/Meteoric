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

const iconMap = {
  "SaaS": "◇",
  "MongoDB": "⎔",
  "Database Design": "⊞",
  "Billing": "₿",
  "Development": "⌘",
  "Startup": "▲",
  "Database": "◈",
  "PostgreSQL": "▤",
  "MVP": "◆",
  "GSAP": "▸",
  "Framer Motion": "◉",
  "Animation": "▽",
  "React": "⚛",
  "Next.js": "◈",
  "Supabase": "▣",
  "Firebase": "▥",
  "Backend": "◀",
  "Remix": "▦",
  "Frameworks": "⊡",
  "Web Development": "◎",
  "Agency": "◯",
  "Freelancer": "○",
  "Business": "□",
  "Website": "▢",
  "Cost": "₡",
  "Pricing": "₵",
  "Prototype": "▣",
  "Case Study": "◈",
  "Tech Stack": "⊟",
  "Hiring": "⊕",
  "Vendor Selection": "⊖",
};

function getIcon(tag) {
  return iconMap[tag] || "◇";
}

export default function BlogIndex() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="min-h-screen bg-[#070707] text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">

          {/* ── Header ── */}
          <div className="mb-16 md:mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#EAEFFF]/30" />
              <span className="text-[#EAEFFF]/40 uppercase tracking-[0.3em] text-xs font-bold">Articles</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-4 max-w-3xl">
              Insights from the&nbsp;<span className="text-[#EAEFFF]">trenches</span>
            </h1>
            <p className="text-white/35 text-[15px] leading-[1.8] max-w-2xl mb-10">
              {pageDesc}
            </p>

            <div className="flex flex-wrap gap-2">
              {blogTags.map((tag) => (
                <span
                  key={tag}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider text-white/30 bg-white/[0.03] border border-white/[0.06] rounded-full hover:bg-white/[0.07] hover:text-white/60 hover:border-white/[0.12] transition-all duration-300 cursor-default"
                >
                  <span className="text-[#EAEFFF]/40 text-[10px]">{getIcon(tag)}</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Featured Post ── */}
          <section className="mb-20">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {featured.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] font-mono tracking-wider text-[#EAEFFF]/60 bg-[#EAEFFF]/[0.06] px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    <span className="text-white/15 text-[10px] font-mono tracking-wider">{featured.published}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-secondary-italic font-normal leading-[1.2] tracking-tight text-white/85 group-hover:text-[#EAEFFF] transition-colors duration-300 mb-3">
                    {featured.title}
                  </h2>
                  <p className="text-white/35 text-sm leading-[1.7] max-w-xl mb-4">
                    {featured.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#EAEFFF]/50 group-hover:text-[#EAEFFF] transition-colors duration-300">
                    Read Article
                    <span className="w-4 h-px bg-[#EAEFFF]/30 group-hover:w-6 transition-all duration-300" />
                  </span>
                </div>
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full border border-white/[0.06] group-hover:border-[#EAEFFF]/30 transition-all duration-300 shrink-0">
                  <span className="text-white/20 group-hover:text-[#EAEFFF]/60 text-xl transition-colors duration-300">→</span>
                </div>
              </div>
            </Link>
          </section>

          {/* ── Rest of Posts ── */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-xs font-bold">All Posts</span>
              <span className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-white/15 text-xs font-mono">{rest.length} articles</span>
            </div>

            <div className="space-y-0">
              {rest.map((post, i) => (
                <article key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block py-6 md:py-8 border-t border-white/[0.06] hover:border-[#EAEFFF]/20 transition-colors duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
                      <div className="hidden md:block md:col-span-1 text-white/10 text-xs font-mono pt-1">
                        {String(i + 2).padStart(2, "0")}
                      </div>
                      <div className="md:col-span-8">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono tracking-wider text-white/25 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
                              {getIcon(tag)} {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-lg md:text-xl font-secondary-italic font-normal text-white/80 group-hover:text-[#EAEFFF] transition-colors duration-300 mb-1.5">
                          {post.title}
                        </h2>
                        <p className="text-white/30 text-sm leading-[1.7] line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                      <div className="md:col-span-3 flex md:flex-col items-center md:items-end gap-3 md:gap-1.5 text-xs font-mono tracking-wider text-white/15">
                        <time dateTime={post.published}>{post.published}</time>
                        <span className="w-px h-3 bg-white/10 md:hidden" />
                        <span className="inline-flex items-center gap-1 text-white/10 group-hover:text-[#EAEFFF]/50 transition-colors duration-300">
                          Read <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <div className="mt-20 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="group inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to Home
            </Link>
            <Link href="/services" className="group inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              Our Services
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
