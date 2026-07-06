export const posts = [
  {
    slug: "why-your-startup-needs-a-product-studio-not-an-agency",
    title: "Why Your Startup Needs a Product Studio, Not an Agency",
    excerpt:
      "Agencies optimize for hours. Product studios optimize for outcomes. Here's why the difference matters when you're building something that needs to ship.",
    date: "June 24, 2026",
    readTime: "5 min read",
    image: "/images/blog/blog-cover-1.png",
    content: [
      {
        type: "paragraph",
        text: "Most founders I talk to have the same story. They hired an agency, paid a lot, waited weeks, and got something that looked good but didn't actually move the needle. The design was polished. The code worked. But the product didn't convert, didn't scale, and didn't feel right.",
      },
      {
        type: "heading",
        text: "The Agency Model Is Broken for Startups",
      },
      {
        type: "paragraph",
        text: "Traditional agencies are built for a different world. They sell hours, not outcomes. They have account managers, project managers, and layers of approval that slow everything down. By the time you get a first draft, your market may have already shifted.",
      },
      {
        type: "paragraph",
        text: "Agencies optimize for utilization — keeping their team billable. That means they stretch timelines, add rounds of revisions, and prioritize process over progress. For a startup moving at speed, this is deadly.",
      },
      {
        type: "heading",
        text: "What a Product Studio Does Differently",
      },
      {
        type: "paragraph",
        text: "A product studio thinks like a founder, not a vendor. We ask the hard questions upfront: Who is this for? What does success look like? How do we get there in the shortest possible time? We don't just build what you ask for — we build what you need.",
      },
      {
        type: "paragraph",
        text: "At Meteoric, every project ships directly with the founder. No account managers. No handoffs. Just one conversation, one builder, one clear line from vision to launch.",
      },
      {
        type: "heading",
        text: "The Real Cost of Speed",
      },
      {
        type: "paragraph",
        text: "Here's what I've learned after shipping 12+ projects: speed doesn't mean cutting corners. It means knowing what to prioritize. A product studio focuses on the 20% of features that deliver 80% of the value. We launch fast, iterate faster, and never build things that don't need to exist.",
      },
      {
        type: "paragraph",
        text: "If you're building a startup, you don't need an agency that treats you like a ticket in a queue. You need a partner who treats your product like their own.",
      },
    ],
  },
  {
    slug: "designing-for-conversion-lessons-from-12-shipped-projects",
    title: "Designing for Conversion: Lessons From 12 Shipped Projects",
    excerpt:
      "After building landing pages and SaaS products for 12 different clients, here are the design principles that consistently drove the best results.",
    date: "June 12, 2026",
    readTime: "7 min read",
    image: "/images/blog/blog-cover-2.png",
    content: [
      {
        type: "paragraph",
        text: "Over the past two years, I've designed and shipped products for fintech startups, B2B SaaS platforms, marketing agencies, and direct-to-consumer brands. Across all of them, certain patterns kept showing up in the highest-converting projects.",
      },
      {
        type: "heading",
        text: "1. Clarity Beats Creativity",
      },
      {
        type: "paragraph",
        text: "The biggest mistake I see in early-stage product design is prioritizing visual flair over communication. A hero section that looks stunning but doesn't answer \"What does this product do?\" in under 3 seconds is a liability, not an asset.",
      },
      {
        type: "paragraph",
        text: "Every high-converting project I've worked on has one thing in common: the value proposition is immediately obvious. The headline says exactly what the product does. The subheadline says who it's for. The CTA says what happens next.",
      },
      {
        type: "heading",
        text: "2. Reduce Cognitive Load",
      },
      {
        type: "paragraph",
        text: "Every additional choice you give a user reduces the likelihood they'll take any action. This is Hick's Law, and it's brutally relevant for landing pages. The best performing designs I've shipped had exactly one primary action per viewport.",
      },
      {
        type: "paragraph",
        text: "Remove navigation links from the hero. Remove secondary CTAs. Remove social proof that doesn't directly support the core message. If it doesn't help the user say \"yes\" faster, cut it.",
      },
      {
        type: "heading",
        text: "3. Motion With Purpose",
      },
      {
        type: "paragraph",
        text: "Animation is not decoration. When used intentionally, motion guides attention, communicates hierarchy, and makes interactions feel responsive. When overused, it distracts and slows down the experience.",
      },
      {
        type: "paragraph",
        text: "The projects that performed best used motion sparingly — a subtle fade-in for the hero, a smooth scroll to sections, a hover state that confirms interactivity. Nothing that gets in the way of the message.",
      },
      {
        type: "heading",
        text: "The Takeaway",
      },
      {
        type: "paragraph",
        text: "Great conversion design is invisible. Users shouldn't think about the design — they should think about the decision. Clear messaging, focused layouts, and purposeful interactions will always outperform trendy aesthetics.",
      },
    ],
  },
  {
    slug: "building-a-saas-prototype-in-3-weeks-a-case-study",
    title: "Building an MVP in 3 Weeks: A SaaS Prototype Case Study",
    excerpt:
      "How we took a fintech concept from whiteboard to working MVP prototype in 21 days — and what we learned about shipping fast without breaking things.",
    date: "May 28, 2026",
    readTime: "8 min read",
    image: "/images/blog/blog-cover-3.png",
    content: [
      {
        type: "paragraph",
        text: "A fintech founder came to us with a problem. They had a clear vision for a SaaS product, a waiting list of beta users, and zero code. They needed a working prototype in under a month to validate the concept and raise their seed round.",
      },
      {
        type: "heading",
        text: "Week 1: Scope and Architecture",
      },
      {
        type: "paragraph",
        text: "We started with a single day of whiteboarding. No slides, no decks — just a shared Figma file and honest conversation. What's the core feature? What can wait? What's the fastest path to an MVP users can click through?",
      },
      {
        type: "paragraph",
        text: "By day two, we had a clear scope: authentication, a dashboard with key metrics, a core workflow for the main feature, and a settings page. Everything else went on the \"later\" list. Most things on that list never needed to be built.",
      },
      {
        type: "heading",
        text: "Week 2: Design and Frontend",
      },
      {
        type: "paragraph",
        text: "We designed in the browser, not in Figma. This is critical for speed. A static mockup looks different from a working interface. By designing directly with code, we caught UX issues early and avoided the handoff overhead that kills most agency projects.",
      },
      {
        type: "paragraph",
        text: "The frontend was built with Next.js and Tailwind CSS — the same stack we use for everything at Meteoric. Consistent tooling means faster iteration, fewer bugs, and easier maintenance.",
      },
      {
        type: "heading",
        text: "Week 3: Backend and Integration",
      },
      {
        type: "paragraph",
        text: "We used Supabase for the backend — authentication, database, and API all in one. The beauty of Supabase is that it handles 80% of what a startup needs out of the box, so we could focus on the 20% that made the product unique.",
      },
      {
        type: "heading",
        text: "The Result",
      },
      {
        type: "paragraph",
        text: "In 21 days, the founder had a working prototype they could show to investors and beta users. The product validated, the seed round closed, and the full build started immediately after. Three weeks of focused work saved months of uncertainty.",
      },
    ],
  },
  {
    slug: "mongodb-schema-design-for-saas-billing",
    title: "MongoDB Schema Design for SaaS Billing — A Practical Guide",
    excerpt:
      "How to design MongoDB schemas for subscription billing, multi-tenant pricing, usage metering, and invoice history — with real examples used in production SaaS apps.",
    date: "July 6, 2026",
    readTime: "9 min read",
    image: "/images/blog/blog-cover-5.png",
    content: [
      {
        type: "paragraph",
        text: "SaaS billing is one of those things that seems simple until you actually build it. A user signs up, pays monthly, gets access. But behind that flow lies a data model that needs to handle plan changes, proration, trial periods, coupon codes, failed payments, invoice generation, and usage metering — all without corrupting financial records.",
      },
      {
        type: "paragraph",
        text: "After building billing systems for multiple SaaS products at Meteoric, I've landed on a MongoDB schema design that handles most subscription scenarios without over-engineering. Here's the approach that's worked across production projects.",
      },
      {
        type: "heading",
        text: "The Core Collections",
      },
      {
        type: "paragraph",
        text: "We use four main collections for billing: organizations, subscriptions, invoices, and usage_events. Each serves a specific purpose and references the others through organization_id.",
      },
      {
        type: "paragraph",
        text: "The organizations collection stores the tenant — company name, billing email, default currency, and tax info. Subscriptions track the current plan, status (active/trialing/past_due/canceled), current period dates, and the Stripe subscription ID for synchronization.",
      },
      {
        type: "paragraph",
        text: "Invoices are generated per billing cycle and store line items, amounts, currency, status (pending/paid/overdue/refunded), and a PDF URL. Usage events track metered billing — API calls, storage used, seats occupied — with timestamps for accurate billing.",
      },
      {
        type: "heading",
        text: "Why Embedded Documents Beat References for Subscriptions",
      },
      {
        type: "paragraph",
        text: "A common mistake is storing the subscription as a separate collection with a reference to the organization. This works, but every page load that needs billing status requires a JOIN-like lookup. In MongoDB, embedding the active subscription inside the organization document eliminates this.",
      },
      {
        type: "paragraph",
        text: "The tradeoff is document size. If a single organization has hundreds of subscription history records, embedding everything becomes unwieldy. Our rule: embed the active subscription and last 3 invoices, reference the rest in a separate invoices collection with organization_id.",
      },
      {
        type: "heading",
        text: "Handling Plan Changes and Proration",
      },
      {
        type: "paragraph",
        text: "When a user upgrades or downgrades their plan, we create a proration record rather than modifying the existing subscription document. The proration calculates the credit for unused days on the old plan and the charge for remaining days on the new plan. This keeps an audit trail that accounting teams can verify.",
      },
      {
        type: "paragraph",
        text: "The proration calculation follows a simple formula: (daily_rate_old × days_unused) - (daily_rate_new × days_remaining). If the result is positive, the user gets a credit. If negative, they're charged the difference on the next invoice.",
      },
      {
        type: "heading",
        text: "Usage Metering at Scale",
      },
      {
        type: "paragraph",
        text: "For metered billing (e.g., pay-per-API-call), storing individual events in MongoDB works up to about 100,000 events per month. Beyond that, we aggregate hourly using MongoDB's $bucket aggregator and store rollups in a usage_summary collection. The raw events get archived to cold storage after 90 days.",
      },
      {
        type: "paragraph",
        text: "The aggregation pipeline groups events by organization_id and hour, then calculates the count. This gives us a hourly usage record that's fast to query for invoice generation and requires minimal storage.",
      },
      {
        type: "heading",
        text: "Invoice Generation Strategy",
      },
      {
        type: "paragraph",
        text: "We generate invoices reactively — when a subscription renews, we calculate line items and create the invoice document. Each invoice stores a snapshot of the pricing at that moment, not a reference to the current plan. This is critical: if you change a plan price later, past invoices should not change.",
      },
      {
        type: "paragraph",
        text: "The invoice document includes line_items as an array of embedded objects, each with description, quantity, unit_price, and total. This denormalization is intentional — it makes invoice rendering a single database read with no joins needed.",
      },
      {
        type: "heading",
        text: "What About Stripe?",
      },
      {
        type: "paragraph",
        text: "We use Stripe as the payment processor, not the source of truth for billing logic. Stripe handles payment collection, webhooks, and dispute management. But our MongoDB schema is the authoritative record of what was billed, when, and why. This dual approach means we're never locked into Stripe and can switch processors if needed.",
      },
      {
        type: "paragraph",
        text: "The key insight: Stripe webhooks update our local documents, but our local documents drive the billing UI and reporting. This gives users fast page loads (no Stripe API calls on every request) and a consistent billing history even if Stripe experiences downtime.",
      },
    ],
  },
  {
    slug: "gsap-vs-framer-motion-production-guide",
    title: "GSAP vs Framer Motion: When to Use Which for Production Websites",
    excerpt:
      "A practical comparison of GSAP and Framer Motion for production web projects — performance benchmarks, bundle size impact, use cases, and decision framework from a developer who ships both daily.",
    date: "July 6, 2026",
    readTime: "10 min read",
    image: "/images/blog/blog-cover-6.png",
    content: [
      {
        type: "paragraph",
        text: "I use both GSAP and Framer Motion in production every week. Not because I can't choose — but because they solve fundamentally different problems. Picking the wrong one for your project means either fighting the tool or shipping a slower experience than you could have.",
      },
      {
        type: "paragraph",
        text: "Here's the honest take after shipping 12+ production projects with both libraries.",
      },
      {
        type: "heading",
        text: "The Short Answer",
      },
      {
        type: "paragraph",
        text: "Use GSAP for scroll-driven animations, complex timelines, SVG morphing, and canvas integrations. Use Framer Motion for component-level enter/exit animations, layout transitions, gesture-based interactions, and anything deeply integrated with React's component lifecycle.",
      },
      {
        type: "paragraph",
        text: "GSAP is a full animation engine. Framer Motion is a React animation library. They overlap in some areas but excel in different ones. Understanding where each shines is the difference between a smooth, performant site and a janky one.",
      },
      {
        type: "heading",
        text: "Bundle Size Reality Check",
      },
      {
        type: "paragraph",
        text: "This is where most advice gets it wrong. People say Framer Motion is \"heavy\" and GSAP is \"lightweight.\" The reality is more nuanced.",
      },
      {
        type: "paragraph",
        text: "GSAP core is about 14KB gzipped. But you rarely use just the core — you add ScrollTrigger (another 8KB), ScrollToPlugin, and sometimes SplitText or CustomEase. A full GSAP setup lands around 25-35KB gzipped. Framer Motion is around 30-40KB gzipped for the full library. The difference is smaller than most developers assume.",
      },
      {
        type: "paragraph",
        text: "The real bundle impact comes from HOW you import. With GSAP, you typically import globally. With Framer Motion, tree-shaking works well if you import specific components (motion.div instead of importing everything). In practice, both end up at similar weights for equivalent functionality.",
      },
      {
        type: "heading",
        text: "When GSAP Wins",
      },
      {
        type: "paragraph",
        text: "ScrollTrigger is GSAP's killer feature. If your site has parallax sections, progress-driven animations, or timeline-based scroll sequences, GSAP is the right choice. Framer Motion's useScroll and useInView are good, but they don't match ScrollTrigger's control over scrub direction, pinning, and timeline integration.",
      },
      {
        type: "paragraph",
        text: "GSAP also wins for complex timelines. Need to sequence 20 animation steps with overlapping, staggered, and nested timings? GSAP's timeline API is purpose-built for this. Framer Motion sequences work for simple chains but get unwieldy beyond 5-6 steps.",
      },
      {
        type: "paragraph",
        text: "SVG animation is another GSAP stronghold. Morphing, drawing, and path animations that would require custom React code in Framer Motion are a few lines in GSAP. For hero sections with animated illustrations, GSAP is significantly faster to implement.",
      },
      {
        type: "heading",
        text: "When Framer Motion Wins",
      },
      {
        type: "paragraph",
        text: "For component-level animations — modals opening, menus sliding, lists reordering — Framer Motion is the clear winner. Its AnimatePresence component handles mount/unmount animations that are genuinely painful to implement in GSAP.",
      },
      {
        type: "paragraph",
        text: "Layout animations (AnimateSharedLayout / layout prop) let you animate between positions when items reorder, which is extremely difficult in GSAP without manual measurement and DOM manipulation.",
      },
      {
        type: "paragraph",
        text: "Gesture-based interactions (drag, hover, tap, whileInView) integrate naturally with Framer Motion because they're declarative props on motion components. In GSAP, you'd need to add event listeners and manually trigger tweens — more code, more edge cases.",
      },
      {
        type: "heading",
        text: "Our Stack at Meteoric",
      },
      {
        type: "paragraph",
        text: "We use both. GSAP powers the landing page hero, scroll-triggered section reveals, and timeline-based animations. Framer Motion handles our modal transitions, card hover effects, testimonial carousel, and layout animations. Lenis provides smooth scrolling on top of both.",
      },
      {
        type: "paragraph",
        text: "The key insight: these libraries aren't competitors for the same job. They're complementary tools for different animation layers. GSAP is the engine for scroll-driven and timeline-based animation. Framer Motion is the React-native layer for component interactions. Using both intentionally gives you the best of both worlds.",
      },
    ],
  },
  {
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    title: "The Meteoric Guide to Choosing Your Tech Stack",
    excerpt:
      "React vs Next.js? Tailwind vs CSS? Supabase vs Firebase? Here's our framework for making technology decisions that won't haunt you later.",
    date: "May 15, 2026",
    readTime: "6 min read",
    image: "/images/blog/blog-cover-4.png",
    content: [
      {
        type: "paragraph",
        text: "Every founder asks the same question: what tech stack should I use? The real question is: what tech stack should I not have to think about?",
      },
      {
        type: "heading",
        text: "Our Default Stack at Meteoric",
      },
      {
        type: "paragraph",
        text: "After shipping 12+ projects across different industries, we've settled on a default stack that works for 90% of use cases: Next.js for the framework, Tailwind CSS for styling, Supabase for the backend, and Vercel for hosting.",
      },
      {
        type: "paragraph",
        text: "This isn't because these are the trendiest tools. It's because they eliminate decisions. When you use the same stack repeatedly, you build muscle memory. You estimate more accurately. You ship faster.",
      },
      {
        type: "heading",
        text: "When to Deviate",
      },
      {
        type: "paragraph",
        text: "Not every project fits the default mold. If you're building a real-time application, you might need WebSockets. If you're handling large file uploads, you might need a dedicated storage solution. The key is knowing when a specialized tool actually saves time vs. when it's just complexity disguised as customization.",
      },
      {
        type: "paragraph",
        text: "Our rule: if a default tool can do 80% of what you need, use the default. Optimize the 20% that actually differentiates your product.",
      },
      {
        type: "heading",
        text: "The Anti-Framework Framework",
      },
      {
        type: "paragraph",
        text: "The best tech stack is the one you never have to think about. If you're spending more time configuring your tools than building your product, you've chosen wrong. Pick boring technology that works, and focus your energy on what actually matters: your users.",
      },
    ],
  },
];
