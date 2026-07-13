"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code, Database, Palette, Rocket, Users, BarChart } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Rocket size={20} />,
    title: "SaaS MVP Development",
    desc: "From concept to working prototype in weeks. We scope the core 20% of features that validate your idea and get you to market fast.",
  },
  {
    icon: <Code size={20} />,
    title: "Full-Stack SaaS Build",
    desc: "Production-ready SaaS platforms with Next.js, Supabase, and modern tooling. Authentication, billing, dashboards, and APIs — built to scale.",
  },
  {
    icon: <Database size={20} />,
    title: "Architecture & Backend",
    desc: "Database design, API architecture, Stripe integration, multi-tenant schemas, and usage metering. The foundation your product needs to grow.",
  },
  {
    icon: <Palette size={20} />,
    title: "SaaS Landing Pages & UX",
    desc: "Conversion-optimized landing pages, onboarding flows, and dashboard interfaces designed to reduce churn and drive activation.",
  },
  {
    icon: <Users size={20} />,
    title: "Multi-Tenant Architecture",
    desc: "Isolated data per tenant, shared infrastructure for efficiency. Team management, role-based access, and white-label options for enterprise readiness.",
  },
  {
    icon: <BarChart size={20} />,
    title: "Analytics & Billing",
    desc: "Usage tracking, subscription management, metered billing, and revenue analytics. Stripe Billing integration with webhooks for real-time updates.",
  },
];

const stats = [
  { value: "3-6", label: "Weeks to MVP" },
  { value: "12+", label: "SaaS projects shipped" },
  { value: "100%", label: "Client satisfaction" },
  { value: "24/7", label: "Post-launch support" },
];

export default function SaaSDevelopmentPage() {
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
            SaaS Development
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          SaaS Development{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Agency
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-8"
        >
          From MVP to production platform. We design, build, and launch SaaS
          products for founders who want to ship fast and scale with confidence.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric is a SaaS development agency that works like a product studio.
          Direct founder involvement, no account managers, and a stack optimized
          for velocity. Every project ships as if it were our own product.
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
            <span className="fill-circle bg-[#EAEFFF]" />
            <span className="relative z-10 group-hover:text-black flex items-center gap-2">
              Start Your SaaS Project <ArrowUpRight size={15} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)]"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#EAEFFF]/70 shrink-0">
                  {item.icon}
                </span>
                <h2 className="text-base font-semibold text-white tracking-tight">{item.title}</h2>
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
            Our SaaS Stack
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            After shipping 12+ SaaS projects, we've settled on a stack that
            eliminates decisions and maximizes velocity:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Frontend", value: "Next.js + Tailwind" },
              { label: "Backend", value: "Supabase / Node.js" },
              { label: "Database", value: "PostgreSQL / MongoDB" },
              { label: "Payments", value: "Stripe" },
              { label: "Auth", value: "Supabase Auth" },
              { label: "Hosting", value: "Vercel" },
              { label: "Animation", value: "GSAP + Framer Motion" },
              { label: "Email", value: "Resend" },
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
            q: "What is a SaaS development agency?",
            a: "A SaaS development agency builds cloud-based software products delivered via subscription. Unlike general web development agencies, SaaS agencies understand multi-tenant architecture, subscription billing, usage metering, and the unique challenges of building products that scale.",
          },
          {
            q: "How long does it take to build a SaaS MVP?",
            a: "Most SaaS MVPs take 3-6 weeks depending on scope. Our record is 21 days for a fintech prototype. We focus on the core 20% of features that deliver 80% of the value.",
          },
          {
            q: "What makes Meteoric different from other SaaS agencies?",
            a: "Every project ships directly with the founder — no account managers, no layers. We work like a product studio, not an agency. This means faster decisions, fewer meetings, and a final product that actually reflects your vision.",
          },
          {
            q: "Do you handle ongoing maintenance after launch?",
            a: "Yes. After launch, we offer retainer-based maintenance, feature additions, and performance optimization. We treat every project as a long-term partnership.",
          },
          {
            q: "How much does a SaaS development agency cost?",
            a: "Costs vary widely based on scope. A focused MVP typically starts around $15,000-$30,000. Full production platforms range from $30,000-$80,000. We provide a detailed scope and fixed-price quote after our free strategy call.",
          },
        ]} />
      </section>


    </div>
  );
}
