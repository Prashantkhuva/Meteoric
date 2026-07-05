"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts } from "@/data/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">
            Insights
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-4">
            Thoughts on{" "}
            <span className="font-secondary-italic text-white/40">
              building
            </span>
            ,{" "}
            <span className="font-secondary-italic text-white/40">
              designing
            </span>
            , and{" "}
            <span className="font-secondary-italic text-white/40">
              shipping
            </span>
          </h1>
          <p className="text-[#EAEFFF]/40 text-base md:text-lg max-w-xl">
            Insights from building products, working with founders, and
            shipping code that matters.
          </p>
        </motion.div>
      </section>

      {/* ── POSTS ── */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)] h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-white/10 bg-black/50 text-white/50">
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

                  <p className="text-[#EAEFFF]/40 text-sm leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-[#EAEFFF]/30 text-xs group-hover:text-[#EAEFFF]/60 transition-colors duration-300">
                    Read more
                    <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BACKGROUND WORDMARK ── */}
      <div className="relative overflow-hidden pb-24">
        <div
          className="text-[18vw] md:text-[14vw] leading-none tracking-[-0.08em] font-semibold text-white/[0.03] select-none whitespace-nowrap text-center"
          aria-hidden="true"
        >
          Insights
        </div>
      </div>
    </div>
  );
}
