"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { projects } from "@/data/projects";
import { workTypeLabel, workTypeDisclosure } from "@/lib/work-type";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { ReactNode } from "react";
import type {
  CaseStudy as CaseStudyData,
  Project,
} from "@/data/types";

interface StrategyStepProps {
  number: string;
  title: string;
  description: string;
}

function StrategyStep({ number, title, description }: StrategyStepProps) {
  return (
    <div className="flex gap-5">
      <span className="text-3xl md:text-4xl font-display text-[var(--text-muted)] leading-none shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <h2
      id={`${id}-heading`}
      className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8 font-medium"
    >
      {children}
    </h2>
  );
}

function MetaCell({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.15em] mb-2 text-[var(--text-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--text-secondary)]">{value}</p>
    </div>
  );
}

export interface CaseStudyProps {
  project: Project;
  caseStudy?: CaseStudyData | null;
}

export default function CaseStudy({ project, caseStudy: cs }: CaseStudyProps) {
  const relatedSlugs = cs?.relatedProjects || [];
  const relatedItems = relatedSlugs
    .map((slug) => {
      const rel = caseStudies.find((c) => c.slug === slug && c.draft !== true);
      const relProject = projects.find(
        (p) => p.caseStudySlug === slug && p.draft !== true,
      );
      if (!rel || !relProject) return null;
      return { ...rel, projSlug: relProject.slug };
    })
    .filter((rel): rel is NonNullable<typeof rel> => rel !== null);

  const workType = project.workType ?? cs?.workType;
  const category = workTypeLabel(workType) ?? project.projectType;
  const disclosure = workTypeDisclosure(workType);

  const metaCells = [
    { label: "Category", value: category },
    {
      label: "Client",
      value: workType === "client" ? cs?.client : null,
    },
    { label: "Industry", value: cs?.industry },
    { label: "Timeline", value: cs?.timeline },
    {
      label: "Services",
      value: cs?.servicesProvided?.join(" · ") ?? cs?.role,
    },
  ].filter((c) => c.value);

  const lead = cs?.solution ?? project.description;
  const solutionBody = cs?.whatWasBuilt || cs?.solution;
  const liveUrl = project.liveUrl ?? cs?.liveUrl;
  const liveVerified = project.liveUrlVerified ?? cs?.liveUrlVerified ?? false;
  const showResults = Boolean(cs?.resultsVerified && cs.results?.length);
  const showTestimonial = Boolean(
    cs?.testimonial?.verified && cs?.testimonial?.permitted,
  );

  return (
    <div
      className="min-h-screen text-[var(--text-primary)]"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Hero — H1 = project title */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 min-h-6 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] transition-colors mb-10"
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
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-5">
            <div className="max-w-2xl">
              {category && (
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 ring-1 ring-[var(--border-color)] inline-block px-3 py-1 rounded-full">
                  {category}
                </p>
              )}
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]">
                {cs?.name ?? project.name}
              </h1>
            </div>
            <p className="text-[15px] max-w-xs leading-relaxed md:text-right" style={{ color: "var(--text-secondary)" }}>
              {cs?.tagline ?? project.tagline}
            </p>
          </div>

          {disclosure && (
            <div
              role="note"
              aria-label="Project disclosure"
              className="mt-6 rounded-xl ring-1 ring-[var(--border-hover)] px-5 py-4 text-sm leading-relaxed"
              style={{ background: "var(--bg-surface)", color: "var(--text-secondary)" }}
            >
              {disclosure}
            </div>
          )}
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
            alt={cs?.imageAlt ?? project.imageAlt}
            width={1280}
            height={720}
            className="w-full h-auto object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Overview */}
      <section
        id="overview"
        aria-labelledby="overview-heading"
        className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16"
      >
        <ScrollReveal direction="up">
          <SectionHeading id="overview">Overview</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-10 mb-8 border-b border-[var(--border-color)]">
            {metaCells.map((cell) => (
              <MetaCell key={cell.label} label={cell.label} value={cell.value} />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.05}>
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-[1.8] mb-8">
            {lead}
          </p>
        </ScrollReveal>

        {project.features?.length > 0 && (
          <ScrollReveal direction="up" delay={0.08}>
            <h3 className="text-sm font-medium mb-4 text-[var(--text-secondary)]">
              What we built
            </h3>
            <ul className="space-y-3">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        )}

        {cs?.deliverables && cs.deliverables.length > 0 && (
          <ScrollReveal direction="up" delay={0.08}>
            <h3 className="text-sm font-medium mb-4 mt-8 text-[var(--text-secondary)]">
              Deliverables
            </h3>
            <ul className="space-y-3">
              {cs.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        )}
      </section>

      {/* Challenge */}
      {cs?.challenge && (
        <section
          id="challenge"
          aria-labelledby="challenge-heading"
          className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16"
        >
          <ScrollReveal direction="up">
            <SectionHeading id="challenge">The challenge</SectionHeading>
            <p className="text-base md:text-lg text-[var(--text-secondary)] leading-[1.8]">
              {cs.challenge}
            </p>
          </ScrollReveal>
        </section>
      )}

      {/* Solution / build */}
      {solutionBody && (
        <section
          id="solution"
          aria-labelledby="solution-heading"
          className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16"
        >
          <ScrollReveal direction="up">
            <SectionHeading id="solution">The solution</SectionHeading>
            <p className="text-base md:text-lg text-[var(--text-secondary)] leading-[1.8]">
              {solutionBody}
            </p>
          </ScrollReveal>

          {cs?.screenshots && cs.screenshots.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {cs.screenshots.map((shot, i) => (
                <ScrollReveal key={i} direction="up" delay={0.06 * i}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={800}
                    height={500}
                    className="rounded-xl ring-1 ring-[var(--border-color)] w-full h-auto"
                    loading="lazy"
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Build process */}
      {cs?.productDecisions && cs.productDecisions.length > 0 && (
        <section
          id="process"
          aria-labelledby="process-heading"
          className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20"
        >
          <ScrollReveal direction="up">
            <SectionHeading id="process">How we built it</SectionHeading>
          </ScrollReveal>
          <div className="space-y-8">
            {cs.productDecisions.slice(0, 4).map((item, i) => {
              const boldMatch = item.match(/^([^.—–-]+?)\s*[—–-]\s*(.+)$/s);
              return (
                <ScrollReveal key={i} direction="up" delay={0.08 * i}>
                  <StrategyStep
                    number={String(i + 1).padStart(2, "0")}
                    title={boldMatch ? boldMatch[1].trim() : `Step ${i + 1}`}
                    description={boldMatch ? boldMatch[2].trim() : item}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Results — only when verified */}
      {showResults && cs && (
        <section
          id="results"
          aria-labelledby="results-heading"
          className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20"
        >
          <ScrollReveal direction="up">
            <SectionHeading id="results">Results</SectionHeading>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cs.results.map((r, ri) => (
              <ScrollReveal key={ri} direction="up" delay={0.08 * ri}>
                <p className="text-3xl md:text-4xl font-display text-[var(--text-primary)] mb-1 tracking-tight">
                  {r.value}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">
                  {r.metric}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{r.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Testimonial — only when verified AND permitted */}
      {showTestimonial && cs?.testimonial && (
        <section
          aria-label="Client testimonial"
          className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20"
        >
          <ScrollReveal direction="up">
            <figure
              className="p-6 md:p-8 rounded-2xl ring-1 ring-[var(--border-color)]"
              style={{ background: "var(--bg-surface)" }}
            >
              <blockquote className="text-base md:text-lg text-[var(--text-secondary)] leading-[1.8]">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-[var(--text-muted)]">
                {cs.testimonial.author}
                {cs.testimonial.role ? `, ${cs.testimonial.role}` : ""}
                {cs.testimonial.company ? ` — ${cs.testimonial.company}` : ""}
              </figcaption>
            </figure>
          </ScrollReveal>
        </section>
      )}

      {/* Technology */}
      <section
        id="technology"
        aria-labelledby="technology-heading"
        className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20"
      >
        <ScrollReveal direction="up">
          <SectionHeading id="technology">Technology</SectionHeading>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.06}>
          <div className="flex flex-wrap gap-2">
            {project.technology.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase ring-1 ring-[var(--border-color)] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Related services */}
      {cs?.serviceLink && (
        <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-16">
          <ScrollReveal
            direction="up"
            className="p-6 md:p-8 rounded-2xl ring-1 ring-[var(--border-color)]"
            style={{ background: "var(--bg-surface)" }}
          >
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.1em] mb-3">
              If this looks like what you need…
            </p>
            <Link
              href={cs.serviceLink.href}
              className="group/serv inline-flex items-center gap-2 min-h-6 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
            >
              <span>Explore {cs.serviceLink.label}</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/serv:translate-x-1"
              />
            </Link>
          </ScrollReveal>
        </section>
      )}

      {/* Related projects */}
      {relatedItems.length > 0 && (
        <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-20">
          <ScrollReveal direction="up">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8 font-medium">
              Continue exploring
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {relatedItems.map((rel, i) => (
              <ScrollReveal key={rel.slug} direction="up" delay={0.08 * i}>
                <Link
                  href={`/work/${rel.projSlug}`}
                  className="group block rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)] hover:ring-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "var(--card-bg)" }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                      {rel.projectType ?? rel.role?.split(",")[0] ?? "Case Study"}
                    </p>
                    <h3 className="text-base font-display text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {rel.tagline}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Next-step CTA */}
      <section
        id="next-step"
        aria-labelledby="next-step-heading"
        className="relative max-w-4xl mx-auto px-6 md:px-12 pb-24"
      >
        <ScrollReveal direction="up" className="pt-12 border-t border-[var(--border-color)]">
          <h2
            id="next-step-heading"
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 font-medium"
          >
            Next step
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="group/btn relative inline-flex items-center gap-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)]"
            >
              <span>Book a call</span>
              <ArrowUpRight size={15} />
            </Link>
            {liveUrl && liveVerified && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5 ring-1 ring-[var(--border-color)] text-[var(--text-primary)] hover:ring-[var(--border-hover)]"
              >
                <span>View live project</span>
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
