"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { serviceFaqs } from "@/data/faqs";

const services = [
  {
    num: "01",
    title: ["Landing", "Pages"],
    desc: "High-converting, fast-loading landing pages designed to make a lasting impression. Built with Next.js and optimized for SEO, speed, and conversion.",
    process: {
      intro: "Every landing page starts with understanding your audience and ends with a page that converts. No templates — every pixel is intentional.",
      steps: [
        {
          title: "Strategy & Wireframe",
          desc: "We map your audience, message, and conversion flow before a single pixel is designed. Every section has a job — no filler, no decoration.",
        },
        {
          title: "Design & Animate",
          desc: "Visual identity meets motion design. We craft scroll-triggered animations, micro-interactions, and a layout that guides the eye exactly where it needs to go.",
        },
        {
          title: "Build & Optimize",
          desc: "Next.js, Tailwind CSS, GSAP. Blazing fast load times, perfect Lighthouse scores, and SEO foundations baked in from day one.",
        },
      ],
    },
  },
  {
    num: "02",
    title: ["SaaS", "Development"],
    desc: "From MVP prototypes to production SaaS platforms. We design, build, and launch complete products — auth, dashboards, payments, and everything in between.",
    process: {
      intro: "We build SaaS like a product studio, not an agency. Founder-level involvement, no account managers, and a technical stack built to scale.",
      steps: [
        {
          title: "Scope & Architect",
          desc: "We define your core 20% — the features that deliver 80% of value. Database schema, API design, auth flows, and subscription billing mapped out before development begins.",
        },
        {
          title: "Build & Ship MVP",
          desc: "Full-stack development with Next.js, Supabase, and Stripe. Auth, dashboards, real-time features, and payment integration — production-ready in 3-6 weeks.",
        },
        {
          title: "Scale & Iterate",
          desc: "Post-launch support, feature additions, performance optimization, and ongoing maintenance. We treat every project as a long-term partnership.",
        },
      ],
    },
  },
  {
    num: "03",
    title: ["Web", "Applications"],
    desc: "Custom web applications — dashboards, internal tools, and customer-facing platforms. Clean UI, solid backend, built to perform at scale.",
    process: {
      intro: "Whether it's an internal dashboard or a customer-facing platform, we build web apps that are fast, reliable, and a pleasure to use.",
      steps: [
        {
          title: "Discover & Map",
          desc: "User research, competitor analysis, and journey mapping. We understand how your users think and what they need before we design a single screen.",
        },
        {
          title: "Design & Prototype",
          desc: "Wireframes → high-fidelity design → interactive prototype. We test and refine until the experience feels natural from the first click.",
        },
        {
          title: "Develop & Deploy",
          desc: "Clean, efficient code with Next.js, Node.js, and Supabase. Real-time features, API integrations, and deployment to Vercel with monitoring baked in.",
        },
      ],
    },
  },
  {
    num: "04",
    title: ["Full-Stack", "Development"],
    desc: "Frontend to backend, database to deployment. We build complete systems — APIs, auth, integrations, and polished interfaces — all under one roof.",
    process: {
      intro: "No coordinating multiple vendors. We handle the entire stack — from the database schema to the pixel-perfect UI — so you get one cohesive product.",
      steps: [
        {
          title: "Architecture & Planning",
          desc: "Technical stack selection, system architecture, and database design. We plan for performance, scalability, and security from day one — no retrofitting.",
        },
        {
          title: "Build & Integrate",
          desc: "Frontend, backend, APIs, third-party integrations. Stripe, Resend, Supabase, Cal.com — everything built to work together seamlessly with proper error handling.",
        },
        {
          title: "Launch & Optimize",
          desc: "Performance optimization, SEO foundations, accessibility checks, and speed audits. Your app launches strong and stays fast as it grows.",
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
  "Tailwind CSS",
  "TypeScript",
  "GSAP",
  "Stripe",
  "PostgreSQL",
  "Framer Motion",
];

export default function ServicesPage() {
  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20 md:pb-32 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[#EAEFFF]/40 uppercase tracking-[0.3em] text-xs font-bold block mb-6"
        >
          Our Expertise
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-secondary-italic font-normal leading-[1.1] tracking-tight max-w-4xl mb-8"
        >
          Design. Build.{" "}
          <span className="font-secondary-italic font-normal">Launch.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10"
        >
          Meteoric partners with founders to design, build, and launch modern web
          products. Every project ships with the same care as if it were our
          own — because it is.
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
              <div className={`grid md:grid-cols-12 gap-10 md:gap-12 items-start ${isReversed ? "" : ""}`}>
                {/* Left: Sticky text */}
                <div
                  className={`md:col-span-5 md:sticky md:top-32 ${
                    isReversed ? "md:order-last" : ""
                  }`}
                >
                  <ScrollReveal direction="down" delay={0}>
                    <span className="text-6xl md:text-8xl font-secondary-italic text-[#EAEFFF]/[0.08] mb-6 block leading-none">
                      {svc.num}.
                    </span>
                  </ScrollReveal>

                  <ScrollReveal direction="down" delay={0.1}>
                    <h2 className="text-3xl md:text-5xl lg:text-[clamp(2.25rem,4vw,3.5rem)] font-secondary-italic font-normal leading-[1.15] tracking-tight mb-6">
                      {svc.title[0]}
                      <br />
                      {svc.title[1]}
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal direction="down" delay={0.2}>
                    <p className="text-white/40 text-base leading-relaxed">
                      {svc.desc}
                    </p>
                  </ScrollReveal>
                </div>

                {/* Right: Process card */}
                <ScrollReveal direction="up" delay={0.2} className="md:col-span-7">
                  <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-10 md:p-14 lg:p-16">
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
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* Tech Stack Marquee */}
      <section className="py-20 md:py-28 relative border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12 text-center">
          <ScrollReveal direction="down" delay={0}>
            <span className="text-[#EAEFFF]/40 uppercase tracking-widest text-xs font-bold block mb-4">
              Our Stack
            </span>
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-secondary-italic">
              Technologies We Master
            </h2>
          </ScrollReveal>
        </div>

        <div className="relative w-full overflow-hidden py-6 flex items-center">
          {/* Edge masks */}
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

      {/* FAQ Section for AEO / GEO */}
      <section className="py-20 md:py-28 relative border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollReveal direction="down" delay={0}>
            <span className="text-[#EAEFFF]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
              FAQ
            </span>
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-secondary-italic mb-14">
              Common questions about our services.
            </h2>
          </ScrollReveal>

          <FaqAccordion items={serviceFaqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <ScrollReveal direction="down" delay={0}>
            <span className="text-[#EAEFFF]/40 uppercase tracking-[0.2em] text-xs font-bold block mb-5">
              Ready to start?
            </span>
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-secondary-italic mb-6">
              Let&apos;s build something <span className="text-white/40">together.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.2}>
            <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-10">
              Book a free strategy call and Meteoric will discuss your project, timeline, and how we can help.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <button
              onClick={openCal}
              className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(234,239,255,0.06)] hover:shadow-[0_0_30px_rgba(234,239,255,0.12)]"
            >
              Get a Free Estimate
            </button>
          </ScrollReveal>
        </div>
      </section>


    </div>
  );
}
