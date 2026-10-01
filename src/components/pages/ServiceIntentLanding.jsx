"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { trackEvent } from "@/lib/analytics/gtag";
import { openCalModal } from "@/components/ui/cal-modal-store";

export default function ServiceIntentLanding({
  page,
  projects: pageProjects = [],
  insights = [],
  relatedService = null,
}) {
  const openCal = useCallback(() => openCalModal(), []);

  const sectionLabel = (text) => (
    <ScrollReveal direction="down" delay={0}>
      <span className="text-[var(--accent)]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
        {text}
      </span>
    </ScrollReveal>
  );

  return (
    <div
      className="min-h-screen text-[var(--text-primary)]"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-28 md:pt-32">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 min-h-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        >
          <ArrowLeft size={14} /> All Services
        </Link>
      </div>

      {/* Hero: H1 + direct answer (AEO answer-first) */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-12 pb-14 md:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.1] max-w-3xl"
        >
          {page.h1}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary, #0a0a0a)] p-6 md:p-7"
        >
          <span className="text-[var(--accent)]/50 uppercase tracking-[0.2em] text-[11px] font-bold block mb-3">
            Quick answer
          </span>
          <p className="text-[15px] md:text-base leading-relaxed text-[var(--text-secondary)] max-w-2xl">
            {page.directAnswer}
          </p>
        </motion.div>
      </section>

      {/* Who it's for + What's included */}
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20 space-y-16">
          <section aria-labelledby="who-for">
            {sectionLabel("Who it's for")}
            <h2
              id="who-for"
              className="text-2xl md:text-3xl font-secondary-italic mb-7"
            >
              Built for founders at a specific stage
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {page.whoFor.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary, #0a0a0a)] p-5 text-[15px] leading-relaxed text-[var(--text-secondary)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="included">
            {sectionLabel("What's included")}
            <h2
              id="included"
              className="text-2xl md:text-3xl font-secondary-italic mb-7"
            >
              What ships with the engagement
            </h2>
            <ul className="space-y-3.5">
              {page.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--text-secondary)]"
                >
                  <Check
                    size={16}
                    className="text-[var(--accent)] mt-1 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Process */}
      <section
        aria-labelledby="process"
        className="border-t border-[var(--border-color)]"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
          {sectionLabel("Process")}
          <h2
            id="process"
            className="text-2xl md:text-3xl font-secondary-italic mb-10"
          >
            How the work runs
          </h2>
          <ol className="space-y-8">
            {page.processSteps.map((step, idx) => (
              <ScrollReveal key={step.title} direction="up" delay={0}>
                <li className="grid md:grid-cols-5 gap-4 md:gap-10">
                  <span className="text-[var(--accent)]/20 text-sm font-mono md:col-span-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="md:col-span-4">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-[var(--text-muted)] text-[15px] leading-relaxed max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Technologies — only when genuinely relevant */}
      {page.technologies?.length > 0 && (
        <section
          aria-labelledby="tech"
          className="border-t border-[var(--border-color)]"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
            {sectionLabel("Technologies")}
            <h2
              id="tech"
              className="text-2xl md:text-3xl font-secondary-italic mb-8"
            >
              Tools chosen for this kind of build
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.technologies.map((tech) => (
                <li
                  key={tech.name}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary, #0a0a0a)] p-5"
                >
                  <p className="text-[15px] font-semibold mb-1">{tech.name}</p>
                  <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                    {tech.use}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Fit / not a fit */}
      <section
        aria-labelledby="fit"
        className="border-t border-[var(--border-color)]"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
          {sectionLabel("Fit check")}
          <h2
            id="fit"
            className="text-2xl md:text-3xl font-secondary-italic mb-3"
          >
            When this engagement fits — and when it doesn&apos;t
          </h2>
          <p className="text-[15px] text-[var(--text-muted)] mb-10 max-w-2xl leading-relaxed">
            Every project is built directly by the founder — that model works
            well under certain conditions. Read both columns before booking.{" "}
            <Link
              href="/about"
              className="text-[var(--accent)] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            >
              About the studio
            </Link>
            .
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary, #0a0a0a)] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] mb-4">
                Good fit
              </h3>
              <ul className="space-y-3">
                {page.fits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--text-secondary)]"
                  >
                    <Check
                      size={15}
                      className="text-[var(--accent)] mt-1 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary, #0a0a0a)] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
                Probably not
              </h3>
              <ul className="space-y-3">
                {page.notFits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--text-muted)]"
                  >
                    <X
                      size={15}
                      className="mt-1 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related work — real project data only */}
      {pageProjects.length > 0 && (
        <section
          aria-labelledby="work"
          className="border-t border-[var(--border-color)]"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
            {sectionLabel("Related work")}
            <h2
              id="work"
              className="text-2xl md:text-3xl font-secondary-italic mb-4"
            >
              Projects in this territory
            </h2>
            <p className="text-[15px] text-[var(--text-muted)] mb-10 max-w-2xl leading-relaxed">
              Shipped work pulled straight from{" "}
              <Link
                href="/work"
                className="text-[var(--accent)] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                the portfolio
              </Link>{" "}
              — browse all case studies there.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {pageProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary, #0a0a0a)] overflow-hidden hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-muted)] block mb-3">
                      {project.projectType}
                    </span>
                    <h3 className="text-lg font-secondary-italic mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-[14px] text-[var(--text-muted)] leading-relaxed mb-4">
                      {project.tagline}
                    </p>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {project.technology.join(" · ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] mt-4 group-hover:translate-x-0.5 transition-transform duration-300">
                      View case study
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section
        aria-labelledby="faq"
        className="border-t border-[var(--border-color)]"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
          {sectionLabel("FAQ")}
          <h2
            id="faq"
            className="text-3xl md:text-5xl font-secondary-italic mb-14"
          >
            Questions, answered plainly
          </h2>
          <FaqAccordion items={page.faqs} />
        </div>
      </section>

      {/* Related insights */}
      {insights.length > 0 && (
        <section
          aria-labelledby="insights"
          className="border-t border-[var(--border-color)]"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
            {sectionLabel("Insights")}
            <h2
              id="insights"
              className="text-2xl md:text-3xl font-secondary-italic mb-10"
            >
              Read before you decide
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {insights.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)] hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <h3 className="text-sm font-secondary-italic text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-2 leading-[1.3]">
                    {post.title}
                  </h3>
                  <span className="text-[var(--text-muted)] text-xs font-mono">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
            {relatedService && (
              <p className="text-[15px] text-[var(--text-muted)] mt-8">
                Full service detail:{" "}
                <Link
                  href={`/services/${relatedService.slug}`}
                  className="text-[var(--accent)] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                >
                  {relatedService.title}
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        aria-labelledby="cta"
        className="border-t border-[var(--border-color)] py-16 md:py-20"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <h2 id="cta" className="text-2xl md:text-3xl font-secondary-italic mb-4">
            Start the conversation
          </h2>
          <p className="text-[15px] md:text-base text-[var(--text-muted)] leading-relaxed mb-8 max-w-2xl">
            {page.ctaLine}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                trackEvent("service_intent_cta_click", {
                  button_location: page.path,
                });
                openCal();
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-9 gap-2 border-0 px-5 text-sm font-medium shadow-none hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                background: "#ffffff",
                color: "var(--bg-primary)",
              }}
            >
              Book a free strategy call
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 12"
                className="size-2 -rotate-90 transition-transform duration-150"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z"
                />
              </svg>
            </button>
            <Link
              href="/booking"
              className="inline-flex items-center gap-1.5 min-h-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            >
              Start a project page →
            </Link>
          </div>
          <nav
            aria-label="Related pages"
            className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[var(--text-muted)]"
          >
            <Link
              href="/services"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              All services
            </Link>
            <Link
              href="/work"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Work
            </Link>
            <Link
              href="/case-studies"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Case studies
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/booking"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
