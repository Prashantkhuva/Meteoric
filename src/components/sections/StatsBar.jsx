"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap-setup";
import siteStats from "@/data/site-stats";

function AnimatedNumber({ target, inView }) {
  const [display, setDisplay] = useState(() => {
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    return isNaN(numeric) ? target : "0";
  });

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    if (isNaN(numeric)) return;
    const suffix = target.replace(/\d/g, "");
    let current = 0;
    const step = Math.max(1, Math.floor(numeric / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, numeric);
      setDisplay(`${current}${suffix}`);
      if (current >= numeric) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span>{display}</span>;
}

export default function StatsBar() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".stat-item"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    );
  }, [inView]);

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Earth background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/stats-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--bg-primary) 0%, transparent 20%, transparent 80%, var(--bg-primary) 100%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
          {siteStats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-item text-center opacity-0 flex items-center gap-8 md:gap-12"
            >
              {i > 0 && (
                <div className="hidden md:block w-px h-[52px]" style={{ background: "rgba(255,255,255,0.16)" }} />
              )}
              <div>
                <div className="text-[42px] md:text-[48px] font-display tracking-tight mb-2" style={{ color: "var(--text-primary)", textShadow: "0 0 12px rgba(0,0,0,0.6)" }}>
                  <AnimatedNumber target={stat.value} inView={inView} />
                </div>
                <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
