import type { HomeServiceCard, Service } from "./types";

/**
 * Single source of truth for service content.
 *
 * Merges three previously duplicated sources:
 * - services index cards (`src/components/pages/Services.jsx`)
 * - home services section (`src/components/sections/ServicesSection.jsx`)
 * - detail pages + metadata (`app/(marketing)/services/[slug]/page.jsx`)
 *
 * Wording differs per surface on purpose (index card vs home card vs detail
 * meta) — those variants live here as separate fields, never rewritten.
 *
 * TODO(content): fill optional Service fields `audience`, `deliverables`,
 * `detailedDescription` with verified copy before rendering them anywhere.
 */

export const services: Service[] = [
  {
    slug: "landing-pages",
    title: "Landing Pages",
    shortDescription:
      "High-converting, fast-loading landing pages designed to make a lasting impression. Built with Next.js and optimized for SEO, speed, and conversion.",
    metadataTitle: "Landing Page Development Services | Next.js & SEO",
    metadataDescription:
      "Build fast, conversion-focused landing pages with Next.js, responsive design, animation, and SEO foundations tailored to your product, startup, or business.",
    h1: ["Landing Page", "Design"],
    tagline: "High-converting landing pages that ship in days.",
    directAnswer:
      "A landing page engagement covers strategy, custom design, build, SEO structure, and launch support — no templates. You bring the product and offer; Meteoric handles message flow, animation, and deployment. Exact timeline and cost depend on page count and content readiness, and are fixed after a scoping call.",
    relatedName: "Landing Pages",
    num: "01",
    image: "/images/service-web.webp",
    metric: "Ships in days",
    process: {
      intro:
        "Every landing page starts with understanding your audience and ends with a page that converts. No templates — every pixel is intentional.",
      steps: [
        {
          title: "Strategy & Wireframe",
          desc: "We map your audience, message, and conversion flow before a single pixel is designed.",
        },
        {
          title: "Design & Animate",
          desc: "Visual identity meets motion design. Scroll-triggered animations and micro-interactions.",
        },
        {
          title: "Build & Optimize",
          desc: "Next.js, Tailwind CSS, GSAP. Blazing fast load times and SEO foundations baked in.",
        },
      ],
    },
    sections: [
      {
        heading: "Built for conversion",
        body: "Every landing page starts with understanding your audience and ends with a page that converts. No templates — every pixel is intentional. We craft scroll-triggered animations, micro-interactions, and layouts that guide visitors exactly where they need to go.",
      },
      {
        heading: "What we deliver",
        body: "Custom design, GSAP/Framer Motion animations, SEO structure, contact forms, Cal.com integration, and analytics setup. Every page is optimized for fast load times and fully responsive across all devices.",
      },
      {
        heading: "Timeline",
        body: "Landing pages deliver in 3–7 days from concept to launch. We work in 10-day sprints with daily updates during active development so you're never waiting for progress.",
      },
    ],
    faqs: [
      {
        question: "How fast can you build a landing page?",
        answer:
          "Most landing pages ship in 3–7 days. The timeline depends on complexity — a single-page site with animations can be ready in 3 days, while multi-page projects may take up to a week.",
      },
      {
        question: "Can I update the landing page myself after launch?",
        answer:
          "Yes. We build on Next.js with a clean, documented codebase. We'll walk you through the basics or set up a simple CMS if you prefer. Post-launch support is included.",
      },
      {
        question: "Do you include SEO in landing page builds?",
        answer:
          "Yes. Every landing page includes meta tags, Open Graph, structured data, canonical URLs, sitemap integration, and performance optimization — all foundations for strong search visibility.",
      },
      {
        question: "What makes Meteoric's landing pages different?",
        answer:
          "We combine design, animation, and performance in one package. GSAP scroll animations, fast load times, and a conversion-focused layout — not a template, not a WordPress theme.",
      },
      {
        question: "What information do you need from me before we start?",
        answer:
          "A short brief is enough: what the product is, who it's for, the action you want visitors to take, and any brand assets or copy you already have. If the copy isn't ready, we can structure the page from your input and refine it together. Exact timeline and cost are confirmed after the scoping call.",
      },
    ],
  },
  {
    slug: "saas-development",
    title: "SaaS Development",
    shortDescription:
      "From MVP prototypes to production SaaS platforms. We design, build, and launch complete products — auth, dashboards, payments, and everything in between.",
    metadataTitle: "SaaS Development Agency | MVP & Product Development",
    metadataDescription:
      "Meteoric designs and develops SaaS products and MVPs with authentication, dashboards, payments, APIs, databases, and scalable full-stack architecture.",
    h1: ["SaaS", "Development"],
    tagline: "From idea to production SaaS — MVP in weeks, not months.",
    directAnswer:
      "Meteoric designs and builds SaaS MVPs and full products end to end: scoping, interface, auth, billing, dashboards, and deployment. The work runs in 10-day sprint cycles with weekly demos and fixed pricing agreed after the discovery call — you always know what is being built and when.",
    relatedName: "SaaS Development",
    num: "02",
    image: "/images/service-saas.webp",
    metric: "3-6 week MVP",
    process: {
      intro:
        "We build SaaS like a product studio, not an agency. Founder-level involvement and a technical stack built to scale.",
      steps: [
        {
          title: "Scope & Architect",
          desc: "Core 20% features that deliver 80% of value. Database schema, API design, auth flows mapped.",
        },
        {
          title: "Build & Ship MVP",
          desc: "Full-stack with Next.js, Supabase, and Stripe. Production-ready in 3-6 weeks.",
        },
        {
          title: "Scale & Iterate",
          desc: "Post-launch support, feature additions, and performance optimization.",
        },
      ],
    },
    relatedBlogPosts: [
      {
        slug: "how-to-build-a-saas-mvp-step-by-step-guide",
        title: "How to Build a SaaS MVP: Step-by-Step Guide",
      },
      {
        slug: "supabase-vs-firebase-2026-comparison",
        title: "Supabase vs Firebase 2026",
      },
      {
        slug: "mongodb-vs-postgresql-for-saas",
        title: "MongoDB vs PostgreSQL for SaaS",
      },
    ],
    sections: [
      {
        heading: "What is a SaaS development agency?",
        body: "A SaaS development agency designs, builds, and launches software-as-a-service products — from database architecture to subscription billing to deployment. Unlike generalist agencies, a SaaS-focused agency understands the specific challenges of subscription businesses: recurring revenue logic, multi-tenant architecture, usage-based billing, and the need to iterate fast without breaking what works. Meteoric is a founder-led SaaS agency: you work directly with the person writing the code, not an account manager.",
      },
      {
        heading: "What we build",
        body: "Complete SaaS platforms with authentication and user management, subscription billing via Stripe, real-time dashboards, admin panels, API integrations, and analytics. Our SaaS development covers the full stack: Next.js frontend, Supabase or PostgreSQL backend, third-party integrations, and Vercel deployment. We don't just build features — we architect your product for growth.",
      },
      {
        heading: "The SaaS problems we solve",
        body: "Choosing the right tech stack when every framework claims to be the best. Building an MVP in weeks, not months, when your runway is burning. Designing billing architecture that handles upgrades, downgrades, trials, and cancellations without bugs. Getting SEO right for a SaaS product so organic growth actually works. Scaling from 100 to 10,000 users without a rewrite. Integrating auth, payments, CRM, and analytics without duct tape. We've solved all of these — for real products, with real users.",
      },
      {
        heading: "Our SaaS development process",
        body: "Week 1: Scope and architect — database schema, API design, auth flows, billing integration plan. Weeks 2–4: Build and ship MVP — core features, user flows, and real-time capabilities. Week 5–6: Polish, deploy, and handoff — performance optimization, SEO foundations, monitoring, and documentation. Weekly demos keep you in the loop. No surprises, no scope creep.",
      },
      {
        heading: "Tech stack for SaaS development",
        body: "We build SaaS products on Next.js (frontend + API routes), Supabase (auth, database, real-time, storage), Stripe (subscription billing), Tailwind CSS (UI), and Vercel (deployment). This stack covers every layer of a SaaS product with minimal boilerplate and generous free tiers — you can launch your MVP for near-zero infrastructure cost.",
      },
      {
        heading: "Who we work with",
        body: "Pre-seed and seed SaaS founders who need an MVP to validate or raise. Series A startups scaling from MVP to production. Technical founders who need a design and product partner. Non-technical founders who need someone to translate ideas into buildable products. If you're building a SaaS product and need a team that moves at startup speed, we're a fit.",
      },
    ],
    faqs: [
      {
        question: "What does a SaaS development agency do?",
        answer:
          "A SaaS development agency designs, builds, and launches software-as-a-service products. This includes database architecture, user authentication, subscription billing, dashboards, APIs, and deployment. A good SaaS agency handles the entire lifecycle from idea to production.",
      },
      {
        question: "How much does it cost to build a SaaS MVP?",
        answer:
          "SaaS MVP costs depend on complexity. A focused MVP with auth, billing, and core features typically starts at a fixed project fee. Factors that affect cost: number of user roles, third-party integrations, real-time requirements, and design complexity. We quote fixed prices after a free strategy call — no hourly billing surprises.",
      },
      {
        question: "How long does it take to build a SaaS product?",
        answer:
          "Most SaaS MVPs ship in 3–6 weeks with a focused scope. Full-featured SaaS platforms take 6–10 weeks. Timeline depends on feature complexity, integrations, and design requirements. We give you a precise timeline after a free strategy call.",
      },
      {
        question: "What tech stack do you use for SaaS development?",
        answer:
          "Next.js, React, Supabase (PostgreSQL), Stripe, Tailwind CSS, and Framer Motion. We adapt to your existing stack if needed, but this is our proven stack for shipping SaaS products fast with low infrastructure costs.",
      },
      {
        question: "Do you build MVPs for early-stage startups?",
        answer:
          "Yes. MVP acceleration is a core service. We run a 3–6 week sprint from idea to deployed product with auth, payments, and a landing page. The goal is to get something in front of real users as fast as possible.",
      },
      {
        question: "Can you help rebuild or scale an existing SaaS product?",
        answer:
          "Yes. We handle tech stack migration, performance optimization, feature scaling, and architecture overhauls. If your current product is slow, buggy, or hard to maintain, we can fix it.",
      },
      {
        question: "How is Meteoric different from other SaaS development agencies?",
        answer:
          "Direct founder involvement, no account managers, 10-day sprint cycles, and fixed pricing. You work with the person who builds your product.",
      },
      {
        question: "Do you provide ongoing support after launch?",
        answer:
          "Yes. Performance monitoring, feature iteration, SEO optimization, and maintenance retainers. We treat every project as a long-term partnership and iterate based on real user feedback.",
      },
      {
        question: "What does a SaaS MVP development engagement include?",
        answer:
          "Scoping the core feature set, interface design, and implementation of auth, payments, dashboards, and APIs, plus deployment and launch support. Work runs in 10-day sprint cycles with weekly demos. What goes into your first version is agreed on the discovery call, and pricing is fixed before development starts.",
      },
    ],
  },
  {
    slug: "startup-web-development",
    title: "Full-Stack Development",
    shortDescription:
      "Frontend to backend, database to deployment. We build complete systems — APIs, auth, integrations, and polished interfaces — all under one roof.",
    metadataTitle: "Startup Web Development | Websites & Web Products",
    metadataDescription:
      "Custom web development for startups, from product websites and marketing pages to full web applications built with modern frontend and backend technologies.",
    h1: ["Startup Web", "Development"],
    tagline: "The web development agency that ships like a startup.",
    directAnswer:
      "Full-stack websites and MVPs for startups, built by the founder directly — no account managers. Strategy, design, development, and launch run in 10-day sprint cycles with weekly demos. Scope, timeline, and fixed pricing are agreed after a short scoping call, before any code is written.",
    relatedName: "Startup Web Development",
    num: "04",
    image: "/images/service-web.webp",
    metric: "One team, full stack",
    process: {
      intro:
        "No coordinating multiple vendors. We handle the entire stack — from database schema to pixel-perfect UI.",
      steps: [
        {
          title: "Architecture & Planning",
          desc: "Technical stack selection, system architecture, and database design.",
        },
        {
          title: "Build & Integrate",
          desc: "Frontend, backend, APIs, third-party integrations. Everything built to work together.",
        },
        {
          title: "Launch & Optimize",
          desc: "Performance optimization, SEO foundations, accessibility checks, and speed audits.",
        },
      ],
    },
    // TODO(content backlog): planned articles not yet published — re-add as
    // { slug, title } entries once they go live:
    //   - how-much-does-a-startup-website-cost  ("How Much Does a Startup Website Cost?")
    //   - how-to-choose-a-web-development-agency ("How to Choose a Web Development Agency")
    //   - react-vs-nextjs-for-startup-websites   ("React vs Next.js for Startup Websites")
    // See QA report P0 #1 (memory/audits/2026-09-30-final-production-qa.md).
    relatedBlogPosts: [],
    sections: [
      {
        heading: "What is a startup web development agency?",
        body: "A startup web development agency is a specialized partner that builds websites, MVPs, and web applications for early-stage companies. Unlike generalist agencies, startup-focused agencies understand limited runway, rapid iteration cycles, and the pressure to ship before competitors. They move faster and deliver products that validate ideas — not bloated enterprise builds that take months. Meteoric is a web development agency built for founders: founder-led, no account managers, 10-day sprint cycles, and fixed pricing.",
      },
      {
        heading: "What we build for startups",
        body: "Landing pages that convert, marketing websites that rank, MVPs that validate, and SaaS platforms that scale. Our web development for startups covers the full spectrum: custom design, modern stack (Next.js + Supabase), SEO foundations, performance optimization, and deployment. Every project includes analytics, mobile responsiveness, and post-launch support.",
      },
      {
        heading: "Startup problems we solve",
        body: "You need an MVP but can't afford a full-time engineering team. Your Webflow site is slow and limits what you can build. You need to raise but your current site looks amateur. You're technical but need design and product strategy. You need to validate an idea before committing months of development. We solve these problems every week — with focused sprints, fixed pricing, and a stack that ships fast.",
      },
      {
        heading: "Why startups choose Meteoric",
        body: "Meteoric delivers founder-level attention with startup-speed execution. We work in 10-day sprints with weekly updates and fixed pricing — no enterprise overhead, no surprise invoices. You get a production-grade product built by the person who founded the company, not a team of strangers.",
      },
      {
        heading: "Our startup development process",
        body: "We work in 10-day sprints with weekly updates. Week 1: Discovery and design direction. Weeks 2–3: Build core features. Week 4: Polish and deploy. For larger projects, we add sprints as needed. You get daily updates during active development, a clear timeline from day one, and a founder who picks up the phone. No project managers, no communication gaps.",
      },
      {
        heading: "Startup-friendly pricing",
        body: "We publish the ranges we work in: landing pages ship in 3–7 days, multi-page websites in 1–3 weeks, web applications in 2–6 weeks, and SaaS MVPs in 3–6 weeks. Every project is quoted at a fixed price after a free strategy call. No hourly billing, no surprise invoices. We work with pre-seed, seed, and Series A startups — the budget matches your stage.",
      },
    ],
    faqs: [
      {
        question: "What does a web development agency for startups do?",
        answer:
          "A web development agency for startups builds websites, MVPs, and SaaS products tailored to early-stage companies. This includes landing pages, marketing sites, web applications, and full-stack SaaS platforms — designed to ship fast and scale with the startup.",
      },
      {
        question: "How much does a startup website cost?",
        answer:
          "Landing pages start at a fixed price and deliver in 3–7 days. Multi-page websites range from 1–3 weeks. Web applications and SaaS MVPs from 2–6 weeks. Contact us for a free quote based on your specific needs.",
      },
      {
        question: "How long does it take to build a startup MVP?",
        answer:
          "Most startup MVPs ship in 3–6 weeks. The timeline depends on feature complexity and integrations. We give you a precise timeline after a free strategy call.",
      },
      {
        question: "Should I use no-code or hire a web development agency?",
        answer:
          "Use no-code for validation and prototyping — it's fast and cheap. Hire an agency when you need performance, SEO, scalability, or complex features. Many startups start with no-code and migrate to custom code once they've validated the idea.",
      },
      {
        question: "What tech stack is best for a startup in 2026?",
        answer:
          "Next.js + Supabase + Tailwind CSS for most SaaS startups. Fast to build, scales well, strong SEO, low cost to operate. This is the stack we use and recommend.",
      },
      {
        question: "Do you work with non-technical founders?",
        answer:
          "Yes. We provide product strategy, technical guidance, and translate ideas into buildable specs. You focus on the vision; we handle execution.",
      },
      {
        question: "What's included in post-launch support?",
        answer:
          "Bug fixes, performance monitoring, feature iteration, SEO optimization, and content updates. Available as a retainer or on-demand.",
      },
      {
        question: "How do you scope an MVP?",
        answer:
          "We start from the outcome you need, not a feature wishlist. On the discovery call we map the core user journey, cut anything that doesn't serve it, and agree on a first version with a clear definition of done. Timeline and cost follow from that scope and are fixed before the first sprint begins.",
      },
    ],
  },
  {
    slug: "nextjs-development",
    title: "Next.js Development",
    metadataTitle: "Next.js Development Agency | Modern Web Applications",
    metadataDescription:
      "Build Next.js websites and web applications with modern architecture, responsive interfaces, SEO foundations, and full-stack functionality.",
    h1: ["Next.js", "Development"],
    tagline: "React and Next.js. The right stack for modern web products.",
    directAnswer:
      "Meteoric builds and modernizes Next.js applications — marketing sites, dashboards, and full-stack products with server rendering, SEO foundations, and App Router patterns. Existing React or Next.js codebases can be audited, repaired, or extended rather than rewritten from scratch.",
    relatedName: "Next.js Development",
    sections: [
      {
        heading: "Why Next.js",
        body: "Server-side rendering, static generation, API routes, and React Server Components — Next.js gives you the performance of static with the power of dynamic.",
      },
      {
        heading: "What we build with Next.js",
        body: "Marketing websites with SSR/SSG, SaaS dashboards with real-time data, e-commerce fronts, API backends, and full-stack applications. Every project gets SEO-optimized metadata, image optimization, and fast load times.",
      },
      {
        heading: "Our expertise",
        body: "App Router, Server Components, Server Actions, middleware, route handlers, and streaming. We stay current with the latest Next.js features and React 19 patterns. Your project ships on the latest stable version.",
      },
    ],
    faqs: [
      {
        question: "Why choose Next.js for my project?",
        answer:
          "Next.js combines the best of static sites and dynamic servers. You get fast load times, great SEO, and the ability to add real-time features, auth, and APIs — all in one framework.",
      },
      {
        question: "Do you migrate existing sites to Next.js?",
        answer:
          "Yes. We've migrated WordPress, plain React, and other frameworks to Next.js. The result is typically faster page loads and significantly better SEO performance.",
      },
      {
        question: "Can you build the backend with Next.js too?",
        answer:
          "Yes. Next.js API routes and Server Actions can handle backend logic, database operations, and third-party integrations. For complex backends, we pair Next.js with Supabase or Node.js.",
      },
      {
        question: "Can Meteoric work with an existing Next.js or React codebase?",
        answer:
          "Yes. We audit the current setup, fix performance or structural issues, and continue development in your codebase — App Router or Pages Router, plain React, or a migration from another framework. You keep ownership of the repository, and we adapt to the process your team already uses.",
      },
    ],
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    shortDescription:
      "Custom web applications — dashboards, internal tools, and customer-facing platforms. Clean UI, solid backend, built to perform at scale.",
    metadataTitle: "Web Application Development | Custom Full-Stack Apps",
    metadataDescription:
      "Meteoric builds custom web applications, dashboards, internal tools, and customer-facing platforms with modern frontend, backend, database, and API architecture.",
    h1: ["Web", "Applications"],
    tagline: "Custom web apps that are fast, reliable, and a pleasure to use.",
    directAnswer:
      "Custom web apps — dashboards, internal tools, portals, and customer-facing platforms — built with Next.js, Node.js, and PostgreSQL. The engagement covers design through deployment, including auth, APIs, and integrations with the systems you already run.",
    relatedName: "Web Applications",
    num: "03",
    image: "/images/service-mobile.webp",
    metric: "Built to perform",
    process: {
      intro:
        "Whether it's an internal dashboard or a customer-facing platform, we build web apps that are fast, reliable, and a pleasure to use.",
      steps: [
        {
          title: "Discover & Map",
          desc: "User research, competitor analysis, and journey mapping.",
        },
        {
          title: "Design & Prototype",
          desc: "Wireframes to high-fidelity design to interactive prototype.",
        },
        {
          title: "Develop & Deploy",
          desc: "Clean code with Next.js, Node.js, and Supabase. Real-time features and API integrations.",
        },
      ],
    },
    sections: [
      {
        heading: "Purpose-built applications",
        body: "Dashboards, internal tools, customer portals, admin panels — whatever your business needs. We design and build web applications with clean UI, solid architecture, and real-time capabilities.",
      },
      {
        heading: "What's included",
        body: "User authentication, role-based access, real-time data, file uploads, search, filtering, data export, and API integrations. Every app is built with performance monitoring and error tracking from day one.",
      },
      {
        heading: "Tech stack",
        body: "Frontend: React, Next.js, Tailwind CSS. Backend: Node.js, Supabase, PostgreSQL. Auth: Supabase Auth or custom JWT. Deployment: Vercel with automated CI/CD. Monitoring: error tracking and analytics baked in.",
      },
    ],
    faqs: [
      {
        question: "What kind of web applications do you build?",
        answer:
          "Dashboards, internal tools, customer portals, data visualization platforms, booking systems, and more. If it runs in a browser, we can build it.",
      },
      {
        question: "Can you integrate with existing APIs or services?",
        answer:
          "Yes. We've integrated Stripe, Resend, Cal.com, Supabase, and custom APIs. We adapt to your existing infrastructure and third-party services.",
      },
      {
        question: "Do you build mobile-responsive web apps?",
        answer:
          "Every web app we build is fully responsive across desktop, tablet, and mobile. We design mobile-first and test across real devices before launch.",
      },
      {
        question: "Does the client own the source code?",
        answer:
          "Yes. You receive the full source code at handover and own it outright — no lock-in and no licensing restrictions. The stack is standard (Next.js, Node.js, PostgreSQL), so any competent development team can maintain it going forward if you ever choose to switch.",
      },
    ],
  },
];

/** Services index page display order — the four cards (nextjs has none). */
export const servicesIndex: Service[] = services
  .filter((s) => s.num)
  .sort((a, b) => (a.num ?? "").localeCompare(b.num ?? ""));

/** Home section cards — wording intentionally differs from the index. */
export const homeServiceCards: HomeServiceCard[] = [
  {
    title: "Landing Page",
    desc: "High-converting, fast-loading landing pages built to make a strong first impression and turn visitors into customers.",
    image: "/images/service-web.webp",
    href: "/services/landing-pages",
  },
  {
    title: "SaaS Development",
    desc: "End-to-end SaaS platforms and MVPs with authentication, dashboards, payments, and scalable architecture.",
    image: "/images/service-saas.webp",
    href: "/services/saas-development",
  },
  {
    title: "Web Apps",
    desc: "Full-stack web apps with clean UI, solid backend, and real-world functionality — built to actually ship.",
    image: "/images/service-mobile.webp",
    href: "/services/web-applications",
  },
  {
    title: "Full-Stack",
    desc: "Complete frontend and backend development — from APIs and databases to polished UI. Full stack, one team.",
    image: "/images/service-web.webp",
    href: "/services/nextjs-development",
  },
];

/** "Related services" links per service detail page. */
export const relatedServicesMap: Record<string, string[]> = {
  "landing-pages": ["saas-development", "web-applications"],
  "saas-development": ["startup-web-development", "nextjs-development"],
  "startup-web-development": ["saas-development", "landing-pages"],
  "nextjs-development": ["saas-development", "web-applications"],
  "web-applications": ["saas-development", "nextjs-development"],
};

/** Technologies marquee on the services index. */
export const techStack: string[] = [
  "Next.js",
  "React",
  "Supabase",
  "Node.js",
  "Tailwind CSS",
  "GSAP",
  "Stripe",
  "PostgreSQL",
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(
  slug: string,
): { slug: string; name: string }[] {
  return (relatedServicesMap[slug] ?? []).map((s) => ({
    slug: s,
    name: getService(s)?.relatedName ?? s,
  }));
}
