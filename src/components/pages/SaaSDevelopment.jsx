"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    num: "01",
    title: "SaaS MVP Development",
    desc: "Fast, focused MVP built around your core value proposition — the minimum features needed to validate your idea with real users and attract early customers or investors.",
    process: {
      intro: "We build SaaS MVPs that ship in weeks, not months. Every decision is scoped around what matters most: validating your idea with real users.",
      steps: [
        {
          title: "Scope & Validate",
          desc: "We define your core 20% — the features that deliver 80% of value. No scope creep, no gold-plating. Just what you need to launch and learn.",
        },
        {
          title: "Build & Ship",
          desc: "Full-stack development with Next.js, Supabase, and Stripe. Auth, billing, dashboards, and core features — production-ready in 3-6 weeks.",
        },
        {
          title: "Learn & Iterate",
          desc: "Post-launch support, user feedback integration, and feature additions. We help you evolve the product based on real data.",
        },
      ],
    },
  },
  {
    num: "02",
    title: "Full-Stack SaaS Platforms",
    desc: "Complete SaaS products with multi-tenant architecture, subscription billing, role-based access, dashboards, APIs, and everything in between.",
    process: {
      intro: "We build SaaS like a product studio, not an agency. Architecture-first approach — scalable multi-tenant design before we write a line of code.",
      steps: [
        {
          title: "Architecture & Design",
          desc: "Multi-tenant data model, auth flows, billing integration, API design, and database schema mapped out before development begins.",
        },
        {
          title: "Build & Integrate",
          desc: "Frontend, backend, APIs, third-party integrations. Stripe, Supabase, Resend — everything built to work together seamlessly.",
        },
        {
          title: "Launch & Scale",
          desc: "Performance optimization, security hardening, monitoring setup, and scaling support. Your SaaS launches strong and grows reliably.",
        },
      ],
    },
  },
  {
    num: "03",
    title: "SaaS Scaling & Optimization",
    desc: "Performance tuning, feature additions, and scaling support for growing SaaS products. We help you go from 100 to 10,000 users without re-architecting.",
    process: {
      intro: "Growing SaaS products need more than bug fixes. We optimize performance, add features, and ensure your architecture supports your next stage of growth.",
      steps: [
        {
          title: "Audit & Identify",
          desc: "Performance audit, architecture review, and bottleneck identification. We find what's holding your SaaS back from scaling.",
        },
        {
          title: "Optimize & Harden",
          desc: "Database query optimization, caching layers, CDN setup, security hardening, and infrastructure improvements.",
        },
        {
          title: "Ship & Monitor",
          desc: "Feature additions, A/B testing infrastructure, analytics pipelines, and monitoring dashboards. Ship improvements with confidence.",
        },
      ],
    },
  },
];

const techStack = [
  "Next.js",
  "React",
  "Supabase",
  "Node.js",
  "PostgreSQL",
  "Stripe",
  "Tailwind CSS",
  "Vercel",
];

const serviceFaqs = [
  {
    question: "How much does it cost to build a SaaS product?",
    answer: "SaaS MVPs typically start from a lower budget and ship in 3-6 weeks. Full-featured SaaS platforms range from 4-10 weeks depending on complexity. We provide a fixed quote after a free discovery call based on your feature requirements.",
  },
  {
    question: "What technologies does Meteoric use for SaaS development?",
    answer: "Our core SaaS stack is Next.js, React, Node.js, Supabase, and Stripe. We use PostgreSQL for databases, Tailwind CSS for styling, and deploy to Vercel. We adapt to your existing stack if needed.",
  },
  {
    question: "Do you build multi-tenant SaaS platforms?",
    answer: "Yes. We architect multi-tenant SaaS with proper data isolation, role-based access control, and per-tenant customization. Every query is automatically scoped to the authenticated tenant for security.",
  },
  {
    question: "How long does it take to build a SaaS MVP?",
    answer: "A focused SaaS MVP with auth, billing, core features, and a polished UI typically takes 3-6 weeks. We ship usable increments every two weeks so you can validate with real users early.",
  },
  {
    question: "Do you handle subscription billing and payments?",
    answer: "Yes. We integrate Stripe for subscription management — plan creation, free trials, usage-based billing, invoice generation, and upgrade/downgrade flows. The billing logic is built directly into your SaaS platform.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function SaaSDevelopmentPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── GEO quotable blocks ── */}
      <div className="sr-only">
        Meteoric is a SaaS development agency that builds scalable SaaS products from MVP to production. The agency specializes in Next.js, React, Node.js, Supabase, and Stripe, building multi-tenant platforms with subscription billing, role-based access control, auth, dashboards, and APIs. Typical SaaS MVP timelines are 3-6 weeks. Full SaaS platforms take 4-10 weeks. Post-launch support is included with every project.
      </div>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20 md:pb-32 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[#EAEFFF]/40 uppercase tracking-[0.3em] text-xs font-bold block mb-6"
        >
          SaaS Development
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-secondary-italic font-normal leading-[1.1] tracking-tight max-w-4xl mb-8"
        >
          Build. Launch.{" "}
          <span className="font-secondary-italic font-normal">Scale.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10"
        >
          We build SaaS products from MVP to production — auth, billing,
          dashboards, APIs, and everything in between. Founder-level
          involvement, no account managers, and a stack built to scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
        />
      </section>

      {/* Service Sections */}
      {services.map((svc, idx) => {
        const isReversed = idx % 2 === 1;
        return (
          <section
            key={svc.num}
            className="py-20 md:py-28 relative border-t border-white/[0.06]"
          >
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start">
                {/* Left: Sticky text */}
                <div
                  className={`md:col-span-5 md:sticky md:top-32 ${
                    isReversed ? "md:order-last" : ""
                  }`}
                >
                  <motion.span
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="text-6xl md:text-8xl font-secondary-italic text-[#EAEFFF]/[0.08] mb-6 block leading-none"
                  >
                    {svc.num}.
                  </motion.span>

                  <motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    custom={1}
                    className="text-3xl md:text-5xl lg:text-[clamp(2.25rem,4vw,3.5rem)] font-secondary-italic font-normal leading-[1.15] tracking-tight mb-6"
                  >
                    {svc.title}
                  </motion.h2>

                  <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    custom={2}
                    className="text-white/40 text-base leading-relaxed"
                  >
                    {svc.desc}
                  </motion.p>
                </div>

                {/* Right: Process card */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  custom={2}
                  className="md:col-span-7 rounded-2xl border border-white/[0.06] p-10 md:p-14 lg:p-16"
                  style={{ background: "#0a0a0a" }}
                >
                  <h3 className="text-xl md:text-2xl font-secondary-italic text-white/80 mb-4">
                    Our Process
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed mb-8">
                    {svc.process.intro}
                  </p>

                  <div className="space-y-6">
                    {svc.process.steps.map((step, si) => (
                      <div
                        key={si}
                        className="border-l-2 border-[#EAEFFF]/10 pl-6 hover:border-[#EAEFFF]/30 transition-colors duration-300"
                      >
                        <h4 className="uppercase tracking-widest text-[11px] font-bold text-white/50 mb-2">
                          {step.title}
                        </h4>
                        <p className="text-sm text-white/30 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Tech Stack Marquee */}
      <section className="py-20 md:py-28 relative border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12 text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#EAEFFF]/40 uppercase tracking-widest text-xs font-bold block mb-4"
          >
            Our Stack
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="text-3xl md:text-5xl font-secondary-italic"
          >
            Technologies We Use for SaaS
          </motion.h2>
        </div>

        <div className="relative w-full overflow-hidden py-6 flex items-center">
          <div className="absolute left-0 top-0 w-24 md:w-48 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-24 md:w-48 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="marquee">
            <div className="flex w-max gap-12 md:gap-20 whitespace-nowrap animate-marquee-left">
              {[...techStack, ...techStack].map((tech, i) => (
                <span
                  key={i}
                  className="text-3xl md:text-5xl font-secondary-italic text-white/[0.08] hover:text-white/40 transition-colors duration-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 relative border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#EAEFFF]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5"
          >
            FAQ
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="text-3xl md:text-5xl font-secondary-italic mb-14"
          >
            Common questions about SaaS development.
          </motion.h2>

          <div className="space-y-3">
            {serviceFaqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/[0.12] transition-colors p-6"
              >
                <h3 className="text-white/80 text-sm font-medium mb-3">{faq.question}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-2xl">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-secondary-italic mb-6"
          >
            Ready to build your SaaS?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="text-white/40 text-base md:text-lg mb-10 max-w-2xl mx-auto"
          >
            Book a free strategy call. We&apos;ll discuss your product vision,
            give you a timeline and estimate, and if we&apos;re a good fit,
            we&apos;ll start within the week.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300"
            >
              Book a Free Strategy Call
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
