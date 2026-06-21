"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Mail,
} from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [toast, setToast] = useState(null);

  const fetchClients = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase not configured");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleAdd(formData) {
    const supabase = createClient();
    const { error } = await supabase.from("clients").insert({
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      status: "active",
    });
    if (error) {
      setToast({ type: "error", message: error.message });
      return;
    }
    setShowAdd(false);
    setToast({ type: "success", message: "Client added" });
    fetchClients();
  }

  async function handleDelete(id) {
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      setToast({ type: "error", message: error.message });
    } else {
      setClients((prev) => prev.filter((c) => c.id !== id));
      setToast({ type: "success", message: "Client removed" });
    }
    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading clients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Clients</h1>
        <p className="text-sm text-white/30">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Clients</h1>
          <p className="mt-1 text-sm text-white/40">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="group relative overflow-hidden rounded-full bg-[#EAEFFF] px-5 py-2.5 text-xs font-semibold text-[#202020] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={14} />
            Add Client
          </span>
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md">
        <div className="absolute -top-40 -right-40 h-60 w-60 rounded-full bg-[#EAEFFF]/[0.015] blur-[80px]" />
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EAEFFF]/8">
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Name</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Email</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Company</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Status</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Created</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center text-sm text-white/20">
                    <span className="flex flex-col items-center gap-2">
                      <span className="text-2xl">—</span>
                      <span>No clients yet</span>
                    </span>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.015] last:border-0">
                    <td className="px-5 py-4 text-white/80 font-medium">
                      {client.name || client.company || "—"}
                      {client.company && client.name && (
                        <span className="block text-xs text-white/20 font-normal">{client.company}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="transition-colors hover:text-[#EAEFFF]">
                          {client.email}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {client.company ? (
                        <span className="flex items-center gap-1.5">
                          <Building2 size={12} className="text-white/20" />
                          {client.company}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEFFF]/20 px-3 py-1 text-xs font-medium text-[#EAEFFF]/70 bg-[#EAEFFF]/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]/70" />
                        {client.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {formatDate(client.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deleting === client.id}
                        className="rounded-lg p-2 text-red-400/20 transition-all duration-300 hover:bg-red-500/[0.04] hover:text-red-400/50 disabled:opacity-30"
                        title="Delete client"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-[15vh]"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-2xl border border-[#EAEFFF]/10 bg-black/80 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(234,239,255,0.03)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAdd(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/20 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/50"
              >
                <X size={16} />
              </button>

              <h2 className="text-lg font-semibold tracking-tight text-white mb-6">Add Client</h2>

              <form action={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Name</label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-xl border border-[#EAEFFF]/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none focus:shadow-[0_0_20px_rgba(234,239,255,0.04)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-xl border border-[#EAEFFF]/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none focus:shadow-[0_0_20px_rgba(234,239,255,0.04)]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Company</label>
                  <input
                    name="company"
                    className="w-full rounded-xl border border-[#EAEFFF]/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#EAEFFF]/30 focus:outline-none focus:shadow-[0_0_20px_rgba(234,239,255,0.04)]"
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 rounded-full border border-[#EAEFFF]/10 px-4 py-2.5 text-xs font-medium text-white/40 transition-all duration-300 hover:bg-white/[0.03] hover:text-white/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 relative overflow-hidden rounded-full bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#202020] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
                    <span className="relative z-10">Add Client</span>
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
            className={`fixed bottom-6 right-6 z-[100] rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${
              toast.type === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
