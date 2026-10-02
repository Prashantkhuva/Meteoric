"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { socialProfiles } from "@/data/social";
import { socialIcons } from "@/components/ui/social-icons";
import { openCalModal } from "@/components/ui/cal-modal-store";

const nextPaths = [
  {
    title: "Services",
    href: "/services",
    desc: "Landing pages, SaaS products, web apps, and full-stack builds — what we ship and how engagements run.",
  },
  {
    title: "Work",
    href: "/work",
    desc: "Recent projects with live links, scope, stacks, and outcomes.",
  },
  {
    title: "About",
    href: "/about",
    desc: "Who you would work with — founder-led, no account managers.",
  },
];

export default function Contact() {
  const openCal = useCallback(() => openCalModal(), []);

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
          Book a free 20-minute strategy call or email us directly. We&apos;ll
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

      {/* Social */}
      <section className="border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <p
            className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Elsewhere
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {socialProfiles.map((profile) => (
              <a
                key={profile.id}
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
            ))}
          </div>
        </div>
      </section>

      {/* Next paths */}
      <section className="border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <p
            className="uppercase tracking-[0.2em] text-xs font-bold mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Explore first
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {nextPaths.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 rounded-xl bg-[var(--bg-secondary, #0a0a0a)] border border-[var(--border-color)] hover:border-[var(--border-hover, rgba(255,255,255,0.12))] transition-all duration-300"
              >
                <h2 className="text-sm font-secondary-italic text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-2 leading-[1.3]">
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
