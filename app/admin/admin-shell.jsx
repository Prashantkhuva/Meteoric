"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./_components/Sidebar";
import { TopBar } from "./_components/TopBar";
import { ToastProvider } from "./_components/Toast";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/clients": "Clients",
  "/admin/cal-bookings": "Bookings",
  "/admin/proposals": "Proposals",
  "/admin/projects": "Projects",
  "/admin/invoices": "Invoices",
};

export function AdminShell({ children, userName, userEmail }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = pageTitles[pathname] || "Admin";

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-[#070707]">
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

        <div className="relative flex flex-1 flex-col min-w-0">
          <TopBar title={title} onMenuClick={openMobile} />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
