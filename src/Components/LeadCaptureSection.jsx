import { useState } from "react";
import { ArrowUpRight, Check, Shield, Clock, MessageSquare } from "lucide-react";

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

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black scroll-mt-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* ── INLINE LEAD CAPTURE ── */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="rounded-2xl border border-white/10 bg-black p-8 md:p-12 text-center">
            <p className="text-white/25 uppercase tracking-[0.3em] text-xs mb-6">
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
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <Check size={16} className="text-green-400" />
                <span className="text-white/60 text-sm">
                  Thanks! We'll be in touch within 24 hours.
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    window.open(
                      `mailto:work.prashantkhuva@gmail.com?subject=Project%20Estimate%20Request&body=Hi%20Meteoric%2C%0A%0AI'd%20like%20to%20get%20a%20free%20estimate%20for%20my%20project.%0A%0AMy%20email%3A%20${encodeURIComponent(email)}%0A%0APlease%20send%20me%20a%20detailed%20scope%20and%20timeline.`,
                    );
                    setSubmitted(true);
                  }
                }}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 w-full px-5 py-3 rounded-full border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-[#EAEFFF]/90 transition-colors"
                >
                  Get Estimate
                  <ArrowUpRight size={14} />
                </button>
              </form>
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
