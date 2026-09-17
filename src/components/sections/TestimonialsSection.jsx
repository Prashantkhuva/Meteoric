"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { Star, BadgeCheck, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getApprovedReviews } from "@/lib/actions";
import FaqAccordion from "./FaqAccordion";
import { homeFaqs } from "@/data/faqs";
import useSectionAnimations from "@/hooks/useSectionAnimations";

// Lazy — ReviewFormModal pulls framer-motion; only load it when the review
// form is actually opened so the homepage initial bundle stays lean.
const ReviewFormModal = dynamic(() => import("./ReviewFormModal"), {
  ssr: false,
  loading: () => null,
});

const fallbackTestimonials = [];

function ReviewCard({ t }) {
  return (
    <div className="w-[400px] shrink-0 rounded-[24px] p-8 flex flex-col gap-5 mx-3" style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)" }}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < t.rating
                ? "fill-[var(--accent)] drop-shadow-[0_0_4px_var(--accent-glow)]"
                : ""
            }
            style={i < t.rating ? { color: "var(--accent)" } : { color: "var(--border-color)" }}
          />
        ))}
      </div>

      <p className="text-[20px] leading-[1.5] font-medium" style={{ color: "var(--text-primary)" }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-auto pt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-xs font-semibold shrink-0" style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
          {t.author.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {t.author}
            </p>
            {t.isVerified && (
              <BadgeCheck size={12} className="shrink-0" style={{ color: "var(--accent)" }} />
            )}
          </div>
          <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
            {t.role}
            {t.role && t.company ? ", " : ""}
            {t.company && <span style={{ color: "var(--text-muted)" }}>{t.company}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const faqHeaderRef = useRef(null);
  const faqListRef = useRef(null);

  const displayReviews =
    reviews && reviews.length > 0 ? reviews : fallbackTestimonials;

  useEffect(() => {
    async function load() {
      const result = await getApprovedReviews();
      if (result.success && result.data.length > 0) {
        setReviews(
          result.data.map((r) => ({
            quote: r.content,
            author: r.name,
            role: r.role,
            project: r.project,
            rating: r.rating,
            company: r.company,
            isVerified: r.is_verified,
            createdAt: r.created_at,
          })),
        );
      }
    }
    load();
  }, []);

  useSectionAnimations(sectionRef, () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const headerHeading = headerRef.current?.querySelector("h2");
    if (headerHeading) {
      const split = new SplitText(headerHeading, {
        type: "lines",
        linesClass: "split-line",
      });
      gsap.fromTo(
        split.lines,
        { y: 50, opacity: 0, rotateX: 15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.12,
          ease: "power3.out",
          duration: 0.6,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        },
      );
    }

    const fadeUp = (target, trigger, opts = {}) =>
      gsap.fromTo(
        target,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.35,
          scrollTrigger: {
            trigger,
            start: "top 88%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
            ...opts,
          },
        },
      );

    fadeUp(faqHeaderRef.current, faqHeaderRef.current);
    fadeUp(faqListRef.current, faqListRef.current);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="reviews"
        className="relative py-24 sm:py-28 lg:py-32 overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle_at_30%_20%, var(--accent-glow), transparent 60%), radial-gradient(circle_at_70%_80%, var(--accent-glow), transparent 60%)" }} />

        <div className="relative z-10">
          {/* ── Header ── */}
          <div
            ref={headerRef}
            className="max-w-7xl mx-auto px-6 md:px-12 mb-16"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-3xl md:text-5xl font-display tracking-tight leading-[1.1]" style={{ color: "var(--text-primary)" }}>
                Trusted by teams
                <br />
                <span style={{ color: "var(--text-muted)" }}>who build the future.</span>
              </h2>
            </div>
          </div>

          {/* ── Marquee Row 1 — scrolls left ── */}
          <ScrollReveal direction="left">
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mb-4">
              <div className="group flex overflow-hidden p-2">
                <div
                  className="flex w-max shrink-0 animate-marquee-left flex-row group-hover:[animation-play-state:paused]"
                  style={{ "--sets": 6 }}
                >
                  {[...Array(6)].map((_, setIndex) =>
                    displayReviews.map((t, i) => (
                      <ReviewCard key={`r1-${setIndex}-${i}`} t={t} />
                    )),
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 z-10" style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 z-10" style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />
            </div>
          </ScrollReveal>

          {/* ── Marquee Row 2 — scrolls right ── */}
          <ScrollReveal direction="right">
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mb-12">
              <div className="group flex overflow-hidden p-2">
                <div
                  className="flex w-max shrink-0 animate-marquee-right flex-row group-hover:[animation-play-state:paused]"
                  style={{ "--sets": 6 }}
                >
                  {[...Array(6)].map((_, setIndex) =>
                    displayReviews.map((t, i) => (
                      <ReviewCard key={`r2-${setIndex}-${i}`} t={t} />
                    )),
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 z-10" style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 z-10" style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />
            </div>
          </ScrollReveal>

          {/* ── Review CTA ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Worked with us?
                </span>
                <button
                  onClick={() => setShowForm(true)}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all duration-200"
                  style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
                >
                  <Sparkles
                    size={11}
                    className="transition-colors"
                    style={{ color: "var(--accent-dim)" }}
                  />
                  Leave a review
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* ── CTA after social proof ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center text-center py-12 px-6 rounded-[24px]" style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)" }}>
                <h3 className="text-2xl md:text-4xl font-display tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
                  Ready to build something{" "}
                  <span style={{ color: "var(--text-muted)" }}>great?</span>
                </h3>
                <p className="text-sm md:text-base max-w-md mb-8" style={{ color: "var(--text-secondary)" }}>
                  Book a free strategy call and let&apos;s discuss your project,
                  timeline, and how we can help.
                </p>
                <button
                  onClick={() => {
                    import("@calcom/embed-react").then(
                      async ({ getCalApi }) => {
                        const cal = await getCalApi({
                          namespace: "let-s-build",
                        });
                        cal("modal", { calLink: "prashantkhuva/let-s-build" });
                      },
                    );
                  }}
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium transition-all duration-300"
                  style={{ background: "var(--accent)", color: "var(--accent-text)" }}
                >
                  Book a Free Strategy Call
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-28">
            <div className="max-w-4xl">
              <div ref={faqHeaderRef}>
                <h2 className="text-2xl md:text-4xl font-display tracking-tight mb-10 max-w-2xl" style={{ color: "var(--text-primary)" }}>
                  Common questions
                  <span style={{ color: "var(--text-muted)" }}> about working with us.</span>
                </h2>
              </div>

              <div ref={faqListRef}>
                <FaqAccordion items={homeFaqs} />
              </div>
            </div>
          </div>
        </div>

        <ReviewFormModal open={showForm} onClose={() => setShowForm(false)} />
      </section>
    </>
  );
}
