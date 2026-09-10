import { blogPosts } from "@/data/blog-posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import Link from "next/link";

const authorData = {
  name: "Prashant Khuva",
  title: "Founder & Full-Stack Developer",
  company: SITE_NAME,
  bio: "Building high-performance web applications and SaaS products for startups since 2025. Specializing in React, Next.js, Node.js, and the MERN stack. Direct founder involvement on every project — no account managers.",
  credentials: [
    "12+ production projects shipped",
    "100% client satisfaction rate",
    "10-day average sprint cycle",
    "Specializing in Next.js + Supabase stack",
  ],
  social: {
    twitter: "https://x.com/prashantkhuva_",
    linkedin: "https://linkedin.com/in/prashantkhuva",
    github: "https://github.com/Prashantkhuva",
  },
};

export function generateMetadata() {
  return {
    title: `${authorData.name} — ${authorData.title} | ${SITE_NAME}`,
    description: authorData.bio,
    alternates: {
      canonical: `${SITE_URL}/author/prashant-khuva`,
    },
    openGraph: {
      title: `${authorData.name} — ${authorData.title}`,
      description: authorData.bio,
      url: `${SITE_URL}/author/prashant-khuva`,
      type: "profile",
    },
  };
}

export default function AuthorPage() {
  const authorPosts = blogPosts
    .filter(
      (post) =>
        post.author?.name === authorData.name ||
        !post.author?.name
    )
    .sort((a, b) => new Date(b.published) - new Date(a.published));

  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorData.name,
    jobTitle: authorData.title,
    worksFor: {
      "@type": "Organization",
      name: authorData.company,
      url: SITE_URL,
    },
    url: `${SITE_URL}/author/prashant-khuva`,
    sameAs: Object.values(authorData.social),
    knowsAbout: [
      "Web Development",
      "SaaS Development",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Supabase",
    ],
    mainEntityOfPage: authorPosts.map((post) => ({
      "@type": "Article",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.published,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: authorData.name,
        item: `${SITE_URL}/author/prashant-khuva`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="min-h-screen bg-[#070707] text-white">
        <div className="fixed top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-[#EAEFFF]/[0.015] via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 md:px-12 pt-28 md:pt-32 pb-24 md:pb-32">
          {/* Back link */}
          <div className="mb-10 md:mb-14">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to blog
            </Link>
          </div>

          {/* Author header */}
          <header className="mb-14 md:mb-20">
            {/* Avatar centered on mobile, left-aligned on md+ */}
            <div className="flex flex-col items-center md:items-start md:flex-row md:gap-7 mb-8 md:mb-10">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#0a0a0a] border border-white/[0.06] flex items-center justify-center text-xl md:text-2xl text-white/20 overflow-hidden shrink-0 mb-5 md:mb-0 ring-1 ring-white/[0.03]">
                <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                  <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.04)" />
                  <ellipse cx="16" cy="26" rx="9" ry="6" fill="rgba(255,255,255,0.025)" />
                </svg>
                <span className="relative z-10">PK</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-[26px] sm:text-3xl md:text-4xl font-secondary-italic text-white/85 mb-1.5 sm:mb-2 md:mb-3 tracking-tight">
                  {authorData.name}
                </h1>
                <p className="text-[#EAEFFF]/30 text-[11px] sm:text-[12px] mb-3 md:mb-4">
                  {authorData.title} at {authorData.company}
                </p>
                <p className="text-white/20 text-[13px] sm:text-[14px] leading-[1.7] font-[350] max-w-xl">
                  {authorData.bio}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 mt-3 md:mt-4">
                  <a href={authorData.social.twitter} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200">@prashantkhuva_</a>
                  <a href={authorData.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200">LinkedIn</a>
                  <a href={authorData.social.github} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200">GitHub</a>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {authorData.credentials.map((cred, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-3.5 rounded-xl bg-[#0b0b0b] border border-white/[0.04]"
                >
                  <div className="text-[10px] sm:text-[11px] text-white/20 leading-snug">{cred}</div>
                </div>
              ))}
            </div>
          </header>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-10 md:mb-14" />

          {/* Articles section */}
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-white/15 uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] font-medium whitespace-nowrap">
                Published Articles ({authorPosts.length})
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-white/[0.04] to-transparent" />
            </div>

            <div className="space-y-2 sm:space-y-2.5">
              {authorPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-[#0b0b0b] border border-white/[0.04] hover:border-white/[0.08] hover:bg-[#0d0d0d] transition-all duration-400"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                        <span className="text-white/[0.06] text-[9px] sm:text-[10px] font-mono tabular-nums mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <h2 className="text-[14px] sm:text-[15px] md:text-lg font-medium text-white/40 group-hover:text-white/65 transition-colors duration-300 leading-[1.4]">
                          {post.title}
                        </h2>
                      </div>
                      <p className="text-white/15 text-[11px] sm:text-[12px] md:text-[13px] leading-[1.6] line-clamp-2 ml-[30px] sm:ml-[34px]">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5 ml-[30px] sm:ml-[34px]">
                        <time dateTime={post.published} className="text-white/10 text-[9px] sm:text-[10px] font-mono">
                          {new Date(post.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        <span className="w-px h-1.5 bg-white/[0.05]" />
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[8px] sm:text-[9px] text-white/[0.08] tracking-wider uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/[0.04] group-hover:text-white/20 transition-colors duration-300 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3H13V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
