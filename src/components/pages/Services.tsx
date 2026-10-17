"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { serviceFaqs } from "@/data/faqs";
import { servicesIndex, techStack } from "@/data/services";
import { trackEvent } from "@/lib/analytics/gtag";
import { openCalModal } from "@/components/ui/cal-modal-store";

export default function ServicesPage() {
  const openCal = useCallback(() => openCalModal(), []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-10 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1] max-w-lg" style={{ color: "var(--text-primary)" }}>
            Web Development Services
          </h1>
        </div>
        <div className="max-w-3xl text-[15px] leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          <p className="mb-4">
            Meteoric is a founder-led web development studio. Every project is
            designed, built, and shipped by the same person you talk to on the
            first call — no account managers, no handoff chains.
          </p>
          <p className="mb-4">
            We work across five service lines, each solving a different stage of
            the product journey.{" "}
            <Link
              href="/services/landing-pages"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              High-converting landing pages
            </Link>{" "}
            for launches and campaigns that need to convert from day one.{" "}
            <Link
              href="/services/saas-development"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              End-to-end SaaS development
            </Link>{" "}
            for founders taking a product from idea to production.{" "}
            <Link
              href="/services/startup-web-development"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              Startup web development
            </Link>{" "}
            covering product sites, marketing pages, and full-stack builds for
            early teams.{" "}
            <Link
              href="/services/nextjs-development"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              Next.js development
            </Link>{" "}
            for teams that want React-based apps with SEO foundations and
            performance baked in. And{" "}
            <Link
              href="/services/web-applications"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              custom web application development
            </Link>{" "}
            — dashboards, portals, and internal tools built around how your team
            actually works.
          </p>
          <p>
            Not sure which fits? Start with a free strategy call — we&apos;ll
            map the smallest version that gets you to the next milestone.
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
            {servicesIndex.map((svc, i) => (
              <ScrollReveal key={svc.num} direction="up" delay={0.1 * i}>
                <Link
                  href={`/services/${svc.slug}`}
                  className="group block rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)] hover:ring-[var(--border-hover)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--accent-glow)]"
                  style={{ background: "var(--card-bg)" }}
                >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <Image
                    src={svc.image!}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i < 2}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
                    {svc.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-300" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Learn more
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Intent-based landing links */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <ScrollReveal
            direction="up"
            className="rounded-2xl ring-1 ring-[var(--border-color)] p-8 md:p-10"
            style={{ background: "var(--card-bg)" }}
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Know what you are looking for?
            </h2>
            <p className="text-sm leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Start with the outcome you need — these pages answer the same
              questions our team hears on every first call.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link
                  href="/saas-mvp-development"
                  className="text-sm inline-flex items-center min-h-6 hover:text-[var(--accent)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Validate a SaaS idea with a buildable MVP →
                </Link>
              </li>
              <li>
                <Link
                  href="/nextjs-development-agency"
                  className="text-sm inline-flex items-center min-h-6 hover:text-[var(--accent)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Hire a Next.js agency for your site or product →
                </Link>
              </li>
              <li>
                <Link
                  href="/startup-landing-page-design"
                  className="text-sm inline-flex items-center min-h-6 hover:text-[var(--accent)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Design a launch page for your startup →
                </Link>
              </li>
              <li>
                <Link
                  href="/web-app-development"
                  className="text-sm inline-flex items-center min-h-6 hover:text-[var(--accent)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Build a custom web app, dashboard, or portal →
                </Link>
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="py-20 md:py-28 overflow-hidden" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12 text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-5xl font-display" style={{ color: "var(--text-primary)" }}>
              Technologies We Master
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal direction="left" className="relative w-full overflow-hidden py-6 flex items-center">
          <div className="absolute left-0 top-0 w-24 md:w-48 h-full z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
          <div className="absolute right-0 top-0 w-24 md:w-48 h-full z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />
          <div className="flex w-max whitespace-nowrap animate-marquee-left" style={{ "--sets": 6 } as React.CSSProperties}>
            {[...Array(6)].flatMap((_, setIndex) =>
              techStack.map((tech, i) => ({ setIndex, tech, i })),
            ).map(({ setIndex, tech, i }) => (
              <span
                key={`${setIndex}-${i}`}
                aria-hidden={setIndex > 0 || undefined}
                className="px-6 md:px-10 text-3xl md:text-5xl font-display transition-colors duration-500"
                style={{ color: "var(--text-primary)", opacity: 0.08 }}
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollReveal direction="right" className="mb-14">
            <h2 className="text-3xl md:text-5xl font-display" style={{ color: "var(--text-primary)" }}>
              Common questions about our services.
            </h2>
          </ScrollReveal>
          <FaqAccordion items={serviceFaqs} />
        </div>
      </section>
    </div>
  );
}
