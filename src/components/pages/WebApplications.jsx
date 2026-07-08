"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Layers, Workflow, Shield, Gauge } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Layers size={20} />,
    title: "Full-Stack Web Applications",
    desc: "Custom web applications built with Next.js, React, and Node.js — from internal tools to customer-facing platforms. Authentication, databases, and real-time features included.",
  },
  {
    icon: <Workflow size={20} />,
    title: "Dashboard & Admin Panels",
    desc: "Data-rich dashboards with real-time analytics, charts, filtering, and export capabilities. Built for clarity and speed, so your team can make decisions faster.",
  },
  {
    icon: <Shield size={20} />,
    title: "API-First Application Architecture",
    desc: "Headless backends with well-documented REST and GraphQL APIs. Designed for scalability, security, and easy integration with third-party services.",
  },
  {
    icon: <Gauge size={20} />,
    title: "Performance & Reliability",
    desc: "Sub-100ms response times, automatic failover, CDN caching, and database optimization. Every application is built to handle growth from day one.",
  },
];

const relatedPosts = [
  {
    slug: "building-a-saas-prototype-in-3-weeks-a-case-study",
    title: "Building an MVP in 3 Weeks: A SaaS Prototype Case Study",
  },
  {
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    title: "The Meteoric Guide to Choosing Your Tech Stack",
  },
  {
    slug: "mongodb-vs-postgresql-for-saas",
    title: "MongoDB vs PostgreSQL for SaaS — Which One Should You Choose?",
  },
];

export default function WebApplicationsPage() {
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
            Web Applications
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          Web Application{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Development
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-8"
        >
          We build custom web applications that are fast, scalable, and a joy to
          use. From internal dashboards to customer-facing platforms — every
          project is crafted for real-world performance.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric is a web application development company that works directly
          with founders and product teams. Modern stack, modern practices — no
          legacy code, no bloated frameworks, no nonsense.
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
            Our Application Stack
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            Every web application we build is powered by a battle-tested stack
            that prioritizes developer velocity and end-user experience:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Frontend", value: "Next.js + React" },
              { label: "Backend", value: "Node.js / Supabase" },
              { label: "Database", value: "PostgreSQL" },
              { label: "Auth", value: "Supabase Auth" },
              { label: "Hosting", value: "Vercel" },
              { label: "API", value: "REST / GraphQL" },
              { label: "Animation", value: "Framer Motion" },
              { label: "Monitoring", value: "Sentry" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-white/70 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[#EAEFFF]/35 text-xs mt-6">
            Read more about our <Link href="/blog/the-meteoric-guide-to-choosing-your-tech-stack" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200">tech stack philosophy</Link>.
          </p>
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
            q: "What kind of web applications do you build?",
            a: "We build a wide range of web applications — internal tools and admin dashboards, customer-facing SaaS platforms, real-time collaboration apps, data visualization dashboards, and API-first backends. If it runs in a browser, we can build it.",
          },
          {
            q: "How long does it take to build a web application?",
            a_html: "A typical MVP can be shipped in 2-4 weeks. More complex applications with real-time features, dashboards, and multiple user roles typically take 6-10 weeks. We provide a detailed timeline after our free scoping call. See our <a href=\"/blog/building-a-saas-prototype-in-3-weeks-a-case-study\" class=\"text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200\">MVP case study</a> for a real example.",
          },
          {
            q: "Do you work with existing codebases?",
            a: "Yes. We regularly take over and modernize existing web applications. Whether you need to add features, fix performance issues, or migrate from a legacy framework — we handle it.",
          },
          {
            q: "What does a web application cost?",
            a: "Pricing depends on complexity. A focused internal tool or dashboard starts around $10,000-$20,000. Full-featured customer-facing applications range from $25,000-$60,000. We provide a fixed-price quote after understanding your requirements.",
          },
          {
            q: "How do you handle scalability?",
            a: "Every application is built with scalability in mind from day one. We use serverless infrastructure (Vercel, Supabase) that auto-scales, implement database indexing and query optimization, and set up monitoring and alerting so you know before users do.",
          },
        ]} />
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
