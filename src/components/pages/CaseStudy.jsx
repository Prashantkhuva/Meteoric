"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import StaggerText from "@/components/layout/StaggerText";
import { caseStudies } from "@/data/case-studies";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function SectionHeading({ children }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-5 font-medium">
      {children}
    </h2>
  );
}

function Prose({ children }) {
  return (
    <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8]">{children}</p>
  );
}

function DecisionList({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-white/20" />
          <span className="text-sm text-[var(--text-muted)] leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CaseStudy({ project }) {
  const csLookup = {
    "lete-em-know": "letem-know",
    "habit-flow": "habit-flow",
    megablog: "megablog",
    "mobile-preview-simulator": "mobile-preview-simulator",
  };
  const caseStudy = caseStudies.find(
    (cs) => cs.slug === csLookup[project.slug],
  );

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  if (!caseStudy) return null;

  return (
    <div className="min-h-screen text-[var(--text-primary)]" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            All Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-[11px] font-mono tracking-widest uppercase mb-4 block text-[var(--accent)]">
            Case Study
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.05] tracking-tight mb-4">
            {caseStudy.name}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-[var(--accent)]">
            {caseStudy.tagline}
          </p>
        </motion.div>
      </section>

      {/* Image */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)]"
        >
          <Image
            src={project.image}
            alt={`${caseStudy.name} — ${caseStudy.tagline} — Meteoric`}
            width={1280}
            height={720}
            className="w-full h-auto object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Meta Row */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-12 border-b border-[var(--border-color)]"
        >
          <div>
            <SectionHeading>Client</SectionHeading>
            <p className="text-[var(--text-secondary)] text-sm">{caseStudy.client}</p>
          </div>
          <div>
            <SectionHeading>Timeline</SectionHeading>
            <p className="text-[var(--text-secondary)] text-sm">{caseStudy.timeline}</p>
          </div>
          <div>
            <SectionHeading>Role</SectionHeading>
            <p className="text-[var(--text-secondary)] text-sm">{caseStudy.role}</p>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-24">
        <div className="space-y-20">
          {/* The Challenge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeading>The Challenge</SectionHeading>
            <Prose>{caseStudy.problem}</Prose>
          </motion.div>

          {/* The Approach */}
          {caseStudy.approach && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeading>The Approach</SectionHeading>
              <Prose>{caseStudy.approach}</Prose>
            </motion.div>
          )}

          {/* What Was Built */}
          {caseStudy.whatWasBuilt && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeading>What Was Built</SectionHeading>
              <Prose>{caseStudy.whatWasBuilt}</Prose>
            </motion.div>
          )}

          {/* Product / UX Decisions */}
          {caseStudy.productDecisions && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeading>Product Decisions</SectionHeading>
              <DecisionList items={caseStudy.productDecisions} />
            </motion.div>
          )}

          {/* Technical Implementation */}
          {caseStudy.technicalImplementation && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeading>Technical Implementation</SectionHeading>
              <Prose>{caseStudy.technicalImplementation}</Prose>
            </motion.div>
          )}

          {/* Key Features + Tech Stack — side by side on desktop */}
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeading>Key Features</SectionHeading>
              <div className="space-y-3">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: project.accent }}
                    />
                    <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <SectionHeading>Tech Stack</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-3 py-1 rounded-full border text-[var(--text-muted)] font-medium tracking-wide uppercase"
                    style={{
                      borderColor: `${project.accent}33`,
                      backgroundColor: `${project.accent}0a`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Outcome */}
          {caseStudy.results && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeading>Outcome</SectionHeading>
              <div className="grid sm:grid-cols-3 gap-8">
                {caseStudy.results.map((r, ri) => (
                  <div key={ri}>
                    <p className="text-2xl md:text-3xl font-display text-[var(--text-primary)] mb-1">
                      {r.value}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">
                      {r.metric}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{r.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Related Services */}
        {caseStudy.serviceLink && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 pt-12 border-t border-[var(--border-color)]"
          >
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.1em] mb-4">
              If this looks like what you need…
            </p>
            <Link
              href={caseStudy.serviceLink.href}
              className="group/serv inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]/70 hover:text-[var(--accent)] transition-colors duration-300"
            >
              <span>Explore {caseStudy.serviceLink.label}</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/serv:translate-x-1"
              />
            </Link>
          </motion.div>
        )}

        {/* Related Projects */}
        {caseStudy.relatedProjects && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16"
          >
            <SectionHeading>Related Work</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-4">
              {caseStudy.relatedProjects.map((slug) => {
                const related = caseStudies.find((cs) => cs.slug === slug);
                if (!related) return null;
                return (
                  <Link
                    key={slug}
                    href={`/work/${slug === "letem-know" ? "lete-em-know" : slug}`}
                    className="group block p-6 rounded-xl border border-[var(--border-color)] hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300"
                  >
                    <p className="text-sm font-display text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {related.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{related.tagline}</p>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 mt-20 pt-12 border-t border-[var(--border-color)]"
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5"
            style={{
              border: `1.5px solid ${project.accent}`,
              color: project.accent,
            }}
          >
            <span
              className="fill-circle"
              style={{ backgroundColor: project.accent }}
            />
            <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-black transition-colors duration-300">
              <StaggerText hoverColor="#000">View Live Project</StaggerText>
              <ArrowUpRight size={15} />
            </span>
          </a>

          <button
            onClick={openCal}
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-[var(--accent)] text-[var(--accent-text)] text-sm font-semibold hover:bg-white transition-all duration-300"
          >
            Start a Project
          </button>
        </motion.div>
      </section>
    </div>
  );
}
