"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts } from "@/data/blog";

const cardGradients = [
  "from-indigo-950 via-purple-950 to-slate-900",
  "from-emerald-950 via-teal-950 to-slate-900",
  "from-amber-950 via-orange-950 to-slate-900",
  "from-sky-950 via-blue-950 to-slate-900",
];

const cardAccents = ["#818cf8", "#34d399", "#f59e0b", "#38bdf8"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-16 pt-32 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-10 bg-white/10" />
          <span className="text-white/20 text-xs uppercase tracking-[0.3em]">
            Our Blog
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight">
            Featured{" "}
            <span className="font-secondary-italic text-white/40">
              Insights
            </span>
          </h1>
          <p className="text-white/25 text-sm md:text-base mt-4 max-w-lg">
            Thoughts on building, designing, and shipping products that
            matter.
          </p>
        </motion.div>
      </section>

      {/* ── POSTS ── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post, i) => {
            const gradient = cardGradients[i % cardGradients.length];
            const accent = cardAccents[i % cardAccents.length];

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden transition-all duration-500 hover:border-[#EAEFFF]/15 h-full flex flex-col"
                >
                  {/* Abstract art area */}
                  <div
                    className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradient}`}
                  >
                    {/* Decorative circles */}
                    <div
                      className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
                      style={{
                        background: `radial-gradient(circle, ${accent}44, transparent)`,
                      }}
                    />
                    <div
                      className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15"
                      style={{
                        background: `radial-gradient(circle, ${accent}33, transparent)`,
                      }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/[0.03]" />
                    {/* Grid dots */}
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, white 0.5px, transparent 0.5px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-white/10"
                        style={{
                          backgroundColor: `${accent}11`,
                          color: accent,
                          borderColor: `${accent}33`,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 text-[11px] text-white/25 mb-3">
                      <span>{post.date}</span>
                      <span className="w-px h-3 bg-white/10" />
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="text-lg font-semibold leading-snug tracking-tight text-white/85 mb-3 group-hover:text-white transition-colors duration-300">
                      {post.title}
                    </h2>

                    <p className="text-white/35 text-sm leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-white/25 text-xs group-hover:text-white/50 transition-colors duration-300">
                      Read Article
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </motion.article>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
