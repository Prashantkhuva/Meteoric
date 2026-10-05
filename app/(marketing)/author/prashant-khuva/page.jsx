import { blogPosts } from "@/data/blog-posts";
import { postImage } from "@/data/blog-images";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildBreadcrumbJsonLd, buildPersonJsonLd, PERSON_ID } from "@/lib/seo/jsonLd";

const authorData = {
  name: "Prashant Khuva",
  title: "Founder & Full-Stack Developer",
  company: SITE_NAME,
  bio: "Full-stack developer specializing in React, Next.js, Node.js & Supabase. No account managers.",
  longBio:
    "Founder of Meteoric. Full-stack developer specializing in React, Next.js, Node.js, and Supabase. Direct founder involvement — no account managers. He writes here about the work behind those products — SaaS architecture, database design, performance, animation, and the SEO that makes them findable — based on projects actually shipped for startups, not tutorials. Every article is reviewed and verified by hand before it goes live.",
  credentials: [
    { value: "Founder-led studio", label: "Direct involvement on every project" },
    { value: "10-day sprint cycle", label: "Average brief-to-ship cadence" },
    { value: "Next.js + Supabase", label: "Specialized production stack" },
  ],
  social: {
    twitter: "https://x.com/prashantkhuva_",
    linkedin: "https://linkedin.com/in/prashantkhuva",
    github: "https://github.com/Prashantkhuva",
  },
};

const socialLinks = [
  {
    label: "X (Twitter)",
    href: authorData.social.twitter,
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    label: "LinkedIn",
    href: authorData.social.linkedin,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "GitHub",
    href: authorData.social.github,
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

function readingTime(post) {
  const words = (post.sections || []).reduce(
    (acc, s) => acc + s.body.split(/\s+/).length,
    0
  );
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function generateMetadata() {
  return {
    title: `${authorData.name} — ${authorData.title}`,
    description: `${authorData.name} — ${authorData.title} at ${SITE_NAME}. ${authorData.bio}`,
    alternates: {
      canonical: `${SITE_URL}/author/prashant-khuva`,
    },
    openGraph: {
      title: `${authorData.name} — ${authorData.title}`,
      description: `${authorData.name} — ${authorData.title} at ${SITE_NAME}. ${authorData.bio}`,
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
      description: `${authorData.name} — ${authorData.title} at ${SITE_NAME}. ${authorData.bio}`,
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

  const authorJsonLd = buildPersonJsonLd();

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${authorData.name} — ${authorData.title}`,
    description: authorData.bio,
    url: `${SITE_URL}/author/prashant-khuva`,
    mainEntity: { "@id": PERSON_ID },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: authorData.name, path: "/author/prashant-khuva" }
  ]);

  return (
    <>
      <JsonLd data={authorJsonLd} />
      <JsonLd data={profilePageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <article className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 md:px-12 pt-28 md:pt-32 pb-24 md:pb-32">
          {/* Back link */}
          <div className="mb-10 md:mb-14">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 min-h-6 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              Back to blog
            </Link>
          </div>

          {/* Author header */}
          <header className="mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8 md:gap-10">
              {/* Portrait */}
              <div className="w-28 sm:w-36 md:w-44 shrink-0">
                <div
                  className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)]"
                  style={{ background: "var(--bg-surface)" }}
                >
                  <Image
                    src="/prashant.png"
                    alt={authorData.name}
                    width={440}
                    height={440}
                    priority
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "top center" }}
                  />
                </div>
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-px" style={{ background: "var(--border-hover)" }} />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Author
                  </span>
                </div>

                <h1 className="text-[28px] sm:text-4xl md:text-5xl font-display leading-[1.05] tracking-tight text-[var(--text-primary)] mb-3">
                  {authorData.name}
                </h1>

                <p className="text-[13px] sm:text-sm text-[var(--text-muted)] mb-4">
                  {authorData.title} at{" "}
                  <span className="text-[var(--text-secondary)]">{authorData.company}</span>
                </p>

                <p className="text-[14px] sm:text-[15px] leading-[1.7] text-[var(--text-secondary)] max-w-xl mb-6">
                  {authorData.longBio}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="group inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--text-muted)] ring-1 ring-[var(--border-color)] hover:text-[var(--text-primary)] hover:ring-[var(--border-hover)] hover:bg-[var(--accent-dim)] transition-all duration-300"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                        className="transition-transform duration-300 group-hover:scale-110"
                      >
                        <path d={link.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Credentials strip */}
            <div
              className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)]"
              style={{ background: "var(--border-color)" }}
            >
              {authorData.credentials.map((cred) => (
                <div key={cred.value} className="px-4 py-4 sm:px-5 sm:py-5" style={{ background: "var(--bg-surface)" }}>
                  <p className="text-[15px] sm:text-base font-medium leading-snug text-[var(--text-primary)] mb-1">
                    {cred.value}
                  </p>
                  <p className="text-[12px] sm:text-[13px] leading-snug text-[var(--text-muted)]">
                    {cred.label}
                  </p>
                </div>
              ))}
            </div>
          </header>

          {/* Divider */}
          <div className="h-px mb-10 md:mb-14" style={{ background: "linear-gradient(to right, transparent, var(--border-color), transparent)" }} />

          {/* Articles section */}
          <section>
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--text-muted)] whitespace-nowrap">
                Published Articles
              </h2>
              <span className="flex-1 h-px" style={{ background: "linear-gradient(to right, var(--border-color), transparent)" }} />
              <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
                {String(authorPosts.length).padStart(2, "0")}
              </span>
            </div>

            {authorPosts.length === 0 ? (
              <div
                className="rounded-2xl px-5 py-10 text-center ring-1 ring-[var(--border-color)]"
                style={{ background: "var(--bg-surface)" }}
              >
                <p className="text-sm text-[var(--text-muted)]">No published articles yet.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {authorPosts.map((post, i) => (
                  <ScrollReveal key={post.slug} direction="left" delay={0.05 * i}>
                    <Link
                      href={`/blog/${post.slug}`}
                    className="group flex flex-col sm:flex-row gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl ring-1 ring-[var(--border-color)] hover:ring-[var(--border-hover)] hover:shadow-[0_8px_30px_var(--accent-glow)] transition-all duration-500"
                    style={{ background: "var(--bg-surface)" }}
                  >
                    <div
                      className="relative w-full sm:w-40 md:w-48 shrink-0 aspect-[16/9] sm:aspect-[10/7] rounded-xl overflow-hidden"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      <Image
                        src={postImage(post)}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 200px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] sm:text-lg font-semibold leading-[1.35] text-[var(--text-primary)] transition-opacity duration-300 group-hover:opacity-70">
                          {post.title}
                        </h3>
                        <ArrowUpRight
                          size={15}
                          className="shrink-0 mt-1 text-[var(--text-muted)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                        />
                      </div>

                      <p className="text-[13px] sm:text-sm leading-[1.6] line-clamp-2 text-[var(--text-secondary)] mt-1.5">
                        {post.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 mt-3 sm:mt-auto sm:pt-4">
                        <time dateTime={post.published} className="text-[11px] font-mono text-[var(--text-muted)]">
                          {formatDate(post.published)}
                        </time>
                        <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          {readingTime(post)} min read
                        </span>
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide text-[var(--text-muted)] ring-1 ring-[var(--border-color)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>

          {/* Footer nav */}
          <div
            className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {String(authorPosts.length).padStart(2, "0")} articles by {authorData.name}
            </span>
            <a
              href="https://cal.com/prashantkhuva/let-s-build"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 min-h-6 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
            >
              Work with {authorData.name.split(" ")[0]}
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
