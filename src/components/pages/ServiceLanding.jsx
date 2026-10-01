"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { blogPosts } from "@/data/blog-posts";
import { openCalModal } from "@/components/ui/cal-modal-store";

export default function ServiceLanding({ service, relatedServices = [] }) {
  const configuredRelated = service.relatedBlogPosts?.length ?? 0;
  const relatedPosts = (service.relatedBlogPosts ?? [])
    .map((rp) =>
      blogPosts.find(
        (p) => p.slug === rp.slug && p.published && p.draft !== true,
      ),
    )
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="min-h-screen text-[var(--text-primary)]" style={{ background: "var(--bg-primary)" }}>
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-28 md:pt-32">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 min-h-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={14} /> All Services
        </Link>
      </div>

      {/* Hero — Atomik style: left title, right description */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-12 pb-16 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]"
          >
            {service.h1[0]}
            <br />
            {service.h1[1]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[15px] max-w-md leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {service.tagline}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 md:mt-10 max-w-2xl"
        >
          <span className="text-[var(--accent)]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-3">
            Quick answer
          </span>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {service.directAnswer}
          </p>
        </motion.div>
      </section>

      {/* Content sections */}
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20 space-y-16">
          {service.sections.map((section, idx) => (
            <ScrollReveal key={idx} direction="up" delay={0}>
              <div className="grid md:grid-cols-5 gap-6 md:gap-10">
                <span className="text-[var(--accent)]/20 text-sm font-mono md:col-span-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-4">
                  <h2 className="text-2xl md:text-3xl font-secondary-italic mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-xl">
                    {section.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="border-t border-[var(--border-color)] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollReveal direction="down" delay={0}>
            <span className="text-[var(--accent)]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
              FAQ
            </span>
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-secondary-italic mb-14">
              Questions about {service.h1[0].toLowerCase()}?
            </h2>
          </ScrollReveal>
          <FaqAccordion items={service.faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border-color)] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollReveal direction="up" delay={0}>
            <div
              className="flex flex-col items-start gap-6 p-8 md:p-12 rounded-2xl"
              style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)" }}
            >
              <h2 className="text-3xl md:text-4xl font-secondary-italic">
                Have a project in mind?
              </h2>
              <p className="text-[15px] leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                Book a free strategy call — we&apos;ll scope the work, agree on a
                timeline, and send fixed pricing. No obligation either way.
              </p>
              <button
                onClick={openCalModal}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[13px] font-medium transition-all duration-300"
                style={{ background: "var(--accent)", color: "var(--accent-text)" }}
              >
                Book a Free Strategy Call
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Articles — only posts that actually exist and are published */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[var(--border-color)] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <ScrollReveal direction="down" delay={0}>
              <span className="text-[var(--accent)]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
                Related Articles
              </span>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)] hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300"
                >
                  <h3 className="text-sm font-secondary-italic text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-2 leading-[1.3]">
                    {post.title}
                  </h3>
                  <span className="text-[var(--text-muted)] text-xs font-mono group-hover:text-[var(--text-muted)] transition-colors duration-300">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {relatedPosts.length === 0 && configuredRelated > 0 && (
        <section className="border-t border-[var(--border-color)] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <span className="text-[var(--accent)]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
              From the Blog
            </span>
            <Link
              href="/blog"
              className="group p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)] hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300 inline-block w-full md:w-auto md:min-w-[16rem]"
            >
              <h3 className="text-sm font-secondary-italic text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-2 leading-[1.3]">
                Browse every published article
              </h3>
              <span className="text-[var(--text-muted)] text-xs font-mono">
                All articles →
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[var(--border-color)] py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <ScrollReveal direction="down" delay={0}>
              <p className="text-[var(--text-muted)] uppercase tracking-[0.2em] text-xs mb-6">
                Related Services
              </p>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedServices.map((rs) => (
                <Link
                  key={rs.slug}
                  href={`/services/${rs.slug}`}
                  className="group p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)] hover:border-[var(--accent)]/[0.12] transition-all duration-300"
                >
                  <h3 className="text-sm font-secondary-italic text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-2">
                    {rs.name}
                  </h3>
                  <span className="text-[var(--text-muted)] text-xs font-mono group-hover:text-[var(--text-muted)] transition-colors duration-300">
                    View service →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
