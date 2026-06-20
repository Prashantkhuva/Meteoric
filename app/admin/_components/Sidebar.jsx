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
      className="relative flex flex-col border-r border-[#EAEFFF]/10 bg-black/40 backdrop-blur-2xl"
      animate={{ width: collapsed ? 64 : 200 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-center border-b border-[#EAEFFF]/10">
        <Link
          href="/admin"
          className="text-sm font-semibold tracking-tight text-white"
        >
          {collapsed ? (
            <span className="text-xl">✦</span>
          ) : (
            <span>
              Meteoric<span className="text-[#EAEFFF]">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group relative block">
              <div
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
                  active
                    ? "text-[#EAEFFF] bg-[#EAEFFF]/8"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl border border-[#EAEFFF]/15 bg-[#EAEFFF]/8 shadow-[0_0_20px_rgba(234,239,255,0.04)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <Icon size={18} />
                </span>
                {!collapsed && (
                  <span className="relative z-10 font-medium">{link.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#EAEFFF]/10 p-2">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/60"
          >
            <LogOut size={18} />
            {!collapsed && <span className="font-medium">Sign out</span>}
          </button>
        </form>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center justify-center rounded-xl px-3 py-2 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/40"
        >
          <ChevronLeft
            size={14}
            className={`transition-transform duration-300 ${!collapsed ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>
    </motion.aside>
  );
}
