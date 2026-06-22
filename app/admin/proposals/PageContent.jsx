"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createClient } from "@/lib/client";
import {
  getLeads, createProposal, updateProposal, deleteProposal, sendProposal,
} from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X, Plus, Eye, Trash2, Send, FileText, Calendar, Building2, Pencil,
  ArrowUpRight, MessageCircle,
} from "lucide-react";
import { formatDate } from "@/lib/admin";
import { useToast } from "../_components/ToastContext";
import { StatusBadge } from "../_components/StatusBadge";
import { StatusSelect } from "../_components/StatusSelect";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Pagination } from "../_components/Pagination";
import { Toolbar, FilterChip, SortDropdown } from "../_components/Toolbar";
import { useFilters } from "../_components/useFilters";
import { useFocusTrap } from "../_components/useFocusTrap";
import { RichEditor } from "../_components/RichEditor";

const PAGE_SIZE = 15;

const statusList = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "viewed", label: "Viewed" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function statusColor(status) {
  const map = {
    draft: "text-white/30 bg-white/[0.04] border-white/[0.06]",
    sent: "text-blue-300/80 bg-blue-500/[0.06] border-blue-400/15",
    viewed: "text-yellow-300/80 bg-yellow-500/[0.06] border-yellow-400/15",
    accepted: "text-emerald-300/80 bg-emerald-500/[0.06] border-emerald-400/15",
    rejected: "text-red-300/80 bg-red-500/[0.06] border-red-400/15",
  };
  return map[status] || "text-white/30 bg-white/[0.04] border-white/[0.06]";
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, setFilters } = useFilters();
  const { search, status: statusFilter, sort, page } = filters;
  const [viewProposal, setViewProposal] = useState(null);
  const [editingProposal, setEditingProposal] = useState(null);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sending, setSending] = useState(null);
  const router = useRouter();
  const addToast = useToast();

  const handleCreateInvoice = useCallback((proposal) => {
    const params = new URLSearchParams();
    if (proposal.id) params.set("proposalId", proposal.id);
    if (proposal.lead?.name) params.set("clientName", proposal.lead.name);
    if (proposal.lead?.email) params.set("clientEmail", proposal.lead.email);
    if (proposal.title) params.set("description", proposal.title);
    router.push(`/admin/invoices${params.toString() ? `?${params.toString()}` : ""}`);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }

    const [proposalRes, leadsRes] = await Promise.all([
      supabase.from("proposals").select("*, lead:leads(name, email, phone, company)").order("created_at", { ascending: false }),
      getLeads().catch(() => []),
    ]);

    if (proposalRes.error) { setError(proposalRes.error.message); }
    else { setProposals(proposalRes.data || []); }
    setLeads(leadsRes);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...proposals];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        (p.title?.toLowerCase() || "").includes(q) ||
        (p.lead?.name?.toLowerCase() || "").includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });
    return result;
  }, [proposals, search, statusFilter, sort]);

  const safePage = Math.min(page, Math.ceil(filtered.length / PAGE_SIZE) || 1);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function handleCreate(formData) {
    try {
      await createProposal(formData);
      setShowNewProposal(false);
      addToast("Proposal created", "success");
      fetchData();
    } catch (err) {
      addToast(err.message || "Failed to create proposal", "error");
    }
  }

  async function handleUpdate(formData) {
    try {
      await updateProposal(formData);
      setEditingProposal(null);
      addToast("Proposal updated", "success");
      fetchData();
    } catch (err) {
      addToast(err.message || "Failed to update proposal", "error");
    }
  }

  async function handleDelete(id) {
    setDeleteTarget(null);
    try {
      await deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
      if (viewProposal?.id === id) setViewProposal(null);
      addToast("Proposal deleted", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete proposal", "error");
    }
  }

  function handleEdit(proposal) {
    setEditingProposal(proposal);
    setViewProposal(null);
  }

  async function handleSend(id) {
    setSending(id);
    try {
      await sendProposal(id);
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: "sent", sent_at: new Date().toISOString() } : p)));
      if (viewProposal?.id === id) {
        setViewProposal((prev) => prev ? { ...prev, status: "sent", sent_at: new Date().toISOString() } : null);
      }
      addToast("Proposal sent to lead", "success");
    } catch (err) {
      addToast(err.message || "Failed to send proposal", "error");
    }
    setSending(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading proposals...</span>
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
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Proposals</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">{filtered.length} proposal{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewProposal(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          New Proposal
        </button>
      </div>

      <Toolbar search={search} onSearchChange={(v) => setFilters({ search: v, page: 1 })} resultCount={filtered.length}>
        <FilterChip active={statusFilter === "all"} onClick={() => setFilters({ status: "all", page: 1 })}>All</FilterChip>
        {statusList.map((s) => (
          <FilterChip key={s.value} active={statusFilter === s.value} onClick={() => setFilters({ status: s.value, page: 1 })}>
            {s.label}
          </FilterChip>
        ))}
        <SortDropdown
          value={sort}
          onChange={(v) => setFilters({ sort: v })}
          label="Sort proposals"
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "title", label: "Title" },
          ]}
        />
      </Toolbar>

      {pageItems.length === 0 ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <p className="text-sm text-white/25">
            {hasFilters ? "No proposals match your filters" : "No proposals yet \u2014 create your first proposal to get started"}
          </p>
          {!hasFilters && (
            <button
              onClick={() => setShowNewProposal(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
            >
              <Plus size={15} />
              New Proposal
            </button>
          )}
        </div>
      ) : (
        <>
          <DesktopTable
            items={pageItems}
            onView={setViewProposal}
            onEdit={setEditingProposal}
            onSend={handleSend}
            onDelete={setDeleteTarget}
            sending={sending}
          />
          <MobileCards
            items={pageItems}
            onView={setViewProposal}
            onEdit={setEditingProposal}
            onSend={handleSend}
            onDelete={setDeleteTarget}
            sending={sending}
          />
          <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={(p) => setFilters({ page: p })} />
        </>
      )}

      <ProposalFormModal
        key={formResetKey}
        open={showNewProposal}
        onClose={() => { setShowNewProposal(false); setFormResetKey(k => k + 1); }}
        onSubmit={handleCreate}
        leads={leads}
        title="New Proposal"
      />

      {editingProposal && (
        <ProposalFormModal
          open={!!editingProposal}
          onClose={() => setEditingProposal(null)}
          onSubmit={handleUpdate}
          leads={leads}
          proposal={editingProposal}
          title="Edit Proposal"
        />
      )}

      <ProposalDetailDrawer
        proposal={viewProposal}
        onClose={() => setViewProposal(null)}
        onEdit={handleEdit}
        onSend={handleSend}
        onDelete={(id) => { setDeleteTarget(id); setViewProposal(null); }}
        onCreateInvoice={handleCreateInvoice}
        sending={sending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete proposal"
        message="Are you sure you want to delete this proposal? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function DesktopTable({ items, onView, onEdit, onSend, onDelete, sending }) {
  return (
    <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a] overflow-x-auto">
      <table className="w-full text-left text-sm min-w-max">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Title</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Lead</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Created</th>
            <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
              <td className="px-5 py-3.5">
                <button
                  onClick={() => onView(p)}
                  className="text-left text-sm text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                >
                  {p.title}
                </button>
              </td>
              <td className="px-5 py-3.5">
                {p.lead ? (
                  <div>
                    <span className="text-sm text-white/60">{p.lead.name}</span>
                    {p.lead.company && (
                      <span className="block text-xs text-white/25">{p.lead.company}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-white/25">—</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold border ${statusColor(p.status)}`}>
                  {statusList.find((s) => s.value === p.status)?.label || p.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-xs text-white/30 tabular-nums">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-white/30" />
                  {formatDate(p.created_at)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <IconButton onClick={() => onView(p)} icon={Eye} label="View details" />
                  {p.lead?.phone && (
                    <IconButton
                      onClick={() => window.open(`https://wa.me/${p.lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${p.lead.name}, I've sent you a proposal: ${p.title}`)}`, "_blank")}
                      icon={MessageCircle}
                      label="Share via WhatsApp"
                      className="text-emerald-400/30 hover:text-emerald-400/60 hover:bg-emerald-500/[0.04]"
                    />
                  )}
                  <IconButton
                    onClick={() => onEdit(p)}
                    icon={Pencil}
                    label="Edit proposal"
                    className="text-white/30 hover:text-white/50"
                  />
                  {p.status === "draft" && (
                    <IconButton
                      onClick={() => onSend(p.id)}
                      disabled={sending === p.id}
                      icon={Send}
                      label="Send proposal"
                      className="text-[#EAEFFF]/30 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/[0.04]"
                    />
                  )}
                  <IconButton
                    onClick={() => onDelete(p.id)}
                    icon={Trash2}
                    label="Delete proposal"
                    className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ items, onView, onEdit, onSend, onDelete, sending }) {
  return (
    <div className="sm:hidden space-y-3">
      {items.map((p) => (
        <div key={p.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onView(p)}
                className="text-sm font-medium text-white/80 hover:text-[#EAEFFF] transition-colors text-left"
              >
                {p.title}
              </button>
              {p.lead && (
                <p className="text-xs text-white/35 mt-0.5">{p.lead.name}{p.lead.company ? ` \u2022 ${p.lead.company}` : ""}</p>
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${statusColor(p.status)}`}>
              {statusList.find((s) => s.value === p.status)?.label || p.status}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-white/30 tabular-nums">{formatDate(p.created_at)}</span>
            <div className="flex items-center gap-1">
              <IconButton onClick={() => onView(p)} icon={Eye} label="View details" />
              {p.lead?.phone && (
                <IconButton
                  onClick={() => window.open(`https://wa.me/${p.lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${p.lead.name}, I've sent you a proposal: ${p.title}`)}`, "_blank")}
                  icon={MessageCircle}
                  label="Share via WhatsApp"
                  className="text-emerald-400/30 hover:text-emerald-400/60 hover:bg-emerald-500/[0.04]"
                />
              )}
              <IconButton onClick={() => onEdit(p)} icon={Pencil} label="Edit proposal" />
              {p.status === "draft" && (
                <IconButton
                  onClick={() => onSend(p.id)}
                  disabled={sending === p.id}
                  icon={Send}
                  label="Send proposal"
                  className="text-[#EAEFFF]/30 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/[0.04]"
                />
              )}
              <IconButton
                onClick={() => onDelete(p.id)}
                icon={Trash2}
                label="Delete proposal"
                className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]"
              />
            </div>
          </div>
        </div>
      ))}
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

function ProposalFormModal({ open, onClose, onSubmit, leads, proposal, title }) {
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState(null);
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (open && proposal) {
      setContent(proposal.content);
    }
    if (open && !proposal) {
      setContent(null);
    }
  }, [open, proposal]);

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
    const fd = new FormData(e.target);
    fd.set("content", JSON.stringify(content));
    if (proposal) fd.set("id", proposal.id);
    await onSubmit(fd);
    setSubmitting(false);
  }

  const scrollRef = useRef(null);

  function handleWheel(e) {
    const el = scrollRef.current;
    if (!el) return;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) return;
    el.scrollTop += e.deltaY;
    e.preventDefault();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-[5vh]" role="dialog" aria-modal="true" aria-labelledby="proposal-form-title">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div ref={trapRef} className="relative w-full max-w-2xl max-h-[calc(100dvh-10vh)] flex flex-col border border-white/[0.08] bg-[#0c0c0c] shadow-2xl">
        <div className="shrink-0 flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 id="proposal-form-title" className="text-lg font-semibold tracking-tight text-white/90">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div ref={scrollRef} onWheel={handleWheel} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Title" name="title" placeholder="Web Development Proposal" defaultValue={proposal?.title || ""} required />
              <div>
                <label htmlFor="field-lead_id" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Lead
                </label>
                <select
                  id="field-lead_id"
                  name="lead_id"
                  defaultValue={proposal?.lead_id || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="">No lead linked</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}{l.company ? ` (${l.company})` : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                Proposal Content
              </label>
              <RichEditor
                content={proposal?.content || null}
                onChange={setContent}
                placeholder="Start writing your proposal..."
              />
            </div>

            <div>
              <label htmlFor="field-timeline" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                Timeline
              </label>
              <textarea
                id="field-timeline"
                name="timeline"
                rows={2}
                placeholder="e.g. 4-6 weeks from project start"
                defaultValue={proposal?.timeline || ""}
                className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="field-terms" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                Terms & Conditions
              </label>
              <textarea
                id="field-terms"
                name="terms"
                rows={3}
                placeholder="Payment terms, revision policy, etc."
                defaultValue={proposal?.terms || ""}
                className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none resize-none"
              />
            </div>

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
                {submitting ? "Saving..." : proposal ? "Save Changes" : "Create Proposal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", placeholder, defaultValue, required }) {
  const inputId = `field-${name}`;
  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
        {label}
        {required && <span className="text-red-400/60 ml-0.5">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          rows={3}
          className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none resize-none"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          required={required}
          className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}

function ProposalDetailDrawer({ proposal, onClose, onEdit, onSend, onDelete, onCreateInvoice, sending }) {
  if (!proposal) return null;
  const trapRef = useFocusTrap(!!proposal);

  useEffect(() => {
    if (!proposal) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [proposal, onClose]);

  return (
    <AnimatePresence>
      {proposal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            ref={trapRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl border-l border-white/[0.06] bg-[#0a0a0a] shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-detail-title"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-6 py-4 z-10">
              <h2 id="proposal-detail-title" className="text-base font-semibold tracking-tight text-white/90">
                {proposal.title}
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
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold border ${statusColor(proposal.status)}`}>
                  {statusList.find((s) => s.value === proposal.status)?.label || proposal.status}
                </span>
                {proposal.sent_at && (
                  <span className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                    <Send size={11} />
                    Sent {formatDate(proposal.sent_at)}
                  </span>
                )}
              </div>

              {proposal.lead && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex h-10 w-10 items-center justify-center text-sm font-bold border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 text-[#EAEFFF]/70">
                    {proposal.lead.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{proposal.lead.name}</p>
                    {proposal.lead.email && (
                      <a href={`mailto:${proposal.lead.email}`} className="text-xs text-white/40 hover:text-[#EAEFFF] transition-colors">
                        {proposal.lead.email}
                      </a>
                    )}
                    {proposal.lead.company && (
                      <span className="block text-xs text-white/25">{proposal.lead.company}</span>
                    )}
                  </div>
                </div>
              )}

              {proposal.content && renderContent(proposal.content)}

              {proposal.timeline && (
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">Timeline</p>
                  <p className="text-sm text-white/60 whitespace-pre-wrap">{proposal.timeline}</p>
                </div>
              )}

              {proposal.terms && (
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">Terms & Conditions</p>
                  <p className="text-sm text-white/60 whitespace-pre-wrap">{proposal.terms}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                <Calendar size={11} />
                Created {formatDate(proposal.created_at)}
              </div>

              <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4">
                {proposal.lead?.phone && (
                  <button
                    onClick={() => window.open(`https://wa.me/${proposal.lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${proposal.lead.name}, I've sent you a proposal: ${proposal.title}. Check your email for details.`)}`, "_blank")}
                    className="inline-flex items-center gap-2 border border-emerald-400/20 px-4 py-2.5 text-xs font-semibold text-emerald-400/70 transition-all hover:bg-emerald-500/[0.06]"
                  >
                    <MessageCircle size={13} />
                    WhatsApp
                  </button>
                )}
                {onCreateInvoice && (
                  <button
                    onClick={() => onCreateInvoice(proposal)}
                    className="inline-flex items-center gap-2 border border-[#EAEFFF]/20 px-4 py-2.5 text-xs font-semibold text-[#EAEFFF]/60 transition-all hover:bg-[#EAEFFF]/[0.04]"
                  >
                    <FileText size={13} />
                    Create Invoice
                  </button>
                )}
                <button
                  onClick={() => onEdit(proposal)}
                  className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                {proposal.status === "draft" && (
                  <button
                    onClick={() => onSend(proposal.id)}
                    disabled={sending === proposal.id}
                    className="inline-flex items-center gap-2 border border-[#EAEFFF]/20 px-4 py-2.5 text-xs font-semibold text-[#EAEFFF]/60 transition-all hover:bg-[#EAEFFF]/[0.04] disabled:opacity-40"
                  >
                    <Send size={13} />
                    {sending === proposal.id ? "Sending..." : "Send to Lead"}
                  </button>
                )}
                <button
                  onClick={() => { onDelete(proposal.id); onClose(); }}
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

function renderContent(content) {
  if (!content) return null;
  if (typeof content === "string") {
    return <p className="text-sm text-white/60 whitespace-pre-wrap">{content}</p>;
  }
  if (content.type === "doc" && content.content) {
    return (
      <div className="space-y-3 text-sm text-white/60 leading-relaxed">
        {content.content.map((node, i) => renderTipTapNode(node, i))}
      </div>
    );
  }
  return null;
}

function renderTipTapNode(node, key) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="text-sm text-white/60 leading-relaxed">
          {renderInlineContent(node.content)}
        </p>
      );
    case "heading":
      const Tag = `h${node.attrs?.level || 2}`;
      const headingSizes = { 1: "text-lg font-semibold text-white/80", 2: "text-base font-semibold text-white/70", 3: "text-sm font-semibold text-white/60" };
      return (
        <Tag key={key} className={`${headingSizes[node.attrs?.level] || "text-base font-semibold text-white/70"} leading-relaxed`}>
          {renderInlineContent(node.content)}
        </Tag>
      );
    case "bulletList":
      return (
        <ul key={key} className="list-disc pl-5 space-y-1 text-sm text-white/60">
          {node.content?.map((item, i) => (
            <li key={i}>{renderInlineContent(item.content)}</li>
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal pl-5 space-y-1 text-sm text-white/60">
          {node.content?.map((item, i) => (
            <li key={i}>{renderInlineContent(item.content)}</li>
          ))}
        </ol>
      );
    default:
      return <p key={key} className="text-sm text-white/60">{renderInlineContent(node.content)}</p>;
  }
}

function renderInlineContent(content) {
  if (!content) return null;
  return content.map((node, i) => {
    switch (node.type) {
      case "text":
        let text = node.text || "";
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case "bold": text = <strong key={i}>{text}</strong>; break;
              case "italic": text = <em key={i}>{text}</em>; break;
              case "underline": text = <u key={i}>{text}</u>; break;
              case "link": {
                const href = mark.attrs?.href || "";
                const safe = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") ? href : "";
                text = <a key={i} href={safe} target="_blank" rel="noopener noreferrer" className="text-[#EAEFFF]/60 hover:text-[#EAEFFF] underline">{text}</a>;
              } break;
            }
          }
        }
        return <span key={i}>{text}</span>;
      case "hardBreak":
        return <br key={i} />;
      default:
        return null;
    }
  });
}
