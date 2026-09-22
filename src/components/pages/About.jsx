"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-setup";
import { SplitText } from "gsap/SplitText";
import siteStats from "@/data/site-stats";

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

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Prashantkhuva",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/withmeteoric",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/prashantkhuva_",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/officialmeteoric/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function AboutPage({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null);
  const headingRef = useRef(null);
  const bioRef = useRef(null);
  const valuesRef = useRef(null);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

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

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = bioRef.current?.querySelectorAll(".bio-reveal");
      if (!items) return;
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 80%",
            toggleActions: "play reset play reset",
          },
        },
      );
    },
    { scope: bioRef },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = valuesRef.current?.querySelectorAll(".value-card");
      if (!cards) return;
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play reset play reset",
          },
        },
      );
    },
    { scope: valuesRef },
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
            Prashant Khuva
          </h1>
          <p
            className="text-[15px] max-w-xs leading-[1.4]"
            style={{ color: "#171717" }}
          >
            Founder of Meteoric — web &amp; product development studio for
            startups and SaaS.
          </p>
        </div>
      </section>

      {/* Bio + Photo */}
      <section
        ref={bioRef}
        className="relative max-w-6xl mx-auto px-6 md:px-12 pb-16 md:pb-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Photo */}
          <div className="bio-reveal relative">
            <div
              className="relative overflow-hidden rounded-2xl aspect-[4/5]"
              style={{ background: "var(--bg-surface)" }}
            >
              <img
                src="/prashant.png"
                alt="Prashant Khuva"
                loading="eager"
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
                Founder &amp; Product Builder
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 md:pt-8">
            <div className="bio-reveal space-y-4 text-[15px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
              <p>
                Meteoric is a{" "}
                <Link
                  href="/"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  web development agency
                </Link>{" "}
                that partners with founders to design, develop, and launch
                modern web products that actually convert.
              </p>
              <p>
                I started Meteoric to close the gap between what founders
                envision and what agencies deliver. No bloat, no
                over-engineering — just clean, production-ready work that ships
                on time.
              </p>
              <p>
                Every project is built with the same care as if it were our own.
                From{" "}
                <Link
                  href="/services"
                  className="underline underline-offset-4 transition-all duration-200"
                  style={{
                    color: "var(--text-secondary)",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  landing pages to full SaaS platforms
                </Link>
                , we treat your product like a startup, not a ticket queue.
              </p>
            </div>

            {/* Stats */}
            <div
              className="bio-reveal grid grid-cols-2 gap-6 py-8"
              style={{
                borderTop: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              {siteStats.map((s, i) => (
                <div
                  key={s.label}
                  className={
                    i % 2 !== 0
                      ? "pl-4 border-l border-[color:var(--border-color)]"
                      : ""
                  }
                >
                  <p
                    className="text-lg sm:text-xl md:text-3xl font-display mb-1 whitespace-nowrap"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-[11px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact + Social */}
            <div className="bio-reveal flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:contact@withmeteoric.com"
                  data-no-magnetic
                  className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  contact@withmeteoric.com
                  <ArrowUpRight size={12} />
                </a>
                <a
                  href="https://cal.com/prashantkhuva/let-s-build"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-no-magnetic
                  className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Book a strategy call
                  <ArrowUpRight size={12} />
                </a>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-no-magnetic
                    className="transition-colors duration-300"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {link.icon}
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
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section
        className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <div ref={valuesRef}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-14">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              Our Principles
            </h2>
            <p
              className="text-[15px] max-w-xs leading-[1.4]"
              style={{ color: "#171717" }}
            >
              The values that guide every decision and every line of code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((item) => (
              <div
                key={item.num}
                className="value-card group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1"
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

      {/* CTA */}
      <section
        className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <p
          className="text-[11px] uppercase tracking-[0.2em] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Ready to build?
        </p>
        <h2
          className="text-3xl md:text-5xl font-display tracking-tight mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          Let&apos;s ship something great.
        </h2>
        <button
          onClick={openCal}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
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
      </section>
    </div>
  );
}
