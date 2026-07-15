"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
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

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20 md:pb-28 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[#EAEFFF]/40 uppercase tracking-[0.3em] text-xs font-bold block mb-6"
        >
          Our Work
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-secondary-italic font-normal leading-[1.1] tracking-tight max-w-4xl mb-8"
        >
          Case{" "}
          <span className="not-italic">Studies</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10"
        >
          Every project ships with measurable impact. Here&apos;s what we built
          and what it delivered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
        />
      </section>

      {/* Case Studies */}
      {caseStudies.map((cs, idx) => {
        const isReversed = idx % 2 === 1;
        return (
          <section
            key={cs.slug}
            id={cs.slug}
            className="py-16 md:py-24 border-t border-white/[0.06]"
          >
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              {/* Top: Large number + title */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="mb-8 md:mb-12"
              >
                <span className="text-6xl md:text-8xl lg:text-9xl font-secondary-italic text-[#EAEFFF]/[0.06] block leading-none mb-4">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <h2 className="text-3xl md:text-5xl font-secondary-italic font-normal tracking-tight mb-3">
                  {cs.name}
                </h2>
                <p className="text-lg md:text-xl text-white/35 font-light">
                  {cs.tagline}
                </p>
              </motion.div>

              {/* Image */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={1}
                className="relative rounded-2xl overflow-hidden aspect-[16/7] mb-10 md:mb-14"
              >
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
                  <Image
                    src={cs.image}
                    alt={cs.name}
                    width={800}
                    height={400}
                    className="object-contain w-full h-full"
                    priority={idx === 0}
                  />
                </div>
              </motion.div>

              {/* Content grid */}
              <div className={`grid md:grid-cols-12 gap-10 md:gap-12 ${isReversed ? "" : ""}`}>
                {/* Left: Meta + Problem/Solution */}
                <div className={`md:col-span-7 ${isReversed ? "md:order-last" : ""}`}>
                  {/* Meta row */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={2}
                    className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-white/[0.06]"
                  >
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
                  </motion.div>

                  {/* Problem */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={3}
                    className="mb-6"
                  >
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-3 font-secondary-italic normal-case text-sm">The Problem</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{cs.problem}</p>
                  </motion.div>

                  {/* Solution */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={4}
                    className="mb-8"
                  >
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-3 font-secondary-italic normal-case text-sm">The Solution</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{cs.solution}</p>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={5}
                  >
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-4 font-secondary-italic normal-case text-sm">Key Features</h3>
                    <div className="space-y-3">
                      {cs.features.map((f, fi) => (
                        <div
                          key={fi}
                          className="border-l-2 pl-5 transition-colors duration-300"
                          style={{ borderColor: `${cs.accent}30` }}
                        >
                          <span className="text-sm text-white/35">{f}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right: Metrics + Tags + CTA */}
                <div className={`md:col-span-5 ${isReversed ? "md:order-first" : ""}`}>
                  {/* Metrics */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={3}
                    className="mb-10"
                  >
                    {cs.results.map((r, ri) => (
                      <div
                        key={ri}
                        className={`${ri !== 0 ? "pt-6 mt-6 border-t border-white/[0.06]" : ""}`}
                      >
                        <p className="text-3xl md:text-4xl font-secondary-italic font-normal tracking-tight mb-1 text-white">
                          {r.value}
                        </p>
                        <p className="text-[11px] text-white/25 uppercase tracking-[0.1em]">
                          {r.metric}
                        </p>
                        <p className="text-xs text-white/30 mt-1">{r.description}</p>
                      </div>
                    ))}
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={4}
                    className="mb-8"
                  >
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-3 font-secondary-italic normal-case text-sm">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {cs.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-3 py-1.5 rounded-full border border-white/[0.08] font-medium tracking-wide uppercase text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={5}
                  >
                    <a
                      href={cs.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/cta inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors duration-300"
                    >
                      <StaggerText text="View Live Project" hoverColor="#fff" />
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                      />
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        );
      })}


    </div>
  );
}
