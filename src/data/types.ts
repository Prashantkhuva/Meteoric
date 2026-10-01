/**
 * Central content contracts for SEO-sensitive site data.
 *
 * Every indexable content surface (services, case studies, testimonials,
 * FAQs, articles, organization, social profiles, navigation) is typed here
 * and stored in the matching `src/data/*.ts` module. Data modules are the
 * single source of truth — components must not re-declare this content.
 *
 * Field naming follows the content architecture spec:
 * - Missing factual data uses optional fields with `TODO(content)` markers.
 * - Never fabricate metrics, client names, dates, or classifications.
 */

/* ────────────────────────────── FAQ ────────────────────────────── */

export interface Faq {
  question: string;
  answer: string;
}

/* ────────────────────────── Home process ────────────────────────── */

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

/* ─────────────────────────── Services ─────────────────────────── */

export interface ServiceProcessStep {
  title: string;
  desc: string;
}

export interface ServiceProcess {
  intro: string;
  steps: ServiceProcessStep[];
}

export interface ServiceSection {
  heading: string;
  body: string;
}

export interface RelatedBlogRef {
  slug: string;
  title: string;
}

export interface Service {
  /** URL segment: /services/{slug} */
  slug: string;
  /** Display title on the services index. */
  title: string;
  /**
   * Short description shown on the services index card.
   * Optional — services without an index card (nextjs-development) omit it.
   */
  shortDescription?: string;
  /**
   * TODO(content): long-form detailed description. Detail pages currently
   * render `sections` instead; add a single-paragraph summary here when ready.
   */
  detailedDescription?: string;
  /** TODO(content): intended audience one-liner (e.g. "Seed-stage SaaS founders"). */
  audience?: string;
  /** TODO(content): concrete deliverables list (e.g. "Responsive Next.js site, SEO setup…"). */
  deliverables?: string;
  /** Optional process steps rendered on the services index. */
  process?: ServiceProcess;
  /** FAQs rendered on the detail page (also feed FAQPage JSON-LD). */
  faqs: Faq[];
  /** <title> for /services/{slug}. */
  metadataTitle: string;
  /** meta description for /services/{slug}. */
  metadataDescription: string;
  /** Two-line H1 shown on the detail hero. */
  h1: [string, string];
  tagline: string;
  /** Direct-answer lead paragraph shown right below the H1 (AEO). */
  directAnswer: string;
  /** Detail-page body sections (also feed HowTo JSON-LD). */
  sections: ServiceSection[];
  relatedBlogPosts?: RelatedBlogRef[];
  /** Label used when this service appears as a "related service" card. */
  relatedName: string;
  /** When true the service must never reach the sitemap or indexable output. */
  draft?: boolean;
  /** Services-index card extras (present on the four index-listed services). */
  num?: string;
  image?: string;
  metric?: string;
}

/** Home services section card — wording differs from the index on purpose. */
export interface HomeServiceCard {
  title: string;
  desc: string;
  image: string;
  href: string;
}

/* ─────────────── Case studies & portfolio projects ─────────────── */

/**
 * Classification of work. Only set when verified from repository facts —
 * unverified records leave this optional field unset.
 */
export type WorkType = "client" | "internal" | "concept" | "open-source";

export interface CaseStudyResult {
  metric: string;
  value: string;
  description: string;
}

export interface ServiceLinkRef {
  label: string;
  href: string;
}

export interface CaseStudyScreenshot {
  /** Path under /public (e.g. "/shots/dashboard.webp"). */
  src: string;
  /** Meaningful description of what the screenshot shows — no keyword stuffing. */
  alt: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  /**
   * Rendered only when BOTH are true:
   * - `verified` — the quote is accurate and approved by the author.
   * - `permitted` — the client agreed to publish it with attribution.
   */
  verified: boolean;
  permitted: boolean;
}

export interface CaseStudy {
  slug: string;
  /** Project / client name. */
  name: string;
  /** Project classification label shown on cards (e.g. "Web Design", "SaaS MVP"). */
  projectType?: string;
  /** TODO(content): industry (e.g. "Marketing", "Health & Fitness"). */
  industry?: string;
  /** TODO(content): services provided as a list (currently free-text `role`). */
  servicesProvided?: string[];
  /** Technology used. */
  technology: string[];
  /** The challenge the project solved. */
  challenge: string;
  /** The solution delivered. */
  solution: string;
  /**
   * Outcome metrics. The Results section renders ONLY when `resultsVerified`
   * is true — set it after each metric is checked against a real source.
   */
  results: CaseStudyResult[];
  /** Rendered as "Results" only when true. TODO(content): verify each metric. */
  resultsVerified?: boolean;
  /** Live URL — only when verified reachable and intended to be public. */
  liveUrl?: string;
  /** Render the live-link button only when true (verified reachable + public + accurate). */
  liveUrlVerified?: boolean;
  image: string;
  /** Meaningful alt text for the preview image. */
  imageAlt: string;
  /** Optional extra screenshots rendered under the solution section. */
  screenshots?: CaseStudyScreenshot[];
  /** TODO(content): deliverables list (e.g. "Responsive site, CMS, analytics setup"). */
  deliverables?: string[];
  /** Testimonial — rendered only when verified AND permitted. */
  testimonial?: CaseStudyTestimonial;
  /** TODO(content): client | internal | concept | open-source — verify before setting. */
  workType?: WorkType;
  tagline: string;
  client: string;
  timeline: string;
  role: string;
  metaTitle: string;
  metaDescription: string;
  whatWasBuilt?: string;
  productDecisions?: string[];
  technicalImplementation?: string;
  features?: string[];
  gradient: string;
  accent: string;
  serviceLink: ServiceLinkRef;
  relatedProjects: string[];
  /** When true the record must never reach the sitemap or indexable output. */
  draft?: boolean;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  /** Live URL — only when verified reachable. */
  liveUrl?: string;
  /** Render the live-link button only when true (verified reachable + public + accurate). */
  liveUrlVerified?: boolean;
  image: string;
  /** Meaningful alt text for the preview image. */
  imageAlt: string;
  /** Project type (work-page filter category). */
  projectType: string;
  /**
   * Slug of the matching record in `src/data/case-studies.ts`.
   * Set when a full case study exists — the /work/[slug] template then
   * renders challenge/solution/results etc. Unset = project-only page.
   */
  caseStudySlug?: string;
  /** Technology used. */
  technology: string[];
  features: string[];
  accent: string;
  /** TODO(content): client | internal | concept | open-source — verify before setting. */
  workType?: WorkType;
  /** When true the record must never reach the sitemap or indexable output. */
  draft?: boolean;
}

/* ────────────────────────── Testimonials ────────────────────────── */

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  project?: string;
  rating: number;
  isVerified?: boolean;
  createdAt?: string;
}

/** Raw `reviews` row shape returned by getApprovedReviews (Supabase). */
export interface ReviewRow {
  content: string;
  name: string;
  role?: string | null;
  project?: string | null;
  rating: number;
  company?: string | null;
  is_verified?: boolean | null;
  created_at?: string | null;
}

/* ────────────────────── Articles / insights ────────────────────── */

export interface ArticleAuthor {
  name: string;
  url: string;
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface ArticleMetric {
  label: string;
  value: string;
}

export interface ArticleReference {
  title: string;
  url: string;
  /** Publishing source / site name of the reference. */
  source: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface ArticleHowTo {
  name: string;
  description?: string;
  step: { name: string; text: string }[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  tagline: string;
  /** Publish date (YYYY-MM-DD). Drives sitemap lastModified. */
  published: string;
  dateModified?: string;
  author: ArticleAuthor;
  sections: ArticleSection[];
  faqs?: Faq[];
  tags: string[];
  metrics: ArticleMetric[];
  furtherReading?: ArticleReference[];
  relatedLinks?: RelatedLink[];
  relatedBlogPosts?: RelatedBlogRef[];
  howTo?: ArticleHowTo;
  /** When true the post must never reach the sitemap or indexable output. */
  draft?: boolean;
}

/* ─────────────── Organization / founder / social ─────────────── */

export interface SocialProfile {
  id: "github" | "linkedin" | "twitter" | "instagram";
  label: string;
  url: string;
}

/**
 * Founder social profile for /about. `url: null` = placeholder pending
 * manual verification — components MUST skip these (never render).
 */
export interface FounderProfile {
  id: string;
  label: string;
  /** Full https URL, or null when not yet verified. */
  url: string | null;
}

export interface OrganizationDetails {
  /** Display name — sourced from seo config SITE_NAME. */
  name: string;
  /** Site-relative logo path (composed with SITE_URL at render). */
  logo: string;
  /** Site-relative default social image path. */
  image: string;
  description: string;
  foundingDate: string;
  areaServed: string;
  contactEmail: string;
  wikidataUrl: string;
  knowsAbout: string[];
  /** Social profile URLs + Wikidata entry (Organization sameAs). */
  sameAs: string[];
}

export interface FounderDetails {
  name: string;
  jobTitle: string;
  description: string;
  /** Personal GitHub profile (distinct from the company github profile). */
  githubUrl: string;
  knowsAbout: string[];
}

/* ────────────────────────── Navigation ────────────────────────── */

export interface NavLink {
  label: string;
  to: string;
}

export interface FooterLinkColumn {
  heading: string;
  links: NavLink[];
}

export interface IntentProcessStep {
  title: string;
  desc: string;
}

export interface IntentTechnology {
  name: string;
  use: string;
}

export interface InsightRef {
  slug: string;
}

/**
 * Top-level intent landing page (e.g. /saas-mvp-development).
 * Copy lives here — each page keeps its own wording, structure is shared.
 */
export interface ServiceIntentPage {
  /** Root path, e.g. "/saas-mvp-development" — no trailing slash. */
  path: string;
  metadataTitle: string;
  metadataDescription: string;
  h1: string;
  /** AEO direct answer shown immediately below the H1. */
  directAnswer: string;
  whoFor: string[];
  deliverables: string[];
  processSteps: IntentProcessStep[];
  /** Omit when no technology list adds genuine relevance. */
  technologies?: IntentTechnology[];
  fits: string[];
  notFits: string[];
  /** Slugs resolved against projects.ts — never free-typed project facts. */
  projectSlugs: string[];
  faqs: Faq[];
  /** Slugs resolved against blog-posts.ts at render time. */
  insightSlugs: string[];
  /** Related service under /services (link target + label source). */
  relatedServiceSlug?: string;
  ctaLine: string;
}
