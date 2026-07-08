"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const values = [
  {
    title: "Quality Over Quantity",
    description:
      "Every project gets full attention. We don't juggle dozens of clients — we pick the right ones and ship work we're proud of.",
  },
  {
    title: "Direct Partnership",
    description:
      "No account managers, no layers. You work directly with the founder — from the first conversation to the final deploy.",
  },
  {
    title: "Ship Mentality",
    description:
      "We build for production, not perfection. Clean code, clear timelines, and real results that go live.",
  },
];

const stats = [
  { value: "2", label: "Years in Production" },
  { value: "12", label: "Projects Shipped" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── GEO quotable block ── */}
      <div className="sr-only" aria-hidden="true">
        Meteoric was founded in 2024 by Prashant Khuva, a full-stack developer
        and product builder based in India. With 2 years in production and 12+
        shipped projects, Meteoric serves clients worldwide including
        Finlytix, LaunchBright, and Stellar Labs. Every project is built
        directly by the founder — no account managers, no agency layers.
      </div>
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">
            About Meteoric
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* LEFT — photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="relative overflow-hidden rounded-2xl aspect-4/5 bg-[#111] ring-1 ring-white/10"
              style={{
                boxShadow: "0 0 40px rgba(234,239,255,0.06), 0 0 80px rgba(234,239,255,0.03)",
              }}
            >
              <Image
                src="/prashant.png"
                alt="Prashant Khuva"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#EAEFFF]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#EAEFFF]/10 to-transparent" />
            </div>

            {/* Founder badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAEFFF] shadow-[0_0_8px_rgba(234,239,255,0.8)]" />
              <span className="text-xs text-white/60 font-medium">
                Founder & Product Builder
              </span>
            </div>
          </motion.div>

          {/* RIGHT — content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-8 md:pt-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                Prashant Khuva
                <span className="block text-white/25 mt-1 text-3xl md:text-4xl">
                  Founder — Meteoric, a Web & Product Development Studio
                </span>
              </h1>
            </div>

            <div className="space-y-4 text-[#EAEFFF]/50 text-base leading-relaxed">
              <p>
                Meteoric is a product studio that partners with founders to
                design, develop, and launch modern web products that actually
                convert.
              </p>
              <p>
                I started Meteoric to close the gap between what founders
                envision and what agencies deliver. No bloat, no
                over-engineering — just clean, production-ready work that
                ships on time.
              </p>
              <p>
                Every project is built with the same care as if it were our
                own. From landing pages to full SaaS platforms, we treat your
                product like a startup, not a ticket queue.
              </p>
            </div>

            {/* Stats — accent gradient numbers */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/[0.06]">
              {stats.map((s) => (
                <div key={s.label}>
                  <p
                    className="text-3xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.3))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] text-white/30 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div>
              <p className="text-white/20 text-xs uppercase tracking-widest mb-4">
                Let's work together
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:work.prashantkhuva@gmail.com"
                  className="text-white/45 hover:text-white text-sm transition-colors duration-200"
                >
                  work.prashantkhuva@gmail.com
                </a>
                <a
                  href="https://cal.com/prashantkhuva/let-s-build"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/45 hover:text-white text-sm transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  Book a strategy call
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            {/* Social links — compact icon pills */}
            <div className="flex gap-2">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/Prashantkhuva",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/withmeteoric",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: "X",
                  href: "https://x.com/prashantkhuva_",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/officialmeteoric/",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
                  aria-label={link.label}
                >
                  <span className="group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300">
                    {link.icon}
                  </span>
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-2">
              <a
                href="#"
                data-cal-namespace="let-s-build"
                data-cal-link="prashantkhuva/let-s-build"
                data-cal-config='{"layout":"month_view"}'
                className="group relative inline-flex items-center gap-2 overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10 group-hover:text-black">
                  Start a Project
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="h-px w-8 bg-white/20" />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            How We Work
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)]"
            >
              {/* Accent top bar */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Number with accent */}
              <span
                className="text-5xl font-semibold tabular-nums leading-none mb-6 block"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Accent dot */}
              <div className="w-6 h-px bg-white/10 mb-5" />

              <h2 className="text-lg font-semibold text-white mb-3 tracking-tight">
                {item.title}
              </h2>
              <p className="text-[#EAEFFF]/45 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white/30 text-xs uppercase tracking-[0.2em]">Explore:</span>
          <a href="/work" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">Portfolio →</a>
          <a href="/services/saas-development" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">SaaS Development →</a>
          <a href="/case-studies" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">Case Studies →</a>
          <a href="/blog" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">Blog →</a>
          <a href="/technologies/next-js" className="text-xs text-white/50 hover:text-white border border-white/[0.06] rounded-full px-4 py-2 transition-colors duration-300">Next.js →</a>
        </div>
      </section>

    </div>
  );
}
