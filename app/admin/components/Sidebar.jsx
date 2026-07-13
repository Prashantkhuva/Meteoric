"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Landmark,
  FileText,
  FolderKanban,
  Receipt,
  PenSquare,
  Mail,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "../actions";
import Logo from "@/components/sections/Logo";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const sections = [
  {
    label: null,
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "CRM",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Users },
      { href: "/admin/clients", label: "Clients", icon: Briefcase },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/proposals", label: "Proposals", icon: FileText },
      { href: "/admin/invoices", label: "Invoices", icon: Receipt },
      { href: "/admin/bank-accounts", label: "Bank Accounts", icon: Landmark },
    ],
  },
  {
    label: "Work",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/cal-bookings", label: "Bookings", icon: Calendar },
    ],
  },
  {
    label: "Email",
    items: [
      { href: "/admin/compose", label: "Compose", icon: PenSquare },
      { href: "/admin/sent-emails", label: "Sent Emails", icon: Mail },
    ],
  },
];

const bottomLinks = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
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

      <div className="flex-1 py-3 px-2.5 overflow-y-auto">
        {sections.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-4" : ""}>
            {section.label && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onMobileClose}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-150 relative",
                      active
                        ? "bg-[#EAEFFF]/[0.06] text-[#EAEFFF]"
                        : "text-white/40 hover:text-white/65 hover:bg-white/[0.025]"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[#EAEFFF]" />
                    )}
                    <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.04] shrink-0">
        <div className="p-2.5 space-y-0.5">
          {bottomLinks.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onMobileClose}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-150 relative",
                  active
                    ? "bg-[#EAEFFF]/[0.06] text-[#EAEFFF]"
                    : "text-white/40 hover:text-white/65 hover:bg-white/[0.025]"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[#EAEFFF]" />
                )}
                <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="px-3 pb-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="h-7 w-7 rounded-full bg-[#EAEFFF] flex items-center justify-center text-[10px] font-bold text-[#121212] shrink-0">
              {(userName || "A").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/60 truncate leading-tight">{userName || "Admin"}</p>
              <p className="text-[10px] text-white/25 truncate leading-tight mt-0.5">{userEmail || ""}</p>
            </div>
          </div>
          <form action={signOut} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[12px] text-white/25 hover:text-white/50 hover:bg-white/[0.025] transition-all"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 xl:w-60 border-r border-white/[0.04] bg-[#070707] shrink-0">
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
