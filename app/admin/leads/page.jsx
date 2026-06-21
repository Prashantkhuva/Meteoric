"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, ArrowRight, UserPlus, Trash2, Eye, Mail, Phone, Building2,
  FileText, DollarSign, Calendar, ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/admin";
import { useToast } from "../_components/ToastContext";
import { StatusBadge } from "../_components/StatusBadge";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Pagination } from "../_components/Pagination";
import { Toolbar, FilterChip, ClearFiltersButton } from "../_components/Toolbar";

const PAGE_SIZE = 15;
const statusList = [
  { value: "inquiry", label: "Inquiry" },
  { value: "discovery", label: "Discovery" },
  { value: "proposal", label: "Proposal" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewLead, setViewLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [converting, setConverting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }
    const { data, error } = await supabase
      .from("leads").select("*").order("created_at", { ascending: false });
    if (error) { setError(error.message); }
    else { setLeads(data || []); }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        (l.name?.toLowerCase() || "").includes(q) ||
        (l.email?.toLowerCase() || "").includes(q) ||
        (l.company?.toLowerCase() || "").includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });
    return result;
  }, [leads, search, statusFilter, sort]);

  const safePage = Math.min(page, Math.ceil(filtered.length / PAGE_SIZE) || 1);
  const pageLeads = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function handleStatusChange(leadId, newStatus) {
    setEditingStatus(leadId);
    const supabase = createClient();
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) { addToast(error.message, "error"); }
    else {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      addToast("Status updated", "success");
    }
    setEditingStatus(null);
  }

  async function handleConvert(lead) {
    setConverting(lead.id);
    const supabase = createClient();
    const { error: insertErr } = await supabase.from("clients").insert({
      name: lead.name, email: lead.email, company: lead.company, status: "onboarding",
    });
    if (insertErr) { addToast(insertErr.message, "error"); setConverting(null); return; }
    const { error: updateErr } = await supabase
      .from("leads").update({ status: "completed" }).eq("id", lead.id);
    if (updateErr) { addToast(updateErr.message, "error"); }
    else {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "completed" } : l)));
      addToast(`${lead.name || "Lead"} converted to client`, "success");
    }
    setConverting(null);
  }

  async function handleDelete(leadId) {
    setDeleteTarget(null);
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", leadId);
    if (error) { addToast(error.message, "error"); }
    else {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (viewLead?.id === leadId) setViewLead(null);
      addToast("Lead deleted", "success");
    }
  }

  async function handleAddLead(formData) {
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      services: formData.get("services"),
      budget: formData.get("budget"),
      status: "inquiry",
    });
    if (error) { addToast(error.message, "error"); return; }
    setShowAddLead(false);
    addToast("Lead added", "success");
    fetchLeads();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="border border-red-500/10 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      </div>
    );
  }

  const hasFilters = search || statusFilter !== "all";

  return (
    <div className="p-5 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Leads</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowAddLead(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      <Toolbar search={search} onSearchChange={setSearch} resultCount={filtered.length}>
        <ClearFiltersButton onClick={() => { setSearch(""); setStatusFilter("all"); }} visible={hasFilters} />
        <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All</FilterChip>
        {statusList.map((s) => (
          <FilterChip key={s.value} active={statusFilter === s.value} onClick={() => setStatusFilter(s.value)}>
            {s.label}
          </FilterChip>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors outline-none"
          aria-label="Sort leads"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
      </Toolbar>

      {pageLeads.length === 0 ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <p className="text-sm text-white/25">
            {hasFilters ? "No leads match your filters" : "No leads yet"}
          </p>
        </div>
      ) : (
        <>
          <DesktopTable
            leads={pageLeads}
            onView={setViewLead}
            onConvert={handleConvert}
            onStatusChange={handleStatusChange}
            onDelete={setDeleteTarget}
            editingStatus={editingStatus}
            converting={converting}
          />
          <MobileCards
            leads={pageLeads}
            onView={setViewLead}
            onConvert={handleConvert}
            onStatusChange={handleStatusChange}
            onDelete={setDeleteTarget}
            editingStatus={editingStatus}
            converting={converting}
          />
          <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}

      <AddLeadModal open={showAddLead} onClose={() => setShowAddLead(false)} onSubmit={handleAddLead} />
      <LeadDetailDrawer lead={viewLead} onClose={() => setViewLead(null)} onConvert={handleConvert} onDelete={setDeleteTarget} converting={converting} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function DesktopTable({ leads, onView, onConvert, onStatusChange, onDelete, editingStatus, converting }) {
  return (
    <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Name</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Contact</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Created</th>
              <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onView(lead)}
                    className="text-left text-sm text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                  >
                    {lead.name || lead.company || "\u2014"}
                  </button>
                  {lead.company && lead.name && (
                    <span className="block text-xs text-white/25">{lead.company}</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="text-xs text-white/45 transition-colors hover:text-[#EAEFFF]">
                        {lead.email}
                      </a>
                    )}
                    {lead.phone && <span className="text-xs text-white/25">{lead.phone}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusSelect
                    current={lead.status}
                    onChange={(val) => onStatusChange(lead.id, val)}
                    disabled={editingStatus === lead.id}
                  />
                </td>
                <td className="px-5 py-3.5 text-xs text-white/30 tabular-nums">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-white/30" />
                    {formatDate(lead.created_at)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <IconButton onClick={() => onView(lead)} icon={Eye} label="View details" />
                    {lead.status !== "completed" && lead.status !== "lost" && (
                      <IconButton
                        onClick={() => onConvert(lead)}
                        disabled={converting === lead.id}
                        icon={UserPlus}
                        label="Convert to client"
                        className="text-[#EAEFFF]/30 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/[0.04]"
                      />
                    )}
                    <IconButton
                      onClick={() => onDelete(lead.id)}
                      icon={Trash2}
                      label="Delete lead"
                      className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MobileCards({ leads, onView, onConvert, onStatusChange, onDelete, editingStatus, converting }) {
  return (
    <div className="sm:hidden space-y-3">
      {leads.map((lead) => (
        <div key={lead.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onView(lead)}
                className="text-sm font-medium text-white/80 hover:text-[#EAEFFF] transition-colors text-left"
              >
                {lead.name || lead.company || "\u2014"}
              </button>
              {lead.company && lead.name && (
                <p className="text-xs text-white/25 mt-0.5">{lead.company}</p>
              )}
            </div>
            <StatusSelect
              current={lead.status}
              onChange={(val) => onStatusChange(lead.id, val)}
              disabled={editingStatus === lead.id}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/30 mb-3">
            {lead.email && <span className="truncate max-w-[180px]">{lead.email}</span>}
            {lead.phone && <span>{lead.phone}</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/30 tabular-nums">{formatDate(lead.created_at)}</span>
            <div className="flex items-center gap-1">
              <IconButton onClick={() => onView(lead)} icon={Eye} label="View details" />
              {lead.status !== "completed" && lead.status !== "lost" && (
                <IconButton
                  onClick={() => onConvert(lead)}
                  disabled={converting === lead.id}
                  icon={UserPlus}
                  label="Convert to client"
                  className="text-[#EAEFFF]/30 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/[0.04]"
                />
              )}
              <IconButton
                onClick={() => onDelete(lead.id)}
                icon={Trash2}
                label="Delete lead"
                className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusSelect({ current, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white/70 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Status: ${current}. Click to change.`}
      >
        <StatusBadge status={current} />
        <ChevronDown size={10} className="opacity-40" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1 z-50 w-36 border border-white/[0.08] bg-[#0c0c0c] p-1 shadow-2xl"
            role="listbox"
            aria-label="Change status"
          >
            {statusList.map((s) => {
              const isActive = current === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => { onChange(s.value); setOpen(false); }}
                  role="option"
                  aria-selected={isActive}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all hover:bg-white/[0.06] text-white/50"
                >
                  <StatusBadge status={s.value} />
                  {isActive && <span className="ml-auto text-[#EAEFFF]/40 text-[10px]">\u2713</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconButton({ onClick, icon: Icon, label, className, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/50 disabled:opacity-30 disabled:pointer-events-none ${className || ""}`}
      aria-label={label}
      title={label}
    >
      <Icon size={14} />
    </button>
  );
}

function AddLeadModal({ open, onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(new FormData(e.target));
    setSubmitting(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-lead-title"
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
            <h2 id="add-lead-title" className="text-lg font-semibold tracking-tight text-white/90 mb-6">Add Lead</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Name" name="name" placeholder="John Doe" />
              <FormField label="Email" name="email" type="email" placeholder="john@example.com" />
              <FormField label="Phone" name="phone" placeholder="+1 234 567 890" />
              <FormField label="Services" name="services" placeholder="Web Development, SEO, Design" />
              <FormField label="Budget" name="budget" placeholder="$5,000 - $10,000" />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Lead"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormField({ label, name, type = "text", placeholder }) {
  const inputId = `field-${name}`;
  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}

function LeadDetailDrawer({ lead, onClose, onConvert, onDelete, converting }) {
  if (!lead) return null;

  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l border-white/[0.06] bg-[#0a0a0a] shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-detail-title"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-6 py-4 z-10">
              <h2 id="lead-detail-title" className="text-base font-semibold tracking-tight text-white/90">
                Lead Details
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 text-white/30 hover:text-white/60 transition-colors hover:bg-white/[0.04]"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center text-sm font-bold border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 text-[#EAEFFF]/70">
                  {(lead.name || lead.company || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">{lead.name || lead.company || "Unnamed"}</h3>
                  <StatusBadge status={lead.status} className="mt-0.5" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Mail, label: "Email", value: lead.email, href: lead.email ? `mailto:${lead.email}` : null },
                  { icon: Phone, label: "Phone", value: lead.phone },
                  { icon: Building2, label: "Company", value: lead.company },
                  { icon: FileText, label: "Services", value: lead.services },
                  { icon: DollarSign, label: "Budget", value: lead.budget },
                ].map((f) => {
                  if (!f.value) return null;
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-3 border-b border-white/[0.04] py-3 last:border-0">
                      <Icon size={13} className="text-white/30 shrink-0" />
                      <span className="text-[10px] font-semibold tracking-wider text-white/25 uppercase w-16 shrink-0">
                        {f.label}
                      </span>
                      {f.href ? (
                        <a href={f.href} className="text-sm text-white/60 transition-colors hover:text-[#EAEFFF]">
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
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-2">Details</p>
                  <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{lead.details}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                <Calendar size={11} />
                Created {formatDate(lead.created_at)}
              </div>

              <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4">
                {lead.status !== "completed" && lead.status !== "lost" && (
                  <button
                    onClick={() => onConvert(lead)}
                    disabled={converting}
                    className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-40"
                  >
                    <UserPlus size={13} />
                    {converting ? "Converting..." : "Convert to Client"}
                    <ArrowRight size={12} />
                  </button>
                )}
                <button
                  onClick={() => { onDelete(lead.id); onClose(); }}
                  className="ml-auto inline-flex items-center gap-2 border border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400/60 transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
