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
    href: "/services",
  },
  {
    num: "02",
    title: "SaaS Development",
    desc: "End-to-end SaaS platforms and MVPs with authentication, dashboards, payments, and scalable architecture.",
    tags: ["Auth", "Dashboards", "Payments", "Scalable"],
    icon: Monitor,
    href: "/services",
  },
  {
    num: "03",
    title: "Web Apps",
    desc: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    tags: ["Frontend", "Backend", "Real-time", "API"],
    icon: Code2,
    href: "/services",
  },
  {
    num: "04",
    title: "Full-Stack",
    desc: "Complete frontend and backend development — from APIs and databases to polished UI. Full stack, one team.",
    tags: ["APIs", "Databases", "UI", "DevOps"],
    icon: Layers,
    href: "/services",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const mobileStackRef = useRef(null);
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

    // Mobile: stacked cards scroll animation
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
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
    });

    mm.add("(max-width: 767px)", () => {
      const stack = mobileStackRef.current;
      if (!stack) return;

      const stackCards = stack.querySelectorAll(".svc-mob-card");
      if (stackCards.length === 0) return;

      const totalCards = stackCards.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: "top top",
          end: () => {
            const cardH = stackCards[0].getBoundingClientRect().height;
            return `+=${(totalCards - 1) * cardH * 0.6}`;
          },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            gsap.set(stack, { height: 0, overflow: "hidden" });
            const spacer = stack.parentElement;
            if (spacer?.classList.contains("pin-spacer")) {
              gsap.set(spacer, { height: 0, padding: 0, overflow: "hidden" });
            }
          },
          onEnterBack: () => {
            gsap.set(stack, { height: "100dvh", overflow: "" });
            const spacer = stack.parentElement;
            if (spacer?.classList.contains("pin-spacer")) {
              gsap.set(spacer, { clearProps: "all" });
            }
          },
        },
      });

      stackCards.forEach((card, i) => {
        const exitStart = i / totalCards;
        const exitEnd = (i + 1) / totalCards;
        tl.to(
          card,
          {
            y: "-100%",
            opacity: 0,
            scale: 0.95,
            ease: "power3.inOut",
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
              <div
                key={s.num}
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
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-white/30 border-b border-white/15 pb-1 group-hover:text-white/60 group-hover:border-white/30 transition-colors duration-300"
                  >
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
                  </Link>
                </div>
              </div>
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
      </div>

      {/* Mobile: stacked cards with scroll animation */}
      <div
        ref={mobileStackRef}
        className="md:hidden relative"
        style={{ height: "100dvh" }}
      >
        <div className="absolute inset-0 px-5 flex flex-col justify-center">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="svc-mob-card absolute inset-x-5 top-0 bottom-0 my-auto rounded-[2rem] overflow-hidden border border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl p-7 flex flex-col"
                style={{
                  height: "min(440px, 56dvh)",
                  zIndex: services.length - i,
                }}
              >
                {/* Ghost number */}
                <span
                  className="absolute top-4 right-5 text-[100px] font-display leading-none text-white/[0.02] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {s.num}
                </span>

                <div>
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-[10px] tracking-[0.3em] font-bold text-white/30 uppercase">
                      Service — {s.num}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center text-white/40">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-[28px] font-secondary-italic text-white leading-[1.1] mb-6">
                    {s.title}
                  </h3>
                  <p className="text-white/50 text-[13px] leading-relaxed max-w-[280px]">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mt-10 mb-8">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/35"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white/40 border-b border-white/[0.12] pb-1 hover:text-white/60 hover:border-white/25 transition-colors"
                  >
                    The full picture
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* CTA card */}
          <div
            className="svc-mob-card absolute inset-x-5 top-0 bottom-0 my-auto rounded-[2rem] overflow-hidden border border-[#EAEFFF]/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl p-7 flex flex-col"
            style={{
              height: "min(440px, 56dvh)",
              zIndex: 0,
            }}
          >
            <span
              className="absolute top-4 right-5 text-[100px] font-display leading-none text-[#EAEFFF]/[0.02] select-none pointer-events-none"
              aria-hidden="true"
            >
              05
            </span>

            <div>
              <span className="text-[10px] tracking-[0.3em] font-bold text-white/25 uppercase block mb-10">
                And then some
              </span>
              <h3 className="text-[28px] font-secondary-italic text-white leading-[1.1] mb-6">
                Something custom in mind?
              </h3>
              <p className="text-white/50 text-[13px] leading-relaxed max-w-[280px]">
                Every project begins with understanding your vision.
              </p>
            </div>

            <div className="mt-auto pt-10">
              <Link
                href="/#contact"
                className="inline-block bg-white text-black px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/90 transition-colors"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
