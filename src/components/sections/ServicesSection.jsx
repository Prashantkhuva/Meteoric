"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
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
      <Link href={service.href} className="block group gsap-work-card">
        {/* Mobile: image card only, text below */}
        <div className="md:hidden">
          <div
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
            style={{
              background: "var(--hero-bg)",
              border: "1px solid var(--hero-border)",
            }}
          >
            <img
              src={service.image}
              alt={service.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="pt-5 pb-2">
            <h3
              className="text-xl font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {service.title}
            </h3>
            <p
              className="text-sm leading-relaxed mb-5 max-w-[95%]"
              style={{ color: "var(--text-secondary)" }}
            >
              {service.desc}
            </p>
            <span
              className="inline-flex items-center gap-2 text-[13px] font-medium px-5 py-2.5 rounded-full transition-all duration-300 group-hover:gap-3"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
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

        {/* Desktop: old overlay design */}
        <div
          className="hidden md:block relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1 aspect-[4/3]"
          style={{
            background: "var(--hero-bg)",
            border: "1px solid var(--hero-border)",
          }}
        >
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-7">
            <h3
              className="text-2xl font-medium mb-2"
              style={{ color: "var(--hero-text)" }}
            >
              {service.title}
            </h3>
            <p
              className="text-body-sm leading-normal mb-4 max-w-[90%]"
              style={{ color: "var(--hero-text-secondary)" }}
            >
              {service.desc}
            </p>
            <div className="flex items-center justify-between">
              <span
                className="text-caption font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--hero-text-muted)" }}
              >
                {service.metric}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider group-hover:gap-2.5 transition-all duration-300"
                style={{ color: "var(--hero-text-muted)" }}
              >
                Learn more
                <svg
                  className="w-3 h-3"
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

      gsap.fromTo(
        sectionRef.current?.querySelectorAll(".gsap-work-card"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        },
      );
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

      <div className="px-6 md:px-16 lg:px-20 max-w-[1200px] mx-auto">
        {/* Header */}
        <div ref={headingRef} className="pt-16 pb-10 lg:pt-24 lg:pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <p
                className="uppercase tracking-[0.15em] text-caption mb-4 font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                What We Build
              </p>
              <h2
                className="text-heading-1 leading-tight tracking-[-0.02em] font-normal"
                style={{ color: "var(--text-primary)" }}
              >
                Services built to
                <span
                  className="block font-secondary-italic"
                  style={{ color: "var(--text-muted)" }}
                >
                  ship results.
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-5 lg:gap-5 pb-16 lg:pb-24">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
