"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { posts } from "@/data/blog";

const cardAccents = ["#818cf8", "#34d399", "#f59e0b", "#38bdf8"];

export default function BlogPostPage({ post }) {
  const idx = posts.findIndex((p) => p.slug === post.slug);
  const accent = cardAccents[idx >= 0 ? idx % cardAccents.length : 0];

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <article className="relative max-w-3xl mx-auto px-6 md:px-16 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/25 hover:text-white text-sm transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to insights
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-56 md:h-72 rounded-2xl overflow-hidden mb-10"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-5 left-5">
            <span
              className="text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border backdrop-blur-sm"
              style={{
                backgroundColor: `${accent}22`,
                color: accent,
                borderColor: `${accent}44`,
              }}
            >
              {post.category}
            </span>
          </div>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 text-xs text-white/25 mb-4">
            <span>{post.date}</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold leading-[1.15] tracking-tight mb-8">
            {post.title}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {post.content.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={i}
                  className="text-xl md:text-2xl font-semibold tracking-tight text-white mt-14 mb-5"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <p
                key={i}
                className="text-white/45 text-base md:text-lg leading-[1.8] mb-6"
              >
                {block.text}
              </p>
            );
          })}
        </motion.div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-20" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/15 text-xs uppercase tracking-[0.25em] mb-6">
            More insights
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {related.map((r, ri) => {
              const ra = cardAccents[ri % cardAccents.length];
              return (
                <Link key={r.slug} href={`/blog/${r.slug}`}>
                  <div className="group rounded-xl border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-white/15">
                    <div className="h-24 relative overflow-hidden">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 400px"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-[11px] text-white/20 mb-1.5">
                        <span>{r.date}</span>
                        <span className="w-px h-2.5 bg-white/10" />
                        <span>{r.readTime}</span>
                      </div>
                      <h3 className="text-sm font-medium text-white/70 leading-snug group-hover:text-white transition-colors duration-300">
                        {r.title}
                      </h3>
                      <div className="mt-2.5 flex items-center gap-1 text-white/20 text-[11px] group-hover:text-white/40 transition-colors duration-300">
                        Read
                        <ArrowUpRight size={10} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </article>
    </div>
  );
}
