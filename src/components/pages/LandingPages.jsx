"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Target, Palette, TrendingUp, Smartphone } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Target size={20} />,
    title: "Conversion-Optimized Pages",
    desc: "Purpose-built landing pages designed for one metric — conversion. Clean copy, clear CTAs, and layouts that guide visitors from hello to sign-up.",
  },
  {
    icon: <Palette size={20} />,
    title: "Brand & Marketing Sites",
    desc: "Full marketing websites that tell your story and showcase your product. Built with Next.js, animated with GSAP and Framer Motion.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "SEO & GEO-Ready",
    desc: "Optimized for search engines and AI chatbots. Structured data, semantic HTML, fast load times, and content designed to get cited by ChatGPT and Perplexity.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Launch & Waitlist Pages",
    desc: "High-impact pages for product debuts, beta signups, and fundraising. Countdown timers, email capture, and social proof that builds anticipation.",
  },
];

const stats = [
  { value: "3-7", label: "Days to launch" },
  { value: "4k+", label: "Avg starting cost" },
  { value: "95+", label: "Lighthouse score" },
  { value: "100%", label: "Client satisfaction" },
];

export default function LandingPagesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">
            Landing Page
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          Landing Page{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Design & Development
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-8"
        >
          High-converting, beautifully animated landing pages that turn visitors
          into customers. Every pixel is purposeful, every interaction intentional.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric builds landing pages for startups that need to make a strong
          first impression. Fast-loading, SEO-optimized, and designed to convert —
          shipped in days, not months.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#"
            data-cal-namespace="let-s-build"
            data-cal-link="prashantkhuva/let-s-build"
            data-cal-config='{"layout":"month_view"}'
            className="group relative inline-flex items-center gap-2 overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-black flex items-center gap-2">
              Start Your Project <ArrowUpRight size={15} />
            </span>
          </a>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 border border-white/10 text-white/50 hover:text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:border-white/30"
          >
            View Portfolio
          </Link>
        </motion.div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-semibold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            What We Build
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)]"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#EAEFFF]/70 shrink-0">
                  {item.icon}
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">{item.title}</h2>
              </div>
              <p className="text-[#EAEFFF]/45 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Our Landing Page Stack
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            Every landing page is powered by a stack optimized for speed,
            SEO, and developer experience:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Framework", value: "Next.js" },
              { label: "Styling", value: "Tailwind CSS" },
              { label: "Animation", value: "GSAP + Framer Motion" },
              { label: "Hosting", value: "Vercel" },
              { label: "Analytics", value: "Vercel SpeedInsights" },
              { label: "SEO", value: "Structured Data + GEO" },
              { label: "Forms", value: "EmailJS" },
              { label: "Booking", value: "Cal.com" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-white/70 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative max-w-3xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            FAQ
          </span>
        </motion.div>

        <FaqAccordion items={[
          {
            q: "How long does it take to design and build a landing page?",
            a_html: "A single landing page typically takes 5-10 days from kickoff to launch. Multi-page marketing sites take 2-4 weeks. Check our <a href=\"/work\" class=\"text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200\">portfolio</a> for examples.",
          },
          {
            q: "Do you optimize landing pages for SEO?",
            a: "Yes. Every landing page ships with proper semantic HTML, meta tags, Open Graph cards, structured data (JSON-LD), and fast Core Web Vitals. We also optimize for GEO to get cited by AI chatbots like ChatGPT and Perplexity.",
          },
          {
            q: "Can you redesign an existing landing page?",
            a: "Absolutely. We regularly audit and redesign existing pages to improve conversion rates, load speed, and visual impact.",
          },
          {
            q: "How much does a landing page cost?",
            a: "A single high-converting landing page starts at $4,000-$8,000. Multi-page marketing sites range from $10,000-$20,000. Every project includes design, development, animations, SEO setup, and one round of revisions.",
          },
          {
            q: "Do you include animations?",
            a: "Yes — it's what we're known for. Scroll-triggered animations, micro-interactions, and page transitions using GSAP and Framer Motion. Every animation is purposeful and performance-optimized.",
          },
        ]} />
      </section>


    </div>
  );
}
