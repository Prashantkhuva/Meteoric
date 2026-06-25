import { useState } from "react";
import { MessageSquare, Rocket, Layers3, Gauge, Globe, AppWindow, LayoutDashboard, Boxes, ArrowUpRight, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    icon: <Globe size={20} />,
    title: "Landing Pages",
    description: "High-converting, fast-loading landing pages built to make a strong first impression and turn visitors into customers.",
    tag: "Design + Dev",
    details: "A landing page is often the first thing your audience sees — and first impressions matter. We build pages that load fast, look premium, and are designed to convert. Every section is intentional: clear headline, strong CTA, social proof, and mobile-first layout.",
    includes: [
      "Custom responsive design",
      "Framer Motion animations",
      "Contact or lead capture form",
      "Performance optimized",
      "SEO-ready structure",
    ],
    timeline: "3–7 days",
    stack: ["React", "Tailwind CSS", "Framer Motion"],
  },
  {
    icon: <AppWindow size={20} />,
    title: "Web Applications",
    description: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    tag: "Full-Stack",
    details: "Web apps are where complexity lives — authentication, data management, user flows, API integrations. We handle all of it. From the database schema to the frontend state management, everything is built to be clean, maintainable, and production-ready.",
    includes: [
      "User authentication & authorization",
      "REST API design and development",
      "Database design with MongoDB",
      "State management with Redux Toolkit",
      "Deployment on Vercel / Render",
    ],
    timeline: "2–6 weeks",
    stack: ["React", "Node.js", "MongoDB", "Express", "JWT"],
  },
  {
    icon: <LayoutDashboard size={20} />,
    title: "SaaS Products",
    description: "End-to-end SaaS platforms with authentication, dashboards, payments, and scalable architecture.",
    tag: "Product Dev",
    details: "Building a SaaS means thinking beyond features — it means building a product that retains users and scales. We help founders go from idea to a live, working product with all the core SaaS infrastructure: multi-user auth, subscription billing, dashboards, and admin controls.",
    includes: [
      "Multi-user authentication system",
      "Subscription billing integration",
      "User dashboard and analytics",
      "Admin panel",
      "Scalable backend architecture",
    ],
    timeline: "4–10 weeks",
    stack: ["React", "Node.js", "MongoDB", "Stripe", "Appwrite"],
  },
  {
    icon: <Boxes size={20} />,
    title: "Full-Stack Development",
    description: "Complete frontend and backend development — from database design to polished UI — using the MERN stack.",
    tag: "MERN Stack",
    details: "Have a custom idea that doesn't fit a template? We build fully custom full-stack applications from the ground up. Whether it's an internal tool, a marketplace, or a niche platform — we scope, plan, and execute it cleanly with no over-engineering.",
    includes: [
      "Custom frontend with React",
      "Node.js + Express backend",
      "MongoDB database architecture",
      "Third-party API integrations",
      "Full deployment and handoff",
    ],
    timeline: "Depends on scope",
    stack: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
  },
];

const capabilities = [
  {
    icon: <MessageSquare size={16} />,
    title: "Direct Access",
    description: "You work directly with the team — no account managers, no layers, full accountability.",
  },
  {
    icon: <Rocket size={16} />,
    title: "On-Time Delivery",
    description: "Clear timelines, no surprises. We set realistic deadlines and we stick to them.",
  },
  {
    icon: <Layers3 size={16} />,
    title: "Clean Codebase",
    description: "Well-structured, readable code you can hand off to any team.",
  },
  {
    icon: <Gauge size={16} />,
    title: "Post-Launch Support",
    description: "Bug fixes, tweaks, and guidance — we don't disappear after delivery.",
  },
];

export default function CapabilitiesSection() {
  const [activeService, setActiveService] = useState(null);

  return (
    <>
      <section id="services" className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-black">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

          {/* ── SERVICES HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <p className="text-white/30 uppercase tracking-[0.2em] text-xs mb-5">
                Services
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white">
                What we build
                <span className="block text-white/30 mt-1">for founders.</span>
              </h2>
            </div>
            <p className="text-[#EAEFFF]/40 text-sm leading-relaxed max-w-xs md:text-right">
              From a landing page to a full SaaS — we handle the entire stack.
            </p>
          </div>

          {/* ── SERVICES LIST ── */}
          <div className="border-t border-[#EAEFFF]/8 mb-28">
            {services.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                viewport={{ once: true }}
                onClick={() => setActiveService(item)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveService(item); } }}
                tabIndex={0}
                role="button"
                aria-label={`View details about ${item.title}`}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-7 border-b border-[#EAEFFF]/8 cursor-pointer transition-colors duration-300 hover:bg-[#EAEFFF]/[0.03] focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:-outline-offset-2"
              >
                {/* Left */}
                <div className="flex items-center gap-6 md:w-1/3">
                  <span className="text-[#EAEFFF]/15 text-sm font-mono">0{index + 1}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl border border-[#EAEFFF]/8 bg-[#EAEFFF]/4 flex items-center justify-center text-[#EAEFFF]/50 group-hover:border-[#EAEFFF]/20 group-hover:text-[#EAEFFF]/80 transition-all duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-[#EAEFFF] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Middle */}
                <p className="text-[#EAEFFF]/45 text-sm leading-relaxed md:w-1/2 md:max-w-md">
                  {item.description}
                </p>

                {/* Right */}
                <div className="flex items-center gap-3 md:justify-end md:w-1/6">
                  <span className="text-xs px-3 py-1 rounded-full border border-[#EAEFFF]/8 bg-[#EAEFFF]/4 text-[#EAEFFF]/30">
                    {item.tag}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-[#EAEFFF]/20 group-hover:text-[#EAEFFF]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── HOW WE WORK ── */}
          <div className="mb-12">
            <p className="text-white/30 uppercase tracking-[0.2em] text-xs mb-5">
              How We Work
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold leading-[1.05] tracking-tight text-white">
              What you can expect
              <span className="text-white/30"> working with us.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {capabilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-[#EAEFFF]/8 bg-black p-6 hover:border-[#EAEFFF]/18 hover:bg-[#050505] hover:shadow-[0_0_28px_rgba(234,239,255,0.035)] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl border border-[#EAEFFF]/8 bg-[#EAEFFF]/4 flex items-center justify-center text-[#EAEFFF]/50 mb-5 group-hover:text-[#EAEFFF]/70 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#EAEFFF] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[#EAEFFF]/45 text-xs leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

       

        </div>
      </section>

      {/* ── SERVICE DETAIL MODAL ── */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              onKeyDown={(e) => { if (e.key === "Escape") setActiveService(null); }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10 w-full max-w-xl rounded-2xl border border-white/[0.08] bg-black p-6 sm:p-8 shadow-[0_0_80px_rgba(234,239,255,0.06)]"
            >
              {/* Close */}
              <button
                onClick={() => setActiveService(null)}
                aria-label="Close dialog"
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[#EAEFFF]/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              {/* Icon + title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 flex items-center justify-center text-[#EAEFFF]/70">
                  {activeService.icon}
                </div>
                <div>
                  <p className="text-[#EAEFFF]/30 text-xs uppercase tracking-widest mb-0.5">{activeService.tag}</p>
                  <h3 id="service-modal-title" className="text-xl font-semibold text-[#EAEFFF] tracking-tight">{activeService.title}</h3>
                </div>
              </div>

              {/* Details */}
              <p className="text-[#EAEFFF]/50 text-sm leading-relaxed mb-7">
                {activeService.details}
              </p>

              {/* Divider */}
              <div className="h-px bg-[#EAEFFF]/8 mb-7" />

              {/* What's included */}
              <div className="mb-7">
                <p className="text-[#EAEFFF]/25 text-xs uppercase tracking-widest mb-4">What's Included</p>
                <div className="space-y-2.5">
                  {activeService.includes.map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#EAEFFF]/8 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={9} className="text-[#EAEFFF]/60" />
                      </div>
                      <p className="text-[#EAEFFF]/55 text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline + stack */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div>
                  <p className="text-[#EAEFFF]/25 text-xs uppercase tracking-widest mb-2">Timeline</p>
                  <p className="text-[#EAEFFF]/70 text-sm font-medium">{activeService.timeline}</p>
                </div>
                <div>
                  <p className="text-[#EAEFFF]/25 text-xs uppercase tracking-widest mb-2">Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeService.stack.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-[#EAEFFF]/8 bg-[#EAEFFF]/4 text-[#EAEFFF]/40">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                data-cal-namespace="let-s-build"
                data-cal-link="prashantkhuva/let-s-build"
                data-cal-config='{"layout":"month_view"}'
                className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Start This Project
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
