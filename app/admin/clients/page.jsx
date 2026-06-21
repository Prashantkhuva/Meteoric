"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Calendar, Building2 } from "lucide-react";
import { formatDate } from "@/lib/admin";
import { useToast } from "../_components/ToastContext";
import { StatusBadge } from "../_components/StatusBadge";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Pagination } from "../_components/Pagination";
import { Toolbar, ClearFiltersButton } from "../_components/Toolbar";

const PAGE_SIZE = 15;

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
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
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });
    return result;
  }, [clients, search, sort]);

  const safePage = Math.min(page, Math.ceil(filtered.length / PAGE_SIZE) || 1);
  const pageClients = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function handleAdd(formData) {
    const supabase = createClient();
    const { error } = await supabase.from("clients").insert({
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      status: "active",
    });
    if (error) { addToast(error.message, "error"); return; }
    setShowAdd(false);
    addToast("Client added", "success");
    fetchClients();
  }

  async function handleDelete(id) {
    setDeleteTarget(null);
    const supabase = createClient();
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) { addToast(error.message, "error"); }
    else {
      setClients((prev) => prev.filter((c) => c.id !== id));
      addToast("Client removed", "success");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/25">
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

  const hasFilters = !!search;

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
        <ClearFiltersButton onClick={() => { setSearch(""); }} visible={hasFilters} />
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
            {hasFilters ? "No clients match your search" : "No clients yet"}
          </p>
        </div>
      ) : (
        <>
          <DesktopTable clients={pageClients} onDelete={setDeleteTarget} />
          <MobileCards clients={pageClients} onDelete={setDeleteTarget} />
          <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}

      <AddClientModal open={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
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

function DesktopTable({ clients, onDelete }) {
  return (
    <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Name</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Email</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Company</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Created</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-4">
                  <span className="text-sm text-white/80 font-medium">
                    {client.name || client.company || "\u2014"}
                  </span>
                  {client.company && client.name && (
                    <span className="block text-xs text-white/25 font-normal">{client.company}</span>
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
                  {client.company ? (
                    <span className="flex items-center gap-1.5 text-xs text-white/45">
                      <Building2 size={12} className="text-white/20" />
                      {client.company}
                    </span>
                  ) : "\u2014"}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={client.status === "active" ? "won" : client.status} />
                </td>
                <td className="px-5 py-4 text-xs text-white/30 tabular-nums">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-white/20" />
                    {formatDate(client.created_at, { time: false })}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onDelete(client.id)}
                    className="p-2 text-red-400/20 transition-all hover:bg-red-500/[0.04] hover:text-red-400/50"
                    aria-label={`Delete ${client.name || "client"}`}
                    title="Delete client"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MobileCards({ clients, onDelete }) {
  return (
    <div className="sm:hidden space-y-3">
      {clients.map((client) => (
        <div key={client.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80">{client.name || client.company || "\u2014"}</p>
              {client.company && client.name && (
                <p className="text-xs text-white/25 mt-0.5">{client.company}</p>
              )}
            </div>
            <StatusBadge status={client.status === "active" ? "won" : client.status} />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/30 mb-3">
            {client.email && <span>{client.email}</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/20 tabular-nums">
              {formatDate(client.created_at, { time: false })}
            </span>
            <button
              onClick={() => onDelete(client.id)}
              className="p-2 text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04] transition-all"
              aria-label={`Delete ${client.name || "client"}`}
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
              className="absolute right-4 top-4 p-1.5 text-white/20 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
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
