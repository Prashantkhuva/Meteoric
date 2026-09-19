"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";
import { caseStudies } from "@/data/case-studies";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border-color)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base md:text-lg font-display text-[var(--text-primary)] tracking-tight">
          {title}
        </span>
        <span className="ml-4 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-[var(--border-color)] group-hover:ring-[var(--border-hover)] transition-all duration-300">
          {open ? (
            <Minus size={14} className="text-[var(--text-secondary)]" />
          ) : (
            <Plus size={14} className="text-[var(--text-secondary)]" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[var(--text-secondary)] text-[15px] leading-[1.8]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StrategyStep({ number, title, description }) {
  return (
    <div className="flex gap-5">
      <span className="text-3xl md:text-4xl font-display text-[var(--text-muted)] leading-none shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">
          {title}
        </h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
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

  const relatedSlugs = caseStudy.relatedProjects || [];
  const relatedItems = relatedSlugs
    .map((slug) => {
      const cs = caseStudies.find((c) => c.slug === slug);
      const projSlug = slug === "letem-know" ? "lete-em-know" : slug;
      return cs ? { ...cs, projSlug } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen text-[var(--text-primary)]" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-10">
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
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
              {caseStudy.role.split(",")[0]}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
              Case Study
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
              {caseStudy.timeline}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display leading-[1.1] tracking-tight mb-5 max-w-4xl">
            {caseStudy.tagline}
          </h1>
          <p className="text-base md:text-lg max-w-2xl text-[var(--text-secondary)] leading-relaxed">
            {caseStudy.problem}
          </p>
        </motion.div>
      </section>

      {/* Image */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-16">
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
          className="grid grid-cols-3 gap-6 pb-12 border-b border-[var(--border-color)]"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] mb-2 text-[var(--text-muted)]">
              Client
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{caseStudy.client}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] mb-2 text-[var(--text-muted)]">
              Timeline
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{caseStudy.timeline}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] mb-2 text-[var(--text-muted)]">
              Service
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{caseStudy.role}</p>
          </div>
        </motion.div>
      </section>

      {/* Intro paragraph */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-base md:text-lg text-[var(--text-secondary)] leading-[1.8]"
        >
          {caseStudy.approach}
        </motion.p>
      </section>

      {/* Challenge + Solution — Collapsible */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
        <Collapsible title="The challenge" defaultOpen>
          {caseStudy.problem}
        </Collapsible>
        <Collapsible title="The solution">
          {caseStudy.whatWasBuilt || caseStudy.approach}
        </Collapsible>
      </section>

      {/* Strategy / Process */}
      {caseStudy.productDecisions && (
        <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8 font-medium">
              Our approach
            </h2>
            <div className="space-y-8">
              {caseStudy.productDecisions.slice(0, 4).map((item, i) => {
                const boldMatch = item.match(/^([^.—–-]+?)\s*[—–-]\s*(.+)$/s);
                return (
                  <StrategyStep
                    key={i}
                    number={String(i + 1).padStart(2, "0")}
                    title={boldMatch ? boldMatch[1].trim() : `Step ${i + 1}`}
                    description={
                      boldMatch ? boldMatch[2].trim() : item
                    }
                  />
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* Objectives / What we solved — side by side */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 font-medium">
              Objectives
            </h2>
            <ul className="space-y-4">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 font-medium">
              What we solved
            </h2>
            <ul className="space-y-4">
              {caseStudy.productDecisions?.slice(0, 5).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.split("—")[0].split("–")[0].trim()}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      {caseStudy.results && (
        <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8 font-medium">
              The outcome
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {caseStudy.results.map((r, ri) => (
                <div key={ri}>
                  <p className="text-3xl md:text-4xl font-display text-[var(--text-primary)] mb-1 tracking-tight">
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
        </section>
      )}

      {/* Tech Stack */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 font-medium">
            Tech stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase ring-1 ring-[var(--border-color)] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Related Services */}
      {caseStudy.serviceLink && (
        <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-2xl ring-1 ring-[var(--border-color)]"
            style={{ background: "var(--bg-surface)" }}
          >
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.1em] mb-3">
              If this looks like what you need…
            </p>
            <Link
              href={caseStudy.serviceLink.href}
              className="group/serv inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
            >
              <span>Explore {caseStudy.serviceLink.label}</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/serv:translate-x-1"
              />
            </Link>
          </motion.div>
        </section>
      )}

      {/* Related Projects — card grid */}
      {relatedItems.length > 0 && (
        <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8 font-medium">
              Continue exploring
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {relatedItems.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/work/${rel.projSlug}`}
                  className="group block rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)] hover:ring-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "var(--card-bg)" }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={`${rel.name} — Meteoric`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                      {rel.role?.split(",")[0] || "Case Study"}
                    </p>
                    <h3 className="text-base font-display text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {rel.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* CTAs */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 pt-12 border-t border-[var(--border-color)]"
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5 ring-1 ring-[var(--border-color)] text-[var(--text-primary)] hover:ring-[var(--border-hover)]"
          >
            <span>View Live Project</span>
            <ArrowUpRight size={15} />
          </a>

          <button
            onClick={openCal}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
            style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
          >
            Book a call
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" className="size-2 -rotate-90 transition-transform duration-150 group-hover:translate-x-px">
              <path fill="currentColor" d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z" />
            </svg>
          </button>
        </motion.div>
      </section>
    </div>
  );
}
