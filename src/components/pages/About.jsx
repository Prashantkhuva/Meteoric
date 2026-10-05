"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-setup";
import { SplitText } from "gsap/SplitText";
import { founderProfiles } from "@/data/organization";
import { socialIcons } from "@/components/ui/social-icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { openCalModal } from "@/components/ui/cal-modal-store";

gsap.registerPlugin(SplitText);

const values = [
  {
    num: "01",
    title: "Quality Over Quantity",
    description:
      "Every project gets full attention. We don't juggle dozens of clients — we pick the right ones and ship work we're proud of.",
  },
  {
    num: "02",
    title: "Direct Partnership",
    description:
      "No account managers, no layers. You work directly with the founder — from the first conversation to the final deploy.",
  },
  {
    num: "03",
    title: "Ship Mentality",
    description:
      "We build for production, not perfection. Clean code, clear timelines, and real results that go live.",
  },
];

/** Verified https URL only — placeholders (url: null) never render. */
const visibleProfiles = founderProfiles.filter(
  (profile) => typeof profile.url === "string" && profile.url.startsWith("https://"),
);

const glance = [
  {
    term: "Meteoric founded",
    definition: "2026",
  },
  {
    term: "Prashant's experience",
    definition: "Full-stack developer — previously built FullStack Craft",
  },
  {
    term: "Based in",
    definition: "India — serving clients worldwide",
  },
  {
    term: "Working model",
    definition: "Founder-led — clients work directly with Prashant",
  },
  {
    term: "Cadence",
    definition: "10-day sprint cycles with weekly demos",
  },
  {
    term: "Core stack",
    definition: "Next.js, React, Node.js, Supabase, Tailwind CSS",
  },
];

export default function AboutPage({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null);
  const headingRef = useRef(null);

  const openCal = useCallback(() => openCalModal(), []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        headingRef.current
          ?.querySelectorAll(".split-line")
          .forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
          });
        return;
      }

      const split = new SplitText(headingRef.current, {
        type: "lines",
        linesClass: "split-line",
        aria: "manual",
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
            toggleActions: "play reset play reset",
          },
        },
      );
    },
    { scope: headingRef },
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero — Atomik heading */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-8 md:pb-12">
        <div
          ref={headingRef}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6"
        >
          <h1
            className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]"
            style={{ color: "var(--text-primary)" }}
          >
            Prashant Khuva, founder of Meteoric
          </h1>
          <p
            className="text-[15px] max-w-xs leading-[1.4]"
            style={{ color: "var(--text-muted)" }}
          >
            Meteoric is a web &amp; product development studio for startups and
            SaaS, founded in 2026.
          </p>
        </div>
      </section>

      {/* Bio + Photo */}
      <section
        className="relative max-w-6xl mx-auto px-6 md:px-12 pb-16 md:pb-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Photo */}
          <ScrollReveal direction="left" className="relative">
            <div
              className="relative overflow-hidden rounded-2xl aspect-[4/5]"
              style={{ background: "var(--bg-surface)" }}
            >
              <Image
                src="/prashant.png"
                alt="Prashant Khuva, founder of Meteoric"
                width={400}
                height={500}
                priority
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: "top center" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{ background: "linear-gradient(to top, var(--text-primary) 10%, transparent 100%)", opacity: 0.06 }}
              />
            </div>
            <div
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                border: "1px solid var(--border-color)",
                background: "var(--nav-bg)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="text-[11px] font-medium tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                Founder &amp; Full-Stack Developer
              </span>
            </div>
          </ScrollReveal>

          {/* Content */}
          <div className="flex flex-col gap-8 md:pt-8">
            <h2
              className="text-[11px] uppercase tracking-[0.1em] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              What Meteoric does
            </h2>
            <ScrollReveal direction="up" className="space-y-4 text-[15px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
              <p>
                Meteoric is a{" "}
                <Link
                  href="/services"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  web development studio
                </Link>{" "}
                that designs, builds, and launches marketing sites, landing
                pages, MVPs, SaaS platforms, and full-stack web apps.
              </p>
              <p>
                It is for founders and small product teams who want to work
                directly with the engineer building their product — no account
                managers, no agency layers. Projects run in 10-day sprint
                cycles with weekly demos and fixed pricing agreed after a
                scoping call.
              </p>
              <p>
                Meteoric was founded in 2026 by{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  Prashant Khuva
                </strong>
                , a full-stack developer based in India who previously built
                FullStack Craft. Clients work with Prashant from the first
                strategy call to the final deploy.
              </p>
              <p>
                Typical work spans{" "}
                <Link
                  href="/saas-mvp-development"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  SaaS MVPs
                </Link>
                ,{" "}
                <Link
                  href="/startup-landing-page-design"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  launch landing pages
                </Link>
                , and{" "}
                <Link
                  href="/web-app-development"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  custom web apps
                </Link>
                .{" "}
                <Link
                  href="/work"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  See the work
                </Link>{" "}
                or{" "}
                <Link
                  href="/case-studies"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  read the case studies
                </Link>
                .
              </p>
            </ScrollReveal>

            {/* At a glance */}
            <ScrollReveal
              direction="up"
              className="py-8"
              style={{
                borderTop: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <h2
                className="text-[11px] uppercase tracking-[0.1em] font-medium mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                At a glance
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {glance.map((row) => (
                  <div key={row.term}>
                    <dt
                      className="text-[11px] uppercase tracking-[0.1em] mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {row.term}
                    </dt>
                    <dd
                      className="text-[15px] leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>

            {/* Contact + Social */}
            <ScrollReveal direction="up" className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:contact@withmeteoric.com"
                  data-no-magnetic
                  className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5 min-h-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  contact@withmeteoric.com
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
                <Link
                  href="/booking"
                  data-no-magnetic
                  className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5 min-h-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  Book a free strategy call
                  <ArrowUpRight size={12} aria-hidden="true" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {visibleProfiles.map((profile) => (
                  <a
                    key={profile.id}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={profile.label}
                    data-no-magnetic
                    className="inline-flex items-center justify-center min-h-6 min-w-6 transition-colors duration-300"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {socialIcons[profile.id] || (
                      <ArrowUpRight size={16} aria-hidden="true" />
                    )}
                  </a>
                ))}
              </div>

              <button
                onClick={openCal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85 w-fit"
                style={{
                  background: "var(--text-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                Book a call
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 12 12"
                  className="size-2 -rotate-90 transition-transform duration-150 group-hover:translate-x-px"
                >
                  <path
                    fill="currentColor"
                  d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z"
                />
              </svg>
            </button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section
        className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-14">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              Our Principles
            </h2>
            <p
              className="text-[15px] max-w-xs leading-[1.4]"
              style={{ color: "var(--text-muted)" }}
            >
              The values that guide every decision and every line of code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((item, i) => (
              <ScrollReveal key={item.num} direction="up" delay={0.1 * i}>
                <div
                  className="group relative h-full p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px var(--accent-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    className="text-[11px] font-mono tracking-wider block mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.num}
                  </span>
                  <h3
                    className="text-lg font-medium mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.7]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section
          className="relative max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-14">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="py-6"
                style={{ borderTop: "1px solid var(--border-color)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                  aria-expanded={openFaq === i}
                >
                  <span
                    className="text-base md:text-lg font-medium pr-4 transition-colors duration-200"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                    style={{
                      border: "1px solid var(--border-color)",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M5 1v8M1 5h8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </svg>
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: openFaq === i ? "1fr" : "0fr",
                    transition:
                      "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      className="text-[15px] leading-[1.8] pr-8"
                      style={{
                        color: "var(--text-secondary)",
                        opacity: openFaq === i ? 1 : 0,
                        transition:
                          "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.05s",
                        paddingTop: openFaq === i ? "16px" : "0",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
