"use client";

import { useState, lazy, Suspense, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/gtag";
import siteStats from "@/data/site-stats";

const RequestModal = lazy(
  () => import("@/components/layout/NavBar/RequestModal"),
);

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
  { label: "GitHub", href: "https://github.com/Prashantkhuva" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/withmeteoric" },
  { label: "X", href: "https://x.com/prashantkhuva_" },
  { label: "Instagram", href: "https://www.instagram.com/officialmeteoric/" },
];

export default function AboutPage({ faqs = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — Photo */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]" style={{ background: "#0a0a0a" }}>
              <img
                src="/prashant.png"
                alt="Prashant Khuva"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }} />
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-[11px] font-medium tracking-wide" style={{ color: "var(--text-secondary)" }}>
                Founder & Product Builder
              </span>
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex flex-col gap-8 md:pt-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
                Prashant Khuva — Founder of Meteoric
              </h1>
              <p className="text-lg md:text-xl" style={{ color: "var(--text-secondary)" }}>
                Web & Product Development Studio
              </p>
            </div>

            <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
              <p>
                Meteoric is a{" "}
                <Link href="/" className="underline underline-offset-4 transition-all duration-200" style={{ color: "var(--text-secondary)", textDecorationColor: "rgba(255,255,255,0.2)" }}>
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
                <Link href="/services" className="underline underline-offset-4 transition-all duration-200" style={{ color: "var(--text-secondary)", textDecorationColor: "rgba(255,255,255,0.2)" }}>
                  landing pages to full SaaS platforms
                </Link>
                , we treat your product like a startup, not a ticket queue.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-8" style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
              {siteStats.map((s, i) => (
                <div key={s.label} className={i !== 0 ? "pl-4" : ""} style={i !== 0 ? { borderLeft: "1px solid var(--border-color)" } : {}}>
                  <p className="text-3xl md:text-4xl font-display mb-1" style={{ color: "var(--text-primary)" }}>
                    {s.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--text-muted)" }}>
                Let&apos;s work together
              </p>
              <div className="flex flex-col gap-2">
                <a href="mailto:contact@withmeteoric.com" data-no-magnetic className="text-sm transition-colors duration-200" style={{ color: "var(--text-muted)" }}>
                  contact@withmeteoric.com
                </a>
                <a href="mailto:contact@withmeteoric.com" data-no-magnetic className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5" style={{ color: "var(--text-muted)" }} onClick={() => trackEvent("whatsapp_click", { click_location: "/about" })}>
                  WhatsApp
                  <ArrowUpRight size={12} />
                </a>
                <a href="https://cal.com/prashantkhuva/let-s-build" target="_blank" rel="noopener noreferrer" data-no-magnetic className="text-sm transition-colors duration-200 inline-flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  Book a strategy call
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" data-no-magnetic className="text-xs uppercase tracking-[0.15em] transition-colors duration-300" style={{ color: "var(--text-muted)" }}>
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div>
              <button
                onClick={openCal}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-all duration-300"
                style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
              >
                Book a Free Strategy Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="relative max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28" style={{ borderTop: "1px solid var(--border-color)" }}>
          <h2 className="text-3xl md:text-5xl font-display tracking-tight mb-14" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6" style={{ borderTop: "1px solid var(--border-color)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-base md:text-lg font-medium pr-4 transition-colors duration-200" style={{ color: "var(--text-secondary)" }}>
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                    style={{ border: "1px solid var(--border-color)", transform: openFaq === i ? "rotate(45deg)" : "none" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--text-muted)" }} />
                    </svg>
                  </span>
                </button>
                <div style={{ display: "grid", gridTemplateRows: openFaq === i ? "1fr" : "0fr", transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <div style={{ overflow: "hidden" }}>
                    <p className="text-[15px] leading-[1.8] pr-8" style={{ color: "var(--text-secondary)", opacity: openFaq === i ? 1 : 0, transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.05s", paddingTop: openFaq === i ? "16px" : "0" }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Suspense fallback={null}>
        <RequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Suspense>

      {/* How We Work */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28" style={{ borderTop: "1px solid var(--border-color)" }}>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight mb-14" style={{ color: "var(--text-primary)" }}>
          Our Principles
        </h2>
        <div className="space-y-0">
          {values.map((item) => (
            <div key={item.num} className="py-10" style={{ borderTop: "1px solid var(--border-color)" }}>
              <div className="flex gap-6 md:gap-10">
                <span className="text-4xl md:text-5xl font-display leading-none mt-1 shrink-0" style={{ color: "rgba(255,255,255,0.06)" }}>
                  {item.num}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.8] max-w-xl" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
