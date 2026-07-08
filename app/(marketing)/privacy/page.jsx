import { SITE_URL } from "@/lib/seo/config";

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
        url: `${SITE_URL}/og-image.png?v=20260706`,
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
    images: [`${SITE_URL}/og-image.png?v=20260706`],
  },
  robots: "noindex, follow",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 md:px-16 pt-32 pb-24">
        <h1 className="text-3xl md:text-4xl font-semibold leading-[1.15] tracking-tight mb-12">
          Privacy Policy
        </h1>

        <p className="text-white/40 text-sm mb-8">Last updated: July 6, 2026</p>

        <div className="space-y-8 text-white/45 text-base leading-[1.8]">
          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">1. Information We Collect</h2>
            <p>When you use our website or services, we may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong className="text-white/60">Contact information</strong> — name, email address, phone number, and company name when you fill out our contact form or request a consultation.</li>
              <li><strong className="text-white/60">Usage data</strong> — pages visited, time spent, browser type, device information, and referral source collected through analytics tools.</li>
              <li><strong className="text-white/60">Communication data</strong> — any information you provide when corresponding with us via email, Cal.com, or other channels.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>To respond to your inquiries and provide our services</li>
              <li>To improve our website and service offerings</li>
              <li>To send occasional updates about our services (you can opt out at any time)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">3. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with trusted third-party service providers who help us operate our business — including Vercel (hosting), Supabase (database), Resend (email), and Google Analytics (analytics). These providers are contractually bound to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">4. Cookies</h2>
            <p>We use minimal cookies for essential functionality and analytics. You can control cookie preferences through your browser settings. We do not use tracking cookies for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">5. Data Retention</h2>
            <p>We retain your personal data only as long as necessary for the purposes described in this policy, or as required by law. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have rights regarding your personal data, including access, correction, deletion, and portability. To exercise these rights, email us at work.prashantkhuva@gmail.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">7. Contact</h2>
            <p>For questions about this privacy policy, contact us at work.prashantkhuva@gmail.com.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
