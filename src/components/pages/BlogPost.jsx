"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { posts } from "@/data/blog";

export default function BlogPostPage({ post }) {
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
          className="relative w-full mb-12 overflow-hidden"
          style={{ aspectRatio: "1.5/1" }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 text-xs text-white/25 mb-4">
            <span>{post.date}</span>
            {post.dateModified && post.dateModified !== post.date && (
              <>
                <span className="w-px h-3 bg-white/10" />
                <span>Updated {post.dateModified}</span>
              </>
            )}
            <span className="w-px h-3 bg-white/10" />
            <span>{post.readTime}</span>
            {post.author && (
              <>
                <span className="w-px h-3 bg-white/10" />
                <span>By {post.author}</span>
              </>
            )}
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
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`}>
                <div className="group">
                  <div className="relative w-full overflow-hidden mb-4" style={{ aspectRatio: "1.26/1" }}>
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-medium text-white/70 leading-snug group-hover:text-white transition-colors duration-300">
                      {r.title}
                    </h3>
                    <span className="text-[11px] text-white/20 whitespace-nowrap shrink-0">
                      {r.date}
                    </span>
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
