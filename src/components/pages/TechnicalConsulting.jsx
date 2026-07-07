"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Lightbulb, Shield, TrendingUp, Cpu } from "lucide-react";

const services = [
  {
    icon: <Lightbulb size={20} />,
    title: "Tech Stack Advisory",
    desc: "Not sure what stack to build on? We analyze your product requirements, team constraints, and budget to recommend the optimal technology choices.",
  },
  {
    icon: <Shield size={20} />,
    title: "Architecture Review",
    desc: "We audit your existing codebase, database schema, and infrastructure for scalability, security, and performance issues — with a prioritized fix plan.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Growth Strategy & Roadmap",
    desc: "Feature prioritization, technical roadmap planning, and build-vs-buy decisions. We help you ship the right things at the right time.",
  },
  {
    icon: <Cpu size={20} />,
    title: "Fractional CTO Services",
    desc: "Ongoing technical leadership for early-stage startups that aren't ready for a full-time CTO. Strategy, code reviews, hiring support, and vendor evaluation.",
  },
];

const relatedPosts = [
  {
    slug: "how-to-choose-a-web-development-agency-for-your-startup",
    title: "How to Choose a Web Development Agency for Your Startup",
  },
  {
    slug: "next-js-vs-remix-2026",
    title: "Next.js vs Remix in 2026: A Comprehensive Comparison",
  },
  {
    slug: "mongodb-vs-postgresql-for-saas",
    title: "MongoDB vs PostgreSQL for SaaS: Choosing the Right Database",
  },
];

export default function TechnicalConsultingPage() {
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
            Technical Consulting
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          Technical Consulting for{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Founders
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-8"
        >
          Make the right technical decisions before writing a line of code.
          Architecture planning, stack selection, code audits, and fractional
          CTO guidance for early-stage startups.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          After shipping 12+ products across every stage of the startup lifecycle,
          we've learned that the best technical decisions happen before the build
          starts. We help founders navigate tech choices with clarity and confidence.
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
              Book a Strategy Call <ArrowUpRight size={15} />
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
            What We Offer
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
                <span className="text-[#EAEFFF]/60">{item.icon}</span>
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
            Why Technical Consulting Matters
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            A wrong tech decision at the start can cost months of rework and
            thousands in wasted engineering hours. Here is what we help founders avoid:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Over-Engineering",
                desc: "Building for millions of users when you have zero. We help you choose the simplest stack that solves today's problems and can evolve tomorrow.",
              },
              {
                title: "Vendor Lock-In",
                desc: "Committing to platforms that become expensive or limiting as you scale. We recommend open, portable stacks that keep your options open.",
              },
              {
                title: "Hiring Mismatches",
                desc: "Choosing a stack that makes it hard to find developers. We recommend technologies with strong talent pools and healthy ecosystems.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold text-white mb-2 tracking-tight">{item.title}</h3>
                <p className="text-[#EAEFFF]/45 text-sm leading-relaxed">{item.desc}</p>
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

        <div className="space-y-6">
          {[
            {
              q: "What is technical consulting for startups?",
              a: "Technical consulting helps startups make informed decisions about technology stack, architecture, infrastructure, and engineering strategy. It is particularly valuable for non-technical founders who need guidance without hiring a full-time CTO, and for technical founders who want a second opinion on critical architecture decisions.",
            },
            {
              q: "How is this different from hiring a CTO?",
              a: "Fractional CTO consulting gives you access to experienced technical leadership on an as-needed basis — without the salary commitment of a full-time executive. You get strategy, code reviews, and roadmap guidance when you need it, and you only pay for the time you use.",
            },
            {
              q: "What does a code audit include?",
              a: "We review your codebase for architecture quality, security vulnerabilities, performance bottlenecks, and technical debt. You get a prioritized list of issues with estimated effort and recommended fixes. Typical audits cover 10-20 key files plus overall architecture review.",
            },
            {
              q: "How long does a typical consulting engagement last?",
              a: "Engagements range from a single 2-hour strategy session to ongoing monthly advisory. Most founders start with a deep-dive session (2-4 hours) to establish the technical strategy, then move to a lighter monthly check-in cadence.",
            },
            {
              q: "Do you only consult on projects you build?",
              a: "No. We are happy to review existing codebases, advise on projects built by other teams, or help you evaluate vendors. Our consulting is independent and focused on what is best for your specific situation.",
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-6"
            >
              <h2 className="text-sm font-semibold text-white mb-3 tracking-tight">{faq.q}</h2>
              <p className="text-[#EAEFFF]/45 text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-32">
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
            Related Reading
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-6 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)]"
              >
                <p className="text-[#EAEFFF]/60 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                  {post.title}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/20 mt-3 group-hover:text-white/50 transition-colors duration-300">
                  Read more <ArrowUpRight size={11} />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
