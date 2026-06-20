"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import Logo from "@/Components/Logo";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/clients": "Clients",
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin";

  return (
    <div className="flex min-h-dvh bg-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#EAEFFF]/[0.02] blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#EAEFFF]/[0.015] blur-[160px] rounded-full" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#EAEFFF]/[0.008] blur-[120px] rounded-full" />
      </div>

      <Sidebar />

      <div className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#EAEFFF]/8 bg-black/50 backdrop-blur-2xl px-6 h-16">
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2.5">
              <Logo className="scale-[0.6] origin-left" />
              <span className="h-3 w-px bg-[#EAEFFF]/10" />
              <span className="text-xs font-medium tracking-widest uppercase text-white/25">
                {title}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#EAEFFF]/8 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[11px] font-medium text-white/30 tracking-wider uppercase">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
