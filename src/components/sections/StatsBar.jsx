"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap-setup";

const stats = [
  { value: "12+", label: "Projects Shipped" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "10", label: "Day Sprint Cycles" },
  { value: "2026", label: "Founded" },
];

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
    <section ref={ref} className="relative bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item text-center md:text-left opacity-0"
            >
              <div className="text-4xl md:text-5xl font-display tracking-tight text-white mb-2">
                <AnimatedNumber target={stat.value} inView={inView} />
              </div>
              <p className="text-sm text-white/40 uppercase tracking-[0.15em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
