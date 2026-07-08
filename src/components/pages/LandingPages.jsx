"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Target, Palette, TrendingUp, Smartphone } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Target size={20} />,
    title: "Conversion-Optimized Landing Pages",
    desc: "Purpose-built landing pages designed for one metric — conversion. Clean copy, clear CTAs, and layouts that guide visitors from hello to sign-up.",
  },
  {
    icon: <Palette size={20} />,
    title: "Brand & Marketing Sites",
    desc: "Full marketing websites that tell your story and showcase your product. Built with Next.js, animated with GSAP and Framer Motion, and designed to be remembered.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "SEO & GEO-Ready Landing Pages",
    desc: "Pages optimized for both traditional search engines and AI chatbots. Structured data, semantic HTML, fast load times, and content designed to get cited.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Product Launch & Waitlist Pages",
    desc: "High-impact launch pages for product debuts, beta signups, and fundraising milestones. Countdown timers, email capture, and social proof that builds anticipation.",
  },
];

const relatedPosts = [
  {
    slug: "how-much-does-a-startup-website-cost",
    title: "How Much Does a Startup Website Cost?",
  },
  {
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    title: "The Meteoric Guide to Choosing Your Tech Stack",
  },
  {
    slug: "why-your-startup-needs-a-product-studio-not-an-agency",
    title: "Why Your Startup Needs a Product Studio, Not an Agency",
  },
];

export default function LandingPagesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-white/25 uppercase tracking-[0.3em] text-xs">
            Landing Pages
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          Landing Page{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Design & Development
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-8"
        >
          We design and build landing pages that convert. Fast-loading,
          beautifully animated, and crafted to turn visitors into customers —
          whether you&apos;re launching a product, collecting beta signups, or
          growing your brand.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric is a landing page design and development agency that builds
          for performance and conversion. Every pixel has a purpose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#"
            data-cal-namespace="let-s-build"
            data-cal-link="prashantkhuva/let-s-build"
            data-cal-config='{"layout":"month_view"}'
            className="group relative inline-flex items-center gap-2 overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-black flex items-center gap-2">
              Start Your Project <ArrowUpRight size={15} />
            </span>
          </a>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 border border-white/10 text-white/50 hover:text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:border-white/30"
          >
            View Portfolio
          </Link>
        </motion.div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            What We Build
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)]"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#EAEFFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#EAEFFF]/60">{item.icon}</span>
                <h2 className="text-lg font-semibold text-white tracking-tight">{item.title}</h2>
              </div>
              <p className="text-[#EAEFFF]/45 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Our Landing Page Stack
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <p className="text-[#EAEFFF]/45 text-sm leading-relaxed mb-6">
            Every landing page is powered by a stack optimized for speed,
            SEO, and developer experience:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Framework", value: "Next.js" },
              { label: "Styling", value: "Tailwind CSS" },
              { label: "Animation", value: "GSAP + Framer Motion" },
              { label: "Hosting", value: "Vercel" },
              { label: "Analytics", value: "Vercel SpeedInsights" },
              { label: "SEO", value: "Structured Data + GEO" },
              { label: "Forms", value: "EmailJS" },
              { label: "Booking", value: "Cal.com" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-white/70 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[#EAEFFF]/35 text-xs mt-6">
            Read more about our <Link href="/blog/the-meteoric-guide-to-choosing-your-tech-stack" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200">tech stack philosophy</Link>.
          </p>
        </div>
      </section>

      <section className="relative max-w-3xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            FAQ
          </span>
        </motion.div>

        <FaqAccordion items={[
          {
            q: "How long does it take to design and build a landing page?",
            a_html: "A single landing page typically takes 5-10 days from kickoff to launch. Multi-page marketing sites take 2-4 weeks. We move fast without sacrificing quality. Check our <a href=\"/work\" class=\"text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200\">portfolio</a> for examples of projects shipped on tight deadlines.",
          },
          {
            q: "Do you optimize landing pages for SEO?",
            a: "Yes. Every landing page ships with proper semantic HTML, meta tags, Open Graph cards, structured data (JSON-LD), and fast Core Web Vitals. We also optimize for GEO (Generative Engine Optimization) to get cited by AI chatbots like ChatGPT and Perplexity.",
          },
          {
            q: "Can you redesign an existing landing page?",
            a: "Absolutely. We regularly audit and redesign existing pages to improve conversion rates, load speed, and visual impact. We keep what works and elevate what doesn't.",
          },
          {
            q: "How much does a landing page cost?",
            a: "A single high-converting landing page starts at $4,000-$8,000. Multi-page marketing sites range from $10,000-$20,000. Every project includes design, development, animations, SEO setup, and one round of revisions.",
          },
          {
            q: "Do you include animations?",
            a: "Yes — it's what we're known for. Scroll-triggered animations, micro-interactions, and page transitions using GSAP and Framer Motion. Every animation is purposeful and performance-optimized, never decorative fluff.",
          },
        ]} />
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.3em]" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Related Reading
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-6 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:shadow-[0_0_50px_rgba(234,239,255,0.04)]"
              >
                <p className="text-[#EAEFFF]/60 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                  {post.title}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/20 mt-3 group-hover:text-white/50 transition-colors duration-300">
                  Read more <ArrowUpRight size={11} />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
