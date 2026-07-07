"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Globe, Smartphone, Search, BarChart } from "lucide-react";
import FaqAccordion from "@/components/sections/FaqAccordion";

const services = [
  {
    icon: <Globe size={20} />,
    title: "Startup Website Design & Development",
    desc: "Modern, conversion-optimized websites built with Next.js and Tailwind CSS. Fast-loading, SEO-optimized, and designed to tell your story.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Landing Pages & Marketing Sites",
    desc: "High-converting landing pages for product launches, beta signups, and fundraising. Built for speed, clarity, and measurable results.",
  },
  {
    icon: <Search size={20} />,
    title: "SEO & GEO Optimization",
    desc: "Technical SEO, structured data, content strategy, and AI-citation optimization (GEO). Built to rank in both search engines and AI chatbots.",
  },
  {
    icon: <BarChart size={20} />,
    title: "Growth & Analytics Setup",
    desc: "Custom dashboards, conversion tracking, A/B testing infrastructure, and analytics pipelines so you know exactly what's working.",
  },
];

const relatedPosts = [
  {
    slug: "why-your-startup-needs-a-product-studio-not-an-agency",
    title: "Why Your Startup Needs a Product Studio, Not an Agency",
  },
  {
    slug: "building-a-saas-prototype-in-3-weeks-a-case-study",
    title: "Building an MVP in 3 Weeks: A SaaS Prototype Case Study",
  },
  {
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    title: "The Meteoric Guide to Choosing Your Tech Stack",
  },
];

export default function StartupWebDevelopmentPage() {
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
            Startup Web Development
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
        >
          Web Development for{" "}
          <span className="font-secondary-italic" style={{
            background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Startups
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mb-8"
        >
          Websites that work as hard as your team. We build fast, beautiful,
          and conversion-optimized web experiences for early-stage startups
          and funded companies alike.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-white/30 text-sm max-w-2xl mb-12"
        >
          Meteoric is a startup web development studio that treats your
          website as a product — not a brochure. Every page is optimized for
          speed, search visibility, and conversion. No bloated templates, no
          page builders. Just production-grade code shipped on Vercel.
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
            Why Startups Choose Meteoric
          </span>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Ship Fast",
                desc: "We work in 2-week sprints. Your website launches in weeks, not months. Average project timeline: 3-6 weeks from kickoff to launch.",
              },
              {
                title: "Built for Growth",
                desc: "Every page is SEO-optimized from day one. Structured data, Core Web Vitals, and AI-citation readiness built in — no afterthoughts.",
              },
              {
                title: "Founder-Led",
                desc: "You work directly with the founder. No account managers, no sales calls. One conversation from strategy to deployment.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold text-white mb-2 tracking-tight">{item.title}</h3>
                <p className="text-[#EAEFFF]/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.06]">
            <p className="text-[#EAEFFF]/35 text-xs">
              Read why <Link href="/blog/why-your-startup-needs-a-product-studio-not-an-agency" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200">founders prefer a product studio</Link> over a traditional agency.
            </p>
          </div>
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
            q: "What does a startup web development agency do?",
            a: "A startup web development agency builds websites and web applications specifically for early-stage and growing startups. Unlike traditional agencies that build brochure sites, startup agencies focus on speed, conversion, SEO readiness, and growth infrastructure. At Meteoric, we build using Next.js and Tailwind CSS for maximum performance and developer velocity.",
          },
          {
            q: "How fast can you build a startup website?",
            a_html: 'Most startup websites launch in 3-6 weeks. A standard 5-page site with blog, SEO setup, and analytics typically takes 3-4 weeks. More complex projects with custom functionality take 5-6 weeks. See our <a href="/work" class="text-white/60 hover:text-white underline underline-offset-2 transition-colors duration-200">portfolio</a> for examples.',
          },
          {
            q: "Do you build both marketing sites and web apps?",
            a: "Yes. We build marketing sites, landing pages, documentation hubs, and full SaaS web applications. Our stack (Next.js + Supabase) handles everything from a 5-page startup site to a multi-tenant SaaS platform.",
          },
          {
            q: "Do you handle SEO and analytics setup?",
            a: "Every project ships with technical SEO (structured data, meta tags, sitemaps), Core Web Vitals optimization, and analytics infrastructure. We also offer GEO (Generative Engine Optimization) to make your site citeable by AI chatbots like ChatGPT and Claude.",
          },
          {
            q: "How much does a startup website cost?",
            a: "A standard startup marketing site starts around $5,000-$12,000. Complex web applications and custom platforms range from $15,000-$50,000. We provide a transparent quote after understanding your needs.",
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
