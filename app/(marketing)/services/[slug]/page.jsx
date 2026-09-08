import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo/config";
import { buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo/jsonLd";
import ServiceLanding from "@/components/pages/ServiceLanding";

const serviceData = {
  "landing-pages": {
    title: "Landing Pages That Convert — Design & Build | Meteoric",
    desc: "Custom landing pages designed and built to convert — no templates. Premium design, GSAP motion, and 95+ Lighthouse scores, shipped in days.",
    h1: ["Landing Page", "Design"],
    tagline: "High-converting landing pages that ship in days.",
    sections: [
      {
        heading: "Built for conversion",
        body: "Every landing page starts with understanding your audience and ends with a page that converts. No templates — every pixel is intentional. We craft scroll-triggered animations, micro-interactions, and layouts that guide visitors exactly where they need to go.",
      },
      {
        heading: "What we deliver",
        body: "Custom design, GSAP/Framer Motion animations, SEO structure, contact forms, Cal.com integration, and analytics setup. Every page ships with 95+ Lighthouse scores and is fully responsive across all devices.",
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
          "We combine design, animation, and performance in one package. GSAP scroll animations, 95+ Lighthouse scores, and a conversion-focused layout — not a template, not a WordPress theme.",
      },
    ],
  },
  "saas-development": {
    title: "SaaS Development Agency — MVP to Production | Meteoric",
    desc: "Meteoric is a SaaS development agency that builds production-ready SaaS products — auth, billing, dashboards, and deployment — in weeks, not months. Founder-led, no account managers.",
    h1: ["SaaS", "Development"],
    tagline: "From idea to production SaaS — MVP in weeks, not months.",
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
        body: "A SaaS development agency designs, builds, and launches software-as-a-service products — from database architecture to subscription billing to deployment. Unlike generalist agencies, a SaaS-focused agency understands the specific challenges of subscription businesses: recurring revenue logic, multi-tenant architecture, usage-based billing, and the need to iterate fast without breaking what works. Meteoric is a founder-led SaaS agency: you work directly with the person writing the code, not an account manager. We've shipped 12+ production SaaS platforms across fintech, edtech, healthtech, and B2B tools.",
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
          "Most SaaS MVPs ship in 3–6 weeks with a focused scope. Full-featured products take 3–6 months. Timeline depends on feature complexity, integrations, and design requirements. We give you a precise timeline after a free strategy call.",
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
          "Direct founder involvement, no account managers, 10-day sprint cycles, fixed pricing, and a track record of 12+ production projects with 100% client satisfaction. You work with the person who builds your product.",
      },
      {
        question: "Do you provide ongoing support after launch?",
        answer:
          "Yes. Performance monitoring, feature iteration, SEO optimization, and maintenance retainers. We treat every project as a long-term partnership and iterate based on real user feedback.",
      },
    ],
  },
  "startup-web-development": {
    title: "Web Development Agency for Startups — Ship Fast | Meteoric",
    desc: "Meteoric is a web development agency for startups. We build high-performance websites, MVPs, and SaaS products that ship in days, not quarters.",
    h1: ["Startup Web", "Development"],
    tagline: "The web development agency that ships like a startup.",
    relatedBlogPosts: [
      {
        slug: "how-much-does-a-startup-website-cost",
        title: "How Much Does a Startup Website Cost?",
      },
      {
        slug: "how-to-choose-a-web-development-agency",
        title: "How to Choose a Web Development Agency",
      },
      {
        slug: "react-vs-nextjs-for-startup-websites",
        title: "React vs Next.js for Startup Websites",
      },
    ],
    sections: [
      {
        heading: "What is a startup web development agency?",
        body: "A startup web development agency is a specialized partner that builds websites, MVPs, and web applications for early-stage companies. Unlike generalist agencies, startup-focused agencies understand limited runway, rapid iteration cycles, and the pressure to ship before competitors. They move faster, charge less, and deliver products that validate ideas — not bloated enterprise builds that take months. Meteoric is a web development agency built for founders: founder-led, no account managers, 10-day sprint cycles, and fixed pricing.",
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
        heading: "Why startups choose Meteoric over freelancers and large agencies",
        body: "Freelancers are cheap but unreliable — they disappear, miss deadlines, or can't handle full-stack work. Large agencies are thorough but slow — 3-month timelines and $100K+ budgets that burn runway. Meteoric sits in the middle: founder-level attention, startup-speed execution, and pricing that matches your stage. We work in 10-day sprints with weekly updates. You get a production-grade product without the enterprise overhead.",
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
    ],
  },
  "nextjs-development": {
    title: "Next.js Development — React & Next.js Experts | Meteoric",
    desc: "React and Next.js applications built on the latest stack — from marketing sites to full-stack SaaS. Fast, scalable, and SEO-ready from day one.",
    h1: ["Next.js", "Development"],
    tagline: "React and Next.js. The right stack for modern web products.",
    sections: [
      {
        heading: "Why Next.js",
        body: "Server-side rendering, static generation, API routes, and React Server Components — Next.js gives you the performance of static with the power of dynamic. We've shipped 12+ production Next.js applications.",
      },
      {
        heading: "What we build with Next.js",
        body: "Marketing websites with SSR/SSG, SaaS dashboards with real-time data, e-commerce fronts, API backends, and full-stack applications. Every project gets SEO-optimized metadata, image optimization, and fast Lighthouse scores.",
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
          "Yes. We've migrated WordPress, plain React, and other frameworks to Next.js. The result is typically 2–3x faster page loads and significantly better SEO performance.",
      },
      {
        question: "Can you build the backend with Next.js too?",
        answer:
          "Yes. Next.js API routes and Server Actions can handle backend logic, database operations, and third-party integrations. For complex backends, we pair Next.js with Supabase or Node.js.",
      },
    ],
  },
  "saas-development-agency": {
    title: "SaaS Development Agency — From Idea to Production | Meteoric",
    desc: "Meteoric is a founder-led SaaS development agency. We build production-ready SaaS products — auth, billing, dashboards, and deployment — in weeks, not months.",
    h1: ["SaaS Development", "Agency"],
    tagline: "Founder-led SaaS development. MVP in weeks, not months.",
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
        heading: "Why Meteoric as your SaaS development agency",
        body: "A SaaS development agency designs, builds, and launches software-as-a-service products — from database architecture to subscription billing to deployment. Meteoric is a founder-led SaaS agency: you work directly with the person writing the code, not an account manager. We've shipped 12+ production SaaS platforms across fintech, edtech, healthtech, and B2B tools. Every project gets founder-level attention, transparent communication, and a product that's built to scale.",
      },
      {
        heading: "What we build as a SaaS development agency",
        body: "Complete SaaS platforms with authentication and user management, subscription billing via Stripe, real-time dashboards, admin panels, API integrations, and analytics. Our SaaS development covers the full stack: Next.js frontend, Supabase or PostgreSQL backend, third-party integrations, and Vercel deployment. We don't just build features — we architect your product for growth.",
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
        heading: "SaaS development that's different",
        body: "Most SaaS agencies hand you off to a project manager. At Meteoric, the founder builds your product. We work in 10-day sprints with daily updates during active development. You get a production-ready SaaS platform — not a prototype, not a no-code hack — built with clean code, documented architecture, and post-launch support included. Our clients stay because the product works, not because of a contract.",
      },
    ],
    faqs: [
      {
        question: "What does a SaaS development agency do?",
        answer:
          "A SaaS development agency designs, builds, and launches software-as-a-service products. This includes database architecture, user authentication, subscription billing, dashboards, APIs, and deployment. A good SaaS agency handles the entire lifecycle from idea to production.",
      },
      {
        question:
          "How long does it take a SaaS development agency to build an MVP?",
        answer:
          "Most SaaS MVPs ship in 3–6 weeks with a focused scope. Timeline depends on feature complexity, third-party integrations, and design requirements. At Meteoric, we give you a precise timeline after a free strategy call.",
      },
      {
        question: "How much does a SaaS development agency charge?",
        answer:
          "SaaS development costs vary by scope. A basic MVP with auth, billing, and core functionality typically starts at a fixed project fee. At Meteoric, we quote fixed prices after a free strategy call — no hourly billing surprises.",
      },
      {
        question: "What tech stack does Meteoric use for SaaS development?",
        answer:
          "Next.js, React, Supabase (PostgreSQL), Stripe, Tailwind CSS, and Framer Motion. We adapt to your existing stack if needed, but this is our proven stack for shipping SaaS products fast.",
      },
      {
        question:
          "How is Meteoric different from other SaaS development agencies?",
        answer:
          "Direct founder involvement, no account managers, 10-day sprint cycles, fixed pricing, and a track record of 12+ production projects with 100% client satisfaction. You work with the person who builds your product.",
      },
    ],
  },
  "web-development-agency-for-startups": {
    title: "Web Development Agency for Startups — Ship Fast | Meteoric",
    desc: "Meteoric is a web development agency for startups. We build high-performance websites, MVPs, and SaaS products that ship in days, not quarters.",
    h1: ["Web Development", "for Startups"],
    tagline: "The web development agency that ships like a startup.",
    relatedBlogPosts: [
      {
        slug: "how-much-does-a-startup-website-cost",
        title: "How Much Does a Startup Website Cost?",
      },
      {
        slug: "how-to-choose-a-web-development-agency",
        title: "How to Choose a Web Development Agency",
      },
      {
        slug: "react-vs-nextjs-for-startup-websites",
        title: "React vs Next.js for Startup Websites",
      },
    ],
    sections: [
      {
        heading: "Why startups choose Meteoric",
        body: "Startups need speed, quality, and a team that understands urgency. Meteoric is a web development agency built for founders: founder-led, no account managers, 10-day sprint cycles, and fixed pricing. We've helped startups go from idea to launch in weeks — landing pages in 3–7 days, MVPs in 3–6 weeks, and full SaaS platforms in 6–10 weeks. Your product ships fast because the person building it cares about your timeline.",
      },
      {
        heading: "What we build for startups",
        body: "Landing pages that convert, marketing websites that rank, MVPs that validate, and SaaS platforms that scale. Our web development for startups covers the full spectrum: custom design, modern stack (Next.js + Supabase), SEO foundations, performance optimization, and deployment. Every project includes analytics, mobile responsiveness, and post-launch support.",
      },
      {
        heading: "Our startup development process",
        body: "We work in 10-day sprints with weekly updates. Week 1: Discovery and design direction. Weeks 2–3: Build core features. Week 4: Polish and deploy. For larger projects, we add sprints as needed. You get daily updates during active development, a clear timeline from day one, and a founder who picks up the phone. No project managers, no communication gaps.",
      },
      {
        heading: "Startup-friendly pricing",
        body: "We publish the ranges we work in: landing pages ship in 3–7 days, multi-page websites in 1–3 weeks, web applications in 2–6 weeks, and SaaS MVPs in 3–6 weeks. Every project is quoted at a fixed price after a free strategy call. No hourly billing, no surprise invoices. We work with pre-seed, seed, and Series A startups — the budget matches your stage.",
      },
      {
        heading: "Built for startups, not enterprises",
        body: "Enterprise agencies move slowly and charge accordingly. Meteoric moves at startup speed. We use a modern stack (Next.js, Supabase, Tailwind CSS, Vercel) that ships fast and scales well. We don't over-engineer — we build what you need now and architect for what you'll need next. The result: a product that loads fast, converts visitors, and doesn't need a rewrite in 6 months.",
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
        question: "Do you work with pre-seed startups?",
        answer:
          "Yes. We specialize in helping early-stage startups launch their first website or MVP. Our process is designed for founders who need to move fast without sacrificing quality.",
      },
      {
        question: "How long does it take to build a startup MVP?",
        answer:
          "Most startup MVPs ship in 3–6 weeks. The timeline depends on feature complexity and integrations. We give you a precise timeline after a free strategy call.",
      },
      {
        question: "What tech stack do you use for startups?",
        answer:
          "Next.js, React, Supabase (PostgreSQL), Stripe, Tailwind CSS, and Vercel. This stack covers frontend, backend, auth, billing, and hosting with minimal setup and generous free tiers.",
      },
    ],
  },
  "web-applications": {
    title: "Custom Web Applications — Dashboards & Tools | Meteoric",
    desc: "Purpose-built web applications — dashboards, portals, and internal tools. Clean interfaces, solid architecture, and real-time by default.",
    h1: ["Web", "Applications"],
    tagline: "Custom web apps that are fast, reliable, and a pleasure to use.",
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
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) return {};
  return {
    title: service.title,
    description: service.desc,
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
    openGraph: {
      title: service.title,
      description: service.desc,
      url: `${SITE_URL}/services/${slug}`,
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: service.title,
      description: service.desc,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) notFound();

  const faqJsonLd = buildFaqJsonLd(service.faqs);

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: service.title,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".sr-only"],
    },
  };

  const howToJsonLd = buildHowToJsonLd(
    (service.sections || []).map((s) => ({
      name: s.heading,
      text: s.body,
    })),
    `How Meteoric builds ${service.h1.join(" ")} products`,
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.h1.join(" "),
        item: `${SITE_URL}/services/${slug}`,
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1.join(" "),
    description: service.desc,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Meteoric",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    serviceType: service.h1.join(" "),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ServiceLanding service={service} />
    </>
  );
}
