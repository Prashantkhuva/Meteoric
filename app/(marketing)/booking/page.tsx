import { pageMetadata } from "@/lib/seo/config";
import CalBooking from "@/components/pages/CalBooking";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonLd";

const pageTitle = "Book a Free Web Development Strategy Call";
const pageDesc =
  "Schedule a free video call with Meteoric to talk through your project's scope, stack, and timeline. No obligation.";

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDesc,
  path: "/booking",
  image: undefined,
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Book a Call", path: "/booking" },
]);

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

const agenda = [
  {
    title: "Your product and goals",
    text: "What you are building, who it is for, and what a successful launch looks like — whether that is a SaaS MVP, a web app, or a marketing site.",
  },
  {
    title: "Scope and priorities",
    text: "Which features belong in the first version and which can wait, so the build stays focused on what users and investors need to see first.",
  },
  {
    title: "Tech stack",
    text: "A recommended stack for your case — typically Next.js, React, and a managed backend like Supabase — and the trade-offs behind it.",
  },
  {
    title: "Timeline and next steps",
    text: "A realistic delivery timeline and what a fixed-price proposal would cover if the project is a good fit.",
  },
];

const bookingFaqs = [
  {
    question: "What should I prepare before the strategy call?",
    answer:
      "A short description of the product, your target users, any designs or reference sites you like, and a rough timeline and budget range. Nothing formal is required.",
  },
  {
    question: "Who will I speak with on the call?",
    answer:
      "Prashant Khuva, the founder of Meteoric, who also builds the projects. You talk to the person writing the code, not a sales team.",
  },
  {
    question: "Will I get a price estimate?",
    answer:
      "If the project is a fit, you receive a fixed-price proposal after the call, based on the scope agreed during the conversation.",
  },
  {
    question: "Can I book a call if I only have an idea, not a spec?",
    answer:
      "Yes. Many calls start with an idea. Part of the call is turning that idea into a scoped first version you can actually ship.",
  },
];

const faqJsonLd = buildFaqJsonLd(bookingFaqs);

export default function BookingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={speakableJsonLd} />
      <JsonLd data={faqJsonLd} />
      <CalBooking>
        <section className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
          <h2 className="text-2xl md:text-3xl font-display tracking-tight mb-4 text-[var(--text-primary)]">
            What we cover on the strategy call
          </h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
            The strategy call is a free, no-obligation video call where we map
            your idea to a buildable plan. You leave with a clear view of scope,
            stack, and timeline — whether or not we work together.
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {agenda.map((item, i) => (
              <li
                key={item.title}
                className="p-5 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.04]"
              >
                <h3 className="text-[var(--text-secondary)] text-sm font-semibold mb-2">
                  {String(i + 1).padStart(2, "0")}. {item.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
          <h2 className="text-2xl md:text-3xl font-display tracking-tight mb-6 text-[var(--text-primary)]">
            Strategy call FAQ
          </h2>
          <dl className="space-y-6 max-w-3xl">
            {bookingFaqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-[var(--text-secondary)] text-sm md:text-base font-semibold mb-1">
                  {faq.question}
                </dt>
                <dd className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </CalBooking>
    </>
  );
}
