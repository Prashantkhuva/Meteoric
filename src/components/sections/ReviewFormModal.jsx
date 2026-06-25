import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2, Check, ArrowUpRight } from "lucide-react";
import { createReview } from "@/lib/actions";

export default function ReviewFormModal({ open, onClose }) {
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
            >
              <X size={14} />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                  <Check size={24} className="text-green-400" />
                </div>
                <p className="text-white font-semibold text-lg mb-2">
                  Thank you, {form.name.split(" ")[0]}!
                </p>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
                  Your review has been submitted and will appear on the site after review.
                  We appreciate your honest feedback.
                </p>
              </div>
            ) : (
              <>
                <p className="text-white/25 uppercase tracking-[0.3em] text-xs mb-1">
                  Give Your Feedback
                </p>
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Share your experience
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                        Name <span className="text-red-400/60">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        disabled={sending}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                        Email <span className="text-red-400/60">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="your@email.com"
                        disabled={sending}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={form.role}
                        onChange={(e) => update("role", e.target.value)}
                        placeholder="e.g. CEO"
                        disabled={sending}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Your company"
                        disabled={sending}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                      Project
                    </label>
                    <input
                      type="text"
                      value={form.project}
                      onChange={(e) => update("project", e.target.value)}
                      placeholder="What project did we work on?"
                      disabled={sending}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                      Rating <span className="text-red-400/60">*</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => update("rating", star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          disabled={sending}
                          className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
                        >
                          <Star
                            size={22}
                            className={
                              star <= (hoveredStar || form.rating)
                                ? "text-[#EAEFFF] fill-[#EAEFFF]"
                                : "text-white/20"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                      Your Review <span className="text-red-400/60">*</span>
                    </label>
                    <textarea
                      required
                      value={form.content}
                      onChange={(e) => update("content", e.target.value)}
                      placeholder="Tell us about your experience working with Meteoric..."
                      rows={4}
                      disabled={sending}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50 resize-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-red-400/80 text-xs">
                      Something went wrong. You can also email us directly at{" "}
                      <a
                        href="mailto:work.prashantkhuva@gmail.com"
                        className="underline hover:text-red-300"
                      >
                        work.prashantkhuva@gmail.com
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-[#EAEFFF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                    {sending ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
