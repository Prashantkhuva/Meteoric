"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FaqAccordion from "@/components/sections/FaqAccordion";

export default function ServiceLanding({ service }) {
  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-28 md:pt-32">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> All Services
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-12 pb-16 md:pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-6"
        >
          {service.h1[0]}
          <br />
          {service.h1[1]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          {service.tagline}
        </motion.p>
      </section>

      {/* Content sections */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20 space-y-16">
          {service.sections.map((section, idx) => (
            <ScrollReveal key={idx} direction="up" delay={0}>
              <div className="grid md:grid-cols-5 gap-6 md:gap-10">
                <span className="text-[#EAEFFF]/20 text-sm font-mono md:col-span-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-4">
                  <h2 className="text-2xl md:text-3xl font-secondary-italic mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-white/40 text-base leading-relaxed max-w-xl">
                    {section.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="border-t border-white/[0.06] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollReveal direction="down" delay={0}>
            <span className="text-[#EAEFFF]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
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
      <section className="border-t border-white/[0.06] py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <ScrollReveal direction="down" delay={0}>
            <h2 className="text-3xl md:text-5xl font-secondary-italic mb-6">
              Need {service.h1[0].toLowerCase()}?{" "}
              <span className="text-white/40">Let's talk.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.1}>
            <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-10">
              Book a free strategy call and Meteoric will discuss your project, timeline, and how we can help.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <button
              onClick={openCal}
              className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(234,239,255,0.06)] hover:shadow-[0_0_30px_rgba(234,239,255,0.12)]"
            >
              Get a Free Estimate <ArrowUpRight size={15} className="ml-2" />
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
