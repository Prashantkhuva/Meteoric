"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2, Check, Send, Sparkles } from "lucide-react";
import { createReview } from "@/lib/actions";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function ReviewFormModal({ open, onClose }) {
  const trapRef = useFocusTrap(open);
  const scrollRef = useRef(null);

  function handleWheel(e) {
    const el = scrollRef.current;
    if (!el) return;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) return;
    el.scrollTop += e.deltaY;
    e.preventDefault();
  }

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    project: "",
    rating: 5,
    content: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) return;

    setSending(true);
    setError(null);

    const result = await createReview(form);

    if (result?.error) {
      setError(result.error);
      setSending(false);
      return;
    }

    setSubmitted(true);
    setSending(false);
  };

  const handleClose = () => {
    setForm({ name: "", email: "", role: "", company: "", project: "", rating: 5, content: "" });
    setHoveredStar(0);
    setSending(false);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            aria-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-full max-w-lg"
          >
            <div ref={(el) => { trapRef.current = el; scrollRef.current = el }} onWheel={handleWheel} className="relative rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/20 to-transparent" />

              <button
                onClick={handleClose}
                aria-label="Close review form"
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/15 flex items-center justify-center mx-auto mb-6">
                      <Check size={26} className="text-green-400" />
                    </div>
                    <p className="text-white font-semibold text-xl mb-2 tracking-tight">
                      Thank you, {form.name.split(" ")[0]}!
                    </p>
                    <p className="text-white/55 text-sm leading-relaxed max-w-sm mx-auto">
                      Your review has been submitted and will appear on the site after review.
                      We appreciate your honest feedback.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-white/50 text-[11px] uppercase tracking-[0.2em] mb-1">
                      <Sparkles size={11} className="text-[#EAEFFF]/40" />
                      Give Your Feedback
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-8 tracking-tight">
                      Share your experience
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                            Name <span className="text-red-400/50">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Your name"
                            disabled={sending}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#EAEFFF]/25 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                            Email <span className="text-red-400/50">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="your@email.com"
                            disabled={sending}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#EAEFFF]/25 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                            Role
                          </label>
                          <input
                            type="text"
                            value={form.role}
                            onChange={(e) => update("role", e.target.value)}
                            placeholder="e.g. CEO"
                            disabled={sending}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#EAEFFF]/25 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                            Company
                          </label>
                          <input
                            type="text"
                            value={form.company}
                            onChange={(e) => update("company", e.target.value)}
                            placeholder="Your company"
                            disabled={sending}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#EAEFFF]/25 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                          Project
                        </label>
                        <input
                          type="text"
                          value={form.project}
                          onChange={(e) => update("project", e.target.value)}
                          placeholder="What project did we work on?"
                          disabled={sending}
                          className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#EAEFFF]/25 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                          Rating <span className="text-red-400/50">*</span>
                        </label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const active = star <= (hoveredStar || form.rating);
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => update("rating", star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                disabled={sending}
                                aria-label={`Rate ${star} star${star === 1 ? "" : "s"} out of 5`}
                                className={`p-1.5 rounded-lg transition-all duration-150 disabled:opacity-50 ${
                                  active ? "scale-100" : "scale-100 hover:scale-110"
                                }`}
                              >
                                <Star
                                  size={20}
                                  className={`transition-all duration-150 ${
                                    active
                                      ? "text-[#EAEFFF] fill-[#EAEFFF] drop-shadow-[0_0_6px_rgba(234,239,255,0.3)]"
                                      : "text-white/15"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/50 text-[11px] uppercase tracking-wider mb-2.5">
                          Your Review <span className="text-red-400/50">*</span>
                        </label>
                        <textarea
                          required
                          value={form.content}
                          onChange={(e) => update("content", e.target.value)}
                          placeholder="Tell us about your experience working with Meteoric..."
                          rows={4}
                          disabled={sending}
                          className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#EAEFFF]/25 focus:bg-white/[0.05] transition-all duration-200 disabled:opacity-50 resize-none"
                        />
                      </div>

                      {error && (
                        <p role="alert" className="text-red-400/70 text-xs flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-red-400/50 shrink-0" />
                          Something went wrong. Email us at{" "}
                          <a
                            href="mailto:contact@withmeteoric.com"
                            className="underline hover:text-red-300 transition-colors"
                          >
                            contact@withmeteoric.com
                          </a>
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="group relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(234,239,255,0.06)] hover:shadow-[0_0_30px_rgba(234,239,255,0.12)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        {sending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Send size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                        {sending ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
