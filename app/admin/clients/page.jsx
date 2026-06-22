"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/client";
import { updateClientStatus, addClient, deleteClient } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trash2, Calendar, Building2, Mail, Phone, MessageCircle
} from "lucide-react";
import { formatDate } from "@/lib/admin";
import { useToast } from "../_components/ToastContext";
import { StatusBadge } from "../_components/StatusBadge";
import { StatusSelect } from "../_components/StatusSelect";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Pagination } from "../_components/Pagination";
import { Toolbar, FilterChip, ClearFiltersButton } from "../_components/Toolbar";

const PAGE_SIZE = 15;

const clientStatusList = [
  { value: "onboarding", label: "Onboarding" },
  { value: "active", label: "Active" },
  { value: "at_risk", label: "At Risk" },
  { value: "inactive", label: "Inactive" },
  { value: "churned", label: "Churned" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewClient, setViewClient] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }
    const { data, error } = await supabase
      .from("clients").select("*").order("created_at", { ascending: false });
    if (error) { setError(error.message); }
    else { setClients(data || []); }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...clients];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        (c.name?.toLowerCase() || "").includes(q) ||
        (c.email?.toLowerCase() || "").includes(q) ||
        (c.company?.toLowerCase() || "").includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });
    return result;
  }, [clients, search, statusFilter, sort]);

  const safePage = Math.min(page, Math.ceil(filtered.length / PAGE_SIZE) || 1);
  const pageClients = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function handleStatusChange(clientId, newStatus) {
    setEditingStatus(clientId);
    try {
      await updateClientStatus(clientId, newStatus);
      setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, status: newStatus } : c)));
      addToast("Status updated", "success");
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    }
    setEditingStatus(null);
  }

  async function handleAdd(formData) {
    try {
      await addClient(formData);
      setShowAdd(false);
      addToast("Client added", "success");
      fetchClients();
    } catch (err) {
      addToast(err.message || "Failed to add client", "error");
    }
  }

  async function handleDelete(id) {
    setDeleteTarget(null);
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      if (viewClient?.id === id) setViewClient(null);
      addToast("Client removed", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading clients...</span>
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
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Clients</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">{filtered.length} client{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          Add Client
        </button>
      </div>

      <Toolbar search={search} onSearchChange={setSearch} resultCount={filtered.length}>
        <ClearFiltersButton onClick={() => { setSearch(""); setStatusFilter("all"); }} visible={hasFilters} />
        <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All</FilterChip>
        {clientStatusList.map((s) => (
          <FilterChip key={s.value} active={statusFilter === s.value} onClick={() => setStatusFilter(s.value)}>
            {s.label}
          </FilterChip>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors outline-none"
          aria-label="Sort clients"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
      </Toolbar>

      {pageClients.length === 0 ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <p className="text-sm text-white/25">
            {hasFilters ? "No clients match your filters" : "No clients yet"}
          </p>
        </div>
      ) : (
        <>
          <DesktopTable
            clients={pageClients}
            onView={setViewClient}
            onStatusChange={handleStatusChange}
            onDelete={setDeleteTarget}
            editingStatus={editingStatus}
          />
          <MobileCards
            clients={pageClients}
            onView={setViewClient}
            onStatusChange={handleStatusChange}
            onDelete={setDeleteTarget}
            editingStatus={editingStatus}
          />
          <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}

      <AddClientModal open={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
      <ClientDetailDrawer client={viewClient} onClose={() => setViewClient(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function DesktopTable({ clients, onView, onStatusChange, onDelete, editingStatus }) {
  return (
    <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a] overflow-x-auto">
      <table className="w-full text-left text-sm min-w-max">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Name</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Email</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Created</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-4">
                  <button
                    onClick={() => onView(client)}
                    className="text-left text-sm text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                  >
                    {client.name || client.company || "\u2014"}
                  </button>
                  {client.company && client.name && (
                    <span className="block text-xs text-white/25">{client.company}</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {client.email ? (
                    <a href={`mailto:${client.email}`} className="text-xs text-white/45 transition-colors hover:text-[#EAEFFF]">
                      {client.email}
                    </a>
                  ) : "\u2014"}
                </td>
                <td className="px-5 py-4">
                  <StatusSelect
                    value={client.status}
                    onChange={(val) => onStatusChange(client.id, val)}
                    disabled={editingStatus === client.id}
                    options={clientStatusList}
                  />
                </td>
                <td className="px-5 py-4 text-xs text-white/30 tabular-nums">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-white/30" />
                    {formatDate(client.created_at)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onDelete(client.id)}
                    className="p-2 text-red-400/20 transition-all hover:bg-red-500/[0.04] hover:text-red-400/50"
                    aria-label={`Delete ${client.name || "client"}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

function MobileCards({ clients, onView, onStatusChange, onDelete, editingStatus }) {
  return (
    <div className="sm:hidden space-y-3">
      {clients.map((client) => (
        <div key={client.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onView(client)}
                className="text-sm font-medium text-white/80 hover:text-[#EAEFFF] transition-colors text-left"
              >
                {client.name || client.company || "\u2014"}
              </button>
              {client.company && client.name && (
                <p className="text-xs text-white/25 mt-0.5">{client.company}</p>
              )}
            </div>
            <StatusSelect
              value={client.status}
              onChange={(val) => onStatusChange(client.id, val)}
              disabled={editingStatus === client.id}
              options={clientStatusList}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/30 mb-3">
            {client.email && <span>{client.email}</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/30 tabular-nums">
              {formatDate(client.created_at)}
            </span>
            <button
              onClick={() => onDelete(client.id)}
              className="p-2 text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04] transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddClientModal({ open, onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape" && open) onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
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
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[15vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-client-title"
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
            <h2 id="add-client-title" className="text-lg font-semibold tracking-tight text-white/90 mb-6">Add Client</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="client-name" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Name <span className="text-red-400/60">*</span>
                </label>
                <input
                  id="client-name"
                  name="name"
                  required
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="client-email" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Email
                </label>
                <input
                  id="client-email"
                  name="email"
                  type="email"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="client-phone" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  id="client-phone"
                  name="phone"
                  type="tel"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div>
                <label htmlFor="client-company" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Company
                </label>
                <input
                  id="client-company"
                  name="company"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  placeholder="Acme Inc."
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
                  {submitting ? "Adding..." : "Add Client"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ClientDetailDrawer({ client, onClose }) {
  if (!client) return null;

  return (
    <AnimatePresence>
      {client && (
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
            aria-labelledby="client-detail-title"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-6 py-4 z-10">
              <h2 id="client-detail-title" className="text-base font-semibold tracking-tight text-white/90">
                Client Details
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
                  {(client.name || client.company || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">{client.name || client.company || "Unnamed"}</h3>
                  <StatusBadge status={client.status} className="mt-0.5" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Mail, label: "Email", value: client.email, href: client.email ? `mailto:${client.email}` : null },
                  { icon: Phone, label: "Phone", value: client.phone, href: client.phone ? `tel:${client.phone}` : null },
                  { icon: MessageCircle, label: "WhatsApp", value: client.phone ? `wa.me/${client.phone.replace(/[^0-9]/g, "")}` : null, href: client.phone ? `https://wa.me/${client.phone.replace(/[^0-9]/g, "")}` : null },
                  { icon: Building2, label: "Company", value: client.company },
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

              <div className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                <Calendar size={11} />
                Created {formatDate(client.created_at)}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
