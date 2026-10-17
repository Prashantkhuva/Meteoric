import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  /** Root-relative path, "" = home ("/"). Matches buildBreadcrumbJsonLd trail. */
  path: string;
}

/**
 * Visible breadcrumb trail. Server-rendered.
 * Names and URLs must match the page's BreadcrumbList JSON-LD exactly —
 * pass the same trail array to both.
 */
export default function Breadcrumbs({
  items,
  containerClassName = "max-w-6xl mx-auto px-6 md:px-12",
}: {
  items: BreadcrumbItem[];
  containerClassName?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${containerClassName} pt-24 md:pt-28`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const href = item.path === "" ? "/" : item.path;
          return (
            <li key={item.path || "home"} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden="true" className="opacity-40">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-[var(--text-primary)] max-w-[36ch] truncate"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={href}
                  className="inline-flex items-center min-h-6 hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
