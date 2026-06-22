"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createClient } from "@/lib/client";
import {
  createProject, updateProject, deleteProject, getClients, getProjectsPaginated,
} from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trash2, Calendar, Building2, Pencil, FolderKanban,
  DollarSign, Clock, Target, CheckCircle, AlertCircle, Download,
  ChevronUp, ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/admin";
import { useToast } from "../_components/ToastContext";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Pagination } from "../_components/Pagination";
import { Toolbar, FilterChip, SortDropdown } from "../_components/Toolbar";
import { BulkActionBar } from "../_components/BulkActionBar";
import { IconButton } from "../_components/IconButton";
import { FormField } from "../_components/FormField";
import { useFilters } from "../_components/useFilters";
import { useFocusTrap } from "../_components/useFocusTrap";
import { useShortcuts } from "../_components/useShortcuts";
import { downloadCSV } from "../_components/csv-export";

const PAGE_SIZE = 15;

const projectStatuses = [
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "cancelled", label: "Cancelled" },
];

function statusColor(status) {
  const map = {
    planning: "text-white/30 bg-white/[0.04] border-white/[0.06]",
    in_progress: "text-blue-300/80 bg-blue-500/[0.06] border-blue-400/15",
    review: "text-yellow-300/80 bg-yellow-500/[0.06] border-yellow-400/15",
    completed: "text-emerald-300/80 bg-emerald-500/[0.06] border-emerald-400/15",
    on_hold: "text-orange-300/80 bg-orange-500/[0.06] border-orange-400/15",
    cancelled: "text-white/25 bg-white/[0.02] border-white/[0.04]",
  };
  return map[status] || "text-white/30 bg-white/[0.04] border-white/[0.06]";
}

const CSV_COLUMNS = [
  { label: "Name", accessor: (p) => p.name || "" },
  { label: "Client", accessor: (p) => p.client?.name || "" },
  { label: "Status", accessor: (p) => p.status || "" },
  { label: "Budget", accessor: (p) => p.budget || "" },
  { label: "Deadline", accessor: (p) => p.deadline || "" },
  { label: "Created", accessor: (p) => formatDate(p.created_at) },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, status: statusFilter, sort, page, col, dir } = filters;
  const [viewProject, setViewProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const addToast = useToast();
  const searchRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, sort, page, col, dir]);

  useShortcuts(
    useMemo(() => ({
      "n": () => setShowNew(true),
      "/": () => searchRef.current?.focus(),
      "Escape": () => { if (viewProject) setViewProject(null); if (showNew) setShowNew(false); },
    }), [viewProject, showNew])
  );

  async function fetchData() {
    setLoading(true);
    const [result, clientsRes] = await Promise.all([
      getProjectsPaginated({ page, pageSize: PAGE_SIZE, search, status: statusFilter, col, dir, sort }),
      getClients().catch(() => []),
    ]);
    if (result.error) { setError(result.error); }
    else { setProjects(result.data); setTotal(result.total); }
    setClients(clientsRes);
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
    if (selected.size === projects.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(projects.map((p) => p.id)));
    }
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    try {
      await Promise.all(ids.map((id) => deleteProject(id)));
      setProjects((prev) => prev.filter((p) => !ids.includes(p.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      if (viewProject && ids.includes(viewProject.id)) setViewProject(null);
      addToast(`${ids.length} project${ids.length > 1 ? "s" : ""} deleted`, "success");
      setSelected(new Set());
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
    }
  }

  async function handleBulkStatusChange(newStatus) {
    const ids = [...selected];
    const formDatas = ids.map((id) => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("status", newStatus);
      return fd;
    });
    try {
      await Promise.all(formDatas.map((fd) => updateProject(fd)));
      setProjects((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: newStatus } : p));
      addToast(`${ids.length} project${ids.length > 1 ? "s" : ""} updated`, "success");
      setSelected(new Set());
    } catch (err) {
      addToast(err.message || "Failed to update", "error");
    }
  }

  async function handleExportCSV() {
    const supabase = createClient();
    if (!supabase) return;
    let query = supabase.from("projects").select("*, client:clients(name, email, company)");
    if (search) { query = query.or(`name.ilike.%${search}%,client.name.ilike.%${search}%`); }
    if (statusFilter !== "all") { query = query.eq("status", statusFilter); }
    const { data } = await query;
    downloadCSV(data || [], CSV_COLUMNS, `projects-${new Date().toISOString().slice(0, 10)}.csv`);
    addToast("CSV exported", "success");
  }

  async function handleCreate(formData) {
    try {
      await createProject(formData);
      setShowNew(false);
      addToast("Project created", "success");
      fetchData();
    } catch (err) {
      addToast(err.message || "Failed to create project", "error");
    }
  }

  async function handleUpdate(formData) {
    try {
      await updateProject(formData);
      setEditingProject(null);
      addToast("Project updated", "success");
      fetchData();
    } catch (err) {
      addToast(err.message || "Failed to update project", "error");
    }
  }

  async function handleDelete(id) {
    setDeleteTarget(null);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (viewProject?.id === id) setViewProject(null);
      addToast("Project deleted", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete project", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading projects...</span>
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
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Projects</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">{total} project{total !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          New Project
        </button>
      </div>

      <Toolbar search={search} onSearchChange={(v) => setFilters({ search: v, page: 1 })} resultCount={total}>
        <button
          onClick={handleExportCSV}
          className="rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors"
          aria-label="Export CSV"
        >
          <Download size={12} className="inline mr-1" />
          CSV
        </button>
        <FilterChip active={statusFilter === "all"} onClick={() => setFilters({ status: "all", page: 1 })}>All</FilterChip>
        {projectStatuses.map((s) => (
          <FilterChip key={s.value} active={statusFilter === s.value} onClick={() => setFilters({ status: s.value, page: 1 })}>
            {s.label}
          </FilterChip>
        ))}
        <SortDropdown
          value={sort}
          onChange={(v) => setFilters({ sort: v })}
          label="Sort projects"
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "name", label: "Name" },
            { value: "deadline", label: "Deadline" },
          ]}
        />
      </Toolbar>

      {projects.length === 0 && !loading ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <FolderKanban size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-sm text-white/25">
            {hasFilters ? "No projects match your filters" : "No projects yet \u2014 create your first project to get started"}
          </p>
          {!hasFilters && (
            <button
              onClick={() => setShowNew(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
            >
              <Plus size={15} />
              New Project
            </button>
          )}
        </div>
      ) : (
        <>
          {projects.length > 0 && (
            <>
              <DesktopTable
                items={projects}
                onView={setViewProject}
                onEdit={setEditingProject}
                onDelete={setDeleteTarget}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                col={col}
                dir={dir}
                onColSort={toggleColSort}
              />
              <MobileCards
                items={projects}
                onView={setViewProject}
                onEdit={setEditingProject}
                onDelete={setDeleteTarget}
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
        onDelete={selected.size > 0 ? handleBulkDelete : undefined}
        onStatusChange={handleBulkStatusChange}
        statusOptions={projectStatuses}
      />

      <ProjectFormModal
        key={formResetKey}
        open={showNew}
        onClose={() => { setShowNew(false); setFormResetKey(k => k + 1); }}
        onSubmit={handleCreate}
        clients={clients}
        title="New Project"
      />

      {editingProject && (
        <ProjectFormModal
          open={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSubmit={handleUpdate}
          clients={clients}
          project={editingProject}
          title="Edit Project"
        />
      )}

      <ProjectDetailDrawer
        project={viewProject}
        onClose={() => setViewProject(null)}
        onEdit={setEditingProject}
        onDelete={setDeleteTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
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

function DesktopTable({ items, onView, onEdit, onDelete, selected, onToggleSelect, onToggleSelectAll, col, dir, onColSort }) {
  const allSelected = items.length > 0 && selected.size === items.length;

  return (
    <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a] overflow-x-auto">
      <table className="w-full text-left text-sm min-w-max">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-5 py-3.5 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-white/20 bg-transparent accent-[#EAEFFF]"
                aria-label="Select all"
              />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("name")}>
              Project<SortIcon column="name" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Client</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("status")}>
              Status<SortIcon column="status" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("budget")}>
              Budget<SortIcon column="budget" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("deadline")}>
              Deadline<SortIcon column="deadline" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
              <td className="px-5 py-3.5">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => onToggleSelect(p.id)}
                  className="rounded border-white/20 bg-transparent accent-[#EAEFFF]"
                  aria-label={`Select ${p.name || "project"}`}
                />
              </td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => onView(p)}
                  className="text-left text-sm text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                >
                  {p.name}
                </button>
                {p.services?.length > 0 && (
                  <span className="block text-xs text-white/25 mt-0.5">{p.services.join(", ")}</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                {p.client ? (
                  <span className="text-sm text-white/60">{p.client.name}</span>
                ) : (
                  <span className="text-sm text-white/25">—</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold border ${statusColor(p.status)}`}>
                  {projectStatuses.find((s) => s.value === p.status)?.label || p.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-white/60 tabular-nums">
                {p.budget ? `$${Number(p.budget).toLocaleString()}` : "—"}
              </td>
              <td className="px-5 py-3.5 text-xs text-white/30 tabular-nums">
                {p.deadline ? (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-white/30" />
                    {new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                ) : "—"}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <IconButton onClick={() => onView(p)} icon={FolderKanban} label="View details" />
                  <IconButton onClick={() => onEdit(p)} icon={Pencil} label="Edit project" className="text-white/30 hover:text-white/50" />
                  <IconButton onClick={() => onDelete(p.id)} icon={Trash2} label="Delete project" className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ items, onView, onEdit, onDelete, selected, onToggleSelect }) {
  return (
    <div className="sm:hidden space-y-3">
      {items.map((p) => (
        <div key={p.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => onToggleSelect(p.id)}
                className="rounded border-white/20 bg-transparent accent-[#EAEFFF] mt-0.5"
                aria-label={`Select ${p.name || "project"}`}
              />
              <div className="min-w-0">
                <button
                  onClick={() => onView(p)}
                  className="text-sm font-medium text-white/80 hover:text-[#EAEFFF] transition-colors text-left"
                >
                  {p.name}
                </button>
                {p.client && (
                  <p className="text-xs text-white/35 mt-0.5">{p.client.name}</p>
                )}
              </div>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${statusColor(p.status)}`}>
              {projectStatuses.find((s) => s.value === p.status)?.label || p.status}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-white/30">
              {p.budget && <span className="tabular-nums">${Number(p.budget).toLocaleString()}</span>}
              {p.deadline && (
                <span className="tabular-nums">{new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <IconButton onClick={() => onView(p)} icon={FolderKanban} label="View details" />
              <IconButton onClick={() => onEdit(p)} icon={Pencil} label="Edit project" />
              <IconButton onClick={() => onDelete(p.id)} icon={Trash2} label="Delete project" className="text-red-400/20 hover:text-red-400/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectFormModal({ open, onClose, onSubmit, clients, project, title }) {
  const [submitting, setSubmitting] = useState(false);
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target);
    if (project) fd.set("id", project.id);
    await onSubmit(fd);
    setSubmitting(false);
  }

  if (!open) return null;

  const servicesStr = project?.services?.length ? project.services.join(", ") : "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-[5vh]" role="dialog" aria-modal="true" aria-labelledby="project-form-title">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div ref={trapRef} className="relative w-full max-w-2xl max-h-[calc(100dvh-10vh)] flex flex-col border border-white/[0.08] bg-[#0c0c0c] shadow-2xl">
        <div className="shrink-0 flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 id="project-form-title" className="text-lg font-semibold tracking-tight text-white/90">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Project Name" name="name" placeholder="Website Redesign" defaultValue={project?.name || ""} required />
              <div>
                <label htmlFor="field-client_id" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Client
                </label>
                <select
                  id="field-client_id"
                  name="client_id"
                  defaultValue={project?.client_id || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="">No client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="field-description" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                Description
              </label>
              <textarea
                id="field-description"
                name="description"
                rows={3}
                placeholder="Project scope and objectives..."
                defaultValue={project?.description || ""}
                className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="field-status" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Status
                </label>
                <select
                  id="field-status"
                  name="status"
                  defaultValue={project?.status || "planning"}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  style={{ colorScheme: "dark" }}
                >
                  {projectStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <FormField label="Start Date" name="start_date" type="date" defaultValue={project?.start_date || ""} />
              <FormField label="Deadline" name="deadline" type="date" defaultValue={project?.deadline || ""} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Budget" name="budget" type="number" placeholder="5000" defaultValue={project?.budget || ""} />
              <div>
                <label htmlFor="field-services" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Services (comma-separated)
                </label>
                <input
                  id="field-services"
                  name="services"
                  defaultValue={servicesStr}
                  placeholder="Web Dev, Design, SEO"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="field-notes" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                Notes
              </label>
              <textarea
                id="field-notes"
                name="notes"
                rows={2}
                placeholder="Internal notes..."
                defaultValue={project?.notes || ""}
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
                {submitting ? "Saving..." : project ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailDrawer({ project, onClose, onEdit, onDelete }) {
  if (!project) return null;
  const trapRef = useFocusTrap(!!project);

  useEffect(() => {
    if (!project) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [project, onClose]);

  const statusInfo = projectStatuses.find((s) => s.value === project.status);

  return (
    <AnimatePresence>
      {project && (
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
            aria-labelledby="project-detail-title"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-6 py-4 z-10">
              <h2 id="project-detail-title" className="text-base font-semibold tracking-tight text-white/90">
                {project.name}
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
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold border ${statusColor(project.status)}`}>
                  {statusInfo?.label || project.status}
                </span>
              </div>

              {project.client && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex h-10 w-10 items-center justify-center text-sm font-bold border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 text-[#EAEFFF]/70">
                    {project.client.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{project.client.name}</p>
                    {project.client.company && (
                      <span className="block text-xs text-white/25">{project.client.company}</span>
                    )}
                  </div>
                </div>
              )}

              {project.description && (
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">Description</p>
                  <p className="text-sm text-white/50 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {project.budget && (
                  <div className="border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">
                      <DollarSign size={12} />
                      Budget
                    </div>
                    <p className="text-lg font-semibold text-white/80 tabular-nums">${Number(project.budget).toLocaleString()}</p>
                  </div>
                )}
                {project.deadline && (
                  <div className="border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">
                      <Clock size={12} />
                      Deadline
                    </div>
                    <p className="text-lg font-semibold text-white/80 tabular-nums">
                      {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                )}
                {project.start_date && (
                  <div className="border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">
                      <Target size={12} />
                      Started
                    </div>
                    <p className="text-lg font-semibold text-white/80 tabular-nums">
                      {new Date(project.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                )}
                {project.services?.length > 0 && (
                  <div className="border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">
                      <CheckCircle size={12} />
                      Services
                    </div>
                    <p className="text-sm text-white/60">{project.services.join(", ")}</p>
                  </div>
                )}
              </div>

              {project.notes && (
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">Notes</p>
                  <p className="text-sm text-white/50 whitespace-pre-wrap">{project.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                <Calendar size={11} />
                Created {formatDate(project.created_at)}
              </div>

              <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4">
                <button
                  onClick={() => onEdit(project)}
                  className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(project.id); onClose(); }}
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
