"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  ChevronLeft,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: Briefcase },
  { href: "/admin/cal-bookings", label: "Bookings", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <motion.aside
      layout
      className="relative flex flex-col border-r border-[#EAEFFF]/8 bg-black/20 backdrop-blur-xl"
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex h-14 items-center justify-center border-b border-[#EAEFFF]/5">
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2"
          aria-label="Meteoric Admin"
        >
          {collapsed ? (
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#EAEFFF] to-[#EAEFFF]/80 text-[10px] font-bold text-[#202020] shadow-[0_0_12px_rgba(234,239,255,0.15)]">
              M
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#EAEFFF] to-[#EAEFFF]/80 text-[10px] font-bold text-[#202020] shadow-[0_0_12px_rgba(234,239,255,0.15)]">
                M
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">Meteoric</span>
              <span className="text-[10px] font-medium text-white/15 px-1.5 py-0.5 rounded-full border border-[#EAEFFF]/10">v1</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group relative block">
              <div
                className={`relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-300 ${
                  active
                    ? "text-white"
                    : "text-white/25 hover:text-white/50"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#EAEFFF]/10 to-transparent border border-[#EAEFFF]/10 shadow-[0_0_20px_rgba(234,239,255,0.05)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[#EAEFFF] shadow-[0_0_8px_rgba(234,239,255,0.3)]" />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <Icon size={16} />
                </span>
                {!collapsed && (
                  <span className="relative z-10 font-medium tracking-tight">
                    {link.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#EAEFFF]/5 p-2 space-y-0.5">
        {!collapsed && (
          <div className="px-2.5 py-2 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#EAEFFF] to-[#7c6aff] flex items-center justify-center text-[9px] font-bold text-black">
                P
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/60 truncate">Prashant</p>
                <p className="text-[10px] text-white/20 truncate">Admin</p>
              </div>
            </div>
          </div>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg px-2.5 py-2 text-sm text-white/15 transition-all duration-300 hover:bg-white/[0.02] hover:text-white/30"
          >
            <LogOut size={14} />
            {!collapsed && <span className="font-medium">Sign out</span>}
          </button>
        </form>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg px-2.5 py-1.5 text-white/10 transition-all duration-300 hover:bg-white/[0.02] hover:text-white/25"
        >
          <ChevronLeft
            size={12}
            className={`transition-transform duration-300 ${!collapsed ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>
    </motion.aside>
  );
}
