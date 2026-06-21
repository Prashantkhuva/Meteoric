"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Building2, FileText, DollarSign, Clock, Calendar } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "\u2014";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentLeadsTable({ leads }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="border border-white/5 bg-black">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <h3 className="text-xs font-semibold tracking-tight text-white/70">Recent Leads</h3>
          <a href="/admin/leads" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-[10px] font-medium tracking-wider text-white/20 uppercase">Name</th>
                <th className="px-5 py-3 text-[10px] font-medium tracking-wider text-white/20 uppercase">Status</th>
                <th className="px-5 py-3 text-[10px] font-medium tracking-wider text-white/20 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-xs text-white/15">No leads yet</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="cursor-pointer border-b border-white/[0.02] transition-all duration-300 hover:bg-white/[0.02] last:border-0"
                  >
                    <td className="px-5 py-3">
                      <span className="text-xs text-white/50">{lead.name || lead.email || "\u2014"}</span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3 text-[10px] text-white/20 tabular-nums">{formatDate(lead.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <LeadDetailModal lead={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function LeadDetailModal({ lead, onClose }) {
  const fields = [
    { icon: Mail, label: "Email", value: lead.email, href: lead.email ? `mailto:${lead.email}` : null },
    { icon: Phone, label: "Phone", value: lead.phone },
    { icon: Building2, label: "Company", value: lead.company },
    { icon: FileText, label: "Services", value: lead.services },
    { icon: DollarSign, label: "Budget", value: lead.budget },
    { icon: Clock, label: "Status", value: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-[10vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-lg border border-white/10 bg-black p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/50"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center text-sm font-bold rounded border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 text-[#EAEFFF]/70">
            {(lead.name || lead.company || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {lead.name || lead.company || "Unnamed"}
            </h2>
            <StatusBadge status={lead.status} className="mt-0.5" />
          </div>
        </div>

        <div className="space-y-0">
          {fields.map((f) => {
            if (!f.value) return null;
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0">
                <Icon size={13} className="text-white/20 shrink-0" />
                <span className="text-[10px] font-medium tracking-wider text-white/25 uppercase w-16 shrink-0">
                  {f.label}
                </span>
                {f.href ? (
                  <a
                    href={f.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#EAEFFF]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {f.value}
                  </a>
                ) : (
                  <span className="text-sm text-white/60">{f.value}</span>
                )}
              </div>
            );
          })}
        </div>

        {lead.details && (
          <div className="mt-4 border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[10px] font-medium tracking-wider text-white/25 uppercase mb-2">Details</p>
            <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{lead.details}</p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-white/15 tabular-nums">
          <Calendar size={11} />
          Created {formatDate(lead.created_at)}
        </div>
      </motion.div>
    </motion.div>
  );
}
