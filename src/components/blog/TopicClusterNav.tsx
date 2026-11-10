import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { getClusterForSlug } from "@/data/topic-clusters";

/** Series box: links a post to its cluster hub, siblings, and service page. */
export default function TopicClusterNav({ slug }: { slug: string }) {
  const cluster = getClusterForSlug(slug);
  if (!cluster) return null;

  const items = [cluster.hub, ...cluster.members]
    .map((s) => blogPosts.find((p) => p.slug === s && p.draft !== true))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={`${cluster.name} guide series`}
      className="mt-16 max-w-[700px] mx-auto rounded-2xl p-6 sm:p-8"
      style={{
        border: "1px solid var(--border-color)",
        background: "var(--accent-glow)",
      }}
    >
      <p
        className="text-[11px] uppercase tracking-[0.14em] font-medium mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        Guide series
      </p>
      <p
        className="font-display text-[22px] leading-[1.25] mb-5"
        style={{ color: "var(--text-primary)" }}
      >
        {cluster.name}
      </p>
      <ol className="space-y-2.5">
        {items.map((post) => {
          const current = post.slug === slug;
          const label = post.seoTitle || post.title;
          return (
            <li key={post.slug} className="text-[15px] leading-[1.5]">
              {current ? (
                <span
                  aria-current="page"
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {label}{" "}
                  <span style={{ color: "var(--text-muted)" }}>
                    · you are here
                  </span>
                </span>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                  {post.slug === cluster.hub && (
                    <span style={{ color: "var(--text-muted)" }}>
                      {" "}
                      · start here
                    </span>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <Link
        href={cluster.service.href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
        style={{ color: "var(--text-primary)" }}
      >
        {cluster.service.label} with Meteoric{" "}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </nav>
  );
}
