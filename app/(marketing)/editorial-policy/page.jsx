import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import Link from "next/link";

const pageTitle = `Editorial Policy | ${SITE_NAME}`;
const pageDesc =
  "How Meteoric creates, reviews, and maintains blog content. Our editorial standards ensure accuracy, expertise, and usefulness for every article.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/editorial-policy`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/editorial-policy`,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    creator: "@prashantkhuva_",
    title: pageTitle,
    description: pageDesc,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function EditorialPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial Policy",
    description: "How Meteoric creates, reviews, and maintains blog content",
    url: `${SITE_URL}/editorial-policy`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              Back to home
            </Link>
          </div>

          <header className="mb-16">
            <span className="uppercase tracking-[0.25em] text-[11px] font-medium block mb-4" style={{ color: "var(--text-muted)" }}>
              Editorial Policy
            </span>
            <h1 className="text-3xl md:text-4xl font-secondary-italic mb-4" style={{ color: "var(--text-primary)" }}>
              How We Create Content
            </h1>
            <p className="text-[15px] leading-[1.8] font-[350]" style={{ color: "var(--text-secondary)" }}>
              Transparency about our content creation process, editorial
              standards, and commitment to accuracy.
            </p>
          </header>

          <div className="space-y-14">
            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic mb-4" style={{ color: "var(--text-primary)" }}>
                Who Writes Our Content
              </h2>
              <p className="text-[15px] leading-[1.85] font-[350]" style={{ color: "var(--text-secondary)" }}>
                All blog content on withmeteoric.com is written or reviewed by
                Prashant Khuva, Founder &amp; Full-Stack Developer at Meteoric.
                Every article reflects real project experience — we only write
                about technologies and approaches we have shipped in production
                for clients. We do not publish AI-generated content without
                human review and hands-on verification.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic mb-4" style={{ color: "var(--text-primary)" }}>
                Our Editorial Standards
              </h2>
              <div className="space-y-4">
                <div className="p-6 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                  <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Accuracy First
                  </h3>
                  <p className="text-[14px] leading-[1.7] font-[350]" style={{ color: "var(--text-muted)" }}>
                    Every technical claim is verified against official
                    documentation. Code examples are tested. Statistics are
                    sourced from published research, official benchmarks, or our
                    own project data. When we reference metrics, those numbers
                    come from real projects we have shipped.
                  </p>
                </div>
                <div className="p-6 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                  <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    No Speculation
                  </h3>
                  <p className="text-[14px] leading-[1.7] font-[350]" style={{ color: "var(--text-muted)" }}>
                    We do not publish opinion pieces without evidence. If we
                    recommend a technology, we explain why based on production
                    experience — not marketing claims. If we compare tools, we
                    disclose when we have direct experience versus when we are
                    citing third-party benchmarks.
                  </p>
                </div>
                <div className="p-6 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                  <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Regular Updates
                  </h3>
                  <p className="text-[14px] leading-[1.7] font-[350]" style={{ color: "var(--text-muted)" }}>
                    Every article shows its last modified date. We review
                    content quarterly for accuracy and freshness. When
                    technology versions change or new data becomes available, we
                    update the article and note the changes. Outdated content is
                    either updated or archived.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic mb-4" style={{ color: "var(--text-primary)" }}>
                Content Review Process
              </h2>
              <ol className="space-y-3">
                {[
                  "Research — gather information from official docs, benchmarks, and project experience.",
                  "Draft — write with clear structure, specific examples, and actionable advice.",
                  "Technical verification — test code examples, verify statistics, check links.",
                  "Editorial review — check for clarity, accuracy, and completeness.",
                  "Publication — publish with structured data, internal links, and citations.",
                  "Monitoring — track performance and update as needed.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-sm font-mono shrink-0 mt-0.5 tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-[1.7] font-[350]" style={{ color: "var(--text-secondary)" }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic mb-4" style={{ color: "var(--text-primary)" }}>
                Corrections
              </h2>
              <p className="text-[15px] leading-[1.85] font-[350]" style={{ color: "var(--text-secondary)" }}>
                If you find an error in any of our articles, please contact us
                at{" "}
                <a
                  href="mailto:contact@withmeteoric.com"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: "var(--accent)" }}
                >
                  contact@withmeteoric.com
                </a>
                . We will review the claim, correct the article if needed, and
                note the correction. Accuracy matters more than being right — if
                we made a mistake, we fix it.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic mb-4" style={{ color: "var(--text-primary)" }}>
                Conflicts of Interest
              </h2>
              <p className="text-[15px] leading-[1.85] font-[350]" style={{ color: "var(--text-secondary)" }}>
                Some articles reference technologies we use in client projects
                (Next.js, Supabase, Stripe, GSAP). We disclose when we have
                direct commercial experience with a tool. Our recommendations
                are based on technical merit and production experience — not
                affiliate relationships or sponsorship. We do not accept paid
                placements in editorial content.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
