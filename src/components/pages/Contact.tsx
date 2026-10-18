"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { socialProfiles } from "@/data/social";
import { socialIcons } from "@/components/ui/social-icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { openCalModal } from "@/components/ui/cal-modal-store";
import { trackEvent } from "@/lib/analytics/gtag";
import type { Faq } from "@/data/types";

const nextSteps = [
  {
    title: "1. You reach out",
    desc: "Book a short video call or email us — either way your message goes straight to Prashant. No account managers in between.",
  },
  {
    title: "2. We talk it through",
    desc: "On the call we cover scope, stack, and timeline. Straight answers, no pressure, no obligation.",
  },
  {
    title: "3. If it is a fit",
    desc: "Pricing is fixed and agreed after the scoping call, then work runs in 10-day sprint cycles with weekly demos.",
  },
];

const projectTypes = [
  {
    title: "SaaS MVPs",
    href: "/saas-mvp-development",
    desc: "MVPs for startups — auth, billing, and the core product loop, shipped.",
  },
  {
    title: "Landing pages",
    href: "/startup-landing-page-design",
    desc: "Launch landing pages built to convert, not just look good.",
  },
  {
    title: "Custom web apps",
    href: "/web-app-development",
    desc: "Full-stack web applications with real databases and auth.",
  },
  {
    title: "Next.js builds",
    href: "/services/nextjs-development",
    desc: "Marketing sites and products on Next.js — SEO, speed, and clean code.",
  },
];

export default function Contact({ faqs }: { faqs: Faq[] }) {
  const openCal = useCallback(() => {
    trackEvent("booking_click", { button_location: "/contact" });
    openCalModal();
  }, []);

  return (
    <div
      className="min-h-screen text-[var(--text-primary)]"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-16 md:pb-20">
        <span
          className="text-[var(--accent)]/40 uppercase tracking-[0.3em] text-xs font-bold block mb-6"
        >
          Contact
        </span>
        <h1 className="text-4xl md:text-6xl font-display tracking-tight leading-[1.05] mb-5">
          Let&apos;s talk about your project
        </h1>
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Book a free short video call or email us directly. We&apos;ll
          talk through your scope, stack, and timeline — no pressure, straight
          answers.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={openCal}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-11 gap-2 border-0 px-6 text-sm font-medium shadow-none hover:opacity-85 active:scale-[0.98]"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            Book a Free Strategy Call
          </button>
          <a
            href="mailto:contact@withmeteoric.com"
            data-no-magnetic
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-11 gap-2 px-6 text-sm font-medium"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <Mail size={15} aria-hidden="true" />
            contact@withmeteoric.com
          </a>
        </div>

        <p
          className="mt-5 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Prefer the full booking page?{" "}
          <Link
            href="/booking"
            data-no-magnetic
            className="underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
          >
            Open scheduling
            <ArrowUpRight size={12} className="inline ml-0.5" aria-hidden="true" />
          </Link>
        </p>
      </section>

      {/* What happens next */}
      <section className="border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <ScrollReveal direction="up">
            <p
              className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              What happens next
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-4">
            {nextSteps.map((step, i) => (
              <ScrollReveal key={step.title} direction="up" delay={0.08 * i}>
                <div className="p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)]">
                  <h2
                    className="text-sm font-secondary-italic mb-2 leading-[1.3]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we take on */}
      <section className="border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <ScrollReveal direction="up">
            <p
              className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              What we take on
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {projectTypes.map((item, i) => (
              <ScrollReveal key={item.href} direction="up" delay={0.08 * i}>
                <Link
                  href={item.href}
                  className="group block p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)] hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300"
                >
                  <h2
                    className="text-sm font-secondary-italic mb-2 leading-[1.3]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.desc}
                  </p>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    Read more →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Prefer email */}
      <section className="border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <ScrollReveal direction="up" className="max-w-2xl">
            <p
              className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Prefer email?
            </p>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Write to{" "}
              <a
                href="mailto:contact@withmeteoric.com"
                className="underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                contact@withmeteoric.com
              </a>
              . A short note with your project type, rough timeline, and budget
              range gets the most useful first reply.
            </p>
            <a
              href="mailto:contact@withmeteoric.com"
              data-no-magnetic
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-11 gap-2 px-6 text-sm font-medium"
              style={{
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <Mail size={15} aria-hidden="true" />
              Email us
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="border-t border-[var(--border-color)]">
          <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
            <ScrollReveal direction="up">
              <p
                className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Frequently asked questions
              </p>
            </ScrollReveal>
            <div className="max-w-[700px]">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Elsewhere */}
      <section className="border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <ScrollReveal direction="up">
            <p
              className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Elsewhere
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {socialProfiles.map((profile, i) => (
              <ScrollReveal
                key={profile.id}
                direction="up"
                delay={0.05 * i}
              >
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={profile.label}
                  data-no-magnetic
                  className="text-sm inline-flex items-center justify-center gap-1.5 min-h-6 min-w-6 transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {socialIcons[profile.id] || (
                    <ArrowUpRight size={16} aria-hidden="true" />
                  )}
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
