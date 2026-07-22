"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { Star, BadgeCheck, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getApprovedReviews } from "@/lib/actions";
import ReviewFormModal from "./ReviewFormModal";
import FaqAccordion from "./FaqAccordion";
import { homeFaqs } from "@/data/faqs";

const fallbackTestimonials = [
  {
    quote:
      "Meteoric redesigned our entire SaaS dashboard and the result was exceptional — cleaner UX, faster load times, and our users actually noticed the difference. The team understood our product vision from day one.",
    author: "Rohan Mehta",
    role: "CTO, Finlytix",
    project: "Finlytix Dashboard Redesign",
    rating: 5,
  },
  {
    quote:
      "Working with Meteoric felt more like a partnership than a vendor relationship. They understood our B2B SaaS vision from day one and brought UX ideas we hadn't even considered. Our monthly recurring revenue grew 40% in the first quarter after launch.",
    author: "Sarah Mitchell",
    role: "CEO, LaunchBright",
    project: "LaunchBright",
    rating: 5,
  },
  {
    quote:
      "We needed a complete brand website redesign and got way more than we expected. The attention to detail in both design and performance is rare to find. Lighthouse scores went from 62 to 98, and our bounce rate dropped by half.",
    author: "James Park",
    role: "Product Lead, Stellar Labs",
    project: "Stellar Labs",
    rating: 5,
  },
];

function ReviewCard({ t }) {
  return (
    <div className="w-[380px] shrink-0 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-6 flex flex-col gap-4 mx-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={11}
            className={
              i < t.rating
                ? "text-[#EAEFFF] fill-[#EAEFFF] drop-shadow-[0_0_4px_rgba(234,239,255,0.3)]"
                : "text-white/10"
            }
          />
        ))}
      </div>

      <p className="text-[13px] text-white/70 leading-[1.7] line-clamp-5 font-[350]">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-auto pt-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-white/50 text-[11px] font-semibold border border-white/10 shrink-0">
          {t.author.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white/90 text-xs font-medium truncate">{t.author}</p>
            {t.isVerified && <BadgeCheck size={11} className="text-[#EAEFFF] shrink-0" />}
          </div>
          <p className="text-white/30 text-[11px] truncate mt-0.5">
            {t.role}
            {t.role && t.company ? ", " : ""}
            {t.company && <span className="text-white/40">{t.company}</span>}
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

  const displayReviews = reviews
    ? [...reviews, ...fallbackTestimonials]
    : fallbackTestimonials;

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
          }))
        );
      }
    }
    load();
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const headerHeading = headerRef.current?.querySelector("h2");
    if (headerHeading) {
      const split = new SplitText(headerHeading, { type: "lines", linesClass: "split-line" });
      gsap.fromTo(split.lines,
        { y: 50, opacity: 0, rotateX: 15 },
        {
          y: 0, opacity: 1, rotateX: 0,
          stagger: 0.12, ease: "power3.out", duration: 0.6,
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none reverse none" },
        },
      );
    }

    const fadeUp = (target, trigger, opts = {}) =>
      gsap.fromTo(target, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, ease: "power2.out", duration: 0.35,
        scrollTrigger: { trigger, start: "top 88%", toggleActions: "play none reverse none", ...opts },
      });

    fadeUp(faqHeaderRef.current, faqHeaderRef.current);
    fadeUp(faqListRef.current, faqListRef.current);
  }, { scope: sectionRef });

  return (
    <>

      <section ref={sectionRef} id="reviews" className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,239,255,0.03),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(234,239,255,0.015),transparent_60%)]" />

        <div className="relative z-10">
          {/* ── Header ── */}
          <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
            <p
              className="text-white/60 uppercase tracking-[0.2em] text-xs mb-5"
            >
              <span className="font-display text-white/40 not-italic mr-2">05</span>
              Client Stories
              </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-3xl md:text-5xl font-secondary-italic text-white tracking-tight leading-[1.1]">
                Trusted by teams
                <br />
                <span className="text-white/40">who build the future.</span>
              </h2>
            </div>
          </div>

          {/* ── Marquee Row 1 — scrolls left ── */}
          <ScrollReveal direction="left">
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mb-4">
              <div className="group flex overflow-hidden p-2 [--gap:0.75rem] [gap:var(--gap)] flex-row [--duration:40s]">
                <div className="flex w-max shrink-0 justify-around [gap:var(--gap)] animate-marquee-left flex-row group-hover:[animation-play-state:paused]">
                  {[...Array(4)].map((_, setIndex) =>
                    displayReviews.map((t, i) => (
                      <ReviewCard key={`r1-${setIndex}-${i}`} t={t} />
                    ))
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black to-transparent z-10" />
            </div>
          </ScrollReveal>

          {/* ── Marquee Row 2 — scrolls right ── */}
          <ScrollReveal direction="right">
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mb-12">
              <div className="group flex overflow-hidden p-2 [--gap:0.75rem] [gap:var(--gap)] flex-row [--duration:40s]">
                <div className="flex w-max shrink-0 justify-around [gap:var(--gap)] animate-marquee-right flex-row group-hover:[animation-play-state:paused]">
                  {[...Array(4)].map((_, setIndex) =>
                    displayReviews.map((t, i) => (
                      <ReviewCard key={`r2-${setIndex}-${i}`} t={t} />
                    ))
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black to-transparent z-10" />
            </div>
          </ScrollReveal>

          {/* ── Review CTA ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <ScrollReveal direction="up">
              <div
                className="inline-flex items-center gap-3"
              >
                <span className="text-white/40 text-xs uppercase tracking-wider">
                  Worked with us?
                </span>
                <button
                  onClick={() => setShowForm(true)}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.08] text-white/40 text-xs hover:text-white hover:border-white/20 hover:bg-white/[0.03] transition-all duration-200"
                >
                  <Sparkles size={11} className="text-[#EAEFFF]/50 group-hover:text-[#EAEFFF] transition-colors" />
                  Leave a review
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-28">
            <div className="max-w-4xl">
              <div ref={faqHeaderRef}>
                <p
                  className="text-white/60 uppercase tracking-[0.2em] text-xs mb-5"
                >
                  FAQs
                </p>
                <h2 className="text-2xl md:text-4xl font-secondary-italic text-white tracking-tight mb-10 max-w-2xl">
                  Common questions
                  <span className="text-white/25"> about working with us.</span>
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
