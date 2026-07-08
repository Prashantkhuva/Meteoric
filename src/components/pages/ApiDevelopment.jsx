"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Zap, Lock, GitBranch, Wifi } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Zap size={20} />,
    title: "REST & GraphQL API Development",
    desc: "Well-documented, versioned APIs built with Node.js, Next.js, and Supabase. Designed for performance, type safety, and seamless frontend integration.",
  },
  {
    icon: <Lock size={20} />,
    title: "Authentication & Authorization",
    desc: "JWT, OAuth 2.0, magic links, and role-based access control. APIs secured from the ground up with rate limiting, input validation, and audit logging.",
  },
  {
    icon: <GitBranch size={20} />,
    title: "Third-Party Integrations",
    desc: "Stripe, Resend, Slack, WhatsApp, Google, and more. We handle webhooks, retry logic, and payload validation so your API stays reliable.",
  },
  {
    icon: <Wifi size={20} />,
    title: "Real-Time APIs & WebSockets",
    desc: "Live updates, presence detection, and collaborative features powered by WebSockets and Supabase Realtime. Built for modern interactive experiences.",
  },
];

const relatedPosts = [
  {
    slug: "mongodb-schema-design-for-saas-billing",
    title: "MongoDB Schema Design for SaaS Billing — A Practical Guide",
  },
  {
    slug: "mongodb-vs-postgresql-for-saas",
    title: "MongoDB vs PostgreSQL for SaaS — Which One Should You Choose?",
  },
  {
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    title: "The Meteoric Guide to Choosing Your Tech Stack",
  },
];

export default function ApiDevelopmentPage() {
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
            API Development
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          API{" "}
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
          We design and build APIs that are fast, secure, and documented.
          REST or GraphQL — your frontend, mobile app, or third-party
          integrations will thank you.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric is a web development company that builds API-first systems.
          Every endpoint is designed with error handling, validation, and
          observability baked in from the start.
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
            Our API Stack
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            We use a modern, type-safe API stack that ensures consistency and
            developer experience:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Framework", value: "Next.js / Node.js" },
              { label: "API Style", value: "REST / GraphQL" },
              { label: "Database", value: "PostgreSQL" },
              { label: "Auth", value: "JWT / Supabase Auth" },
              { label: "Validation", value: "Zod" },
              { label: "Hosting", value: "Vercel" },
              { label: "Email", value: "Resend" },
              { label: "Payments", value: "Stripe" },
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
            q: "Do you build REST or GraphQL APIs?",
            a: "Both. We recommend REST for simple resource-based APIs and GraphQL for complex data requirements or when building with React/Next.js frontends. We can also build hybrid systems that expose both.",
          },
          {
            q: "How do you document APIs?",
            a: "APIs are documented with OpenAPI (Swagger) for REST and auto-generated GraphQL docs. We also provide Postman collections, integration guides, and example code snippets for common use cases.",
          },
          {
            q: "Can you integrate with existing third-party services?",
            a_html: "Absolutely. We regularly integrate with Stripe, Resend, Supabase, Cal.com, Google APIs, Slack, WhatsApp, and more. We handle webhooks, OAuth flows, and error handling so integrations stay reliable. Check our <a href=\"/services/technical-consulting\" class=\"text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200\">technical consulting</a> page for more detail.",
          },
          {
            q: "How do you handle API security?",
            a: "Every API we build includes rate limiting, input validation (Zod), authentication via JWT or OAuth 2.0, CORS configuration, SQL injection prevention, and request logging. We also implement proper error handling that never leaks implementation details.",
          },
          {
            q: "How much does a custom API cost?",
            a: "A focused API with 10-15 endpoints typically ranges from $8,000-$15,000. Complex integrations or real-time APIs with WebSockets range from $15,000-$30,000. We provide a detailed scope after our discovery call.",
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
