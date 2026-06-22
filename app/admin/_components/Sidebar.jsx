"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  FolderKanban,
  Receipt,
  LogOut,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "../actions";
import Logo from "@/Components/Logo";
import { useFocusTrap } from "./useFocusTrap";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: Briefcase },
  { href: "/admin/proposals", label: "Proposals", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/cal-bookings", label: "Bookings", icon: Calendar },
];

export function Sidebar({ mobileOpen, onMobileClose, userName, userEmail }) {
  const pathname = usePathname();
  const mobileTrapRef = useFocusTrap(mobileOpen);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" && mobileOpen) onMobileClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen, onMobileClose]);

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center h-14 px-5 border-b border-white/[0.04] shrink-0">
        <Link href="/admin" className="flex items-center" aria-label="Meteoric Admin">
          <Logo className="!block w-[120px]" />
        </Link>
      </div>

      <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onMobileClose}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[#EAEFFF]/8 text-[#EAEFFF] border border-[#EAEFFF]/10"
                  : "text-white/45 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
              )}
            >
              <Icon size={17} />
              <span>{link.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EAEFFF]" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/[0.04] p-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#EAEFFF] flex items-center justify-center text-xs font-bold text-[#121212]">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/70 truncate">{userName || "Admin"}</p>
            <p className="text-xs text-white/35 truncate">{userEmail || "Administrator"}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 border-r border-white/[0.04] bg-[#070707] shrink-0">
        {nav}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              ref={mobileTrapRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-72 border-r border-white/[0.04] bg-[#070707] lg:hidden"
            >
              <div className="flex items-center justify-end h-14 px-4 border-b border-white/[0.04]">
                <button
                  onClick={onMobileClose}
                  className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
