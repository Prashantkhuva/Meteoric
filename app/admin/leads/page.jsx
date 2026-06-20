"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ArrowRight,
  UserPlus,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  FileText,
  DollarSign,
  Clock,
  Calendar,
} from "lucide-react";

const statusList = [
  { value: "new", label: "New", color: "#34d399" },
  { value: "contacted", label: "Contacted", color: "#38bdf8" },
  { value: "qualified", label: "Qualified", color: "#7c6aff" },
  { value: "proposal", label: "Proposal", color: "#c8a97e" },
  { value: "won", label: "Won", color: "#EAEFFF" },
  { value: "lost", label: "Lost", color: "#ef4444" },
];

const statusMap = Object.fromEntries(statusList.map((s) => [s.value, s]));

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [converting, setConverting] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchLeads = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase not configured");
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function handleStatusChange(leadId, newStatus) {
    setEditingStatus(leadId);
    const supabase = createClient();
    await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    setEditingStatus(null);
  }

  async function handleConvert(lead) {
    setConverting(lead.id);
    const supabase = createClient();
    await supabase.from("clients").insert({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: "active",
    });
    await supabase.from("leads").update({ status: "won" }).eq("id", lead.id);
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: "won" } : l))
    );
    setConverting(null);
  }

  async function handleDelete(leadId) {
    setDeleting(leadId);
    const supabase = createClient();
    await supabase.from("leads").delete().eq("id", leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (viewLead?.id === leadId) setViewLead(null);
    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Leads</h1>
        <p className="text-sm text-white/30">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Leads</h1>
          <p className="mt-1 text-sm text-white/40">
            {leads.length} total lead{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md">
        <div className="absolute -top-40 -right-40 h-60 w-60 rounded-full bg-[#EAEFFF]/[0.015] blur-[80px]" />
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EAEFFF]/8">
                <th className="px-4 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Name</th>
                <th className="px-4 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Contact</th>
                <th className="px-4 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Status</th>
                <th className="px-4 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Created</th>
                <th className="px-4 py-4 text-right text-xs font-medium tracking-wider text-white/30 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-20 text-center text-sm text-white/20">
                    <span className="flex flex-col items-center gap-2">
                      <span className="text-2xl">—</span>
                      <span>No leads yet</span>
                    </span>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const st = statusMap[lead.status] || statusMap.new;
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.015] last:border-0"
                    >
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setViewLead(lead)}
                          className="text-left text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                        >
                          {lead.name || lead.company || "—"}
                        </button>
                        {lead.company && lead.name && (
                          <span className="block text-xs text-white/20">{lead.company}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-white/40 transition-colors hover:text-[#EAEFFF] text-xs">
                              {lead.email}
                            </a>
                          )}
                          {lead.phone && (
                            <span className="text-white/25 text-xs">{lead.phone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusDropdown
                          current={lead.status}
                          onChange={(val) => handleStatusChange(lead.id, val)}
                          disabled={editingStatus === lead.id}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-white/30 text-xs tabular-nums">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={11} />
                          {formatDate(lead.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewLead(lead)}
                            className="rounded-lg p-2 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/50"
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                          {lead.status !== "won" && lead.status !== "lost" && (
                            <button
                              onClick={() => handleConvert(lead)}
                              disabled={converting === lead.id}
                              className="rounded-lg p-2 text-[#EAEFFF]/30 transition-all duration-300 hover:bg-[#EAEFFF]/[0.04] hover:text-[#EAEFFF]/60 disabled:opacity-30"
                              title="Convert to client"
                            >
                              <UserPlus size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(lead.id)}
                            disabled={deleting === lead.id}
                            className="rounded-lg p-2 text-red-400/20 transition-all duration-300 hover:bg-red-500/[0.04] hover:text-red-400/50 disabled:opacity-30"
                            title="Delete lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {viewLead && <LeadDetailModal lead={viewLead} onClose={() => setViewLead(null)} onDelete={handleDelete} />}
      </AnimatePresence>
    </div>
  );
}

function StatusDropdown({ current, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const st = statusMap[current] || statusMap.new;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 hover:opacity-80`}
        style={{
          color: st.color,
          borderColor: `${st.color}33`,
          background: `${st.color}0d`,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
        {st.label}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 w-40 rounded-xl border border-[#EAEFFF]/10 bg-black/90 backdrop-blur-xl p-1 shadow-xl">
            {statusList.map((s) => (
              <button
                key={s.value}
                onClick={() => { onChange(s.value); setOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 hover:bg-white/[0.04] ${
                  current === s.value ? "text-white" : "text-white/40"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                {s.label}
                {current === s.value && <span className="ml-auto text-[#EAEFFF]/50">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onDelete }) {
  const [cnv, setCnv] = useState(false);
  const st = statusMap[lead.status] || statusMap.new;
  const fields = [
    { icon: Mail, label: "Email", value: lead.email, href: lead.email ? `mailto:${lead.email}` : null },
    { icon: Phone, label: "Phone", value: lead.phone },
    { icon: Building2, label: "Company", value: lead.company },
    { icon: FileText, label: "Services", value: lead.services },
    { icon: DollarSign, label: "Budget", value: lead.budget },
    { icon: Clock, label: "Status", value: st.label, color: st.color },
  ];

  async function handleConvert() {
    setCnv(true);
    const supabase = createClient();
    await supabase.from("clients").insert({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: "active",
    });
    await supabase.from("leads").update({ status: "won" }).eq("id", lead.id);
    onClose();
    window.location.reload();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-[10vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-2xl border border-[#EAEFFF]/10 bg-black/80 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(234,239,255,0.03)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/50"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFFF]/15 bg-[#EAEFFF]/10 text-sm font-bold text-[#EAEFFF]">
            {(lead.name || lead.company || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {lead.name || lead.company || "Unnamed"}
            </h2>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium mt-0.5"
              style={{
                color: st.color,
                borderColor: `${st.color}33`,
                background: `${st.color}0d`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
              {st.label}
            </span>
          </div>
        </div>

        <div className="space-y-0">
          {fields.map((f) => {
            if (!f.value) return null;
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3 border-b border-[#EAEFFF]/5 py-3 last:border-0">
                <Icon size={13} className="text-white/20 shrink-0" />
                <span className="text-xs font-medium tracking-wider text-white/30 uppercase w-16 shrink-0">
                  {f.label}
                </span>
                {f.href ? (
                  <a href={f.href} className="text-sm text-white/60 transition-colors hover:text-[#EAEFFF]">
                    {f.value}
                  </a>
                ) : (
                  <span className="text-sm text-white/60" style={f.color ? { color: f.color } : {}}>
                    {f.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {lead.details && (
          <div className="mt-4 rounded-xl border border-[#EAEFFF]/5 bg-white/[0.02] p-4">
            <p className="text-xs font-medium tracking-wider text-white/30 uppercase mb-2">Details</p>
            <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{lead.details}</p>
          </div>
        )}

        <div className="mt-4 text-xs text-white/15 text-right tabular-nums">
          Created {formatDate(lead.created_at)}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-[#EAEFFF]/8 pt-4">
          {lead.status !== "won" && lead.status !== "lost" && (
            <button
              onClick={handleConvert}
              disabled={cnv}
              className="flex items-center gap-2 rounded-xl border border-[#EAEFFF]/15 bg-[#EAEFFF]/5 px-4 py-2 text-xs font-medium text-[#EAEFFF]/70 transition-all duration-300 hover:bg-[#EAEFFF]/10 hover:text-[#EAEFFF] disabled:opacity-40"
            >
              <UserPlus size={13} />
              {cnv ? "Converting..." : "Convert to Client"}
              <ArrowRight size={12} />
            </button>
          )}
          <button
            onClick={() => { onDelete(lead.id); onClose(); }}
            className="ml-auto flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-2 text-xs font-medium text-red-400/50 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
