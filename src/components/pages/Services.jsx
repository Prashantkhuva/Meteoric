"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code, Globe, Palette, Lightbulb } from "lucide-react";

const serviceItems = [
  {
    icon: <Code size={20} />,
    num: "01",
    title: "SaaS Development",
    desc: "From MVP prototypes to production SaaS platforms. We build with Next.js, Supabase, and Stripe — shipped fast, built to scale.",
    href: "/services/saas-development",
  },
  {
    icon: <Globe size={20} />,
    num: "02",
    title: "Startup Web Development",
    desc: "Conversion-optimized websites for early-stage and funded startups. Fast-loading, SEO-ready, and designed to tell your story.",
    href: "/services/startup-web-development",
  },
  {
    icon: <Palette size={20} />,
    num: "03",
    title: "UI/UX Design",
    desc: "Clean, conversion-focused interfaces designed for your users. From wireframes to high-fidelity prototypes — we design experiences that feel intuitive.",
    href: "/services/ui-ux-design",
  },
  {
    icon: <Lightbulb size={20} />,
    num: "04",
    title: "Technical Consulting",
    desc: "Stack selection, architecture planning, and code audits. We help founders make the right technical decisions before writing a single line of code.",
    href: "/services/technical-consulting",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">
            Services
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          What We{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Build
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-16"
        >
          We partner with founders to design, build, and launch modern web
          products. Every project ships with the same care as if it were our
          own — because it is.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {serviceItems.map((item, i) => (
            <Link key={item.href + item.num} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="group relative rounded-2xl border border-white/[0.06] p-7 transition-all duration-500 hover:border-[#EAEFFF]/20 hover:shadow-[0_0_60px_rgba(234,239,255,0.06)]"
                style={{ background: "#0a0a0a" }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#EAEFFF]/70 shrink-0">
                      {item.icon}
                    </span>
                    <h2 className="text-lg font-semibold text-white tracking-tight">{item.title}</h2>
                  </div>
                  <span className="text-[11px] font-mono tracking-wider text-white/15 mt-1">{item.num}</span>
                </div>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/25 group-hover:text-[#EAEFFF]/60 transition-colors duration-300 font-medium">
                  Learn more <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
