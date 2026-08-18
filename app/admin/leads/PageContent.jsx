"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/client";
import { updateLeadStatus, convertLeadToClient, addLead, updateLead, deleteLead, getLeadsPaginated, importLeads } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, ArrowRight, UserPlus, Trash2, Eye, Mail, Phone, Building2,
  FileText, DollarSign, Calendar, Download, ChevronUp, ChevronDown, Pencil,
  Upload, FileUp, AlertTriangle, CheckCircle2, XCircle, Loader2, Tag,
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
import { useFilters } from "@/hooks/useFilters";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useShortcuts } from "@/hooks/useShortcuts";
import { downloadCSV } from "@/lib/csv-export";
import { sanitizeSearch } from "@/lib/search";
import { normalizeImportStatus } from "@/lib/admin-validation";
import Checkbox from "../components/Checkbox";
import { LeadFormModal } from "../components/LeadFormModal";

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
  { label: "Source", accessor: (l) => l.source || "" },
  { label: "Budget", accessor: (l) => l.budget || "" },
  { label: "Created", accessor: (l) => formatDate(l.created_at) },
];

const sourceList = [
  { value: "website", label: "Website" },
  { value: "cal.com", label: "Cal.com" },
  { value: "manual", label: "Manual" },
  { value: "csv_import", label: "CSV Import" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Other" },
];

function sourceLabel(source) {
  return sourceList.find((s) => s.value === source)?.label || source || "";
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, status: statusFilter, score: scoreFilter, source: sourceFilter, sort, page, col, dir } = filters;
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importKey, setImportKey] = useState(0);
  const [formResetKey, setFormResetKey] = useState(0);
  const [editingStatus, setEditingStatus] = useState(null);
  const [converting, setConverting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [exporting, setExporting] = useState(false);
  const [bulkStatusLoading, setBulkStatusLoading] = useState(false);
  const deleteRef = useRef(null);
  const addToast = useToast();
  const searchRef = useRef(null);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, scoreFilter, sourceFilter, sort, page, col, dir]); // eslint-disable-line react-hooks/exhaustive-deps

  useShortcuts(
    useMemo(() => ({
      "n": () => setShowAddLead(true),
      "/": () => searchRef.current?.focus(),
      "Escape": () => { if (viewLead) setViewLead(null); if (showAddLead) setShowAddLead(false); if (editLead) setEditLead(null); },
    }), [viewLead, showAddLead]) // eslint-disable-line react-hooks/exhaustive-deps
  );

  async function fetchLeads() {
    const fetchId = ++fetchIdRef.current;
    setSelected(new Set());
    setLoading(true);
    const result = await getLeadsPaginated({ page, pageSize: PAGE_SIZE, search, status: statusFilter, score: scoreFilter, source: sourceFilter, col, dir, sort });
    if (fetchId !== fetchIdRef.current) return;
    if (result.error) { setError(result.error); }
    else { setLeads(result.data); setTotal(result.total); }
    setHasLoaded(true);
    setLoading(false);
  }

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
      const results = await Promise.all(ids.map((id) => deleteLead(id)));
      const errorResult = results.find(r => r?.error);
      if (errorResult) {
        addToast(errorResult.error, "error");
        return;
      }
      setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      if (viewLead && ids.includes(viewLead.id)) setViewLead(null);
      addToast(`${ids.length} lead${ids.length > 1 ? "s" : ""} deleted`, "success");
      setSelected(new Set());
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
    } finally {
      setBulkConfirm(null);
      setIsDeleting(false);
    }
  }

  async function handleBulkStatusChange(newStatus) {
    setBulkStatusLoading(true);
    const ids = [...selected];
    try {
      const results = await Promise.all(ids.map((id) => updateLeadStatus(id, newStatus)));
      const errorResult = results.find(r => r?.error);
      if (errorResult) {
        addToast(errorResult.error, "error");
        return;
      }
      setLeads((prev) => prev.map((l) => ids.includes(l.id) ? { ...l, status: newStatus } : l));
      addToast(`${ids.length} lead${ids.length > 1 ? "s" : ""} updated`, "success");
      setSelected(new Set());
    } catch (err) {
      addToast(err.message || "Failed to update", "error");
    } finally {
      setBulkStatusLoading(false);
    }
  }

  async function handleExportCSV() {
    setExporting(true);
    try {
      const supabase = createClient();
      if (!supabase) return;
      let query = supabase.from("leads").select("*");
      if (search) { query = query.or(`name.ilike.%${sanitizeSearch(search)}%,email.ilike.%${sanitizeSearch(search)}%,company.ilike.%${sanitizeSearch(search)}%`); }
      if (statusFilter !== "all") { query = query.eq("status", statusFilter); }
      if (sourceFilter !== "all") { query = query.eq("source", sourceFilter); }
      if (scoreFilter === "hot") { query = query.gte("ai_score", 70); }
      else if (scoreFilter === "warm") { query = query.gte("ai_score", 40).lt("ai_score", 70); }
      else if (scoreFilter === "cold") { query = query.gte("ai_score", 0).lt("ai_score", 40); }
      else if (scoreFilter === "scored") { query = query.not("ai_score", "is", null); }
      else if (scoreFilter === "unscored") { query = query.is("ai_score", null); }
      query = query.order("created_at", { ascending: false });

      const allRows = [];
      for (let i = 0; i < 50; i++) {
        const from = i * 1000;
        const { data, error } = await query.range(from, from + 999);
        if (error) break;
        allRows.push(...(data || []));
        if ((data || []).length < 1000) break;
      }

      downloadCSV(allRows, CSV_COLUMNS, `leads-${new Date().toISOString().slice(0, 10)}.csv`);
      addToast(`CSV exported (${allRows.length} leads)`, "success");
    } finally {
      setExporting(false);
    }
  }

  async function handleStatusChange(leadId, newStatus) {
    setEditingStatus(leadId);
    try {
      const result = await updateLeadStatus(leadId, newStatus);
      if (result?.error) {
        addToast(result.error, "error");
        return;
      }
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      addToast("Status updated", "success");
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    } finally {
      setEditingStatus(null);
    }
  }

  async function handleConvert(lead) {
    setConverting(lead.id);
    try {
      const result = await convertLeadToClient(lead.id);
      if (result?.error) {
        addToast(result.error, "error");
        return;
      }
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "completed" } : l)));
      addToast(`${lead.name || "Lead"} converted to client`, "success");
    } catch (err) {
      addToast(err.message || "Failed to convert", "error");
    } finally {
      setConverting(null);
    }
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
      const result = await deleteLead(id);
      if (result?.error) {
        addToast(result.error, "error");
        return;
      }
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (viewLead?.id === id) setViewLead(null);
      addToast("Lead deleted", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
    } finally {
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  }

  async function handleAddLead(formData) {
    try {
      if (formData.get("id")) {
        const result = await updateLead(formData);
        if (result?.error) {
          addToast(result.error, "error");
          return;
        }
        setEditLead(null);
        addToast("Lead updated", "success");
      } else {
        const result = await addLead(formData);
        if (result?.error) {
          addToast(result.error, "error");
          return;
        }
        setShowAddLead(false);
        addToast("Lead added", "success");
      }
      fetchLeads();
    } catch (err) {
      addToast(err.message || "Failed to save lead", "error");
    }
  }

  if (loading && !hasLoaded) {
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

  const hasFilters = search || statusFilter !== "all" || scoreFilter !== "all" || sourceFilter !== "all";

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
          onClick={() => { setImportKey((k) => k + 1); setShowImport(true); }}
          className="rounded-full border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 px-3 py-1 text-xs text-[#EAEFFF]/70 hover:text-[#EAEFFF] hover:border-[#EAEFFF]/40 transition-colors"
          aria-label="Import CSV"
        >
          <Upload size={12} className="inline mr-1" />
          Import
        </button>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Export CSV"
        >
          {exporting ? <span className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60 inline-block mr-1" /> : <Download size={12} className="inline mr-1" />}
          {exporting ? "Exporting..." : "CSV"}
        </button>
        <ClearFiltersButton onClick={() => setFilters({ search: "", status: "all", score: "all", source: "all", page: 1 })} visible={hasFilters} />
        <FilterChip active={statusFilter === "all"} onClick={() => setFilters({ status: "all", page: 1 })}>All</FilterChip>
        {statusList.map((s) => (
          <FilterChip key={s.value} active={statusFilter === s.value} onClick={() => setFilters({ status: s.value, page: 1 })}>
            {s.label}
          </FilterChip>
        ))}
        <FilterChip active={scoreFilter === "all"} onClick={() => setFilters({ score: "all", page: 1 })}>All scores</FilterChip>
        <FilterChip active={scoreFilter === "hot"} onClick={() => setFilters({ score: "hot", page: 1 })}>Hot (70+)</FilterChip>
        <FilterChip active={scoreFilter === "warm"} onClick={() => setFilters({ score: "warm", page: 1 })}>Warm (40–69)</FilterChip>
        <FilterChip active={scoreFilter === "cold"} onClick={() => setFilters({ score: "cold", page: 1 })}>Cold (0–39)</FilterChip>
        <FilterChip active={scoreFilter === "unscored"} onClick={() => setFilters({ score: "unscored", page: 1 })}>Unscored</FilterChip>
        <SortDropdown
          value={sourceFilter}
          onChange={(v) => setFilters({ source: v, page: 1 })}
          label="Filter by source"
          options={[
            { value: "all", label: "All sources" },
            ...sourceList,
          ]}
        />
        <SortDropdown
          value={sort}
          onChange={(v) => setFilters({ sort: v, page: 1 })}
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
            <div className={`relative transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none select-none" : ""}`}>
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
            </div>
          )}
          <Pagination current={page} total={total} pageSize={PAGE_SIZE} loading={loading} onChange={(p) => setFilters({ page: p })} />
        </>
      )}

      <BulkActionBar
        selectedCount={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={selected.size > 0 ? () => setBulkConfirm("delete") : undefined}
        onStatusChange={handleBulkStatusChange}
        statusOptions={statusList}
        loading={bulkStatusLoading}
      />

      <LeadFormModal key={formResetKey} open={showAddLead || !!editLead} lead={editLead} onClose={() => { setShowAddLead(false); setEditLead(null); setFormResetKey(k => k + 1); }} onSubmit={handleAddLead} />
      <LeadImportModal key={importKey} open={showImport} onClose={() => setShowImport(false)} onImported={() => { setShowImport(false); fetchLeads(); }} />
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
                  {lead.source && (
                    <span className="block text-[10px] text-white/20 uppercase tracking-wider mt-0.5">{sourceLabel(lead.source)}</span>
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
                {lead.source && (
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mt-0.5">{sourceLabel(lead.source)}</p>
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

function LeadImportModal({ open, onClose, onImported }) {
  const trapRef = useFocusTrap(open);
  const addToast = useToast();
  const [step, setStep] = useState("upload");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const FIELDS = [
    { key: "name", label: "Name", required: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "company", label: "Company" },
    { key: "services", label: "Services" },
    { key: "budget", label: "Budget" },
    { key: "details", label: "Details" },
    { key: "status", label: "Status" },
    { key: "source", label: "Source" },
  ];

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!open) return;
    function handleKey(e) { if (e.key === "Escape" && step !== "importing") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, step]);

  function normalizeHeader(h) {
    return String(h || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function detectMapping(headers) {
    const rules = {
      name: ["name", "fullname", "leadname", "contactname", "person", "fullname"],
      email: ["email", "emailaddress", "eemail", "mail"],
      phone: ["phone", "phonenumber", "telephone", "mobile", "contact", "whatsapp"],
      company: ["company", "organization", "organisation", "business", "companyname"],
      services: ["services", "service", "servicetype", "projecttype", "serviceinterest"],
      budget: ["budget", "estimatedbudget", "price", "amount", "budgetrange"],
      details: ["details", "notes", "message", "description", "projectdetails", "requirements"],
      status: ["status", "leadstatus", "stage"],
      source: ["source", "leadsource", "channel", "origin", "medium"],
    };
    const auto = {};
    headers.forEach((h) => {
      const key = normalizeHeader(h);
      for (const [field, aliases] of Object.entries(rules)) {
        if (!auto[field] && aliases.includes(key)) {
          auto[field] = h;
          break;
        }
      }
    });
    return auto;
  }

  function handleFile(file) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      addToast("Please select a .csv file", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast("File must be under 2MB", "error");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = (res.data || []).filter((r) => r && Object.values(r).some((v) => v != null && String(v).trim() !== ""));
        if (!data.length) {
          addToast("CSV has no rows to import", "error");
          return;
        }
        if (data.length > 1000) {
          addToast("Maximum 1000 rows per import", "error");
          return;
        }
        const hs = Object.keys(data[0] || {}).filter(Boolean);
        setHeaders(hs);
        setRawRows(data);
        setMapping(detectMapping(hs));
        setFileName(file.name);
        setStep("map");
        if (fileRef.current) fileRef.current.value = "";
      },
      error: () => addToast("Failed to parse CSV", "error"),
    });
  }

  const preview = useMemo(() => {
    const seen = new Set();
    return rawRows.map((r) => {
      const row = {};
      FIELDS.forEach((f) => {
        row[f.key] = mapping[f.key] ? String(r[mapping[f.key]] ?? "").trim() : "";
      });
      let state = "valid";
      let reason = "";
      if (!row.name) { state = "error"; reason = "Missing name"; }
      else if (row.email && !EMAIL_RE.test(row.email)) { state = "error"; reason = `Invalid email: ${row.email}`; }
      else if (row.email) {
        const key = row.email.toLowerCase();
        if (seen.has(key)) { state = "duplicate"; reason = "Duplicate email in file"; }
        else seen.add(key);
      }
      if (state === "valid" && row.status && !normalizeImportStatus(row.status)) {
        state = "error"; reason = `Unknown status: ${row.status}`;
      }
      return { ...row, state, reason };
    });
  }, [rawRows, mapping]); // eslint-disable-line react-hooks/exhaustive-deps

  const validCount = preview.filter((r) => r.state === "valid").length;
  const errorCount = preview.filter((r) => r.state === "error").length;
  const duplicateCount = preview.filter((r) => r.state === "duplicate").length;

  async function handleImport() {
    const payload = preview
      .filter((r) => r.state === "valid")
      .map((r) => ({
        name: r.name,
        email: r.email,
        phone: r.phone,
        company: r.company,
        services: r.services,
        budget: r.budget,
        details: r.details,
        status: r.status,
        source: r.source,
      }));
    setStep("importing");
    const res = await importLeads(payload);
    if (res?.error) {
      addToast(res.error, "error");
      setStep("preview");
      return;
    }
    setResult(res);
    setStep("result");
    addToast(`${res.imported || 0} lead${res.imported === 1 ? "" : "s"} imported`, "success");
  }

  const busy = step === "importing";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[8vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-leads-title"
        >
          <div className="absolute inset-0 bg-black/70" onClick={() => { if (!busy) onClose(); }} />
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${step === "preview" || step === "result" ? "max-w-2xl" : "max-w-md"} border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl`}
          >
            <button
              onClick={onClose}
              disabled={busy}
              className="absolute right-4 top-4 p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
            <h2 id="import-leads-title" className="text-lg font-semibold tracking-tight text-white/90 mb-1">Import Leads</h2>
            <p className="text-xs text-white/35 mb-6">
              {step === "upload" && "Upload a CSV file to add multiple leads at once"}
              {step === "map" && "Match your columns to lead fields"}
              {step === "preview" && "Review rows before importing"}
              {step === "importing" && "Importing leads..."}
              {step === "result" && "Import complete"}
            </p>

            {step === "upload" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
                className={`flex flex-col items-center justify-center gap-3 border border-dashed px-6 py-12 text-center transition-all ${dragging ? "border-[#EAEFFF]/50 bg-[#EAEFFF]/5" : "border-white/[0.12] hover:border-white/[0.25]"}`}
              >
                <Upload size={28} className="text-white/20" />
                <p className="text-sm text-white/50">Drag & drop a CSV here, or</p>
                <input
                  ref={fileRef}
                  id="import-csv-input"
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <label
                  htmlFor="import-csv-input"
                  className="inline-flex cursor-pointer items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
                >
                  <FileUp size={14} />
                  Choose CSV file
                </label>
                <p className="text-[10px] text-white/25">.csv only · max 2MB · max 1,000 rows</p>
                <p className="text-[10px] text-white/25">Supported columns: name, email, phone, company, services, budget, details, status, source</p>
              </div>
            )}

            {step === "map" && (
              <div className="space-y-3">
                <p className="text-xs text-white/40 truncate"><span className="text-white/60">{fileName}</span> · {rawRows.length} rows</p>
                <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
                  {FIELDS.map((f) => (
                    <div key={f.key} className="flex items-center gap-3">
                      <label className="w-28 shrink-0 text-xs text-white/50">
                        {f.label}
                        {f.required && <span className="text-red-400/70 ml-0.5">*</span>}
                      </label>
                      <select
                        value={mapping[f.key] || ""}
                        onChange={(e) => setMapping((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="flex-1 border border-white/[0.06] bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-[#EAEFFF]/20"
                      >
                        <option value="">— Not mapped —</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("upload")}
                    className="flex-1 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("preview")}
                    disabled={!mapping.name}
                    className="flex-1 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-40"
                  >
                    Review ({rawRows.length} rows)
                  </button>
                </div>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 border border-green-400/20 bg-green-400/5 px-2 py-0.5 text-green-400">
                    <CheckCircle2 size={11} /> {validCount} ready
                  </span>
                  <span className="inline-flex items-center gap-1 border border-red-400/20 bg-red-400/5 px-2 py-0.5 text-red-400">
                    <XCircle size={11} /> {errorCount} invalid
                  </span>
                  {duplicateCount > 0 && (
                    <span className="inline-flex items-center gap-1 border border-yellow-400/20 bg-yellow-400/5 px-2 py-0.5 text-yellow-400">
                      <AlertTriangle size={11} /> {duplicateCount} duplicates in file
                    </span>
                  )}
                </div>
                <div className="max-h-[38vh] overflow-y-auto border border-white/[0.06]">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-[#0c0c0c]">
                      <tr className="border-b border-white/[0.06]">
                        <th className="px-3 py-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Row</th>
                        <th className="px-3 py-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Name</th>
                        <th className="px-3 py-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Email</th>
                        <th className="px-3 py-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 200).map((r, i) => (
                        <tr key={i} className="border-b border-white/[0.02] last:border-0">
                          <td className="px-3 py-2 text-white/30 tabular-nums">{i + 2}</td>
                          <td className="px-3 py-2 text-white/70">{r.name || "\u2014"}</td>
                          <td className="px-3 py-2 text-white/40 truncate max-w-[180px]">{r.email || "\u2014"}</td>
                          <td className="px-3 py-2">
                            {r.state === "valid" ? (
                              <span className="text-green-400/80">{r.reason || "Ready"}</span>
                            ) : r.state === "duplicate" ? (
                              <span className="text-yellow-400/80">{r.reason}</span>
                            ) : (
                              <span className="text-red-400/80">{r.reason}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rawRows.length > 200 && (
                  <p className="text-[10px] text-white/25">Showing first 200 rows of {rawRows.length}.</p>
                )}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("map")}
                    disabled={busy}
                    className="flex-1 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-30"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={busy || validCount === 0}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-40"
                  >
                    {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    {busy ? "Importing..." : `Import ${validCount} lead${validCount === 1 ? "" : "s"}`}
                  </button>
                </div>
              </div>
            )}

            {step === "importing" && (
              <div className="flex flex-col items-center gap-3 py-10">
                <Loader2 size={26} className="animate-spin text-[#EAEFFF]/60" />
                <p className="text-sm text-white/50">Importing leads...</p>
              </div>
            )}

            {step === "result" && result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-green-400/20 bg-green-400/5 p-4 text-center">
                    <p className="text-2xl font-bold text-green-400 tabular-nums">{result.imported || 0}</p>
                    <p className="text-[10px] uppercase tracking-wider text-green-400/60 mt-1">Imported</p>
                  </div>
                  <div className="border border-yellow-400/20 bg-yellow-400/5 p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400 tabular-nums">{result.skipped || 0}</p>
                    <p className="text-[10px] uppercase tracking-wider text-yellow-400/60 mt-1">Skipped</p>
                  </div>
                </div>
                {(result.errors || []).length > 0 && (
                  <div className="max-h-[30vh] overflow-y-auto border border-white/[0.06]">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-[#0c0c0c]">
                        <tr className="border-b border-white/[0.06]">
                          <th className="px-3 py-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Row</th>
                          <th className="px-3 py-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Issue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(result.errors || []).slice(0, 50).map((e, i) => (
                          <tr key={i} className="border-b border-white/[0.02] last:border-0">
                            <td className="px-3 py-2 text-white/30 tabular-nums">{e.row || "\u2014"}</td>
                            <td className="px-3 py-2 text-red-400/80">{e.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(result.errors || []).length > 50 && (
                      <p className="px-3 py-2 text-[10px] text-white/25">+{result.errors.length - 50} more issues</p>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={onImported}
                  className="w-full bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AiScoreBadge({ score, category, size = "sm" }) {
  if (score == null) return <span className="text-xs text-white/15">—</span>;

  const barColor =
    score >= 70 ? "bg-green-400" :
    score >= 40 ? "bg-yellow-400" :
    "bg-red-400";

  const bgColor =
    score >= 70 ? "border-green-400/20 bg-green-400/5" :
    score >= 40 ? "border-yellow-400/20 bg-yellow-400/5" :
    "border-red-400/20 bg-red-400/5";

  const textColor =
    score >= 70 ? "text-green-400" :
    score >= 40 ? "text-yellow-400" :
    "text-red-400";

  const catClass = category === "spam" ? "text-red-400/60" : "text-white/30";
  const isLg = size === "lg";

  return (
    <span className={`inline-flex items-center gap-2 border ${bgColor} ${isLg ? "px-3 py-1.5" : "px-2 py-0.5"}`}>
      <span className={`flex items-center gap-1.5`}>
        <span className={`w-1.5 h-1.5 rounded-full ${barColor}`} />
        <span className={`font-semibold tabular-nums ${isLg ? "text-sm" : "text-xs"} ${textColor}`}>{score}</span>
      </span>
      {category && (
        <span className={`text-[10px] uppercase tracking-wider ${catClass}`}>{category}</span>
      )}
    </span>
  );
}

function LeadDetailDrawer({ lead, onClose, onEdit, onConvert, onDelete, converting }) {
  const trapRef = useFocusTrap(!!lead);

  useEffect(() => {
    if (!lead) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lead, onClose]);

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
                  { icon: Tag, label: "Source", value: lead.source ? (sourceList.find((s) => s.value === lead.source)?.label || lead.source) : null },
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
