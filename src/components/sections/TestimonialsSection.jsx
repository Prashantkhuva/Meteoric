"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, BadgeCheck, Sparkles, Globe, Zap } from "lucide-react";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";
import { getApprovedReviews } from "@/lib/actions";
import ReviewFormModal from "./ReviewFormModal";

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

const faqs = [
  {
    question: "What's your typical development process?",
    answer:
      "We start with a discovery call to understand your vision and requirements. Then we move through design direction, development sprints, and finally launch. The entire process is transparent with weekly updates and a clear timeline.",
  },
  {
    question: "How long does it take to build a website or SaaS?",
    answer:
      "Landing pages typically take 3–7 days. Web applications range from 2–6 weeks depending on complexity. SaaS products take 4–10 weeks. We'll give you a precise timeline after our discovery call.",
  },
  {
    question: "Do you only work with MERN stack?",
    answer:
      "MERN is our core stack, but we're flexible. We've worked with Appwrite, Supabase, various databases, and can adapt to your existing tech stack if needed.",
  },
  {
    question: "What happens after launch? Do you provide support?",
    answer:
      "Yes. We include post-launch support for bug fixes, tweaks, and guidance. We don't disappear after delivery — we treat every product as a long-term partnership.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a free strategy call using the button below. We'll discuss your project, give you a timeline and estimate, and if we're a good fit, we'll start within the week.",
  },
];

const trustStats = [
  { value: "12", label: "Projects", icon: Globe },
  { value: "100%", label: "On-Time", icon: Zap },
  { value: "5★", label: "Rating", icon: Star },
  { value: "10d", label: "Avg Sprint", icon: Zap },
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
  const [openFaq, setOpenFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const faqSchema = buildFaqJsonLd(faqs);

  const reviewSchema = {
    "@context": "https://schema.org",
    "@graph": fallbackTestimonials.map((t) => ({
      "@type": "Review",
      itemReviewed: { "@type": "Organization", name: "Meteoric" },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5" },
      author: { "@type": "Person", name: t.author },
      reviewBody: t.quote,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <section className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,239,255,0.03),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(234,239,255,0.015),transparent_60%)]" />

        <div className="relative z-10">
          {/* ── Header ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5"
            >
              <span className="font-display text-white/30 not-italic mr-2">04</span>
              Client Stories
            </motion.p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-3xl md:text-5xl font-secondary-italic text-white tracking-tight leading-[1.1]">
                Trusted by teams
                <br />
                <span className="text-white/40">who build the future.</span>
              </h2>

              <div className="flex gap-3">
                {trustStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]"
                    >
                      <Icon size={11} className="text-white/30" />
                      <span className="text-white/70 text-xs font-medium">{stat.value}</span>
                      <span className="text-white/30 text-[10px]">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Marquee Row 1 — scrolls left ── */}
          <div className="relative flex w-full items-center overflow-hidden mb-4">
            <div className="group flex overflow-hidden p-2 [--gap:0.75rem] [gap:var(--gap)] flex-row [--duration:40s]">
              <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-left flex-row group-hover:[animation-play-state:paused]">
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

          {/* ── Marquee Row 2 — scrolls right ── */}
          <div className="relative flex w-full items-center overflow-hidden mb-12">
            <div className="group flex overflow-hidden p-2 [--gap:0.75rem] [gap:var(--gap)] flex-row [--duration:40s]">
              <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-right flex-row group-hover:[animation-play-state:paused]">
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

          {/* ── Review CTA ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
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
            </motion.div>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-28">
            <div className="max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5"
              >
                FAQs
              </motion.p>
              <h2 className="text-2xl md:text-4xl font-secondary-italic text-white tracking-tight mb-10 max-w-2xl">
                Common questions
                <span className="text-white/25"> about working with us.</span>
              </h2>

              <div className="space-y-2.5">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`group rounded-xl border transition-all duration-300 ${
                      openFaq === i
                        ? "border-white/[0.12] bg-gradient-to-b from-white/[0.03] to-transparent"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-4 text-left"
                    >
                      <span className="text-white/80 text-sm pr-4 leading-relaxed">
                        {faq.question}
                      </span>
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          openFaq === i
                            ? "border-[#EAEFFF]/20 bg-[#EAEFFF]/10 text-[#EAEFFF] rotate-45"
                            : "border-white/10 text-white/30 group-hover:border-white/20"
                        }`}
                      >
                        <Plus size={12} />
                      </span>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-white/40 text-sm leading-relaxed px-5 md:px-6 pb-5 -mt-1 max-w-2xl">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ReviewFormModal open={showForm} onClose={() => setShowForm(false)} />
      </section>
    </>
  );
}
