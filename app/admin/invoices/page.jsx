"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/client";
import {
  createInvoice, updateInvoice, deleteInvoice, sendInvoice, getClients,
} from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Eye, Trash2, Send, Receipt, Calendar, Building2, Mail,
  Pencil, DollarSign, FileText, ArrowUpRight, PlusCircle,
} from "lucide-react";
import { formatDate } from "@/lib/admin";
import { useToast } from "../_components/ToastContext";
import { StatusBadge } from "../_components/StatusBadge";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Pagination } from "../_components/Pagination";
import { Toolbar, FilterChip } from "../_components/Toolbar";

const PAGE_SIZE = 15;

const statusList = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

function statusColor(status) {
  const map = {
    draft: "text-white/30 bg-white/[0.04] border-white/[0.06]",
    sent: "text-blue-300/80 bg-blue-500/[0.06] border-blue-400/15",
    paid: "text-emerald-300/80 bg-emerald-500/[0.06] border-emerald-400/15",
    overdue: "text-red-300/80 bg-red-500/[0.06] border-red-400/15",
    cancelled: "text-white/25 bg-white/[0.02] border-white/[0.04]",
  };
  return map[status] || "text-white/30 bg-white/[0.04] border-white/[0.06]";
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sending, setSending] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }

    const [invoiceRes, clientsRes] = await Promise.all([
      supabase.from("invoices").select("*, client:clients(name, email, company)").order("created_at", { ascending: false }),
      getClients().catch(() => []),
    ]);

    if (invoiceRes.error) { setError(invoiceRes.error.message); }
    else { setInvoices(invoiceRes.data || []); }
    setClients(clientsRes);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...invoices];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((inv) =>
        (inv.invoice_number?.toLowerCase() || "").includes(q) ||
        (inv.client?.name?.toLowerCase() || "").includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "amount") return (b.total || 0) - (a.total || 0);
      if (sort === "number") return (a.invoice_number || "").localeCompare(b.invoice_number || "");
      return 0;
    });
    return result;
  }, [invoices, search, statusFilter, sort]);

  const safePage = Math.min(page, Math.ceil(filtered.length / PAGE_SIZE) || 1);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function handleCreate(formData) {
    try {
      await createInvoice(formData);
      setShowNewInvoice(false);
      addToast("Invoice created", "success");
      fetchData();
    } catch (err) {
      addToast(err.message || "Failed to create invoice", "error");
    }
  }

  async function handleUpdate(formData) {
    try {
      await updateInvoice(formData);
      setEditingInvoice(null);
      addToast("Invoice updated", "success");
      fetchData();
    } catch (err) {
      addToast(err.message || "Failed to update invoice", "error");
    }
  }

  async function handleDelete(id) {
    setDeleteTarget(null);
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      if (viewInvoice?.id === id) setViewInvoice(null);
      addToast("Invoice deleted", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete invoice", "error");
    }
  }

  async function handleSend(id) {
    setSending(id);
    try {
      await sendInvoice(id);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "sent", sent_at: new Date().toISOString() } : inv)));
      if (viewInvoice?.id === id) {
        setViewInvoice((prev) => prev ? { ...prev, status: "sent", sent_at: new Date().toISOString() } : null);
      }
      addToast("Invoice sent to client", "success");
    } catch (err) {
      addToast(err.message || "Failed to send invoice", "error");
    }
    setSending(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading invoices...</span>
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
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Invoices</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">{filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewInvoice(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          New Invoice
        </button>
      </div>

      <Toolbar search={search} onSearchChange={setSearch} resultCount={filtered.length}>
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
          aria-label="Sort invoices"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="amount">Amount</option>
          <option value="number">Invoice #</option>
        </select>
      </Toolbar>

      {pageItems.length === 0 ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <Receipt size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-sm text-white/25">
            {hasFilters ? "No invoices match your filters" : "No invoices yet"}
          </p>
        </div>
      ) : (
        <>
          <DesktopTable
            items={pageItems}
            onView={setViewInvoice}
            onEdit={setEditingInvoice}
            onSend={handleSend}
            onDelete={setDeleteTarget}
            sending={sending}
          />
          <MobileCards
            items={pageItems}
            onView={setViewInvoice}
            onEdit={setEditingInvoice}
            onSend={handleSend}
            onDelete={setDeleteTarget}
            sending={sending}
          />
          <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}

      <InvoiceFormModal
        open={showNewInvoice}
        onClose={() => setShowNewInvoice(false)}
        onSubmit={handleCreate}
        clients={clients}
        title="New Invoice"
      />

      {editingInvoice && (
        <InvoiceFormModal
          open={!!editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSubmit={handleUpdate}
          clients={clients}
          invoice={editingInvoice}
          title="Edit Invoice"
        />
      )}

      <InvoiceDetailDrawer
        invoice={viewInvoice}
        onClose={() => setViewInvoice(null)}
        onEdit={setEditingInvoice}
        onSend={handleSend}
        onDelete={setDeleteTarget}
        sending={sending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
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
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Invoice</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Client</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Amount</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Created</th>
            <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => (
            <tr key={inv.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
              <td className="px-5 py-3.5">
                <button
                  onClick={() => onView(inv)}
                  className="text-left text-sm text-white/80 font-medium transition-colors hover:text-[#EAEFFF]"
                >
                  {inv.invoice_number}
                </button>
              </td>
              <td className="px-5 py-3.5">
                {inv.client ? (
                  <div>
                    <span className="text-sm text-white/60">{inv.client.name}</span>
                    {inv.client.company && (
                      <span className="block text-xs text-white/25">{inv.client.company}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-white/25">—</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold border ${statusColor(inv.status)}`}>
                  {statusList.find((s) => s.value === inv.status)?.label || inv.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-white/60 tabular-nums">
                ${Number(inv.total).toFixed(2)}
              </td>
              <td className="px-5 py-3.5 text-xs text-white/30 tabular-nums">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-white/30" />
                  {formatDate(inv.created_at)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <IconButton onClick={() => onView(inv)} icon={Eye} label="View details" />
                  {(inv.status === "draft" || inv.status === "sent") && (
                    <IconButton
                      onClick={() => onEdit(inv)}
                      icon={Pencil}
                      label="Edit invoice"
                      className="text-white/30 hover:text-white/50"
                    />
                  )}
                  {inv.status === "draft" && (
                    <IconButton
                      onClick={() => onSend(inv.id)}
                      disabled={sending === inv.id}
                      icon={Send}
                      label="Send invoice"
                      className="text-[#EAEFFF]/30 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/[0.04]"
                    />
                  )}
                  {inv.status === "draft" && (
                    <IconButton
                      onClick={() => onDelete(inv.id)}
                      icon={Trash2}
                      label="Delete invoice"
                      className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]"
                    />
                  )}
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
      {items.map((inv) => (
        <div key={inv.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onView(inv)}
                className="text-sm font-medium text-white/80 hover:text-[#EAEFFF] transition-colors text-left"
              >
                {inv.invoice_number}
              </button>
              {inv.client && (
                <p className="text-xs text-white/35 mt-0.5">{inv.client.name}{inv.client.company ? ` \u2022 ${inv.client.company}` : ""}</p>
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${statusColor(inv.status)}`}>
              {statusList.find((s) => s.value === inv.status)?.label || inv.status}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-white/60 tabular-nums font-medium">${Number(inv.total).toFixed(2)}</span>
            <span className="text-[10px] text-white/30 tabular-nums">{formatDate(inv.created_at)}</span>
          </div>
          <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-white/[0.04]">
            <IconButton onClick={() => onView(inv)} icon={Eye} label="View details" />
            {(inv.status === "draft" || inv.status === "sent") && (
              <IconButton onClick={() => onEdit(inv)} icon={Pencil} label="Edit invoice" />
            )}
            {inv.status === "draft" && (
              <IconButton
                onClick={() => onSend(inv.id)}
                disabled={sending === inv.id}
                icon={Send}
                label="Send invoice"
                className="text-[#EAEFFF]/30 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/[0.04]"
              />
            )}
            {inv.status === "draft" && (
              <IconButton
                onClick={() => onDelete(inv.id)}
                icon={Trash2}
                label="Delete invoice"
                className="text-red-400/20 hover:text-red-400/50 hover:bg-red-500/[0.04]"
              />
            )}
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

function InvoiceFormModal({ open, onClose, onSubmit, clients, invoice, title }) {
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState(invoice?.items || [{ description: "", quantity: 1, rate: 0 }]);
  const [tax, setTax] = useState(invoice?.tax || 0);

  useEffect(() => {
    if (open && invoice) {
      setItems(invoice.items?.length ? invoice.items : [{ description: "", quantity: 1, rate: 0 }]);
      setTax(invoice.tax || 0);
    }
    if (open && !invoice) {
      setItems([{ description: "", quantity: 1, rate: 0 }]);
      setTax(0);
    }
  }, [open, invoice]);

  useEffect(() => {
    if (open) {
      const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  const subtotal = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
  const total = subtotal + Number(tax);

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target);
    fd.set("items", JSON.stringify(items.filter((i) => i.description.trim())));
    fd.set("tax", String(tax));
    if (invoice) fd.set("id", invoice.id);
    await onSubmit(fd);
    setSubmitting(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-[5vh]" role="dialog" aria-modal="true" aria-labelledby="invoice-form-title">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[calc(100dvh-10vh)] flex flex-col border border-white/[0.08] bg-[#0c0c0c] shadow-2xl">
        <div className="shrink-0 flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 id="invoice-form-title" className="text-lg font-semibold tracking-tight text-white/90">{title}</h2>
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
              <FormField label="Invoice Number" name="invoice_number" placeholder="Auto-generated" defaultValue={invoice?.invoice_number || ""} disabled />
              <div>
                <label htmlFor="field-client_id" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Client
                </label>
                <select
                  id="field-client_id"
                  name="client_id"
                  defaultValue={invoice?.client_id || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                >
                  <option value="">No client linked</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-3">
                Line Items
              </label>
              <div className="space-y-2">
                <div className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_80px_32px] gap-2 text-[10px] font-semibold tracking-wider text-white/25 uppercase px-3">
                  <span>Description</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Rate</span>
                  <span className="text-right">Amount</span>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_80px_32px] gap-2 items-center border border-white/[0.04] bg-black/40 p-2.5">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Item description"
                      className="w-full bg-transparent text-sm text-white placeholder-white/20 outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                      className="w-full bg-transparent text-sm text-white/80 text-right outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
                      className="w-full bg-transparent text-sm text-white/80 text-right outline-none"
                    />
                    <span className="text-sm text-white/60 text-right tabular-nums">
                      ${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-1 text-red-400/40 hover:text-red-400/70 transition-colors text-right"
                        aria-label="Remove item"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1.5 text-xs text-[#EAEFFF]/50 hover:text-[#EAEFFF]/80 transition-colors px-3 py-1.5"
                >
                  <PlusCircle size={13} />
                  Add item
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-xs text-white/30">Subtotal</span>
                <span className="text-white/60 w-28 text-right tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-xs text-white/30">Tax</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-28 bg-transparent text-sm text-white/80 text-right outline-none border-b border-white/[0.06]"
                />
              </div>
              <div className="flex items-center gap-4 text-sm font-semibold border-t border-white/[0.06] pt-1.5">
                <span className="text-xs text-white/50">Total</span>
                <span className="text-white/90 w-28 text-right tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="field-due_date" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Due Date
                </label>
                <input
                  id="field-due_date"
                  name="due_date"
                  type="date"
                  defaultValue={invoice?.due_date || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white transition-all focus:border-[#EAEFFF]/20 outline-none"
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
                placeholder="Payment instructions, thank you note, etc."
                defaultValue={invoice?.notes || ""}
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
                rows={2}
                placeholder="Payment terms, late fees, etc."
                defaultValue={invoice?.terms || ""}
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
                {submitting ? "Saving..." : invoice ? "Save Changes" : "Create Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", placeholder, defaultValue, required, disabled }) {
  const inputId = `field-${name}`;
  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
        {label}
        {required && <span className="text-red-400/60 ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none disabled:opacity-30"
      />
    </div>
  );
}

function InvoiceDetailDrawer({ invoice, onClose, onEdit, onSend, onDelete, sending }) {
  if (!invoice) return null;

  return (
    <AnimatePresence>
      {invoice && (
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
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl border-l border-white/[0.06] bg-[#0a0a0a] shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-detail-title"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-6 py-4 z-10">
              <h2 id="invoice-detail-title" className="text-base font-semibold tracking-tight text-white/90">
                {invoice.invoice_number}
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
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold border ${statusColor(invoice.status)}`}>
                  {statusList.find((s) => s.value === invoice.status)?.label || invoice.status}
                </span>
                {invoice.sent_at && (
                  <span className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                    <Send size={11} />
                    Sent {formatDate(invoice.sent_at)}
                  </span>
                )}
              </div>

              {invoice.client && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex h-10 w-10 items-center justify-center text-sm font-bold border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 text-[#EAEFFF]/70">
                    {invoice.client.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{invoice.client.name}</p>
                    {invoice.client.email && (
                      <a href={`mailto:${invoice.client.email}`} className="text-xs text-white/40 hover:text-[#EAEFFF] transition-colors">
                        {invoice.client.email}
                      </a>
                    )}
                    {invoice.client.company && (
                      <span className="block text-xs text-white/25">{invoice.client.company}</span>
                    )}
                  </div>
                </div>
              )}

              {invoice.items?.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-3">Line Items</p>
                  <div className="border border-white/[0.06] divide-y divide-white/[0.04]">
                    {invoice.items.map((item, i) => {
                      const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                      return (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/70">{item.description}</p>
                            <p className="text-xs text-white/30 tabular-nums mt-0.5">
                              {item.quantity} &times; ${Number(item.rate).toFixed(2)}
                            </p>
                          </div>
                          <span className="text-sm text-white/60 tabular-nums shrink-0 ml-4">
                            ${amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col items-end gap-1 mt-3 text-sm">
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-white/30">Subtotal</span>
                      <span className="text-white/50 w-24 text-right tabular-nums">${Number(invoice.subtotal || 0).toFixed(2)}</span>
                    </div>
                    {Number(invoice.tax) > 0 && (
                      <div className="flex items-center gap-6">
                        <span className="text-xs text-white/30">Tax</span>
                        <span className="text-white/50 w-24 text-right tabular-nums">${Number(invoice.tax).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-6 font-semibold border-t border-white/[0.06] pt-1.5">
                      <span className="text-xs text-white/50">Total</span>
                      <span className="text-white/90 w-24 text-right tabular-nums">${Number(invoice.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {invoice.due_date && (
                <div className="flex items-center gap-2 text-[10px] text-white/30 tabular-nums">
                  <Calendar size={11} />
                  Due: {invoice.due_date}
                </div>
              )}

              {invoice.notes && (
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">Notes</p>
                  <p className="text-sm text-white/50 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}

              {invoice.terms && (
                <div className="border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-1">Terms & Conditions</p>
                  <p className="text-sm text-white/50 whitespace-pre-wrap">{invoice.terms}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums">
                <Calendar size={11} />
                Created {formatDate(invoice.created_at)}
              </div>

              <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4">
                {(invoice.status === "draft" || invoice.status === "sent") && (
                  <button
                    onClick={() => onEdit(invoice)}
                    className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                )}
                {invoice.status === "draft" && (
                  <button
                    onClick={() => onSend(invoice.id)}
                    disabled={sending === invoice.id}
                    className="inline-flex items-center gap-2 border border-[#EAEFFF]/20 px-4 py-2.5 text-xs font-semibold text-[#EAEFFF]/60 transition-all hover:bg-[#EAEFFF]/[0.04] disabled:opacity-40"
                  >
                    <Send size={13} />
                    {sending === invoice.id ? "Sending..." : "Send to Client"}
                  </button>
                )}
                {invoice.status === "draft" && (
                  <button
                    onClick={() => { onDelete(invoice.id); onClose(); }}
                    className="ml-auto inline-flex items-center gap-2 border border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400/60 transition-all hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
