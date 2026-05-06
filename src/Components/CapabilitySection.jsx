import React from "react";
import { MessageSquare, Rocket, Layers3, Gauge } from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  {
    icon: <MessageSquare size={20} />,
    title: "Clear Communication",
    description:
      "Fast replies, structured updates, and transparent collaboration throughout the project lifecycle.",
  },

  {
    icon: <Rocket size={20} />,
    title: "Fast Execution",
    description:
      "From concept to production-ready experiences with efficient workflows and rapid iteration cycles.",
  },

  {
    icon: <Layers3 size={20} />,
    title: "Scalable Foundations",
    description:
      "Clean frontend and backend architecture designed to grow alongside your product and business.",
  },

  {
    icon: <Gauge size={20} />,
    title: "Performance Focused",
    description:
      "Interfaces optimized for responsiveness, smooth interactions, and real-world usability.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.03),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* TOP */}
        <div className="max-w-4xl mb-20">
          <p className="text-[#EAEFFF]/40 uppercase tracking-[0.2em] text-sm mb-6">
            Working Together
          </p>

          <h2 className="text-4xl md:text-6xl leading-[1.05] font-semibold tracking-tight text-[#EAEFFF]">
            What you can expect
            <span className="text-[#EAEFFF]/40"> when building with me.</span>
          </h2>

          <p className="mt-8 text-[#EAEFFF]/50 text-lg leading-relaxed max-w-2xl">
            A workflow focused on speed, clarity, scalability, and polished
            digital experiences.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -6,
              }}
              className="group relative overflow-hidden rounded-[30px] border border-[#EAEFFF]/10 bg-[#0d0d0d] p-8 transition-all duration-500 hover:border-[#EAEFFF]/15 hover:bg-[#101010] hover:shadow-[0_0_40px_rgba(234,239,255,0.04)]"
            >
              {/* ambient glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#EAEFFF]/6 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* animated border */}
              <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                <div
                  className="absolute inset-0 rounded-[30px] p-[1px]"
                  style={{
                    background: `
                      repeating-conic-gradient(
                        from 180deg at 50% 50%,
                        #EAEFFF 0%,
                        rgba(234,239,255,0.8) 8%,
                        rgba(234,239,255,0.12) 16%,
                        rgba(234,239,255,0.8) 24%,
                        #EAEFFF 32%
                      )
                    `,
                  }}
                >
                  <div className="h-full w-full rounded-[30px] bg-[#0d0d0d]" />
                </div>
              </div>

              <div className="relative z-10">
                {/* icon */}
                <div className="w-12 h-12 rounded-2xl border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 flex items-center justify-center text-[#EAEFFF]/70 mb-8">
                  {item.icon}
                </div>

                {/* title */}
                <h3 className="text-2xl font-semibold tracking-tight text-[#EAEFFF] mb-4">
                  {item.title}
                </h3>

                {/* desc */}
                <p className="text-[#EAEFFF]/50 leading-relaxed text-base max-w-md">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* bottom strip */}
        <div className="mt-20 rounded-[30px] border border-[#EAEFFF]/10 bg-[#0d0d0d] px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[#EAEFFF]/35 uppercase tracking-[0.18em] text-xs mb-3">
              Currently Building
            </p>

            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#EAEFFF]">
              Full-stack products, SaaS platforms,
              <span className="text-[#EAEFFF]/40">
                {" "}
                and premium web experiences.
              </span>
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "ExpressJS",
              "Appwrite",
              "Firebase",
              "REST APIs",
              "Tailwind CSS",
            ].map((tag, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 text-[#EAEFFF]/45 text-sm"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
