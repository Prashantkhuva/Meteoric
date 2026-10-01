import type { ReviewRow, Testimonial } from "./types";

/**
 * Testimonials module.
 *
 * Approved testimonials are stored in Supabase (`reviews` table) and loaded
 * at runtime via getApprovedReviews() from `@/lib/actions` — there is no
 * static testimonial copy on purpose (client quotes need client permission,
 * see TODO on getApprovedReviews). This module owns the testimonial display
 * contract and the single row→display mapping.
 *
 * TODO(content): populate approved reviews in admin once client permission
 * is confirmed; until then the homepage testimonial marquee renders empty
 * (SSR ships no review quotes, which is also the a11y-safe state).
 */

/** Shown when no approved reviews exist yet. */
export const fallbackTestimonials: Testimonial[] = [];

/** Maps a raw review row to the display testimonial. Single mapping point. */
export function mapReviewRow(row: ReviewRow): Testimonial {
  return {
    quote: row.content,
    author: row.name,
    role: row.role ?? undefined,
    project: row.project ?? undefined,
    rating: row.rating,
    company: row.company ?? undefined,
    isVerified: row.is_verified ?? undefined,
    createdAt: row.created_at ?? undefined,
  };
}
