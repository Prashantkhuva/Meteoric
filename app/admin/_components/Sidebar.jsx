"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <motion.aside
      layout
      className="relative flex flex-col border-r border-[#EAEFFF]/8 bg-black/30 backdrop-blur-2xl"
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex h-16 items-center justify-center border-b border-[#EAEFFF]/8">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          aria-label="Meteoric Admin"
        >
          {collapsed ? (
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#EAEFFF]/10 border border-[#EAEFFF]/15 text-sm font-bold text-[#EAEFFF]">
              M
            </span>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#EAEFFF]/10 border border-[#EAEFFF]/15 text-sm font-bold text-[#EAEFFF]">
                M
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                Meteoric<span className="text-[#EAEFFF]">.</span>
              </span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2.5 py-5">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group relative block">
              <div
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
                  active
                    ? "text-[#EAEFFF]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl border border-[#EAEFFF]/15 bg-gradient-to-r from-[#EAEFFF]/10 to-transparent shadow-[0_0_25px_rgba(234,239,255,0.05)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <Icon size={18} />
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

      <div className="border-t border-[#EAEFFF]/8 p-2.5 space-y-1">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/20 transition-all duration-300 hover:bg-white/[0.03] hover:text-white/40"
          >
            <LogOut size={16} />
            {!collapsed && <span className="font-medium">Sign out</span>}
          </button>
        </form>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-white/15 transition-all duration-300 hover:bg-white/[0.03] hover:text-white/30"
        >
          <ChevronLeft
            size={13}
            className={`transition-transform duration-300 ${!collapsed ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>
    </motion.aside>
  );
}
