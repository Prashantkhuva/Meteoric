import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, MessageSquareText, BadgeCheck, Sparkles } from "lucide-react";
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

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const displayReviews = reviews ? [...reviews, ...fallbackTestimonials] : fallbackTestimonials;

  useEffect(() => {
    async function load() {
      const result = await getApprovedReviews();
      if (result.success && result.data.length > 0) {
        setReviews(result.data.map((r) => ({
          quote: r.content,
          author: r.name,
          role: r.role,
          project: r.project,
          rating: r.rating,
          company: r.company,
          isVerified: r.is_verified,
          createdAt: r.created_at,
        })));
      }
    }
    load();
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % displayReviews.length);
  }, [displayReviews.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + displayReviews.length) % displayReviews.length);
  }, [displayReviews.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <>
      <section
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,239,255,0.03),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(234,239,255,0.015),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/20 uppercase tracking-[0.3em] text-xs mb-14"
          >
            Client Stories
          </motion.p>

          <div className="max-w-4xl">
            <div className="relative">
              <div className="absolute -top-8 -left-6 w-32 h-32 rounded-full bg-[#EAEFFF]/[0.04] blur-3xl" />
              <Quote
                size={56}
                className="text-white/[0.04] absolute -top-4 -left-3"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <p className="text-lg md:text-2xl text-white/85 leading-[1.75] font-[350] mb-8 tracking-tight">
                    &ldquo;{displayReviews[current].quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < displayReviews[current].rating
                            ? "text-[#EAEFFF] fill-[#EAEFFF] drop-shadow-[0_0_4px_rgba(234,239,255,0.3)]"
                            : "text-white/10"
                        }
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-white/60 text-xs font-semibold border border-white/10">
                      {displayReviews[current].author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm leading-none">
                          {displayReviews[current].author}
                        </p>
                        {displayReviews[current].isVerified && (
                          <BadgeCheck size={12} className="text-[#EAEFFF]" />
                        )}
                      </div>
                      <p className="text-white/30 text-xs mt-1">
                        {displayReviews[current].role}
                        {displayReviews[current].role && displayReviews[current].company ? ", " : ""}
                        {displayReviews[current].company && (
                          <span className="text-white/40">{displayReviews[current].company}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                    <p className="text-white/15 text-[11px] tracking-wider uppercase">
                      {displayReviews[current].project}
                    </p>
                    {displayReviews[current].createdAt && (
                      <span className="text-white/10 text-[10px]">
                        · {new Date(displayReviews[current].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4 mt-10">
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex gap-1.5">
                {displayReviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-500 ${
                      i === current
                        ? "w-6 h-1.5 bg-white/90"
                        : "w-1.5 h-1.5 bg-white/15 hover:bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── feedback CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16 inline-flex items-center gap-3"
          >
            <span className="text-white/15 text-xs uppercase tracking-wider">
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
      </section>

      <ReviewFormModal open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
