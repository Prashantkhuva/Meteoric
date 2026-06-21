"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
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
  if (!dateStr) return "\u2014";
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
  const [statusModal, setStatusModal] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [converting, setConverting] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchLeads = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase not configured");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function handleStatusChange(leadId, newStatus) {
    setEditingStatus(leadId);
    const supabase = createClient();
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) {
      setToast({ type: "error", message: error.message });
    } else {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    }
    setEditingStatus(null);
  }

  async function handleConvert(lead) {
    setConverting(lead.id);
    const supabase = createClient();
    const { error: insertErr } = await supabase.from("clients").insert({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: "active",
    });
    if (insertErr) {
      setToast({ type: "error", message: insertErr.message });
      setConverting(null);
      return;
    }
    const { error: updateErr } = await supabase
      .from("leads").update({ status: "won" }).eq("id", lead.id);
    if (updateErr) {
      setToast({ type: "error", message: updateErr.message });
    } else {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: "won" } : l))
      );
      setToast({ type: "success", message: `${lead.name || "Lead"} converted to client` });
    }
    setConverting(null);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleDelete(leadId) {
    setDeleting(leadId);
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", leadId);
    if (error) {
      setToast({ type: "error", message: error.message });
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (viewLead?.id === leadId) setViewLead(null);
    }
    setDeleting(null);
  }

  async function handleAddLead(formData) {
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      services: formData.get("services"),
      budget: formData.get("budget"),
      status: "new",
    });
    if (error) {
      setToast({ type: "error", message: error.message });
      return;
    }
    setShowAddLead(false);
    setToast({ type: "success", message: "Lead added" });
    fetchLeads();
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
        <button
          onClick={() => setShowAddLead(true)}
          className="group relative overflow-hidden bg-[#EAEFFF] px-5 py-2.5 text-xs font-semibold text-[#202020] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={14} />
            Add Lead
          </span>
        </button>
      </div>

      <div className="border border-white/5 bg-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3.5 text-[10px] font-medium tracking-wider text-white/25 uppercase">Name</th>
                <th className="px-4 py-3.5 text-[10px] font-medium tracking-wider text-white/25 uppercase">Contact</th>
                <th className="px-4 py-3.5 text-[10px] font-medium tracking-wider text-white/25 uppercase">Status</th>
                <th className="px-4 py-3.5 text-[10px] font-medium tracking-wider text-white/25 uppercase">Created</th>
                <th className="px-4 py-3.5 text-right text-[10px] font-medium tracking-wider text-white/25 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-20 text-center text-sm text-white/20">
                    <span className="flex flex-col items-center gap-2">
                      <span className="text-2xl">&mdash;</span>
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
                      className="border-b border-white/[0.02] transition-all duration-300 hover:bg-white/[0.01] last:border-0"
                    >
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setViewLead(lead)}
                          className="text-left text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                        >
                          {lead.name || lead.company || "\u2014"}
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
                        <button
                          onClick={() => setStatusModal({ id: lead.id, current: lead.status })}
                          disabled={editingStatus === lead.id}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 hover:opacity-80`}
                          style={{
                            color: st.color,
                            borderColor: `${st.color}33`,
                            background: `${st.color}0d`,
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
                          {st.label}
                        </button>
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
                            className="p-2 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/50"
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                          {lead.status !== "won" && lead.status !== "lost" && (
                            <button
                              onClick={() => handleConvert(lead)}
                              disabled={converting === lead.id}
                              className="p-2 text-[#EAEFFF]/30 transition-all duration-300 hover:bg-[#EAEFFF]/[0.04] hover:text-[#EAEFFF]/60 disabled:opacity-30"
                              title="Convert to client"
                            >
                              <UserPlus size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(lead.id)}
                            disabled={deleting === lead.id}
                            className="p-2 text-red-400/20 transition-all duration-300 hover:bg-red-500/[0.04] hover:text-red-400/50 disabled:opacity-30"
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

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-[10vh]"
            onClick={() => setShowAddLead(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md border border-white/10 bg-black p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddLead(false)}
                className="absolute right-4 top-4 p-1.5 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/50"
              >
                <X size={16} />
              </button>

              <h2 className="text-lg font-semibold tracking-tight text-white mb-6">Add Lead</h2>

              <form action={handleAddLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Name</label>
                  <input name="name" className="w-full border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Email</label>
                  <input name="email" type="email" className="w-full border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Phone</label>
                  <input name="phone" className="w-full border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Services</label>
                  <input name="services" className="w-full border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none" placeholder="Web Development, SEO, Design" />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Budget</label>
                  <input name="budget" className="w-full border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none" placeholder="$5,000 - $10,000" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddLead(false)} className="flex-1 border border-white/10 px-4 py-2.5 text-xs font-medium text-white/35 transition-all duration-300 hover:bg-white/[0.03] hover:text-white/60">Cancel</button>
                  <button type="submit" className="flex-1 relative overflow-hidden bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#202020] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
                    <span className="relative z-10">Add Lead</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-6 right-6 z-[100] border px-4 py-3 text-sm font-medium ${
              toast.type === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {statusModal && (
          <StatusModal
            data={statusModal}
            onSelect={handleStatusChange}
            onClose={() => setStatusModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {viewLead && <LeadDetailModal lead={viewLead} onClose={() => setViewLead(null)} onDelete={handleDelete} />}
      </AnimatePresence>
    </div>
  );
}

function StatusModal({ data, onSelect, onClose }) {
  if (!data) return null;
  const current = data.current;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-xs border border-white/10 bg-black p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="px-3 py-3 text-[11px] font-medium tracking-wider text-white/30 uppercase">Change Status</p>
        <div className="space-y-0.5">
          {statusList.map((s) => (
            <button
              key={s.value}
              onClick={() => { onSelect(data.id, s.value); onClose(); }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/[0.04] ${
                current === s.value ? "text-white" : "text-white/40"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
              {current === s.value && <span className="ml-auto text-[#EAEFFF]/50">&#10003;</span>}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
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
    const { error: insertErr } = await supabase.from("clients").insert({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: "active",
    });
    if (insertErr) { setCnv(false); return alert(insertErr.message); }
    const { error: updateErr } = await supabase
      .from("leads").update({ status: "won" }).eq("id", lead.id);
    if (updateErr) { setCnv(false); return alert(updateErr.message); }
    onClose();
    window.location.reload();
  }

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
          <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.02] text-sm font-bold text-[#EAEFFF]">
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
              <div key={f.label} className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0">
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
          <div className="mt-4 border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs font-medium tracking-wider text-white/30 uppercase mb-2">Details</p>
            <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{lead.details}</p>
          </div>
        )}

        <div className="mt-4 text-xs text-white/15 text-right tabular-nums">
          Created {formatDate(lead.created_at)}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4">
          {lead.status !== "won" && lead.status !== "lost" && (
            <button
              onClick={handleConvert}
              disabled={cnv}
              className="relative overflow-hidden flex items-center gap-2 bg-[#EAEFFF] px-4 py-2 text-xs font-semibold text-[#202020] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
            >
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                <UserPlus size={13} />
                {cnv ? "Converting..." : "Convert to Client"}
                <ArrowRight size={12} />
              </span>
            </button>
          )}
          <button
            onClick={() => { onDelete(lead.id); onClose(); }}
            className="ml-auto flex items-center gap-2 border border-red-500/10 bg-red-500/5 px-4 py-2 text-xs font-medium text-red-400/50 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
