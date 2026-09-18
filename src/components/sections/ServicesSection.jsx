"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import StaggerText from "@/components/layout/StaggerText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GridLines from "@/components/ui/GridLines";
import useSectionAnimations from "@/hooks/useSectionAnimations";

const services = [
  {
    title: "Landing Page",
    desc: "High-converting, fast-loading landing pages built to make a strong first impression and turn visitors into customers.",
    image: "/images/service-web.webp",
    metric: "3x faster launch",
    href: "/services/landing-pages",
  },
  {
    title: "SaaS Development",
    desc: "End-to-end SaaS platforms and MVPs with authentication, dashboards, payments, and scalable architecture.",
    image: "/images/service-saas.webp",
    metric: "10+ MVPs shipped",
    href: "/services/saas-development",
  },
  {
    title: "Web Apps",
    desc: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    image: "/images/service-mobile.webp",
    metric: "99.9% uptime",
    href: "/services/web-applications",
  },
  {
    title: "Full-Stack",
    desc: "Complete frontend and backend development — from APIs and databases to polished UI. Full stack, one team.",
    image: "/images/service-web.webp",
    metric: "50+ projects delivered",
    href: "/services/nextjs-development",
  },
];

function ServiceCard({ service, index }) {
  return (
    <ScrollReveal direction="up" delay={index * 0.1}>
      <Link href={service.href} className="block group">
        <div className="flex flex-col gap-5 lg:gap-6">
          {/* Image */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3">
            <h3
              className="text-[28px] sm:text-[32px] lg:text-[36px] font-display leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              {service.title}
            </h3>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-[500px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {service.desc}
            </p>

            {/* Metric + CTA */}
            <div className="flex items-center gap-4 mt-2">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {service.metric}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--border-color)" }}
              >
                |
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider group-hover:gap-2.5 transition-all duration-300"
                style={{ color: "var(--text-muted)" }}
              >
                Learn more
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  useSectionAnimations(
    sectionRef,
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      const split = new SplitText(headingRef.current, {
        type: "lines",
        linesClass: "split-line",
      });
      gsap.fromTo(
        split.lines,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top bottom",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        },
      );

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full"
      style={{ background: "var(--bg-primary)" }}
    >
      <GridLines />

      <div className="px-6 md:px-16 lg:px-20 max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headingRef} className="pt-24 pb-12 lg:pt-32 lg:pb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Our Services
              </p>
              <h2
                className="text-[clamp(2rem,5vw,48px)] leading-[1.05] tracking-[-0.02em] font-normal"
                style={{ color: "var(--text-primary)" }}
              >
                What we build
                <span
                  className="block font-secondary-italic"
                  style={{ color: "var(--text-muted)" }}
                >
                  for founders.
                </span>
              </h2>
            </div>

            <ScrollReveal direction="right" delay={0.3}>
              <button
                onClick={openCal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                Book a call
                <svg
                  className="w-4 h-4 -rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </ScrollReveal>
          </div>
        </div>

        {/* Service cards — 2x2 grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16 pb-24 lg:pb-32">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-6 pb-24 lg:pb-32">
          <h3
            className="text-[clamp(1.75rem,4vw,36px)] leading-[1.1] font-normal max-w-[500px]"
            style={{ color: "var(--text-primary)" }}
          >
            Something custom in mind?
          </h3>
          <p
            className="text-sm sm:text-base leading-relaxed max-w-[500px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Every project begins with understanding your vision. Whether
            it&apos;s a landing page, SaaS, or a full-stack app — we&apos;ll
            build it tailored to your goals.
          </p>

          <button
            onClick={openCal}
            className="inline-flex items-center justify-center flip-btn"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            <StaggerText
              hovered={ctaHovered}
              hoverColor="var(--accent)"
              style={{ fontSize: 14, fontWeight: 400, color: "var(--accent)" }}
            >
              {"Book a Free Call"}
            </StaggerText>
          </button>
        </div>
      </div>
    </section>
  );
}
