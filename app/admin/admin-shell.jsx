"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ToastProvider } from "./components/Toast";
import ErrorBoundary from "@/components/sections/ErrorBoundary";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/clients": "Clients",
  "/admin/cal-bookings": "Bookings",
  "/admin/proposals": "Proposals",
  "/admin/projects": "Projects",
  "/admin/invoices": "Invoices",
  "/admin/bank-accounts": "Bank Accounts",
  "/admin/compose": "Compose Email",
  "/admin/sent-emails": "Sent Emails",
  "/admin/settings": "Settings",
};

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState(null);
  const [checking, setChecking] = useState(true);
  const title = pageTitles[pathname] || "Admin";

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserName(
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Admin"
      );
      setUserEmail(user?.email);
    }).finally(() => setChecking(false));
  }, [router]);

  // Lock body scroll on admin pages
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#070707]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#EAEFFF] border-t-transparent" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-dvh overflow-hidden bg-[#070707]">
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} userName={userName} userEmail={userEmail} />

        <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden">
          <TopBar title={title} onMenuClick={openMobile} />
          <main className="flex-1 overflow-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
