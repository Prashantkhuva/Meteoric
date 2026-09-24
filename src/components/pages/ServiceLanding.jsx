"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FaqAccordion from "@/components/sections/FaqAccordion";

export default function ServiceLanding({ service, relatedServices = [] }) {
  return (
    <div className="min-h-screen text-[var(--text-primary)]" style={{ background: "var(--bg-primary)" }}>
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-28 md:pt-32">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
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
            style={{ color: "#171717" }}
          >
            {service.tagline}
          </motion.p>
        </div>
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

      {/* Related Articles */}
      {service.relatedBlogPosts?.length > 0 && (
        <section className="border-t border-[var(--border-color)] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <ScrollReveal direction="down" delay={0}>
              <span className="text-[var(--accent)]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
                Related Articles
              </span>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-4">
              {service.relatedBlogPosts.map((post) => (
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
