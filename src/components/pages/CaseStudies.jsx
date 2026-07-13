"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Timer, Target, Users, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StaggerText from "@/components/layout/StaggerText";
import { caseStudies } from "@/data/case-studies";

const iconMap = {
  "Load Time": <Timer size={18} />,
  "Mobile Score": <TrendingUp size={18} />,
  "Animation": <Target size={18} />,
  "Timeline": <Timer size={18} />,
  "Beta Users": <Users size={18} />,
  "Funding": <TrendingUp size={18} />,
  "Publishing Time": <Timer size={18} />,
  "Editors": <Users size={18} />,
  "Tech Stack": <Target size={18} />,
  "Installs": <Users size={18} />,
  "Rating": <TrendingUp size={18} />,
  "Community": <Users size={18} />,
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#EAEFFF]/[0.015] blur-[200px] rounded-full" />
      </div>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 mb-10">
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">Case Studies</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6">
          Measurable{" "}
          <span className="font-secondary-italic" style={{ background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            outcomes.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-white/40 text-base md:text-lg max-w-2xl mb-16">
          Every project ships with measurable impact. Here's what we built and what it delivered.
        </motion.p>

        <div className="space-y-24">
          {caseStudies.map((cs, i) => (
            <motion.div key={cs.slug} id={cs.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 * i }}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* Left — Image + Tags (2 cols) */}
                <div className="lg:col-span-2">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${cs.gradient}`} />
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <Image src={cs.image} alt={cs.name} width={400} height={300} className="object-contain drop-shadow-2xl" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-3 py-1 rounded-full border text-white/40 font-medium tracking-wide uppercase" style={{ borderColor: `${cs.accent}33`, backgroundColor: `${cs.accent}0a` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — Content (3 cols) */}
                <div className="lg:col-span-3">
                  {/* Meta bar */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-px w-6" style={{ backgroundColor: cs.accent }} />
                    <span className="text-[11px] font-mono tracking-widest uppercase" style={{ color: cs.accent }}>
                      Case Study {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">{cs.name}</h2>
                  <p className="text-base font-medium mb-6" style={{ color: cs.accent }}>{cs.tagline}</p>

                  {/* Meta info */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1">Client</p>
                      <p className="text-white/70 text-sm">{cs.client}</p>
                    </div>
                    <div>
                      <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1">Timeline</p>
                      <p className="text-white/70 text-sm">{cs.timeline}</p>
                    </div>
                    <div>
                      <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1">Role</p>
                      <p className="text-white/70 text-sm">{cs.role}</p>
                    </div>
                  </div>

                  {/* Problem */}
                  <div className="mb-6">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-2">The Problem</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{cs.problem}</p>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-2">The Solution</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{cs.solution}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {cs.results.map((r, ri) => (
                      <div key={ri} className="p-4 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06]">
                        <div className="flex items-center gap-2 mb-2" style={{ color: cs.accent }}>
                          {iconMap[r.metric] || <TrendingUp size={18} />}
                          <span className="text-[10px] uppercase tracking-[0.1em] font-medium">{r.metric}</span>
                        </div>
                        <p className="text-xl font-bold text-white mb-1">{r.value}</p>
                        <p className="text-[11px] text-white/30">{r.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cs.features.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: cs.accent }} />
                          <span className="text-xs text-white/40">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a href={cs.link} target="_blank" rel="noopener noreferrer" className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5" style={{ border: `1.5px solid ${cs.accent}`, color: cs.accent }}>
                    <span className="fill-circle" style={{ backgroundColor: cs.accent }} />
                    <span className="relative z-10 flex items-center gap-2">
                      <StaggerText hoverColor="#000">View Live Project</StaggerText>
                      <ArrowUpRight size={15} />
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-12" />
        <p className="text-white/15 text-xs uppercase tracking-[0.25em] mb-4">Explore More</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/work" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">View all projects →</Link>
          <Link href="/services/saas-development" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">SaaS Development →</Link>
          <Link href="/services/full-stack-development" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">Full-Stack →</Link>
        </div>
      </section>
    </div>
  );
}
