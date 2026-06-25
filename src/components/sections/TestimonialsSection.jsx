import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Plus, MessageSquareText, BadgeCheck, Sparkles, Globe, Zap } from "lucide-react";
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

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState(null);
  const [current, setCurrent] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
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

  const faqSchema = buildFaqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,239,255,0.03),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(234,239,255,0.015),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* ── TESTIMONIALS ── */}
          <div className="mb-28">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/20 uppercase tracking-[0.3em] text-xs mb-12"
            >
              Client Stories
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
              {/* Left — quote card */}
              <div className="lg:col-span-3">
                <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-10">
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <Quote size={40} className="text-white/[0.04] absolute top-6 left-8" />
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <p className="text-base md:text-xl text-white/85 leading-[1.8] font-[350] mb-8 tracking-tight pl-8">
                          &ldquo;{displayReviews[current].quote}&rdquo;
                        </p>
                        <div className="flex items-center gap-1 mb-5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < displayReviews[current].rating
                                  ? "text-[#EAEFFF] fill-[#EAEFFF] drop-shadow-[0_0_4px_rgba(234,239,255,0.3)]"
                                  : "text-white/10"
                              }
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-white/60 text-xs font-semibold border border-white/10 shrink-0">
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
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.04]">
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
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="flex gap-2">
                    <button
                      onClick={prev}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      onClick={next}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                    >
                      <ChevronRight size={13} />
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

                {/* Minimal review CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mt-10 inline-flex items-center gap-3"
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

              {/* Right — trust */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {trustStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                      >
                        <Icon size={14} className="text-white/20 mb-2.5" />
                        <p className="text-xl font-semibold text-white tracking-tight">
                          {stat.value}
                        </p>
                        <p className="text-[11px] text-white/20 mt-0.5">{stat.label}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/20 uppercase tracking-[0.3em] text-xs mb-8"
            >
              FAQs
            </motion.p>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-10 max-w-2xl">
              Common questions
              <span className="text-white/25"> about working with us.</span>
            </h2>

            <div className="space-y-2.5">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`group rounded-xl border transition-all duration-300 ${
                    openFaq === i
                      ? "border-[#EAEFFF]/12 bg-gradient-to-b from-[#EAEFFF]/[0.03] to-transparent"
                      : "border-white/[0.05] bg-white/[0.02] hover:border-white/10"
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
      </section>

      <ReviewFormModal open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
