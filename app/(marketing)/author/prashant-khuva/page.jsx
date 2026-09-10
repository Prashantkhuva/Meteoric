import { blogPosts } from "@/data/blog-posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import Link from "next/link";

const authorData = {
  name: "Prashant Khuva",
  title: "Founder & Full-Stack Developer",
  company: SITE_NAME,
  bio: "Building high-performance web applications and SaaS products for startups since 2020. Specializing in React, Next.js, Node.js, and the MERN stack. Direct founder involvement on every project — no account managers.",
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
      <article className="min-h-screen bg-black text-white">
        <div className="fixed top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#EAEFFF]/[0.015] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="mb-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              Back to blog
            </Link>
          </div>

          <header className="mb-16">
            <div className="flex items-start gap-6 mb-8">
              <span className="relative w-20 h-20 rounded-full bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center text-lg text-white/40 overflow-hidden shrink-0">
                <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                  <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.06)" />
                  <ellipse cx="16" cy="26" rx="9" ry="6" fill="rgba(255,255,255,0.04)" />
                </svg>
                <span className="relative z-10">PK</span>
              </span>
              <div>
                <h1 className="text-3xl md:text-4xl font-secondary-italic text-white/80 mb-2">
                  {authorData.name}
                </h1>
                <p className="text-[#EAEFFF]/40 text-sm mb-4">
                  {authorData.title} at {authorData.company}
                </p>
                <p className="text-white/25 text-[15px] leading-[1.8] font-[350] max-w-2xl">
                  {authorData.bio}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <a
                    href={authorData.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/15 hover:text-white/40 text-[11px] font-mono tracking-wider transition-colors duration-200"
                  >
                    @prashantkhuva_
                  </a>
                  <a
                    href={authorData.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/15 hover:text-white/40 text-[11px] font-mono tracking-wider transition-colors duration-200"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={authorData.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/15 hover:text-white/40 text-[11px] font-mono tracking-wider transition-colors duration-200"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {authorData.credentials.map((cred, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06]"
                >
                  <div className="text-[13px] text-white/40">{cred}</div>
                </div>
              ))}
            </div>
          </header>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[#EAEFFF]/30 uppercase tracking-[0.25em] text-[11px] font-medium">
                Published Articles ({authorPosts.length})
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>
            <div className="space-y-4">
              {authorPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-6 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-medium text-white/60 group-hover:text-white/80 transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-white/25 text-[13px] leading-[1.6] line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <time
                          dateTime={post.published}
                          className="text-white/15 text-[11px] font-mono"
                        >
                          {new Date(post.published).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-white/15 tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors shrink-0 mt-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M6 3H13V10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13 3L3 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
