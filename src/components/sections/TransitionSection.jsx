"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, X, Monitor, Database, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    id: 1,
    icon: <Monitor size={18} />,
    title: "Premium Interfaces",
    short:
      "Modern interfaces designed with clarity, motion, and intentional visual hierarchy.",
    details:
      "Every interface is crafted to feel clean, premium, and intuitive. We focus heavily on spacing, typography, interaction design, and subtle motion to create experiences that feel polished rather than template-based.",
  },

  {
    id: 2,
    icon: <Database size={18} />,
    title: "Performance First",
    short:
      "Fast-loading systems optimized for smooth interactions and scalability.",
    details:
      "Performance is built into the foundation — not added later. From optimized frontend architecture to clean backend systems, everything we build is designed to feel responsive, lightweight, and production-ready.",
  },

  {
    id: 3,
    icon: <Sparkles size={18} />,
    title: "Built for Growth",
    short:
      "Products structured to help startups launch quickly and scale confidently.",
    details:
      "We build systems with long-term scalability in mind. Whether it's a startup MVP, SaaS platform, or brand website, the goal is always to create flexible foundations that can evolve as the business grows.",
  },
];

export default function TransitionSection() {
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);

  const mainWords = "Digital products that feel".split(" ");
  const mutedWords = "modern, fast, and unforgettable.".split(" ");

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headingRef.current?.querySelectorAll(".gsap-head-word").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
      cardsRef.current?.querySelectorAll(".gsap-card").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }
    gsap.fromTo(headingRef.current?.querySelectorAll(".gsap-head-word"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: "power3.out",
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 88%",
        end: "top 50%",
        toggleActions: "play none none none",
      },
    });

    gsap.fromTo(cardsRef.current?.querySelectorAll(".gsap-card"),
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "top 35%",
          toggleActions: "play none none none",
        },
      },
    );
  }, { scope: sectionRef });

  return (
    <>
      <section ref={sectionRef} className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black">
        {/* background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.03),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* TOP */}
          <div ref={headingRef} className="max-w-4xl mb-20">
            <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5">
              Beyond Just Development
            </p>

            <h2 className="text-4xl md:text-6xl leading-[1.05] font-semibold tracking-tight text-white [&>.gsap-head-word:not(:last-child)]:mr-[0.25em]">
              {mainWords.map((word, i) => (
                <span key={i} className="gsap-head-word inline-block">{word}</span>
              ))}
              <span className="text-white/50 font-secondary-italic [&>.gsap-head-word:not(:last-child)]:mr-[0.25em]">
                {" "}
                {mutedWords.map((word, i) => (
                  <span key={i} className="gsap-head-word inline-block">{word}</span>
                ))}
              </span>
            </h2>

            <p className="mt-8 text-[#EAEFFF]/65 text-lg max-w-2xl leading-relaxed">
              We help startups and brands build premium software and digital
              experiences focused on performance, clarity, and strong visual identity.
            </p>
          </div>

          {/* CARDS */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="gsap-card opacity-0">
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
                onClick={() => setActiveCard(item)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveCard(item); } }}
                tabIndex={0}
                role="button"
                aria-label={`View details about ${item.title}`}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#EAEFFF]/10 bg-black p-6 min-h-[26.875rem] md:h-[26.875rem] transition-all duration-300 hover:border-[#EAEFFF]/18 hover:bg-[#050505] hover:shadow-[0_0_34px_rgba(234,239,255,0.045)] before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(circle_at_top,rgba(234,239,255,0.05),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 focus-visible:outline-2 focus-visible:outline-white/40"
              >
                {/* PREMIUM ANIMATED BORDER */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-40">
                  <div
                    className="absolute inset-0 rounded-3xl p-[1px]"
                    style={{
                      background: `
        repeating-conic-gradient(
          from 180deg at 50% 50%,
          #EAEFFF 0%,
          rgba(234,239,255,0.8) 8%,
          rgba(234,239,255,0.12) 16%,
          rgba(234,239,255,0.8) 24%,
          #EAEFFF 32%
        )
      `,
                    }}
                  >
                    <div className="h-full w-full rounded-3xl bg-black" />
                  </div>
                </div>

                {/* top ambient glow */}
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#EAEFFF]/7 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* TOP VISUAL */}
                  <div className="relative w-full overflow-hidden">
                    <div className="relative w-full rounded-2xl border border-[#EAEFFF]/12 bg-[#090909] overflow-hidden">
                      {/* soft inner glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,239,255,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* top bar */}
                      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#EAEFFF]/8">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]/15" />
                        <div className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]/10" />
                        <div className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]/8" />

                        <div className="flex-1 ml-1.5 h-2 rounded-full bg-[#EAEFFF]/8" />
                      </div>

                      {/* CARD 1 */}
                      {item.id === 1 && (
                        <div className="p-3">
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {[74, 52, 91].map((value, i) => (
                              <div
                                key={i}
                                className="rounded-xl bg-[#EAEFFF]/5 border border-[#EAEFFF]/8 px-2 py-2"
                              >
                                <div className="text-[9px] text-[#EAEFFF]/30 font-mono mb-1">
                                  {["MRR", "CAC", "LTV"][i]}
                                </div>

                                <div className="text-xs font-bold text-[#EAEFFF]/70">
                                  {value}%
                                </div>

                                <div className="h-0.5 w-full rounded-full bg-[#EAEFFF]/8 mt-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${value}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full rounded-full bg-[#EAEFFF]/40"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-end gap-1 h-16">
                            {[25, 45, 35, 65, 48, 80, 55, 72, 40, 88].map(
                              (h, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${h}%` }}
                                  transition={{
                                    duration: 0.7,
                                    delay: i * 0.03,
                                  }}
                                  className="flex-1 rounded-sm origin-bottom bg-[#EAEFFF]/18"
                                />
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* CARD 2 */}
                      {item.id === 2 && (
                        <div className="p-4 space-y-3">
                          {["Auth API", "Database", "Storage", "Analytics"].map(
                            (label, i) => (
                              <div
                                key={i}
                                className="rounded-xl border border-[#EAEFFF]/8 bg-[#EAEFFF]/4 p-3"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[11px] text-[#EAEFFF]/45 font-mono">
                                    {label}
                                  </span>

                                  <span className="text-[10px] text-[#EAEFFF]/30">
                                    LIVE
                                  </span>
                                </div>

                                <div className="h-1 rounded-full bg-[#EAEFFF]/8 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{
                                      width: `${70 + i * 5}%`,
                                    }}
                                    transition={{
                                      duration: 1,
                                      delay: i * 0.1,
                                    }}
                                    className="h-full rounded-full bg-[#EAEFFF]/35"
                                  />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      {/* CARD 3 */}
                      {item.id === 3 && (
                        <div className="relative h-[170px] flex items-center justify-center overflow-hidden">
                          {/* back card */}
                          <motion.div
                            whileHover={{
                              rotate: -10,
                              y: -4,
                            }}
                            className="absolute w-48 h-28 rounded-2xl border border-[#EAEFFF]/10 bg-[#131313] rotate-[-8deg]"
                          />

                          {/* middle card */}
                          <motion.div
                            whileHover={{
                              rotate: 8,
                              y: -8,
                            }}
                            className="absolute w-48 h-28 rounded-2xl border border-[#EAEFFF]/10 bg-[#161616] rotate-[6deg]"
                          />

                          {/* front card */}
                          <motion.div
                            whileHover={{
                              y: -10,
                            }}
                            className="relative w-52 h-32 rounded-2xl border border-[#EAEFFF]/12 bg-[#1a1a1a] p-4 shadow-[0_0_30px_rgba(234,239,255,0.04)]"
                          >
                            <div className="h-3 w-24 rounded-full bg-[#EAEFFF]/18 mb-4" />

                            <div className="space-y-2">
                              <div className="h-2 rounded-full bg-[#EAEFFF]/10" />
                              <div className="h-2 w-4/5 rounded-full bg-[#EAEFFF]/10" />
                              <div className="h-2 w-2/3 rounded-full bg-[#EAEFFF]/10" />
                            </div>

                            <div className="mt-5 flex gap-2">
                              <div className="h-6 w-16 rounded-full border border-[#EAEFFF]/10 bg-[#EAEFFF]/5" />
                              <div className="h-6 w-12 rounded-full border border-[#EAEFFF]/10 bg-[#EAEFFF]/5" />
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-6 space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex aspect-square size-9 rounded-full border border-[#EAEFFF]/15 bg-[#EAEFFF]/5 items-center justify-center text-[#EAEFFF]/60">
                          {item.icon}
                        </div>

                        <span className="text-[#EAEFFF]/25 text-sm font-medium">
                          0{item.id}
                        </span>
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-[#EAEFFF]/30 transition-all duration-300 group-hover:text-[#EAEFFF]/70 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>

                    <h3 className="text-[#EAEFFF] text-2xl font-bold tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-[#EAEFFF]/70 text-sm font-medium leading-relaxed">
                      {item.short}
                    </p>
                  </div>
                </div>
              </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={() => setActiveCard(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="capability-dialog-title"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-black p-6 md:p-10 shadow-[0_0_80px_rgba(234,239,255,0.06)]"
            >
              {/* close */}
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setActiveCard(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>

              {/* number */}
              <div className="w-14 h-14 rounded-2xl border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 flex items-center justify-center text-[#EAEFFF]/80 font-medium mb-8">
                0{activeCard.id}
              </div>

              <h3
                id="capability-dialog-title"
                className="text-3xl md:text-4xl font-semibold text-[#EAEFFF] mb-6 tracking-tight"
              >
                {activeCard.title}
              </h3>

              <p className="text-[#EAEFFF]/60 text-lg leading-relaxed mb-8">
                {activeCard.short}
              </p>

              <div className="border-t border-[#EAEFFF]/10 pt-8">
                <h4 className="text-[#EAEFFF] font-medium mb-4">
                  Design Philosophy
                </h4>

                <p className="text-[#EAEFFF]/45 leading-relaxed text-base">
                  {activeCard.details}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
