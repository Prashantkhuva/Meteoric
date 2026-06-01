import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { buildFaqJsonLd } from "../seo/jsonLd.js";

const testimonials = [
  {
    quote:
      "Meteoric delivered our habit tracking SaaS on time and within budget. The codebase is clean, well-documented, and our users love the clean dashboard. Exactly what we needed as an early-stage startup. Streak tracking and weekly analytics shipped without a single bug.",
    author: "Alex Chen",
    role: "Founder, Habit Flow",
    project: "Habit Flow",
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

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const faqSchema = buildFaqJsonLd(faqs);

  return (
    <>
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Helmet>

      <section className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* ── TESTIMONIALS ── */}
          <div className="mb-28">
            <p className="text-white/25 uppercase tracking-[0.3em] text-xs mb-10">
              Client Stories
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — quote */}
              <div className="relative">
                <Quote
                  size={40}
                  className="text-white/[0.04] absolute -top-4 -left-2"
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-8">
                      "{testimonials[current].quote}"
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: testimonials[current].rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-[#EAEFFF] fill-[#EAEFFF]"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-white font-semibold">
                      {testimonials[current].author}
                    </p>
                    <p className="text-white/30 text-sm">
                      {testimonials[current].role}
                    </p>
                    <p className="text-white/15 text-xs mt-1">
                      {testimonials[current].project}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-4 mt-8">
                  <div className="flex gap-2">
                    <button
                      onClick={prev}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={next}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i === current
                            ? "bg-white w-4"
                            : "bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — trust indicators */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    value: "10+",
                    label: "Projects Delivered",
                  },
                  {
                    value: "100%",
                    label: "On-Time Delivery",
                  },
                  {
                    value: "5★",
                    label: "Client Rating",
                  },
                  {
                    value: "< 2wk",
                    label: "Average Sprint",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-black p-6 hover:border-white/20 transition-colors"
                  >
                    <p className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/30">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-4xl">
            <p className="text-white/25 uppercase tracking-[0.3em] text-xs mb-10">
              Frequently Asked
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white mb-16 max-w-3xl">
              Common questions
              <span className="text-white/30"> about working with us.</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`rounded-2xl border transition-all duration-300 ${
                    openFaq === i
                      ? "border-[#EAEFFF]/20 bg-[#EAEFFF]/[0.02] shadow-[0_0_30px_rgba(234,239,255,0.03)]"
                      : "border-white/5 bg-black hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-white/80 text-sm font-medium pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        openFaq === i
                          ? "border-[#EAEFFF]/30 bg-[#EAEFFF]/10 text-[#EAEFFF] rotate-45"
                          : "border-white/10 text-white/30"
                      }`}
                    >
                      <Plus size={14} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/40 text-sm leading-relaxed px-6 pb-6 -mt-1 max-w-2xl">
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
    </>
  );
}
