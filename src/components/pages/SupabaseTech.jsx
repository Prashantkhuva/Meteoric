"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Database, Lock, Repeat, Server } from "lucide-react";

const features = [
  {
    icon: <Database size={20} />,
    title: "PostgreSQL Backend",
    desc: "Full PostgreSQL with migrations, joins, views, triggers, and the entire Postgres ecosystem — no NoSQL limitations.",
  },
  {
    icon: <Lock size={20} />,
    title: "Row Level Security",
    desc: "Fine-grained access control defined directly in PostgreSQL. Security policies at the database level, not middleware.",
  },
  {
    icon: <Repeat size={20} />,
    title: "Realtime & Presence",
    desc: "Broadcast, presence, and Postgres Changes for live dashboards, collaborative features, and real-time updates.",
  },
  {
    icon: <Server size={20} />,
    title: "Auth & Storage",
    desc: "Built-in authentication (OAuth, magic links, phone) and file storage with S3-compatible object storage.",
  },
];

const relatedPosts = [
  { slug: "supabase-vs-firebase-2026-comparison", title: "Supabase vs Firebase in 2026: Which Backend Should You Build On?" },
  { slug: "building-a-saas-prototype-in-3-weeks-a-case-study", title: "Building an MVP in 3 Weeks: A SaaS Prototype Case Study" },
];

export default function SupabasePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 mb-10">
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">Technology</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6">
          Supabase{" "}
          <span className="font-secondary-italic" style={{ background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Development
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-white/40 text-base md:text-lg max-w-2xl mb-16">
          We build full-stack applications on Supabase — the open-source Firebase alternative. Authentication, PostgreSQL, realtime subscriptions, Row Level Security, and file storage. Open-source portable, production-ready.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i }} className="group p-6 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] hover:ring-[#EAEFFF]/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-[#EAEFFF] mt-1">{f.icon}</span>
                <div>
                  <h3 className="text-base font-medium text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex flex-wrap gap-3">
          <Link href="/work" className="group inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium hover:border-white hover:bg-white hover:text-black transition-all duration-300">
            View Portfolio <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a href="/#contact" className="group inline-flex items-center gap-2 border border-[#EAEFFF]/20 text-[#EAEFFF] px-6 py-3 rounded-full text-sm font-medium hover:border-[#EAEFFF] transition-all duration-300">
            Start a Project <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-16" />
        <p className="text-white/15 text-xs uppercase tracking-[0.25em] mb-6">Related Reading</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedPosts.map((r) => (
            <Link key={r.slug} href={`/blog/${r.slug}`} className="group p-6 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] hover:ring-[#EAEFFF]/20 transition-all duration-300">
              <h3 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">{r.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
