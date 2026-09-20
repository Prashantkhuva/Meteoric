"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { serviceFaqs } from "@/data/faqs";
import { trackEvent } from "@/lib/analytics/gtag";

const services = [
  {
    num: "01",
    title: "Landing Pages",
    desc: "High-converting, fast-loading landing pages designed to make a lasting impression. Built with Next.js and optimized for SEO, speed, and conversion.",
    slug: "landing-pages",
    image: "/images/service-web.webp",
    metric: "3x faster launch",
    process: {
      intro: "Every landing page starts with understanding your audience and ends with a page that converts. No templates — every pixel is intentional.",
      steps: [
        { title: "Strategy & Wireframe", desc: "We map your audience, message, and conversion flow before a single pixel is designed." },
        { title: "Design & Animate", desc: "Visual identity meets motion design. Scroll-triggered animations and micro-interactions." },
        { title: "Build & Optimize", desc: "Next.js, Tailwind CSS, GSAP. Blazing fast load times and SEO foundations baked in." },
      ],
    },
  },
  {
    num: "02",
    title: "SaaS Development",
    desc: "From MVP prototypes to production SaaS platforms. We design, build, and launch complete products — auth, dashboards, payments, and everything in between.",
    slug: "saas-development",
    image: "/images/service-saas.webp",
    metric: "3-6 week MVP",
    process: {
      intro: "We build SaaS like a product studio, not an agency. Founder-level involvement and a technical stack built to scale.",
      steps: [
        { title: "Scope & Architect", desc: "Core 20% features that deliver 80% of value. Database schema, API design, auth flows mapped." },
        { title: "Build & Ship MVP", desc: "Full-stack with Next.js, Supabase, and Stripe. Production-ready in 3-6 weeks." },
        { title: "Scale & Iterate", desc: "Post-launch support, feature additions, and performance optimization." },
      ],
    },
  },
  {
    num: "03",
    title: "Web Applications",
    desc: "Custom web applications — dashboards, internal tools, and customer-facing platforms. Clean UI, solid backend, built to perform at scale.",
    slug: "web-applications",
    image: "/images/service-mobile.webp",
    metric: "99.9% uptime",
    process: {
      intro: "Whether it's an internal dashboard or a customer-facing platform, we build web apps that are fast, reliable, and a pleasure to use.",
      steps: [
        { title: "Discover & Map", desc: "User research, competitor analysis, and journey mapping." },
        { title: "Design & Prototype", desc: "Wireframes to high-fidelity design to interactive prototype." },
        { title: "Develop & Deploy", desc: "Clean code with Next.js, Node.js, and Supabase. Real-time features and API integrations." },
      ],
    },
  },
  {
    num: "04",
    title: "Full-Stack Development",
    desc: "Frontend to backend, database to deployment. We build complete systems — APIs, auth, integrations, and polished interfaces — all under one roof.",
    slug: "startup-web-development",
    image: "/images/service-web.webp",
    metric: "One team, full stack",
    process: {
      intro: "No coordinating multiple vendors. We handle the entire stack — from database schema to pixel-perfect UI.",
      steps: [
        { title: "Architecture & Planning", desc: "Technical stack selection, system architecture, and database design." },
        { title: "Build & Integrate", desc: "Frontend, backend, APIs, third-party integrations. Everything built to work together." },
        { title: "Launch & Optimize", desc: "Performance optimization, SEO foundations, accessibility checks, and speed audits." },
      ],
    },
  },
];

const techStack = ["Next.js", "React", "Supabase", "Node.js", "Tailwind CSS", "GSAP", "Stripe", "PostgreSQL"];

export default function ServicesPage() {
  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-10 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1] max-w-lg" style={{ color: "var(--text-primary)" }}>
            Web Development Services
          </h1>
          <p className="text-[15px] max-w-md leading-relaxed" style={{ color: "#171717" }}>
            Meteoric partners with founders to design, build, and launch modern
            web products. Every project ships with the same care as if it were
            our own.
          </p>
        </div>
        <button
          onClick={() => {
            trackEvent("services_cta_click", { button_location: "/services" });
            openCal();
          }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
          style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
        >
          Book a call
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" className="size-2 -rotate-90 transition-transform duration-150 group-hover:translate-x-px">
            <path fill="currentColor" d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z" />
          </svg>
        </button>
      </section>

      {/* Service Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <Link
                key={svc.num}
                href={`/services/${svc.slug}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px]"
                style={{ border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: "var(--text-muted)" }}>
                      {svc.num}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {svc.metric}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {svc.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {svc.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-300" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Learn more
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="py-20 md:py-28 overflow-hidden" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display" style={{ color: "var(--text-primary)" }}>
            Technologies We Master
          </h2>
        </div>
        <div className="relative w-full overflow-hidden py-6 flex items-center">
          <div className="absolute left-0 top-0 w-24 md:w-48 h-full z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
          <div className="absolute right-0 top-0 w-24 md:w-48 h-full z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />
          <div className="flex w-max whitespace-nowrap animate-marquee-left" style={{ "--sets": 6 }}>
            {[...Array(6)].flatMap(() => techStack).map((tech, i) => (
              <span key={i} className="px-6 md:px-10 text-3xl md:text-5xl font-display transition-colors duration-500" style={{ color: "var(--text-primary)", opacity: 0.08 }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-display mb-14" style={{ color: "var(--text-primary)" }}>
            Common questions about our services.
          </h2>
          <FaqAccordion items={serviceFaqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display mb-6" style={{ color: "var(--text-primary)" }}>
            Let&apos;s build something <span style={{ color: "var(--text-muted)" }}>together.</span>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            Book a free strategy call and we&apos;ll discuss your project, timeline, and how we can help.
          </p>
          <button
            onClick={() => {
              trackEvent("services_cta_click", { button_location: "/services" });
              openCal();
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
            style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
          >
            Book a call
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" className="size-2 -rotate-90 transition-transform duration-150 group-hover:translate-x-px">
              <path fill="currentColor" d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
