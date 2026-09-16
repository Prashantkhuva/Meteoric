"use client";

import { useState, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { Check, Loader2 } from "lucide-react";
import { createLead } from "@/lib/actions";
import useSectionAnimations from "@/hooks/useSectionAnimations";
import { trackEvent } from "@/lib/analytics/gtag";

export default function LeadCaptureSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);

  useSectionAnimations(
    sectionRef,
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const heading = headingRef.current;
      if (heading) {
        const split = new SplitText(heading, { type: "lines", linesClass: "split-line" });
        gsap.fromTo(split.lines,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.1, ease: "power3.out", duration: 0.5,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none reverse none",
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap.fromTo(
        contentRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.4,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    setError(false);

    const result = await createLead({
      name: "",
      email,
      services: "Lead Capture (Get Estimate)",
      details: `New lead via Get Estimate form. Email: ${email}`,
    });

    if (result?.error) {
      setError(result.error);
      setSending(false);
      return;
    }

    setSubmitted(true);
    setSending(false);

    trackEvent("contact_form_submit", {
      form_location: window.location.pathname,
    });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 sm:py-28 lg:py-32 overflow-hidden scroll-mt-24"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle_at_center, var(--accent-glow), transparent 70%)" }} />

      <div
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center"
      >
        <p className="uppercase tracking-[0.2em] text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Start a Project
        </p>
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
          Let&apos;s ship your next product
          <span className="block mt-1 font-secondary-italic font-normal" style={{ color: "var(--text-muted)" }}>
            SaaS platforms, landing pages, full-stack apps.
          </span>
        </h2>
        <p className="text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
          Drop your email and we&apos;ll send you a{" "}
          <span style={{ color: "var(--text-primary)" }}>scope, timeline, and price estimate</span>{" "}
          within 24 hours — free, no commitment required.
        </p>

        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{ background: "var(--accent-glow)", border: "1px solid var(--border-color)" }}
          >
            <Check size={16} className="text-green-400" />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Thanks! We&apos;ll be in touch within 24 hours.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              className="flex-1 w-full px-5 py-3 rounded-xl text-sm focus:outline-none transition-colors disabled:opacity-50"
              style={{ border: "1px solid var(--border-color)", background: "var(--accent-glow)", color: "var(--text-primary)" }}
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              style={{ background: "var(--accent)", color: "var(--accent-text)", boxShadow: "0 0 20px var(--accent-glow)" }}
            >
              {sending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <span className="text-sm">→</span>
              )}
              {sending ? "Sending..." : "Get Estimate"}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="text-red-400/80 text-xs text-center mt-4">
            Something went wrong. Please email us directly at{" "}
            <a
              href="mailto:contact@withmeteoric.com"
              data-no-magnetic
              className="underline hover:text-red-300"
            >
              contact@withmeteoric.com
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
