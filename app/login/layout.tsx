// Metadata for the auth page: the page itself is a client component
// ("use client"), which cannot export metadata — hence this layout.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
