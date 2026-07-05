"use client";

import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Landing Pages",
    desc: "High-converting, fast-loading landing pages built to make a strong first impression and turn visitors into customers.",
    tag: "Design + Dev",
    img: "/we-do-1.avif",
  },
  {
    num: "02",
    title: "Web Applications",
    desc: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    tag: "Full-Stack",
    img: "/we-do-2.avif",
  },
  {
    num: "03",
    title: "SaaS Products",
    desc: "End-to-end SaaS platforms with authentication, dashboards, payments, and scalable architecture.",
    tag: "Product Dev",
    img: "/we-do-3.avif",
  },
  {
    num: "04",
    title: "Full-Stack Development",
    desc: "Complete frontend and backend development — from database design to polished UI.",
    tag: "MERN Stack",
    img: "/we-do-4.avif",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ServicesSection() {
  return (
    <section className="relative w-full bg-black px-6 md:px-16 py-28 md:py-36">
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full px-5 py-2"
          style={{
            backgroundColor: "#1b1b1b",
            boxShadow: "inset 1.5px 1.5px 2px 0px rgba(255,255,255,0.15)",
          }}
        >
          <svg
            role="presentation"
            viewBox="0 0 24 24"
            style={{ opacity: 1 }}
            width={24}
            height={24}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          <span
            className="text-xs font-normal uppercase tracking-[0.15em]"
            style={{ color: "#eee" }}
          >
            Our Services
          </span>
        </motion.div>

        {/* Heading + Description */}
        <div className="grid md:grid-cols-2 gap-10 mb-20 mt-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-[clamp(2.5rem,7vw,72px)] leading-[0.92] tracking-[-0.03em] font-normal text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
              <span className="block">What we build</span>
              <span
                className="block text-transparent bg-clip-text font-display-italic"
                style={{
                  backgroundImage: "linear-gradient(97deg, #fff 0%, #999 100%)",
                }}
              >
                for founders.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-base md:text-lg leading-relaxed self-center max-w-md"
            style={{ color: "#808080" }}
          >
            From a landing page to a full SaaS — we handle the entire stack.
          </motion.p>
        </div>

        {/* Service Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {services.map((s, idx) => (
            <motion.div
              key={s.num}
              variants={itemVariants}
              className="group relative overflow-hidden"
              style={{
                borderRight:
                  idx % 4 !== 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Card Inner */}
              <div
                className="relative p-8 md:p-10"
                style={{
                  border: "1px solid rgb(47, 47, 47)",
                  margin: -1,
                  background: "rgb(0,0,0)",
                }}
              >
                {/* BG */}
                <div className="absolute inset-0" style={{ backgroundColor: "rgb(0,0,0)" }} />

                {/* Image */}
                <div className="relative z-[1] w-[152px] h-[152px] md:w-[190px] md:h-[190px] mb-8 overflow-hidden rounded-2xl mx-auto">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-contain"
                    style={{ display: "block" }}
                  />
                </div>

                {/* Hover Image Overlay */}
                <div
                  className="absolute z-[2] inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                    <svg
                      viewBox="0 0 324 381"
                      className="w-[202px] h-[238px] md:w-[260px] md:h-[306px]"
                      style={{ opacity: 0.2 }}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M162 0L323.5 95.5V286.5L162 381L0.5 286.5V95.5L162 0Z"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M162 20L304 106V276L162 361L20 276V106L162 20Z"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M162 40L284 116V256L162 341L40 256V116L162 40Z"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover BG Gradient */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 46%)",
                  }}
                />

                {/* Content */}
                <div className="relative z-[3]">
                  <p
                    className="text-sm font-mono tracking-wider mb-3"
                    style={{ color: "#eee" }}
                  >
                    {s.num}
                  </p>
                  <h3
                    className="text-xl md:text-2xl font-semibold mb-3"
                    style={{ color: "#eee" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-xs"
                    style={{ color: "#808080" }}
                  >
                    {s.desc}
                  </p>

                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
