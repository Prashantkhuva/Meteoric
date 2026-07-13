"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smartphone, Monitor, Code2, Layers } from "lucide-react";
import StaggerText from "@/components/layout/StaggerText";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Landing Page",
    desc: "High-converting, fast-loading landing pages built to make a strong first impression and turn visitors into customers.",
    tags: ["Strategy", "UX/UI", "Responsive", "Conversion"],
    icon: Smartphone,
    href: "/services/landing-pages",
  },
  {
    num: "02",
    title: "SaaS Development",
    desc: "End-to-end SaaS platforms and MVPs with authentication, dashboards, payments, and scalable architecture.",
    tags: ["Auth", "Dashboards", "Payments", "Scalable"],
    icon: Monitor,
    href: "/services/saas-development",
  },
  {
    num: "03",
    title: "Web Apps",
    desc: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    tags: ["Frontend", "Backend", "Real-time", "API"],
    icon: Code2,
    href: "/services/web-applications",
  },
  {
    num: "04",
    title: "Full-Stack",
    desc: "Complete frontend and backend development — from APIs and databases to polished UI. Full stack, one team.",
    tags: ["APIs", "Databases", "UI", "DevOps"],
    icon: Layers,
    href: "/services/full-stack-development",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const progressRef = useRef(null);
  const headingRef = useRef(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  const svcMainWords = "What we build".split(" ");
  const svcMutedWords = "for founders.".split(" ");

  useGSAP(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Heading word reveal — scrub
    gsap.fromTo(headingRef.current?.querySelectorAll(".gsap-svc-word"),
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
      },
    );

    const cardsWrap = cardsWrapRef.current;
    const container = scrollContainerRef.current;
    if (!cardsWrap || !container) return;

    const getScrollDistance = () =>
      cardsWrap.scrollWidth - container.offsetWidth;

    const scrollTween = gsap.to(cardsWrap, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });

    // Per-card entrance
    const cards = cardsWrap.querySelectorAll(".service-card");
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0.3, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: card,
            start: "left 85%",
            end: "left 50%",
            scrub: true,
          },
        },
      );
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-black"
    >
      {/* Header */}
      <div ref={headingRef} className="px-6 md:px-16 pt-28 md:pt-36 pb-12 md:pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-4">
          <div>
            <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5 [&>.gsap-svc-word:not(:last-child)]:mr-[0.25em]">
              <span className="font-display text-white/30 not-italic mr-2">
                01
              </span>
              {"Our Services".split(" ").map((w, i) => (
                <span key={i} className="gsap-svc-word inline-block">{w}</span>
              ))}
            </p>

            <h2 className="text-[clamp(2.5rem,7vw,72px)] leading-[0.92] tracking-[-0.03em] font-normal text-white [&>.gsap-svc-word:not(:last-child)]:mr-[0.25em]">
              {svcMainWords.map((w, i) => (
                <span key={i} className="gsap-svc-word inline-block">{w} </span>
              ))}
              <span className="block font-secondary-italic [&>.gsap-svc-word:not(:last-child)]:mr-[0.25em]">
                {svcMutedWords.map((w, i) => (
                  <span
                    key={i}
                    className="gsap-svc-word inline-block text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(97deg, #fff 0%, #999 100%)" }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </span>
            </h2>
          </div>

          <div
            className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 pb-2"
          >
            <span>Scroll to explore</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Horizontal scroll area — pinned on desktop */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-hidden hidden md:flex min-h-screen items-center"
      >
        <div
          ref={cardsWrapRef}
          className="flex gap-6 px-6 md:px-16 w-max"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.num}
                href={s.href}
                className="service-card group relative flex-shrink-0 w-[80vw] lg:w-[60vw] xl:w-[48vw] rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-8 md:p-10 flex flex-col justify-between min-h-[420px] transition-colors duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Ghost number */}
                <span
                  className="absolute top-6 right-8 text-[120px] md:text-[180px] font-display leading-none text-white/[0.02] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {s.num}
                </span>

                {/* Top row: label + icon */}
                <div className="relative z-10 flex items-center justify-between mb-10">
                  <span className="text-[10px] tracking-[0.3em] font-bold text-white/30 uppercase">
                    Service — {s.num}
                  </span>
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 group-hover:text-white/60 group-hover:border-white/20 transition-colors duration-300">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title + description */}
                <div className="relative z-10 flex-1">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-5 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-white/45 max-w-md">
                    {s.desc}
                  </p>
                </div>

                {/* Tags + CTA */}
                <div className="relative z-10 mt-8">
                  <div className="flex flex-wrap gap-2 mb-8">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-[0.15em] text-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-white/30 border-b border-white/15 pb-1 group-hover:text-white/60 group-hover:border-white/30 transition-colors duration-300">
                    The full picture
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}

          {/* CTA card */}
          <div className="flex-shrink-0 w-[80vw] lg:w-[60vw] xl:w-[48vw] rounded-2xl overflow-hidden border border-[#EAEFFF]/10 bg-[#EAEFFF]/[0.04] backdrop-blur-md p-8 md:p-10 flex flex-col justify-between min-h-[420px]">
            <span
              className="absolute top-6 right-8 text-[120px] md:text-[180px] font-display leading-none text-[#EAEFFF]/[0.03] select-none pointer-events-none"
              aria-hidden="true"
            >
              05
            </span>

            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.3em] font-bold text-[#EAEFFF]/30 uppercase block mb-10">
                And then some
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-5 leading-tight">
                Something custom in mind?
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/45 max-w-md">
                Every project begins with understanding your vision. Whether it's
                a landing page, SaaS, or a full-stack app — we'll build it
                tailored to your goals.
              </p>
            </div>

            <div className="relative z-10">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center flip-btn"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                <StaggerText hovered={ctaHovered} hoverColor="#1b1b1b" style={{ fontSize: 14, fontWeight: 400, color: "#1b1b1b" }}>
                  {"Start a conversation"}
                </StaggerText>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-[#EAEFFF]/40 to-[#EAEFFF]/80 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Mobile: vertical cards */}
      <div className="md:hidden px-6 pb-28">
        <div className="space-y-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.num}
                href={s.href}
                className="group relative block rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 transition-colors duration-300 hover:border-white/[0.12]"
              >
                {/* Ghost number */}
                <span
                  className="absolute top-4 right-4 text-[80px] font-display leading-none text-white/[0.02] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {s.num}
                </span>

                <div className="relative z-10 flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.3em] font-bold text-white/30 uppercase">
                    Service — {s.num}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="relative z-10 text-xl font-display text-white mb-2">
                  {s.title}
                </h3>
                <p className="relative z-10 text-sm leading-relaxed text-white/45 mb-4">
                  {s.desc}
                </p>

                <div className="relative z-10 flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-[0.15em] text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
