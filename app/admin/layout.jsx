"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/clients": "Clients",
  "/admin/cal-bookings": "Bookings",
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin";

  return (
    <div className="flex min-h-dvh bg-black">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Sidebar />

      <div className="relative flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between px-6 lg:px-8 h-14 border-b border-white/5">
          <span className="text-xs font-medium tracking-widest uppercase text-white/20">
            /{title.toLowerCase()}
          </span>
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 bg-black">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            <span className="text-[10px] font-medium text-white/25 tracking-wider uppercase">
              Live
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
