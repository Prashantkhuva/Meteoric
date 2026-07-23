import Link from "next/link";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";

const pageTitle = "Privacy Policy — Meteoric";
const pageDesc =
  "Meteoric's privacy policy explains how we collect, use, and protect your personal data when you use our website and services.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/privacy`,
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: 1635,
        height: 962,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prashantkhuva_",
    creator: "@prashantkhuva_",
    title: pageTitle,
    description: pageDesc,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
  robots: "index, follow",
};

const sections = [
  {
    num: "01",
    title: "Information We Collect",
    content: `When you use our website or services, we may collect the following types of information:`,
    items: [
      { label: "Contact information", desc: "name, email address, phone number, and company name when you fill out our contact form or request a consultation." },
      { label: "Usage data", desc: "pages visited, time spent, browser type, device information, and referral source collected through analytics tools." },
      { label: "Communication data", desc: "any information you provide when corresponding with us via email, Cal.com, or other channels." },
    ],
  },
  {
    num: "02",
    title: "How We Use Your Information",
    content: `We use your information for the following purposes:`,
    items: [
      { desc: "To respond to your inquiries and provide our services" },
      { desc: "To improve our website and service offerings" },
      { desc: "To send occasional updates about our services (you can opt out at any time)" },
      { desc: "To comply with legal obligations" },
    ],
  },
  {
    num: "03",
    title: "Data Sharing",
    content: `We do not sell your personal information. We may share data with trusted third-party service providers who help us operate our business — including Vercel (hosting), Supabase (database), Resend (email), and Google Analytics (analytics). These providers are contractually bound to protect your data.`,
  },
  {
    num: "04",
    title: "Cookies",
    content: `We use minimal cookies for essential functionality and analytics. You can control cookie preferences through your browser settings. We do not use tracking cookies for advertising purposes.`,
  },
  {
    num: "05",
    title: "Data Retention",
    content: `We retain your personal data only as long as necessary for the purposes described in this policy, or as required by law. You may request deletion of your data at any time by contacting us.`,
  },
  {
    num: "06",
    title: "Your Rights",
    content: `Depending on your location, you may have rights regarding your personal data, including access, correction, deletion, and portability. To exercise these rights, email us at contact@withmeteoric.com.`,
  },
  {
    num: "07",
    title: "Contact",
    content: `For questions about this privacy policy, contact us at contact@withmeteoric.com.`,
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
  ],
};

export default function Privacy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    <div className="min-h-screen bg-black text-white">
      <main className="relative max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <span className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-xs font-bold block mb-6">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-6">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/10" />
            <span className="text-white/20 text-xs font-mono tracking-wider">
              Last updated — July 6, 2026
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-0">
          {sections.map((section) => (
            <section
              key={section.num}
              className="py-10 border-t border-white/[0.06]"
            >
              <div className="flex gap-6 md:gap-10">
                {/* Number */}
                <span className="text-4xl md:text-5xl font-secondary-italic text-[#EAEFFF]/[0.06] leading-none mt-1 shrink-0">
                  {section.num}
                </span>

                {/* Content */}
                <div>
                  <h2 className="text-xl md:text-2xl font-secondary-italic font-normal text-white/80 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-white/35 text-[15px] leading-[1.8] mb-4">
                    {section.content}
                  </p>
                  {section.items && (
                    <ul className="space-y-3 mt-4">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1 h-1 rounded-full bg-white/15 mt-2.5 shrink-0" />
                          <span className="text-white/35 text-[15px] leading-[1.8]">
                            {item.label && (
                              <strong className="text-white/55 font-medium">{item.label} — </strong>
                            )}
                            {item.desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <p className="text-white/15 text-xs font-mono tracking-wider">
            Meteoric · withmeteoric.com
          </p>
          <Link href="/" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
            Back to home
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}
