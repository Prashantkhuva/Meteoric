import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../Components/Navbar";

const stack = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "TypeScript",
  "Tailwind CSS",
  "Redux Toolkit",
  "Appwrite",
  "Framer Motion",
  "REST APIs",
];

const stats = [
  { value: "2+", label: "Years Building" },
  { value: "3", label: "Shipped Projects" },
  { value: "MERN", label: "Core Stack" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white">
        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white/25 uppercase tracking-[0.3em] text-xs mb-10"
          >
            About
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* LEFT — photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Photo container */}
              <div className="relative overflow-hidden rounded-2xl aspect-4/5 bg-[#111]">
                <img
                  src="/prashant.png"
                  alt="Prashant Khuva"
                  className="w-full h-full object-cover object-top"
                />
                {/* Subtle bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Available badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/60 font-medium">
                  Available for Work
                </span>
              </div>
            </motion.div>

            {/* RIGHT — content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-8 md:pt-4"
            >
              {/* Heading */}
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                  Prashant Khuva
                  <span className="block text-white/25 mt-1 text-3xl md:text-4xl">
                    Full-Stack Developer
                  </span>
                </h1>
              </div>

              {/* Bio */}
              <div className="space-y-4 text-[#EAEFFF]/50 text-base leading-relaxed">
                <p>
                  I'm a self-taught full-stack developer focused on building
                  clean, fast, and production-ready web products for founders
                  and small businesses.
                </p>
                <p>
                  No agency overhead. No project managers. You work directly
                  with the person writing your code — from first call to final
                  deploy.
                </p>
                <p>
                  I started from zero, learning everything through building real
                  projects. That's exactly the mindset I bring to every client's
                  product.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-white/30 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Stack */}
              <div>
                <p className="text-white/20 text-xs uppercase tracking-widest mb-4">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div>
                <p className="text-white/20 text-xs uppercase tracking-widest mb-4">
                  Contact
                </p>
                <a
                  href="mailto:work.prashantkhuva@gmail.com"
                  className="text-white/45 hover:text-white text-sm transition-colors duration-200"
                >
                  work.prashantkhuva@gmail.com
                </a>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Links */}
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "GitHub", href: "https://github.com/Prashantkhuva" },
                  {
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/in/prashantkhuva",
                  },
                  {
                    label: "X / Twitter",
                    href: "https://x.com/prashantkhuva_",
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-sm transition-colors group"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
