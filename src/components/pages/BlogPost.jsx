"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { posts } from "@/data/blog";

export default function BlogPostPage({ post }) {
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <article className="relative max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to insights
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 text-xs text-white/25 mb-4">
            <span className="px-3 py-1 rounded-full border border-white/10 text-white/40">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold leading-[1.15] tracking-tight mb-6">
            {post.title}
          </h1>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose-custom"
        >
          {post.content.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={i}
                  className="text-xl md:text-2xl font-semibold tracking-tight text-white mt-12 mb-4"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <p
                key={i}
                className="text-[#EAEFFF]/55 text-base md:text-lg leading-[1.8] mb-5"
              >
                {block.text}
              </p>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

        {/* Related */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-6">
            Related insights
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`}>
                <div className="group rounded-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_30px_rgba(234,239,255,0.03)]">
                  <div className="flex items-center gap-2 text-[11px] text-white/20 mb-2">
                    <span>{r.date}</span>
                    <span className="w-px h-2.5 bg-white/10" />
                    <span>{r.readTime}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white/70 leading-snug group-hover:text-white transition-colors duration-300">
                    {r.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-1 text-[#EAEFFF]/20 text-[11px] group-hover:text-[#EAEFFF]/40 transition-colors duration-300">
                    Read
                    <ArrowUpRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  );
}
