"use client";

import { useCallback } from "react";
import Script from "next/script";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function CalBooking() {
  const initCal = useCallback(() => {
    if (typeof window === "undefined" || !window.Cal) return;
    try {
      window.Cal("init", "let-s-build", { origin: "https://app.cal.com" });
      window.Cal.ns["let-s-build"]("inline", {
        elementOrSelector: "#my-cal-inline-let-s-build",
        config: { layout: "month_view", theme: "dark", useSlotsViewOnSmallScreen: "true" },
        calLink: "prashantkhuva/let-s-build",
      });
      window.Cal.ns["let-s-build"]("ui", { hideEventTypeDetails: true, layout: "month_view", theme: "dark" });
    } catch (e) { if (process.env.NODE_ENV !== "production") console.warn("Cal init failed", e); }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-16 md:pb-20">
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-xs font-bold block mb-6"
        >
          Free Consultation
        </motion.span>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl md:text-5xl lg:text-6xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-5"
        >
          Book a Strategy Call
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-white/35 text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Pick a time that works for you. No commitment, no sales pitch — just a
          conversation about your project, timeline, and how we can help.
        </motion.p>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* Cal Embed */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <Script src="https://app.cal.com/embed/embed.js" strategy="afterInteractive" onLoad={initCal} />
        <div className="rounded-2xl ring-1 ring-white/[0.06] bg-[#0a0a0a] overflow-hidden">
          <div id="my-cal-inline-let-s-build" className="w-full h-[750px] overflow-scroll" />
        </div>
      </section>

      {/* Bottom note */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        <div className="flex flex-col sm:flex-row items-start gap-6 text-white/25 text-sm leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EAEFFF]/40 shrink-0" />
            <span>30-minute video call, completely free</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EAEFFF]/40 shrink-0" />
            <span>Discuss your goals, timeline, and budget</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EAEFFF]/40 shrink-0" />
            <span>No obligation — ever</span>
          </div>
        </div>
      </section>
    </div>
  );
}
