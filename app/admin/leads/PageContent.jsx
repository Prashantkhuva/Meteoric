"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateLeadStatus, convertLeadToClient, addLead, updateLead, deleteLead, getLeadsPaginated } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, ArrowRight, UserPlus, Trash2, Eye, Mail, Phone, Building2,
  FileText, DollarSign, Calendar, Download, ChevronUp, ChevronDown, Pencil,
} from "lucide-react";
import { formatDate } from "@/lib/supabase/admin";
import { useToast } from "../components/ToastContext";
import { StatusBadge } from "../components/StatusBadge";
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
import Checkbox from "../components/Checkbox";

const PAGE_SIZE = 15;
const statusList = [
  { value: "inquiry", label: "Inquiry" },
  { value: "discovery", label: "Discovery" },
  { value: "proposal", label: "Proposal" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost" },
];

const CSV_COLUMNS = [
  { label: "Name", accessor: (l) => l.name || "" },
  { label: "Email", accessor: (l) => l.email || "" },
  { label: "Phone", accessor: (l) => l.phone || "" },
  { label: "Company", accessor: (l) => l.company || "" },
  { label: "Status", accessor: (l) => l.status || "" },
  { label: "Budget", accessor: (l) => l.budget || "" },
  { label: "Created", accessor: (l) => formatDate(l.created_at) },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, status: statusFilter, sort, page, col, dir } = filters;
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [editingStatus, setEditingStatus] = useState(null);
  const [converting, setConverting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const deleteRef = useRef(null);
  const addToast = useToast();
  const searchRef = useRef(null);

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, sort, page, col, dir]);

  useShortcuts(
    useMemo(() => ({
      "n": () => setShowAddLead(true),
      "/": () => searchRef.current?.focus(),
      "Escape": () => { if (viewLead) setViewLead(null); if (showAddLead) setShowAddLead(false); if (editLead) setEditLead(null); },
    }), [viewLead, showAddLead])
  );

  async function fetchLeads() {
    setLoading(true);
    const result = await getLeadsPaginated({ page, pageSize: PAGE_SIZE, search, status: statusFilter, col, dir, sort });
    if (result.error) { setError(result.error); }
    else { setLeads(result.data); setTotal(result.total); }
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
    if (selected.size === leads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l.id)));
    }
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    setIsDeleting(true);
    try {
      await Promise.all(ids.map((id) => deleteLead(id)));
      setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      if (viewLead && ids.includes(viewLead.id)) setViewLead(null);
      addToast(`${ids.length} lead${ids.length > 1 ? "s" : ""} deleted`, "success");
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
      await Promise.all(ids.map((id) => updateLeadStatus(id, newStatus)));
      setLeads((prev) => prev.map((l) => ids.includes(l.id) ? { ...l, status: newStatus } : l));
      addToast(`${ids.length} lead${ids.length > 1 ? "s" : ""} updated`, "success");
      setSelected(new Set());
    } catch (err) {
      addToast(err.message || "Failed to update", "error");
    }
  }

  async function handleExportCSV() {
    const supabase = createClient();
    if (!supabase) return;
    let query = supabase.from("leads").select("*");
    if (search) { query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`); }
    if (statusFilter !== "all") { query = query.eq("status", statusFilter); }
    const { data } = await query;
    downloadCSV(data || [], CSV_COLUMNS, `leads-${new Date().toISOString().slice(0, 10)}.csv`);
    addToast("CSV exported", "success");
  }

  async function handleStatusChange(leadId, newStatus) {
    setEditingStatus(leadId);
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      addToast("Status updated", "success");
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    }
    setEditingStatus(null);
  }

  async function handleConvert(lead) {
    setConverting(lead.id);
    try {
      await convertLeadToClient(lead.id);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "completed" } : l)));
      addToast(`${lead.name || "Lead"} converted to client`, "success");
    } catch (err) {
      addToast(err.message || "Failed to convert", "error");
    }
    setConverting(null);
  }

  function promptDelete(leadId) {
    deleteRef.current = leadId;
    setDeleteTarget(leadId);
  }

  async function handleDelete() {
    const id = deleteRef.current;
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (viewLead?.id === id) setViewLead(null);
      addToast("Lead deleted", "success");
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
      setDeleteTarget(null);
    }
    setIsDeleting(false);
  }

  async function handleAddLead(formData) {
    try {
      if (formData.get("id")) {
        await updateLead(formData);
        setEditLead(null);
        addToast("Lead updated", "success");
      } else {
        await addLead(formData);
        setShowAddLead(false);
        addToast("Lead added", "success");
      }
      fetchLeads();
    } catch (err) {
      addToast(err.message || "Failed to save lead", "error");
    }
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
          <p className="mt-1 text-sm text-white/35 tabular-nums">{total} lead{total !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowAddLead(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          Add Lead
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
        <ClearFiltersButton onClick={() => setFilters({ search: "", status: "all" })} visible={hasFilters} />
        <FilterChip active={statusFilter === "all"} onClick={() => setFilters({ status: "all", page: 1 })}>All</FilterChip>
        {statusList.map((s) => (
          <FilterChip key={s.value} active={statusFilter === s.value} onClick={() => setFilters({ status: s.value, page: 1 })}>
            {s.label}
          </FilterChip>
        ))}
        <SortDropdown
          value={sort}
          onChange={(v) => setFilters({ sort: v })}
          label="Sort leads"
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "name", label: "Name" },
          ]}
        />
      </Toolbar>

      {leads.length === 0 && !loading ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <p className="text-sm text-white/25">
            {hasFilters ? "No leads match your filters" : "No leads yet \u2014 add your first lead to get started"}
          </p>
          {!hasFilters && (
            <button
              onClick={() => setShowAddLead(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
            >
              <Plus size={15} />
              Add Lead
            </button>
          )}
        </div>
      ) : (
        <>
          {leads.length > 0 && (
            <>
              <DesktopTable
                leads={leads}
                onView={setViewLead}
                onConvert={handleConvert}
                onStatusChange={handleStatusChange}
                onDelete={promptDelete}
                editingStatus={editingStatus}
                converting={converting}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                col={col}
                dir={dir}
                onColSort={toggleColSort}
              />
              <MobileCards
                leads={leads}
                onView={setViewLead}
                onConvert={handleConvert}
                onStatusChange={handleStatusChange}
                onDelete={promptDelete}
                editingStatus={editingStatus}
                converting={converting}
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

      <LeadFormModal key={formResetKey} open={showAddLead || !!editLead} lead={editLead} onClose={() => { setShowAddLead(false); setEditLead(null); setFormResetKey(k => k + 1); }} onSubmit={handleAddLead} />
      <LeadDetailDrawer lead={viewLead} onClose={() => setViewLead(null)} onEdit={(lead) => { setViewLead(null); setEditLead(lead); }} onConvert={handleConvert} onDelete={promptDelete} converting={converting} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => { if (!isDeleting) setDeleteTarget(null) }}
      />
      <ConfirmDialog
        open={bulkConfirm === "delete"}
        title="Delete leads"
        message={`Are you sure you want to delete ${selected.size} lead${selected.size !== 1 ? "s" : ""}? This action cannot be undone.`}
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

function DesktopTable({ leads, onView, onConvert, onStatusChange, onDelete, editingStatus, converting, selected, onToggleSelect, onToggleSelectAll, col, dir, onColSort }) {
  const allSelected = leads.length > 0 && selected.size === leads.length;

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
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("name")}>
                Name<SortIcon column="name" col={col} dir={dir} />
              </th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Contact</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("ai_score")}>
                Score<SortIcon column="ai_score" col={col} dir={dir} />
              </th>
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
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-3.5">
                  <Checkbox
                    checked={selected.has(lead.id)}
                    onChange={() => onToggleSelect(lead.id)}
                    label={`Select ${lead.name || "lead"}`}
                  />
                </td>
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
                  <AiScoreBadge score={lead.ai_score} category={lead.ai_category} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusSelect
                    value={lead.status}
                    onChange={(val) => onStatusChange(lead.id, val)}
                    disabled={editingStatus === lead.id}
                    options={statusList}
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
  );
}

function MobileCards({ leads, onView, onConvert, onStatusChange, onDelete, editingStatus, converting, selected, onToggleSelect }) {
  return (
    <div className="sm:hidden space-y-3">
      {leads.map((lead) => (
        <div key={lead.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                checked={selected.has(lead.id)}
                onChange={() => onToggleSelect(lead.id)}
                label={`Select ${lead.name || "lead"}`}
              />
              <div className="min-w-0">
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
            </div>
            <StatusSelect
              value={lead.status}
              onChange={(val) => onStatusChange(lead.id, val)}
              disabled={editingStatus === lead.id}
              options={statusList}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <AiScoreBadge score={lead.ai_score} category={lead.ai_category} />
            {lead.email && <span className="truncate max-w-[180px] text-white/30">{lead.email}</span>}
            {lead.phone && <span className="text-white/30">{lead.phone}</span>}
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

function LeadFormModal({ open, lead, onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const trapRef = useFocusTrap(open);
  const isEdit = !!lead;

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
            ref={trapRef}
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
            <h2 id="add-lead-title" className="text-lg font-semibold tracking-tight text-white/90 mb-6">{isEdit ? "Edit Lead" : "Add Lead"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isEdit && <input type="hidden" name="id" value={lead.id} />}
              <FormField label="Name" name="name" placeholder="John Doe" defaultValue={lead?.name || ""} />
              <FormField label="Email" name="email" type="email" placeholder="john@example.com" defaultValue={lead?.email || ""} />
              <FormField label="Phone" name="phone" placeholder="+1 234 567 890" defaultValue={lead?.phone || ""} />
              <FormField label="Services" name="services" placeholder="Web Development, SEO, Design" defaultValue={lead?.services || ""} />
              <FormField label="Budget" name="budget" placeholder="$5,000 - $10,000" defaultValue={lead?.budget || ""} />
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
                  {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Lead"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AiScoreBadge({ score, category, size = "sm" }) {
  if (score == null) return <span className="text-xs text-white/15">—</span>;

  const color =
    score >= 70 ? "text-green-400 border-green-400/20 bg-green-400/5" :
    score >= 40 ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" :
    "text-red-400 border-red-400/20 bg-red-400/5";

  const catClass = category === "spam" ? "text-red-400/60" : "text-white/30";
  const isLg = size === "lg";

  return (
    <span className={`inline-flex items-center gap-1.5 border ${color} ${isLg ? "px-2.5 py-1" : "px-2 py-0.5"}`}>
      <span className={`font-semibold tabular-nums ${isLg ? "text-sm" : "text-xs"}`}>{score}</span>
      {category && (
        <span className={`text-[10px] uppercase tracking-wider ${catClass}`}>{category}</span>
      )}
    </span>
  );
}

function LeadDetailDrawer({ lead, onClose, onEdit, onConvert, onDelete, converting }) {
  if (!lead) return null;
  const trapRef = useFocusTrap(!!lead);

  useEffect(() => {
    if (!lead) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lead, onClose]);

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
            ref={trapRef}
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

              {lead.ai_score != null && (
                <div className="flex items-center gap-3 border-b border-white/[0.04] pb-3">
                  <AiScoreBadge score={lead.ai_score} category={lead.ai_category} size="lg" />
                  {lead.ai_summary && (
                    <span className="text-xs text-white/40 italic">{lead.ai_summary}</span>
                  )}
                </div>
              )}

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
                <button
                  onClick={() => onEdit(lead)}
                  className="inline-flex items-center gap-2 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70"
                >
                  <Pencil size={13} />
                  Edit
                </button>
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
