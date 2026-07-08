import { SITE_URL } from "@/lib/seo/config";

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

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 md:px-16 pt-32 pb-24">
        <h1 className="text-3xl md:text-4xl font-semibold leading-[1.15] tracking-tight mb-12">
          Terms of Service
        </h1>

        <p className="text-white/40 text-sm mb-8">Last updated: July 6, 2026</p>

        <div className="space-y-8 text-white/45 text-base leading-[1.8]">
          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">1. Services</h2>
            <p>Meteoric provides software development services including but not limited to web development, SaaS product development, landing page design, and technical consulting. The specific scope, timeline, and pricing for each engagement will be outlined in a separate proposal or agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">2. Intellectual Property</h2>
            <p>Upon full payment for services, all intellectual property rights to the deliverables (code, designs, and assets) created specifically for your project are transferred to you. Meteoric retains the right to display the work in our portfolio and use the underlying techniques and methodologies in future projects.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">3. Payments</h2>
            <p>Payment terms are specified in the project proposal or agreement. Typical terms include a deposit upfront with the balance due upon completion or milestone-based payments. Late payments may result in project delays or suspension of work.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">4. Revisions and Changes</h2>
            <p>Projects include the revision cycles specified in the proposal. Additional revisions or scope changes beyond the agreed terms will be billed at our standard hourly rate. Scope changes that significantly alter the project timeline will be documented in a change order.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">5. Confidentiality</h2>
            <p>Both parties agree to keep confidential any proprietary information shared during the engagement. This includes business plans, technical specifications, and any non-public data. This obligation survives the termination of the agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">6. Limitation of Liability</h2>
            <p>Meteoric's liability is limited to the amount paid for the specific project component giving rise to the claim. We are not liable for consequential damages, lost profits, or business interruption, even if advised of the possibility of such damages.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">7. Website Use</h2>
            <p>This website is provided for informational purposes. You agree not to use this site for any unlawful purpose or in violation of these terms. We reserve the right to update these terms at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-4">8. Contact</h2>
            <p>For questions about these terms, contact us at work.prashantkhuva@gmail.com.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
