"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Shield, Clock, MessageSquare, Loader2 } from "lucide-react";
import { createLead } from "@/lib/actions";

const trustSignals = [
  {
    icon: <Shield size={16} />,
    label: "Clean, documented code",
  },
  {
    icon: <Clock size={16} />,
    label: "On-time delivery guarantee",
  },
  {
    icon: <MessageSquare size={16} />,
    label: "Direct founder communication",
  },
];

export default function LeadCaptureSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

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

    if (result?.emailError) {
      console.warn("Email warning:", result.emailError);
    }

    setSubmitted(true);
    setSending(false);
  };

  return (
    <section
      id="lead-capture"
      className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black scroll-mt-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* ── INLINE LEAD CAPTURE ── */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 md:p-12 text-center">
            <p className="text-white/30 uppercase tracking-[0.2em] text-xs mb-5">
              Start a Project
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white mb-4">
              Have an idea?
              <span className="block text-white/25 mt-1">
                Let's build something exceptional.
              </span>
            </h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
              Tell us what you're building and we'll send you a detailed
              scope, timeline, and price — no commitment required.
            </p>

            {submitted ? (
              <div role="status" aria-live="polite" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <Check size={16} className="text-green-400" />
                <span className="text-white/60 text-sm">
                  Thanks! We'll be in touch within 24 hours.
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                  className="flex-1 w-full px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(234,239,255,0.06)] hover:shadow-[0_0_30px_rgba(234,239,255,0.12)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {sending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ArrowUpRight size={14} />
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
                  className="underline hover:text-red-300"
                >
                  contact@withmeteoric.com
                </a>
              </p>
            )}
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div>
          <p className="text-white/20 text-xs uppercase tracking-widest text-center mb-8">
            Why founders choose Meteoric
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {trustSignals.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-white/40 text-sm"
              >
                <span className="text-white/30">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
