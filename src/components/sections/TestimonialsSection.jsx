import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Plus, MessageSquareText, BadgeCheck, Sparkles, Palette, Zap, Globe } from "lucide-react";
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
  { value: "12", label: "Projects Delivered", icon: Globe },
  { value: "100%", label: "On-Time Delivery", icon: Zap },
  { value: "5★", label: "Client Rating", icon: Star },
  { value: "10", label: "Day Average Sprint", icon: Palette },
];

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState(null);
  const [current, setCurrent] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [paused, setPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const displayReviews = reviews || fallbackTestimonials;

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
              className="text-white/20 uppercase tracking-[0.3em] text-xs mb-10"
            >
              Client Stories
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left — quote */}
              <div className="relative">
                <div className="absolute -top-8 -left-6 w-32 h-32 rounded-full bg-[#EAEFFF]/[0.04] blur-3xl" />
                <div className="relative">
                  <Quote
                    size={64}
                    className="text-white/[0.04] absolute -top-5 -left-4"
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="relative mb-10">
                        <p className="text-xl md:text-[28px] text-white/85 leading-[1.7] font-[350] tracking-tight">
                          &ldquo;{displayReviews[current].quote}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < displayReviews[current].rating
                                ? "text-[#EAEFFF] fill-[#EAEFFF] drop-shadow-[0_0_6px_rgba(234,239,255,0.35)]"
                                : "text-white/10"
                            }
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-white/70 text-sm font-semibold border border-white/10 shadow-[0_0_16px_rgba(255,255,255,0.04)]">
                          {displayReviews[current].author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm leading-none">
                              {displayReviews[current].author}
                            </p>
                            {displayReviews[current].isVerified && (
                              <BadgeCheck size={13} className="text-[#EAEFFF] drop-shadow-[0_0_4px_rgba(234,239,255,0.3)]" />
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
                      {(displayReviews[current].project || displayReviews[current].createdAt) && (
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                          {displayReviews[current].project && (
                            <p className="text-white/15 text-[11px] tracking-wider uppercase">
                              {displayReviews[current].project}
                            </p>
                          )}
                          {displayReviews[current].createdAt && (
                            <span className="text-white/10 text-[10px]">
                              · {new Date(displayReviews[current].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <div className="flex gap-2">
                    <button
                      onClick={prev}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)] transition-all duration-200"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={next}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)] transition-all duration-200"
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
                            ? "w-7 h-1.5 bg-white/90"
                            : "w-1.5 h-1.5 bg-white/15 hover:bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — trust indicators */}
              <div className="grid grid-cols-2 gap-3">
                {trustStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                      className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6 hover:border-white/20 hover:from-white/[0.06] hover:shadow-[0_0_24px_rgba(234,239,255,0.04)] transition-all duration-300"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative">
                        <Icon size={18} className="text-white/20 mb-3 group-hover:text-white/30 transition-colors duration-300" />
                        <p className="text-3xl font-semibold text-white mb-1 tracking-tight">
                          {stat.value}
                        </p>
                        <p className="text-xs text-white/25 tracking-wide">{stat.label}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── GIVE YOUR FEEDBACK ── */}
          <div className="mb-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-10 md:p-14 text-center overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/30 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.015),transparent_60%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-white/30 text-[11px] uppercase tracking-[0.2em] mb-6">
                  <Sparkles size={11} className="text-[#EAEFFF]/50" />
                  Your Voice Matters
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
                  Share your experience
                </h3>
                <p className="text-white/30 text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto">
                  Worked with us? Leave an honest review — real names, real stories,
                  full transparency. Every review is published as-is after verification.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(234,239,255,0.1)] hover:shadow-[0_0_30px_rgba(234,239,255,0.2)]"
                >
                  <MessageSquareText size={14} className="group-hover:scale-110 transition-transform" />
                  Give Your Feedback
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/20 uppercase tracking-[0.3em] text-xs mb-10"
            >
              Frequently Asked
            </motion.p>
            <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white mb-16 max-w-3xl">
              Common questions
              <span className="text-white/25"> about working with us.</span>
            </h2>

            <div className="space-y-2.5">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`group rounded-2xl border transition-all duration-300 ${
                    openFaq === i
                      ? "border-[#EAEFFF]/15 bg-gradient-to-b from-[#EAEFFF]/[0.03] to-transparent"
                      : "border-white/[0.05] bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 md:px-7 md:py-5 text-left"
                  >
                    <span className="text-white/80 text-sm font-medium pr-4 leading-relaxed">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        openFaq === i
                          ? "border-[#EAEFFF]/25 bg-[#EAEFFF]/10 text-[#EAEFFF] rotate-45"
                          : "border-white/10 text-white/30 group-hover:border-white/20"
                      }`}
                    >
                      <Plus size={13} />
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
                        <p className="text-white/40 text-sm leading-relaxed px-6 md:px-7 pb-6 -mt-1 max-w-2xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ReviewFormModal open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
