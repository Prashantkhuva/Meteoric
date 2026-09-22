import { blogPosts } from "@/data/blog-posts";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import Link from "next/link";

const authorData = {
  name: "Prashant Khuva",
  title: "Founder & Full-Stack Developer",
  company: SITE_NAME,
  bio: "Founder of Meteoric. Full-stack developer specializing in React, Next.js, Node.js, and Supabase. Direct founder involvement — no account managers.",
  credentials: [
    "Founder-led studio — direct involvement on every project",
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
    description: `${authorData.name} is the ${authorData.title} at ${SITE_NAME}. ${authorData.bio}`,
    alternates: {
      canonical: `${SITE_URL}/author/prashant-khuva`,
    },
    openGraph: {
      title: `${authorData.name} — ${authorData.title}`,
      description: `${authorData.name} is the ${authorData.title} at ${SITE_NAME}. ${authorData.bio}`,
      url: `${SITE_URL}/author/prashant-khuva`,
      type: "profile",
      images: [
        {
          url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
          secureUrl: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
          width: 1200,
          height: 630,
          alt: `${authorData.name} — ${authorData.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: `${authorData.name} — ${authorData.title}`,
      description: `${authorData.name} is the ${authorData.title} at ${SITE_NAME}. ${authorData.bio}`,
      images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
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
      <article className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 md:px-12 pt-28 md:pt-32 pb-24 md:pb-32">
          {/* Back link */}
          <div className="mb-10 md:mb-14">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to blog
            </Link>
          </div>

          {/* Author header */}
          <header className="mb-14 md:mb-20">
            <div className="flex flex-col items-center md:items-start md:flex-row md:gap-7 mb-8 md:mb-10">
              <div
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl md:text-2xl overflow-hidden shrink-0 mb-5 md:mb-0"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
              >
                <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                  <circle cx="16" cy="12" r="5" fill="var(--accent-dim)" />
                  <ellipse cx="16" cy="26" rx="9" ry="6" fill="var(--accent-glow)" />
                </svg>
                <span className="relative z-10">PK</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-[26px] sm:text-3xl md:text-4xl font-secondary-italic mb-1.5 sm:mb-2 md:mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {authorData.name}
                </h1>
                <p className="text-[11px] sm:text-[12px] mb-3 md:mb-4" style={{ color: "var(--text-muted)" }}>
                  {authorData.title} at {authorData.company}
                </p>
                <p className="text-[13px] sm:text-[14px] leading-[1.7] font-[350] max-w-xl" style={{ color: "var(--text-secondary)" }}>
                  {authorData.bio}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 mt-3 md:mt-4">
                  <a href={authorData.social.twitter} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200" style={{ color: "var(--text-muted)" }}>@prashantkhuva_</a>
                  <a href={authorData.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200" style={{ color: "var(--text-muted)" }}>LinkedIn</a>
                  <a href={authorData.social.github} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200" style={{ color: "var(--text-muted)" }}>GitHub</a>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {authorData.credentials.map((cred, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-3.5 rounded-xl"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
                >
                  <div className="text-[10px] sm:text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>{cred}</div>
                </div>
              ))}
            </div>
          </header>

          {/* Divider */}
          <div className="h-px mb-10 md:mb-14" style={{ background: "linear-gradient(to right, transparent, var(--border-color), transparent)" }} />

          {/* Articles section */}
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                Published Articles ({authorPosts.length})
              </span>
              <span className="flex-1 h-px" style={{ background: "linear-gradient(to right, var(--border-color), transparent)" }} />
            </div>

            <div className="space-y-2 sm:space-y-2.5">
              {authorPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-400"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                        <span className="text-[9px] sm:text-[10px] font-mono tabular-nums mt-1 shrink-0" style={{ color: "var(--text-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                        <h2 className="text-[14px] sm:text-[15px] md:text-lg font-medium transition-colors duration-300 leading-[1.4]" style={{ color: "var(--text-secondary)" }}>
                          {post.title}
                        </h2>
                      </div>
                      <p className="text-[11px] sm:text-[12px] md:text-[13px] leading-[1.6] line-clamp-2 ml-[30px] sm:ml-[34px]" style={{ color: "var(--text-muted)" }}>
                        {post.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5 ml-[30px] sm:ml-[34px]">
                        <time dateTime={post.published} className="text-[9px] sm:text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                          {new Date(post.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        <span className="w-px h-1.5" style={{ background: "var(--border-color)" }} />
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[8px] sm:text-[9px] tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-300 shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} viewBox="0 0 16 16" fill="none">
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
