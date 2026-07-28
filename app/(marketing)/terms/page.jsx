import Link from "next/link";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";

const pageTitle = "Terms of Service — Meteoric";
const pageDesc =
  "Meteoric's terms of service govern the use of our website and the engagement terms for our software development services.";

export const metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDesc,
    url: `${SITE_URL}/terms`,
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
    title: "Services",
    content: `Meteoric provides software development services including but not limited to web development, SaaS product development, landing page design, and technical consulting. The specific scope, timeline, and pricing for each engagement will be outlined in a separate proposal or agreement.`,
  },
  {
    num: "02",
    title: "Intellectual Property",
    content: `Upon full payment for services, all intellectual property rights to the deliverables (code, designs, and assets) created specifically for your project are transferred to you. Meteoric retains the right to display the work in our portfolio and use the underlying techniques and methodologies in future projects.`,
  },
  {
    num: "03",
    title: "Payments",
    content: `Payment terms are specified in the project proposal or agreement. Typical terms include a deposit upfront with the balance due upon completion or milestone-based payments. Late payments may result in project delays or suspension of work.`,
  },
  {
    num: "04",
    title: "Revisions and Changes",
    content: `Projects include the revision cycles specified in the proposal. Additional revisions or scope changes beyond the agreed terms will be billed at our standard hourly rate. Scope changes that significantly alter the project timeline will be documented in a change order.`,
  },
  {
    num: "05",
    title: "Confidentiality",
    content: `Both parties agree to keep confidential any proprietary information shared during the engagement. This includes business plans, technical specifications, and any non-public data. This obligation survives the termination of the agreement.`,
  },
  {
    num: "06",
    title: "Termination",
    content: `Either party may terminate the agreement with written notice as specified in the signed proposal or agreement. Upon termination, the client is responsible for payment for all work completed up to the date of termination. Deliverables for completed work will be released upon receipt of final payment. Sections relating to Intellectual Property, Confidentiality, and Limitation of Liability shall survive termination.`,
  },
  {
    num: "07",
    title: "Warranty Disclaimer",
    content: `Our services are provided on an "as-is" and "as-available" basis. To the fullest extent permitted by law, Meteoric disclaims all warranties, whether express or implied, including any implied warranties of merchantability or fitness for a particular purpose. Any warranties specific to your engagement will be outlined in the signed proposal or agreement.`,
  },
  {
    num: "08",
    title: "Limitation of Liability",
    content: `Meteoric's liability is limited to the amount paid for the specific project component giving rise to the claim. We are not liable for consequential damages, lost profits, or business interruption, even if advised of the possibility of such damages.`,
  },
  {
    num: "09",
    title: "Indemnification",
    content: `You agree to indemnify, defend, and hold harmless Meteoric and its personnel from and against any claims, damages, losses, liabilities, and expenses arising out of or related to your use of the deliverables, content you provide to us, or your violation of these terms or applicable law.`,
  },
  {
    num: "10",
    title: "Force Majeure",
    content: `Neither party shall be held liable for delays or failure to perform obligations under these terms due to events beyond their reasonable control, including but not limited to natural disasters, acts of God, hosting outages, government actions, pandemics, or internet disruptions.`,
  },
  {
    num: "11",
    title: "Website Use",
    content: `This website is provided for informational purposes. You agree not to use this site for any unlawful purpose or in violation of these terms. We reserve the right to update these terms at any time. This website may contain links to third-party websites or services that are not owned or controlled by Meteoric. We are not responsible for the content, privacy practices, or practices of any third-party websites.`,
  },
  {
    num: "12",
    title: "Governing Law and Jurisdiction",
    content: `These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts of Gujarat, India, regardless of your country of residence or location.`,
  },
  {
    num: "13",
    title: "Contact",
    content: `For questions about these terms, contact us at contact@withmeteoric.com.`,
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms` },
  ],
};

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".sr-only", "h1"],
  },
};

export default function Terms() {
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
    <div className="min-h-screen bg-black text-white">
      <main className="relative max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <span className="text-[#EAEFFF]/30 uppercase tracking-[0.3em] text-xs font-bold block mb-6">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-secondary-italic font-normal leading-[1.1] tracking-tight mb-6">
            Terms of Service
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
                  <p className="text-white/35 text-[15px] leading-[1.8]">
                    {section.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-xs font-mono tracking-wider">
            Meteoric · withmeteoric.com
          </p>
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              Our Services
            </Link>
            <Link href="/" className="text-white/20 hover:text-white/50 text-xs font-mono tracking-wider transition-colors duration-200">
              Meteoric Home
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
