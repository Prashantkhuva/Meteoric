import { Wrench } from "lucide-react";

export const metadata = {
  title: "We'll Be Right Back | Meteoric",
  description:
    "Meteoric is currently undergoing scheduled maintenance. We'll be back soon.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://withmeteoric.com/maintenance",
  },
  openGraph: {
    title: "We'll Be Right Back | Meteoric",
    description:
      "Meteoric is currently undergoing scheduled maintenance. We'll be back soon.",
    url: "https://withmeteoric.com/maintenance",
    siteName: "Meteoric",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "We'll Be Right Back | Meteoric",
    description:
      "Meteoric is currently undergoing scheduled maintenance. We'll be back soon.",
  },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />
      <div className="relative z-10 text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[var(--border-color)] bg-[var(--text-primary)]/[0.03] mb-8">
          <Wrench size={24} className="text-[var(--text-muted)]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          We&apos;ll be right back
        </h1>
        <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed mb-4">
          We&apos;re currently performing scheduled maintenance to improve your
          experience. We should be back shortly.
        </p>
        <p className="text-[var(--text-muted)] text-xs">
          For urgent inquiries, email{" "}
          <a
            href="mailto:contact@withmeteoric.com"
            className="underline hover:text-[var(--text-secondary)] transition-colors"
          >
            contact@withmeteoric.com
          </a>
        </p>
      </div>
    </div>
  );
}
