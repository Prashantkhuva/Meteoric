import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

// Homepage → key guides: passes internal link equity to the posts closest to page 1.
const FEATURED_SLUGS = [
  "gsap-vs-framer-motion-production-guide",
  "what-is-a-saas-development-agency",
  "react-vs-nextjs-for-startup-websites",
  "mongodb-vs-postgresql-for-saas",
  "high-converting-landing-page-structure-for-saas",
  "how-to-choose-a-web-development-agency",
];

export default function FeaturedGuides() {
  const guides = FEATURED_SLUGS.map((slug) =>
    blogPosts.find((p) => p.slug === slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (guides.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-guides-heading"
      className="relative"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16 lg:py-24">
        <p
          className="uppercase tracking-[0.15em] text-caption mb-4 font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Guides
        </p>
        <h2
          id="featured-guides-heading"
          className="text-heading-1 font-semibold leading-tight tracking-tight mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          Guides for founders.{" "}
          <span
            className="font-secondary-italic"
            style={{ color: "var(--text-secondary)" }}
          >
            Straight answers, no fluff.
          </span>
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col justify-between gap-4 rounded-2xl p-6 transition-colors"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--card-bg)",
                }}
              >
                <div>
                  <h3
                    className="text-base font-medium leading-snug mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.seoTitle || post.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {post.tagline}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-sm transition-opacity group-hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Read guide <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          All guides <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
