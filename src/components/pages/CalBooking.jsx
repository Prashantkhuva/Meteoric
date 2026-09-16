"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Target, ShieldCheck, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function CalBooking() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "let-s-build" });
      cal("ui", { hideEventTypeDetails: true, layout: "month_view", theme: "dark" });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-16 md:pb-20">
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-[var(--accent)]/30 uppercase tracking-[0.3em] text-xs font-bold block mb-6"
        >
          Free Consultation
        </motion.span>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl md:text-6xl lg:text-7xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-5"
        >
          Book a Free Web Development{" "}
          <span className="not-italic font-semibold font-display text-[var(--text-primary)]">Strategy Call</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Pick a time that works for you. No commitment, no sales pitch — just a
          conversation about your <span className="text-[var(--text-secondary)] font-secondary-italic">project, timeline,</span> and{" "}
          <span className="text-[var(--text-secondary)] font-secondary-italic">how we can help.</span>
        </motion.p>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* Cal Embed */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="relative rounded-2xl ring-1 ring-white/[0.06] overflow-hidden shadow-[0_0_60px_-20px_rgba(234,239,255,0.08)]" style={{ height: "750px" }}>
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(234,239,255,0.03),transparent_70%)] pointer-events-none" />
          <Cal
            namespace="let-s-build"
            calLink="prashantkhuva/let-s-build"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
          />
        </div>
      </section>

      {/* Bottom notes */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.04]">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/5 flex items-center justify-center shrink-0">
              <Video size={16} className="text-[var(--accent)]/50" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm font-semibold mb-1">Free consultation</p>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">30-minute video call, completely free</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.04]">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/5 flex items-center justify-center shrink-0">
              <Target size={16} className="text-[var(--accent)]/50" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm font-semibold mb-1">No pressure</p>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">Discuss your goals, timeline, and budget</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.04]">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/5 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[var(--accent)]/50" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm font-semibold mb-1">Zero commitment</p>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">No obligation — ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual internal links */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <div className="border-t border-white/[0.06] pt-10">
          <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.15em] mb-4">Explore more</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)]/60 hover:text-[var(--text-primary)] transition-colors">
              Our Services <ArrowRight size={12} />
            </Link>
            <Link href="/work" className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)]/60 hover:text-[var(--text-primary)] transition-colors">
              Our Work <ArrowRight size={12} />
            </Link>
            <Link href="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)]/60 hover:text-[var(--text-primary)] transition-colors">
              Case Studies <ArrowRight size={12} />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)]/60 hover:text-[var(--text-primary)] transition-colors">
              About <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
