"use client";

import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { caseStudies } from "@/data/case-studies";
import { trackEvent } from "@/lib/analytics/gtag";

export default function CaseStudiesPage() {
  trackEvent("case_study_view", {
    case_study_name: caseStudies[0]?.name,
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-10 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]" style={{ color: "var(--text-primary)" }}>
            Case Studies
          </h1>
          <p className="text-[15px] max-w-xs leading-relaxed md:text-right" style={{ color: "#171717" }}>
            Every project ships with measurable impact. Here&apos;s what we
            built and what it delivered.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      {caseStudies.map((cs, idx) => {
        const isReversed = idx % 2 === 1;
        return (
          <section
            key={cs.slug}
            id={cs.slug}
            className="py-16 md:py-24"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              <ScrollReveal direction="down" delay={0} className="mb-8 md:mb-12">
                <span className="text-6xl md:text-8xl lg:text-9xl font-display block leading-none mb-4" style={{ color: "var(--accent-dim)" }}>
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <h2 className="text-3xl md:text-5xl font-display tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
                  {cs.name}
                </h2>
                <p className="text-lg md:text-xl" style={{ color: "var(--text-secondary)" }}>
                  {cs.tagline}
                </p>
              </ScrollReveal>

              {/* Image */}
              <ScrollReveal direction="up" delay={0.1} className="relative rounded-2xl overflow-hidden min-h-[16rem] sm:min-h-[20rem] mb-10 md:mb-14 group gsap-work-card">
                <div className="flex items-center justify-center p-4 sm:p-8 h-full">
                  <img
                    src={cs.image}
                    alt={`${cs.name} — Meteoric`}
                    className="object-contain w-full h-auto rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              </ScrollReveal>

              {/* Content grid */}
              <div className="grid md:grid-cols-12 gap-10 md:gap-12">
                <div className={`md:col-span-7 ${isReversed ? "md:order-last" : ""}`}>
                  <ScrollReveal direction="left" delay={0.1} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-8" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-muted)" }}>Client</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{cs.client}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-muted)" }}>Timeline</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{cs.timeline}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-muted)" }}>Role</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{cs.role}</p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal direction="left" delay={0.15} className="mb-6">
                    <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>The Problem</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{cs.problem}</p>
                  </ScrollReveal>

                  <ScrollReveal direction="left" delay={0.2} className="mb-8">
                    <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>The Solution</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{cs.solution}</p>
                  </ScrollReveal>

                  <ScrollReveal direction="left" delay={0.25}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary)" }}>Key Features</h3>
                    <div className="space-y-3">
                      {cs.features.map((f, fi) => (
                        <div key={fi} className="border-l-2 pl-5 transition-colors duration-300" style={{ borderColor: "var(--border-color)" }}>
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>

                <div className={`md:col-span-5 ${isReversed ? "md:order-first" : ""}`}>
                  <ScrollReveal direction="right" delay={0.15} className="mb-10">
                    {cs.results.map((r, ri) => (
                      <div key={ri} className={`${ri !== 0 ? "pt-6 mt-6" : ""}`} style={ri !== 0 ? { borderTop: "1px solid var(--border-color)" } : {}}>
                        <p className="text-3xl md:text-4xl font-display tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
                          {r.value}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                          {r.metric}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{r.description}</p>
                      </div>
                    ))}
                  </ScrollReveal>

                  <ScrollReveal direction="right" delay={0.2} className="mb-8">
                    <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {cs.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase" style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>

                  <ScrollReveal direction="right" delay={0.25}>
                    <a href={cs.link} target="_blank" rel="noopener noreferrer" className="group/cta inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
                      View Live Project
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                    </a>
                  </ScrollReveal>

                  {cs.serviceLink && (
                    <ScrollReveal direction="right" delay={0.3} className="mt-8 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
                      <p className="text-[11px] uppercase tracking-[0.1em] mb-3" style={{ color: "var(--text-muted)" }}>If this looks like what you need…</p>
                      <Link href={cs.serviceLink.href} className="group/serv inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
                        <span>Explore {cs.serviceLink.label}</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/serv:translate-x-1" />
                      </Link>
                    </ScrollReveal>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
