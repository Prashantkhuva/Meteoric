"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Database, Code, GitBranch, Shield, Server, Zap } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Server size={20} />,
    title: "Backend & API Development",
    desc: "RESTful and GraphQL APIs built with Node.js, Next.js, and Supabase. Authentication, rate limiting, input validation, and comprehensive documentation — production-ready from day one.",
  },
  {
    icon: <Database size={20} />,
    title: "Database Design & Architecture",
    desc: "PostgreSQL and MongoDB schema design, query optimization, indexing strategies, and migration planning. Multi-tenant architectures for SaaS and real-time data pipelines.",
  },
  {
    icon: <Code size={20} />,
    title: "Frontend Engineering",
    desc: "Polished, responsive UIs built with React, Next.js, and Tailwind CSS. Server components, streaming SSR, and optimized Core Web Vitals out of the box.",
  },
  {
    icon: <GitBranch size={20} />,
    title: "Third-Party Integrations",
    desc: "Stripe payments, Resend email, Supabase auth, Cal.com booking, and custom webhooks. Every integration includes error handling, retry logic, and monitoring.",
  },
  {
    icon: <Shield size={20} />,
    title: "Auth & Security",
    desc: "JWT, OAuth 2.0, magic links, role-based access control, rate limiting, and audit logging. Security is built into every layer, not bolted on at the end.",
  },
  {
    icon: <Zap size={20} />,
    title: "DevOps & Deployment",
    desc: "Vercel hosting, CI/CD pipelines, environment management, custom domains, SSL, and monitoring. We ship and maintain so you don't have to.",
  },
];

const relatedPosts = [
  {
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    title: "The Meteoric Guide to Choosing Your Tech Stack",
  },
  {
    slug: "mongodb-vs-postgresql-for-saas",
    title: "MongoDB vs PostgreSQL for SaaS — Which One Should You Choose?",
  },
  {
    slug: "building-a-saas-prototype-in-3-weeks-a-case-study",
    title: "Building an MVP in 3 Weeks: A SaaS Prototype Case Study",
  },
];

export default function FullStackDevelopmentPage() {
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
            Full-Stack Development
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          Full-Stack{" "}
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
          We build complete web systems — from database schema and API architecture
          to polished frontend interfaces and deployment. One team, full stack.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric is a full-stack development agency that eliminates the gap between
          frontend and backend. Every project ships as a complete, integrated system —
          not a collection of disconnected parts. No handoffs, no coordination overhead,
          no surprises.
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
            Our Full-Stack Stack
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            Every layer of the stack is chosen for developer velocity, production
            reliability, and zero configuration overhead:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Frontend", value: "Next.js + Tailwind" },
              { label: "Backend", value: "Node.js / Supabase" },
              { label: "Database", value: "PostgreSQL / MongoDB" },
              { label: "API", value: "REST / GraphQL" },
              { label: "Auth", value: "Supabase Auth / JWT" },
              { label: "Payments", value: "Stripe" },
              { label: "Email", value: "Resend" },
              { label: "Hosting", value: "Vercel" },
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
            q: "What does a full-stack development agency do?",
            a: "A full-stack development agency builds complete web systems — frontend (UI/UX), backend (APIs, business logic), database (design, optimization), and third-party integrations. Unlike specialist agencies, we handle the entire stack so you don't need to coordinate multiple vendors.",
          },
          {
            q: "How long does full-stack development take?",
            a_html: 'A complete full-stack application typically takes 4-10 weeks depending on complexity. A focused MVP with auth, database, and core features can ship in 3-5 weeks. See our <a href="/blog/building-a-saas-prototype-in-3-weeks-a-case-study" class="text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200">MVP case study</a> for a real example.',
          },
          {
            q: "Do you build both frontend and backend?",
            a: "Yes. We build everything from the database schema and API layer to the frontend UI and deployment infrastructure. You get a complete, production-ready system — not a half-built prototype that needs another team to finish.",
          },
          {
            q: "Can you integrate third-party APIs and services?",
            a: "Absolutely. We regularly integrate Stripe for payments, Resend for transactional email, Supabase for auth and database, Cal.com for booking, and custom integrations via REST and webhooks.",
          },
          {
            q: "How much does full-stack development cost?",
            a: "Pricing depends on scope. A focused full-stack MVP starts around $15,000-$25,000. Complete production platforms with multiple integrations range from $30,000-$75,000. We provide a detailed scope and fixed-price quote after our discovery call.",
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
