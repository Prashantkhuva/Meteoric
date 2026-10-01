// Metadata for the auth page: the page itself is a client component
// ("use client"), which cannot export metadata — hence this layout.
export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return children;
}
