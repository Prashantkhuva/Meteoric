"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { posts } from "@/data/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

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
            Thoughts on building, designing, and shipping products that matter.
          </p>
        </motion.div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group"
              >
                <div className="relative w-full overflow-hidden mb-5" style={{ aspectRatio: "1.26/1" }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl md:text-2xl font-medium leading-snug tracking-tight text-white/85 group-hover:text-white transition-colors duration-300">
                    {post.title}
                  </h2>
                  <span className="text-xs text-white/20 whitespace-nowrap shrink-0">
                    {post.date}
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
