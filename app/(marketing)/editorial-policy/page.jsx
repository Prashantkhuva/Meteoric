import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import Link from "next/link";

export const metadata = {
  title: `Editorial Policy | ${SITE_NAME}`,
  description:
    "How Meteoric creates, reviews, and maintains blog content. Our editorial standards ensure accuracy, expertise, and usefulness for every article.",
  alternates: {
    canonical: `${SITE_URL}/editorial-policy`,
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
      <div className="min-h-screen bg-[#070707] text-white">
        <div className="fixed top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#EAEFFF]/[0.015] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              Back to home
            </Link>
          </div>

          <header className="mb-16">
            <span className="text-[#EAEFFF]/30 uppercase tracking-[0.25em] text-[11px] font-medium block mb-4">
              Editorial Policy
            </span>
            <h1 className="text-3xl md:text-4xl font-secondary-italic text-white/80 mb-4">
              How We Create Content
            </h1>
            <p className="text-white/25 text-[15px] leading-[1.8] font-[350]">
              Transparency about our content creation process, editorial standards, and commitment to accuracy.
            </p>
          </header>

          <div className="space-y-14">
            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic text-white/70 mb-4">
                Who Writes Our Content
              </h2>
              <p className="text-white/30 text-[15px] leading-[1.85] font-[350]">
                All blog content on withmeteoric.com is written or reviewed by Prashant Khuva, Founder &amp; Full-Stack Developer at Meteoric. Every article reflects real project experience — we only write about technologies and approaches we have shipped in production for clients. We do not publish AI-generated content without human review and hands-on verification.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic text-white/70 mb-4">
                Our Editorial Standards
              </h2>
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-[#0a0a0a] border border-white/[0.06]">
                  <h3 className="text-sm font-medium text-white/60 mb-2">Accuracy First</h3>
                  <p className="text-white/25 text-[14px] leading-[1.7] font-[350]">
                    Every technical claim is verified against official documentation. Code examples are tested. Statistics are sourced from published research, official benchmarks, or our own project data. When we reference metrics (e.g., &quot;Lighthouse scores of 95+&quot;), those numbers come from real projects we have shipped.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-[#0a0a0a] border border-white/[0.06]">
                  <h3 className="text-sm font-medium text-white/60 mb-2">No Speculation</h3>
                  <p className="text-white/25 text-[14px] leading-[1.7] font-[350]">
                    We do not publish opinion pieces without evidence. If we recommend a technology, we explain why based on production experience — not marketing claims. If we compare tools, we disclose when we have direct experience versus when we are citing third-party benchmarks.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-[#0a0a0a] border border-white/[0.06]">
                  <h3 className="text-sm font-medium text-white/60 mb-2">Regular Updates</h3>
                  <p className="text-white/25 text-[14px] leading-[1.7] font-[350]">
                    Every article shows its last modified date. We review content quarterly for accuracy and freshness. When technology versions change or new data becomes available, we update the article and note the changes. Outdated content is either updated or archived.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic text-white/70 mb-4">
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
                    <span className="text-[#EAEFFF]/20 text-sm font-mono shrink-0 mt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/30 text-[15px] leading-[1.7] font-[350]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic text-white/70 mb-4">
                Corrections
              </h2>
              <p className="text-white/30 text-[15px] leading-[1.85] font-[350]">
                If you find an error in any of our articles, please contact us at{" "}
                <a
                  href="mailto:contact@withmeteoric.com"
                  className="text-[#EAEFFF]/40 hover:text-[#EAEFFF]/60 transition-colors"
                >
                  contact@withmeteoric.com
                </a>
                . We will review the claim, correct the article if needed, and note the correction. Accuracy matters more than being right — if we made a mistake, we fix it.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-secondary-italic text-white/70 mb-4">
                Conflicts of Interest
              </h2>
              <p className="text-white/30 text-[15px] leading-[1.85] font-[350]">
                Some articles reference technologies we use in client projects (Next.js, Supabase, Stripe, GSAP). We disclose when we have direct commercial experience with a tool. Our recommendations are based on technical merit and production experience — not affiliate relationships or sponsorship. We do not accept paid placements in editorial content.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
