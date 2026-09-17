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
    num: "01",
    title: "Landing Page",
    desc: "High-converting, fast-loading landing pages built to make a strong first impression and turn visitors into customers.",
    tags: ["Strategy", "UX/UI", "Responsive", "Conversion"],
    image: "/images/service-web.webp",
    metric: "3x faster launch",
    href: "/services/landing-pages",
  },
  {
    num: "02",
    title: "SaaS Development",
    desc: "End-to-end SaaS platforms and MVPs with authentication, dashboards, payments, and scalable architecture.",
    tags: ["Auth", "Dashboards", "Payments", "Scalable"],
    image: "/images/service-saas.webp",
    metric: "10+ MVPs shipped",
    href: "/services/saas-development",
  },
  {
    num: "03",
    title: "Web Apps",
    desc: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    tags: ["Frontend", "Backend", "Real-time", "API"],
    image: "/images/service-mobile.webp",
    metric: "99.9% uptime",
    href: "/services/web-applications",
  },
  {
    num: "04",
    title: "Full-Stack",
    desc: "Complete frontend and backend development — from APIs and databases to polished UI. Full stack, one team.",
    tags: ["APIs", "Databases", "UI", "DevOps"],
    image: "/images/service-web.webp",
    metric: "50+ projects delivered",
    href: "/services/nextjs-development",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const mobileStackRef = useRef(null);
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

      // Mobile: stacked cards scroll animation
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const cardsWrap = cardsWrapRef.current;
        const container = scrollContainerRef.current;
        if (!cardsWrap || !container) return;

        const getScrollDistance = () =>
          Math.max(0, cardsWrap.scrollWidth - container.offsetWidth);

        const scrollTween = gsap.to(cardsWrap, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinType: "transform",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          scrollTween.scrollTrigger?.kill();
          scrollTween.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        const scrollContainer = mobileScrollRef.current;
        const stack = mobileStackRef.current;
        if (!stack || !scrollContainer) return;

        const allCards = stack.querySelectorAll(".svc-mob-card");
        if (allCards.length === 0) return;

        // Measure first card's natural height, force it on every card
        const cardH = allCards[0].getBoundingClientRect().height;
        allCards.forEach((c) => {
          c.style.height = `${cardH}px`;
        });

        const serviceCards = stack.querySelectorAll(
          ".svc-mob-card:not(:last-child)",
        );
        const totalCards = serviceCards.length;
        const scrollDistance = (totalCards - 1) * cardH * 0.6;

        // Wrapper height: just enough for sticky to unstick when last card exits
        scrollContainer.style.height = `calc(100dvh + ${scrollDistance}px)`;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollContainer,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        serviceCards.forEach((card, i) => {
          const exitStart = i / totalCards;
          const exitEnd = (i + 1) / totalCards;
          tl.to(
            card,
            {
              y: "-100%",
              opacity: 0,
              ease: "power2.inOut",
              duration: exitEnd - exitStart,
            },
            exitStart,
          );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      return () => {
        mm?.revert?.();
      };
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
      {/* Header */}
      <div ref={headingRef} className="px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-4">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
              <span className="font-display not-italic mr-2" style={{ color: "var(--text-muted)" }}>
                02
              </span>
              Our Services
            </p>

            <h2 className="text-[clamp(2.5rem,7vw,72px)] leading-[0.92] tracking-[-0.03em] font-normal" style={{ color: "var(--text-primary)" }}>
              What we build{" "}
              <span
                className="block font-secondary-italic"
                style={{ color: "var(--text-muted)" }}
              >
                for founders.
              </span>
            </h2>
          </div>

          <ScrollReveal direction="right" delay={0.3}>
            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] pb-2" style={{ color: "var(--text-muted)" }}>
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
          </ScrollReveal>
        </div>
      </div>

      {/* Horizontal scroll area — pinned on desktop */}
      <div
        ref={scrollContainerRef}
        className="relative hidden lg:flex min-h-screen items-center overflow-clip"
      >
        <div ref={cardsWrapRef} className="flex gap-6 px-6 md:px-16 w-max">
          {services.map((s) => (
              <div
                key={s.num}
                className="service-card group relative flex-shrink-0 w-[65vw] lg:w-[45vw] xl:w-[38vw] rounded-2xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[420px] transition-colors duration-300"
                style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)" }}
              >
                {/* Ghost number */}
                <span
                  className="absolute top-6 right-8 text-[120px] md:text-[180px] font-display leading-none select-none pointer-events-none"
                  style={{ color: "var(--accent-glow)" }}
                  aria-hidden="true"
                >
                  {s.num}
                </span>

                {/* Top row: label + AI image */}
                <div className="relative z-10 mb-8">
                  <span className="text-[10px] tracking-[0.3em] font-bold uppercase mb-4 block" style={{ color: "var(--text-muted)" }}>
                    Service — {s.num}
                  </span>
                  <div className="w-full h-40 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                </div>

                {/* Title + description */}
                <div className="relative z-10 flex-1">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-display mb-3 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {s.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                    {s.metric}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: "var(--text-muted)" }}>
                    {s.desc}
                  </p>
                </div>

                {/* Tags + CTA */}
                <div className="relative z-10 mt-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em]"
                        style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold pb-1 transition-colors duration-300"
                    style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)" }}
                  >
                    Learn more
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
                  </Link>
                </div>
              </div>
          ))}

          {/* CTA card */}
          <div className="flex-shrink-0 w-[65vw] lg:w-[45vw] xl:w-[38vw] rounded-2xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[420px]" style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)" }}>
            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase block mb-10" style={{ color: "var(--text-muted)" }}>
                And then some
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display mb-5 leading-tight" style={{ color: "var(--text-primary)" }}>
                Something custom in mind?
              </h3>
              <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: "var(--text-muted)" }}>
                Every project begins with understanding your vision. Whether
                it's a landing page, SaaS, or a full-stack app — we'll build it
                tailored to your goals.
              </p>
            </div>

            <div className="relative z-10">
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
        </div>
      </div>

      {/* Mobile: stacked cards with scroll animation */}
      <div ref={mobileScrollRef} className="lg:hidden">
        <div
          ref={mobileStackRef}
          className="sticky top-0 h-screen supports-[height:100dvh]:h-dvh relative will-change-transform"
        >
          <div className="absolute inset-0 px-5 flex flex-col justify-center">
            {services.map((s, i) => (
                <div
                  key={s.num}
                  className="svc-mob-card absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-[2rem] overflow-hidden p-6 flex flex-col gap-4"
                  style={{
                    zIndex: services.length - i,
                    width: "calc(100vw - 40px)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  {/* Ghost number */}
                  <span
                    className="absolute top-4 right-5 text-[100px] font-display leading-none select-none pointer-events-none"
                    style={{ color: "var(--accent-glow)" }}
                    aria-hidden="true"
                  >
                    {s.num}
                  </span>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.3em] font-bold uppercase" style={{ color: "var(--text-muted)" }}>
                      Service — {s.num}
                    </span>
                  </div>

                  {/* AI image */}
                  <div className="w-full h-28 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>

                  <h3 className="text-[22px] font-secondary-italic leading-[1.1]" style={{ color: "var(--text-primary)" }}>
                    {s.title}
                  </h3>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {s.metric}
                  </p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {s.desc}
                  </p>

                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.15em]"
                          style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold pb-1 transition-colors"
                      style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)" }}
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
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
            ))}

            {/* CTA card */}
            <div
              className="svc-mob-card absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-[2rem] overflow-hidden p-6 flex flex-col gap-4"
              style={{ zIndex: 0, width: "calc(100vw - 40px)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}
            >
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase block" style={{ color: "var(--text-muted)" }}>
                And then some
              </span>
              <h3 className="text-[22px] font-secondary-italic leading-[1.1]" style={{ color: "var(--text-primary)" }}>
                Something custom in mind?
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Every project begins with understanding your vision. Whether
                it&apos;s a landing page, SaaS, or a full-stack app — we&apos;ll
                build it tailored to your goals.
              </p>

              <div className="mt-auto">
                <button
                  onClick={openCal}
                  className="inline-flex items-center justify-center flip-btn"
                  onMouseEnter={() => setCtaHovered(true)}
                  onMouseLeave={() => setCtaHovered(false)}
                >
                  <StaggerText
                    hovered={ctaHovered}
                    hoverColor="var(--accent)"
                    style={{ fontSize: 13, fontWeight: 400, color: "var(--accent)" }}
                  >
                    {"Book a Free Call"}
                  </StaggerText>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
