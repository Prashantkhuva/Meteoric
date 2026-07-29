import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo/config";
import { buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo/jsonLd";
import ServiceLanding from "@/components/pages/ServiceLanding";

const serviceData = {
  "landing-pages": {
    title: "Landing Page Design Agency | Meteoric",
    desc: "Meteoric builds high-converting landing pages with Next.js. Custom design, animations, SEO, and fast delivery.",
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
      { question: "How fast can you build a landing page?", answer: "Most landing pages ship in 3–7 days. The timeline depends on complexity — a single-page site with animations can be ready in 3 days, while multi-page projects may take up to a week." },
      { question: "Can I update the landing page myself after launch?", answer: "Yes. We build on Next.js with a clean, documented codebase. We'll walk you through the basics or set up a simple CMS if you prefer. Post-launch support is included." },
      { question: "Do you include SEO in landing page builds?", answer: "Yes. Every landing page includes meta tags, Open Graph, structured data, canonical URLs, sitemap integration, and performance optimization — all foundations for strong search visibility." },
      { question: "What makes Meteoric's landing pages different?", answer: "We combine design, animation, and performance in one package. GSAP scroll animations, 95+ Lighthouse scores, and a conversion-focused layout — not a template, not a WordPress theme." },
    ],
  },
  "saas-development": {
    title: "SaaS Development Agency | Meteoric",
    desc: "Meteoric ships SaaS MVPs in 3–6 weeks. Full-stack SaaS development with Next.js, Supabase, Stripe — auth, billing, dashboards included. Founder-led, production-ready.",
    h1: ["SaaS", "Development"],
    tagline: "From idea to production SaaS — MVP in weeks, not months.",
    sections: [
      {
        heading: "We build SaaS like a product studio",
        body: "Founder-level involvement, no account managers. We handle the entire lifecycle — from database schema to subscription billing to deployment. You get a production-ready SaaS platform, not a prototype.",
      },
      {
        heading: "What we ship",
        body: "Auth & user management, dashboard interfaces, subscription billing (Stripe), real-time features, API integrations, admin panels, and analytics. Every project includes performance optimization, SEO foundations, and post-launch support.",
      },
      {
        heading: "Our process",
        body: "Week 1: Scope & architect (database, API, auth flows). Weeks 2–4: Build & ship MVP. Week 5–6: Polish, deploy, and handoff. Weekly updates, transparent communication, no surprises.",
      },
    ],
    faqs: [
      { question: "How long does it take to build a SaaS MVP?", answer: "Most SaaS MVPs ship in 3–6 weeks. Timeline depends on feature complexity, third-party integrations, and design requirements. We give you a precise timeline after the free strategy call." },
      { question: "What tech stack do you use for SaaS?", answer: "Next.js, React, Supabase (PostgreSQL), Stripe, Tailwind CSS, and Framer Motion. We adapt to your existing stack if needed." },
      { question: "Can you add features after the MVP launches?", answer: "Yes. Every project includes post-launch support. We treat each product as a long-term partnership and iterate based on real user feedback." },
      { question: "How is Meteoric different from other SaaS agencies?", answer: "Direct founder involvement, no account managers, 10-day sprint cycles, and a track record of 12+ production projects with 100% client satisfaction." },
    ],
  },
  "startup-web-development": {
    title: "Startup Web Development Agency | Meteoric",
    desc: "Meteoric builds high-performance websites for startups. Next.js, modern stack, fast delivery. Landing pages in 3–7 days, multi-page sites in 1–3 weeks. Founder-led development.",
    h1: ["Startup Web", "Development"],
    tagline: "Your startup's website ships in days, not quarters.",
    sections: [
      {
        heading: "Built for startups",
        body: "Speed matters. We build high-performance websites that load fast, convert visitors, and scale with your startup. No bloated CMS, no unnecessary dependencies — just clean, modern code.",
      },
      {
        heading: "What we deliver",
        body: "Marketing websites, landing pages, documentation sites, and web applications. Every project includes SEO foundations, performance optimization, mobile responsiveness, and analytics setup.",
      },
      {
        heading: "Typical timeline",
        body: "Landing pages: 3–7 days. Multi-page websites: 1–3 weeks. Web applications: 2–6 weeks. We work in 10-day sprints with weekly updates so you're never in the dark.",
      },
    ],
    faqs: [
      { question: "How much does a startup website cost?", answer: "Landing pages start at a fixed price and deliver in 3–7 days. Multi-page websites and web applications are scoped per project. Contact us for a free quote based on your specific needs." },
      { question: "Do you work with pre-seed startups?", answer: "Yes. We specialize in helping early-stage startups launch their first website or MVP. Our process is designed for founders who need to move fast without sacrificing quality." },
      { question: "Can I update the website myself after launch?", answer: "Yes. We build on Next.js with a clean, documented codebase. We'll walk you through the basics or set up a simple CMS if needed. Post-launch support is included." },
    ],
  },
  "nextjs-development": {
    title: "Next.js Development Agency | Meteoric",
    desc: "Meteoric is a Next.js development agency building React and Next.js applications — from landing pages to full-stack SaaS. 12+ production projects. SEO, speed, scalability.",
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
      { question: "Why choose Next.js for my project?", answer: "Next.js combines the best of static sites and dynamic servers. You get fast load times, great SEO, and the ability to add real-time features, auth, and APIs — all in one framework." },
      { question: "Do you migrate existing sites to Next.js?", answer: "Yes. We've migrated WordPress, plain React, and other frameworks to Next.js. The result is typically 2–3x faster page loads and significantly better SEO performance." },
      { question: "Can you build the backend with Next.js too?", answer: "Yes. Next.js API routes and Server Actions can handle backend logic, database operations, and third-party integrations. For complex backends, we pair Next.js with Supabase or Node.js." },
    ],
  },
  "web-applications": {
    title: "Custom Web Applications | Meteoric",
    desc: "Meteoric builds custom web applications — dashboards, internal tools, and customer-facing platforms. React, Next.js, Node.js, Supabase.",
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
      { question: "What kind of web applications do you build?", answer: "Dashboards, internal tools, customer portals, data visualization platforms, booking systems, and more. If it runs in a browser, we can build it." },
      { question: "Can you integrate with existing APIs or services?", answer: "Yes. We've integrated Stripe, Resend, Cal.com, Supabase, and custom APIs. We adapt to your existing infrastructure and third-party services." },
      { question: "Do you build mobile-responsive web apps?", answer: "Every web app we build is fully responsive across desktop, tablet, and mobile. We design mobile-first and test across real devices before launch." },
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
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: service.title,
      description: service.desc,
      images: [`${SITE_URL}/og.png`],
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
    `How Meteoric builds ${service.h1.join(" ")} products`
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.h1.join(" "), item: `${SITE_URL}/services/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ServiceLanding service={service} />
    </>
  );
}
