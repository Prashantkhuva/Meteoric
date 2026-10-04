"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
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

export default function StatsBar({ strip = false }) {
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

  if (strip) {
    return (
      <section
        ref={ref}
        className="relative border-t"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background:
            "linear-gradient(to top, rgba(1,4,5,0.92) 0%, rgba(1,4,5,0.5) 100%)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3.5">
          <ul className="grid grid-cols-4">
            {siteStats.map((stat, i) => (
              <li
                key={stat.label}
                className="stat-item flex flex-col items-center text-center opacity-0 px-1 min-w-0"
                style={
                  i > 0
                    ? { borderLeft: "1px solid rgba(255,255,255,0.1)" }
                    : undefined
                }
              >
                <span
                  className="text-[15px] font-semibold tracking-tight whitespace-nowrap leading-none"
                  style={{ color: "#ffffff" }}
                >
                  <AnimatedNumber target={stat.value} inView={inView} />
                </span>
                <span
                  className="mt-1 text-[8px] uppercase tracking-[0.06em] font-medium leading-[1.2]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "var(--hero-bg)" }}>
      {/* Earth background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/stats-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--hero-bg) 0%, transparent 20%, transparent 80%, var(--hero-bg) 100%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {siteStats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item text-center opacity-0"
            >
              <div className="text-[clamp(1.25rem,5vw,2.25rem)] font-semibold tracking-tight mb-1.5 whitespace-nowrap" style={{ color: "#ffffff" }}>
                <AnimatedNumber target={stat.value} inView={inView} />
              </div>
              <p className="text-caption uppercase tracking-[0.12em] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
