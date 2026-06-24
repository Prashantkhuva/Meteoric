"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getLeads, createProposal, updateProposal, deleteProposal, sendProposal, updateProposalStatus, getProposalsPaginated, ensureShareToken,
} from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X, Plus, Eye, Trash2, Send, FileText, Calendar, Building2, Pencil,
  ArrowUpRight, MessageCircle, Download, ChevronUp, ChevronDown, Printer,
  CheckCircle2, XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/supabase/admin";
import { useToast } from "../components/ToastContext";
import { StatusSelect } from "../components/StatusSelect";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";
import { Toolbar, FilterChip, SortDropdown, ClearFiltersButton } from "../components/Toolbar";
import { BulkActionBar } from "../components/BulkActionBar";
import { IconButton } from "../components/IconButton";
import { FormField } from "../components/FormField";
import { useFilters } from "@/hooks/useFilters";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useShortcuts } from "@/hooks/useShortcuts";
import { downloadCSV } from "@/lib/csv-export";
import { getSiteUrl } from "@/config/site-url";
import Checkbox from "../components/Checkbox";
import { RichEditor } from "../components/RichEditor";

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

const CSV_COLUMNS = [
  { label: "Title", accessor: (p) => p.title || "" },
  { label: "Lead Name", accessor: (p) => p.lead?.name || "" },
  { label: "Lead Company", accessor: (p) => p.lead?.company || "" },
  { label: "Status", accessor: (p) => p.status || "" },
  { label: "Created", accessor: (p) => formatDate(p.created_at) },
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [total, setTotal] = useState(0);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, status: statusFilter, sort, page, col, dir } = filters;
  const [viewProposal, setViewProposal] = useState(null);
  const [editingProposal, setEditingProposal] = useState(null);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const [sending, setSending] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const router = useRouter();
  const addToast = useToast();
  const searchRef = useRef(null);

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
  }, [search, statusFilter, sort, page, col, dir]);

  useShortcuts(
    useMemo(() => ({
      "n": () => setShowNewProposal(true),
      "/": () => searchRef.current?.focus(),
      "Escape": () => { if (viewProposal) setViewProposal(null); if (showNewProposal) setShowNewProposal(false); },
    }), [viewProposal, showNewProposal])
  );

  async function fetchData() {
    setLoading(true);
    const [result, leadsRes] = await Promise.all([
      getProposalsPaginated({ page, pageSize: PAGE_SIZE, search, status: statusFilter, col, dir, sort }),
      getLeads().catch(() => []),
    ]);
    if (result.error) { setError(result.error); }
    else { setProposals(result.data); setTotal(result.total); }
    setLeads(leadsRes);
    setLoading(false);
  }

  useEffect(() => {
    setSelected(new Set());
  }, [page, search, statusFilter]);

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === proposals.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(proposals.map((p) => p.id)));
    }
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    setIsDeleting(true);
    try {
      await Promise.all(ids.map((id) => deleteProposal(id)));
      setProposals((prev) => prev.filter((p) => !ids.includes(p.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      if (viewProposal && ids.includes(viewProposal.id)) setViewProposal(null);
      addToast(`${ids.length} proposal${ids.length > 1 ? "s" : ""} deleted`, "success");
      setSelected(new Set());
      setBulkConfirm(null);
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
      setBulkConfirm(null);
    }
    setIsDeleting(false);
  }

  async function handleBulkStatusChange(newStatus) {
    const ids = [...selected];
    try {
      await Promise.all(ids.map((id) => updateProposalStatus(id, newStatus)));
      setProposals((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: newStatus } : p));
      addToast(`${ids.length} proposal${ids.length > 1 ? "s" : ""} updated`, "success");
      setSelected(new Set());
    } catch (err) {
      addToast(err.message || "Failed to update", "error");
    }
  }

  async function handleExportCSV() {
    const supabase = createClient();
    if (!supabase) return;
    let query = supabase.from("proposals").select("*, lead:leads(name, email, phone, company)");
    if (search) { query = query.or(`title.ilike.%${search}%,lead.name.ilike.%${search}%`); }
    if (statusFilter !== "all") { query = query.eq("status", statusFilter); }
    const { data } = await query;
    downloadCSV(data || [], CSV_COLUMNS, `proposals-${new Date().toISOString().slice(0, 10)}.csv`);
    addToast("CSV exported", "success");
  }

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
    setIsDeleting(true);
    try {
      await deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (viewProposal?.id === id) setViewProposal(null);
      addToast("Proposal deleted", "success");
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message || "Failed to delete proposal", "error");
      setDeleteTarget(null);
    }
    setIsDeleting(false);
  }

  function handleEdit(proposal) {
    setEditingProposal(proposal);
    setViewProposal(null);
  }

  async function handleSend(id) {
    setSending(id);
    const result = await sendProposal(id);
    if (result.success) {
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: "sent", sent_at: new Date().toISOString() } : p)));
      if (viewProposal?.id === id) {
        setViewProposal((prev) => prev ? { ...prev, status: "sent", sent_at: new Date().toISOString() } : null);
      }
      addToast("Proposal sent to lead", "success");
    } else {
      addToast(result.error || "Failed to send proposal", "error");
    }
    setSending(null);
  }

  async function handleStatusChange(id, newStatus) {
    setEditingStatus(id);
    try {
      await updateProposalStatus(id, newStatus);
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
      if (viewProposal?.id === id) {
        setViewProposal((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      addToast("Status updated", "success");
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    }
    setEditingStatus(null);
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
          <p className="mt-1 text-sm text-white/35 tabular-nums">{total} proposal{total !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewProposal(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          New Proposal
        </button>
      </div>

      <Toolbar search={search} onSearchChange={(v) => setFilters({ search: v, page: 1 })} resultCount={total} searchRef={searchRef}>
        <button
          onClick={handleExportCSV}
          className="rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors"
          aria-label="Export CSV"
        >
          <Download size={12} className="inline mr-1" />
          CSV
        </button>
        <ClearFiltersButton onClick={() => setFilters({ search: "", status: "all", page: 1 })} visible={hasFilters} />
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

      {proposals.length === 0 && !loading ? (
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
          {proposals.length > 0 && (
            <>
              <DesktopTable
                items={proposals}
                onView={setViewProposal}
                onEdit={setEditingProposal}
                onSend={handleSend}
                onDelete={setDeleteTarget}
                onStatusChange={handleStatusChange}
                editingStatus={editingStatus}
                sending={sending}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                col={col}
                dir={dir}
                onColSort={toggleColSort}
              />
              <MobileCards
                items={proposals}
                onView={setViewProposal}
                onEdit={setEditingProposal}
                onSend={handleSend}
                onDelete={setDeleteTarget}
                onStatusChange={handleStatusChange}
                editingStatus={editingStatus}
                sending={sending}
                selected={selected}
                onToggleSelect={toggleSelect}
              />
            </>
          )}
          <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={(p) => setFilters({ page: p })} />
        </>
      )}

      <BulkActionBar
        selectedCount={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={selected.size > 0 ? () => setBulkConfirm("delete") : undefined}
        onStatusChange={handleBulkStatusChange}
        statusOptions={statusList}
      />

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
        onStatusChange={handleStatusChange}
        sending={sending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete proposal"
        message="Are you sure you want to delete this proposal? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => { if (!isDeleting) setDeleteTarget(null) }}
      />
      <ConfirmDialog
        open={bulkConfirm === "delete"}
        title="Delete proposals"
        message={`Are you sure you want to delete ${selected.size} proposal${selected.size !== 1 ? "s" : ""}? This action cannot be undone.`}
        confirmLabel="Delete All"
        destructive
        loading={isDeleting}
        onConfirm={handleBulkDelete}
        onCancel={() => { if (!isDeleting) setBulkConfirm(null) }}
      />
    </div>
  );
}

function SortIcon({ column, col, dir }) {
  if (col !== column) return null;
  return dir === "asc" ? (
    <ChevronUp size={11} className="inline ml-0.5 text-[#EAEFFF]" />
  ) : (
    <ChevronDown size={11} className="inline ml-0.5 text-[#EAEFFF]" />
  );
}

function DesktopTable({ items, onView, onEdit, onSend, onDelete, onStatusChange, editingStatus, sending, selected, onToggleSelect, onToggleSelectAll, col, dir, onColSort }) {
  const allSelected = items.length > 0 && selected.size === items.length;

  return (
    <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a] overflow-x-auto">
      <table className="w-full text-left text-sm min-w-max">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-5 py-3.5 w-10">
              <Checkbox
                checked={allSelected}
                onChange={onToggleSelectAll}
                label="Select all"
              />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("title")}>
              Title<SortIcon column="title" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Lead</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("status")}>
              Status<SortIcon column="status" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("created_at")}>
              Created<SortIcon column="created_at" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
              <td className="px-5 py-3.5">
                <Checkbox
                  checked={selected.has(p.id)}
                  onChange={() => onToggleSelect(p.id)}
                  label={`Select ${p.title || "proposal"}`}
                />
              </td>
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
                <StatusSelect
                  value={p.status}
                  onChange={(val) => onStatusChange(p.id, val)}
                  disabled={editingStatus === p.id}
                  options={statusList}
                />
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
onClick={async () => {
                const t = p.share_token || (await ensureShareToken("proposal", p.id)).token;
                window.open(`https://wa.me/${p.lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${p.lead.name}, I've sent you a proposal: ${p.title}.${t ? ` Download: ${getSiteUrl()}/api/pdf/proposal/${p.id}?token=${t}` : " Check your email for the PDF."}`)}`, "_blank")}
              }
                      icon={MessageCircle}
                      label="Share via WhatsApp"
                      className="text-emerald-400/30 hover:text-emerald-400/60 hover:bg-emerald-500/[0.04]"
                    />
                  )}
                  <IconButton onClick={() => window.open(`/preview/proposal/${p.id}`, "_blank")} icon={Printer} label="Print / PDF" className="text-white/30 hover:text-white/50" />
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

function MobileCards({ items, onView, onEdit, onSend, onDelete, onStatusChange, editingStatus, sending, selected, onToggleSelect }) {
  return (
    <div className="sm:hidden space-y-3">
      {items.map((p) => (
        <div key={p.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                checked={selected.has(p.id)}
                onChange={() => onToggleSelect(p.id)}
                label={`Select ${p.title || "proposal"}`}
              />
              <div className="min-w-0">
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
            </div>
            <StatusSelect
              value={p.status}
              onChange={(val) => onStatusChange(p.id, val)}
              disabled={editingStatus === p.id}
              options={statusList}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-white/30 tabular-nums">{formatDate(p.created_at)}</span>
            <div className="flex items-center gap-1">
              <IconButton onClick={() => onView(p)} icon={Eye} label="View details" />
              {p.lead?.phone && (
                <IconButton
                  onClick={async () => {
                    const t = p.share_token || (await ensureShareToken("proposal", p.id)).token;
                    window.open(`https://wa.me/${p.lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${p.lead.name}, I've sent you a proposal: ${p.title}.${t ? ` Download: ${getSiteUrl()}/api/pdf/proposal/${p.id}?token=${t}` : " Check your email for the PDF."}`)}`, "_blank")}
                  }
                  icon={MessageCircle}
                  label="Share via WhatsApp"
                  className="text-emerald-400/30 hover:text-emerald-400/60 hover:bg-emerald-500/[0.04]"
                />
              )}
              <IconButton onClick={() => window.open(`/preview/proposal/${p.id}`, "_blank")} icon={Printer} label="Print / PDF" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="proposal-form-title">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div ref={(el) => { trapRef.current = el; scrollRef.current = el }} onWheel={handleWheel} className="relative w-full max-w-2xl max-h-full overflow-y-auto border border-white/[0.08] bg-[#0c0c0c] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0c0c0c] px-6 py-4">
          <h2 id="proposal-form-title" className="text-lg font-semibold tracking-tight text-white/90">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">
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

function ProposalDetailDrawer({ proposal, onClose, onEdit, onSend, onDelete, onCreateInvoice, onStatusChange, sending }) {
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
                <button
                  onClick={() => window.open(`/preview/proposal/${proposal.id}`, "_blank")}
                  className="inline-flex items-center gap-2 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70"
                >
                  <Printer size={13} />
                  Print / PDF
                </button>
                {proposal.lead?.phone && (
                  <button
                    onClick={async () => {
                      const t = proposal.share_token || (await ensureShareToken("proposal", proposal.id)).token;
                      window.open(`https://wa.me/${proposal.lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${proposal.lead.name}, I've sent you a proposal: ${proposal.title}.${t ? ` Download: ${getSiteUrl()}/api/pdf/proposal/${proposal.id}?token=${t}` : " Check your email for the PDF."}`)}`, "_blank")}
                    }
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
                {proposal.status === "sent" && (
                  <>
                    <button
                      onClick={() => onStatusChange(proposal.id, "accepted")}
                      className="inline-flex items-center gap-2 border border-emerald-400/20 px-4 py-2.5 text-xs font-semibold text-emerald-400/70 transition-all hover:bg-emerald-500/[0.06]"
                    >
                      <CheckCircle2 size={13} />
                      Accept
                    </button>
                    <button
                      onClick={() => onStatusChange(proposal.id, "rejected")}
                      className="inline-flex items-center gap-2 border border-red-400/20 px-4 py-2.5 text-xs font-semibold text-red-400/70 transition-all hover:bg-red-500/[0.06]"
                    >
                      <XCircle size={13} />
                      Reject
                    </button>
                  </>
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
