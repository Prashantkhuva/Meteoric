"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createInvoice, updateInvoice, deleteInvoice, sendInvoice,
  markInvoiceAsPaid, markInvoiceAsOverdue, getClients, getInvoicesPaginated, ensureShareToken,
} from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  X, Plus, Eye, Trash2, Send, Receipt, Calendar, Building2, Mail,
  Pencil, DollarSign, FileText, ArrowUpRight, PlusCircle, Printer, CheckCircle,
  MessageCircle, Download, ChevronUp, ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/supabase/admin";
import { useToast } from "../components/ToastContext";
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
import { getSiteUrl } from "@/config/site-url";

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

const CSV_COLUMNS = [
  { label: "Invoice #", accessor: (inv) => inv.invoice_number || "" },
  { label: "Client", accessor: (inv) => inv.client?.name || "" },
  { label: "Client Email", accessor: (inv) => inv.client?.email || "" },
  { label: "Status", accessor: (inv) => inv.status || "" },
  { label: "Total", accessor: (inv) => Number(inv.total || 0).toFixed(2) },
  { label: "Due Date", accessor: (inv) => inv.due_date || "" },
  { label: "Created", accessor: (inv) => formatDate(inv.created_at) },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, status: statusFilter, sort, page, col, dir } = filters;
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const [sending, setSending] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const addToast = useToast();
  const searchParams = useSearchParams();
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchParams.has("proposalId")) {
      setShowNewInvoice(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, sort, page, col, dir]);

  const checkedOverdue = useRef(false);

  useShortcuts(
    useMemo(() => ({
      "n": () => setShowNewInvoice(true),
      "/": () => searchRef.current?.focus(),
      "Escape": () => { if (viewInvoice) setViewInvoice(null); if (showNewInvoice) setShowNewInvoice(false); },
    }), [viewInvoice, showNewInvoice])
  );

  async function fetchData() {
    setLoading(true);

    const [result, clientsRes] = await Promise.all([
      getInvoicesPaginated({ page, pageSize: PAGE_SIZE, search, status: statusFilter, col, dir, sort }),
      getClients().catch(() => []),
    ]);

    if (result.error) { setError(result.error); setLoading(false); return; }

    setInvoices(result.data);
    setTotal(result.total);
    setClients(clientsRes);
    setLoading(false);

    if (checkedOverdue.current) return;
    checkedOverdue.current = true;

    const supabase = createClient();
    if (!supabase) return;
    const { data: allInvoices } = await supabase
      .from("invoices").select("id, status, due_date");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueIds = [];
    (allInvoices || []).forEach((inv) => {
      if (inv.status === "sent" && inv.due_date) {
        const due = new Date(inv.due_date);
        if (due < today) overdueIds.push(inv.id);
      }
    });

    if (overdueIds.length > 0) {
      try {
        await markInvoiceAsOverdue(overdueIds);
        setInvoices((prev) => prev.map((inv) =>
          overdueIds.includes(inv.id) ? { ...inv, status: "overdue" } : inv
        ));
      } catch {}
    }
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === invoices.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(invoices.map((inv) => inv.id)));
    }
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    setIsDeleting(true);
    try {
      await Promise.all(ids.map((id) => deleteInvoice(id)));
      setInvoices((prev) => prev.filter((inv) => !ids.includes(inv.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      if (viewInvoice && ids.includes(viewInvoice.id)) setViewInvoice(null);
      addToast(`${ids.length} invoice${ids.length > 1 ? "s" : ""} deleted`, "success");
      setSelected(new Set());
      setBulkConfirm(null);
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
      setBulkConfirm(null);
    }
    setIsDeleting(false);
  }

  async function handleExportCSV() {
    const supabase = createClient();
    if (!supabase) return;
    let query = supabase.from("invoices").select("*, client:clients(name, email, phone, company), proposal:proposals(id, title)");
    if (search) { query = query.or(`invoice_number.ilike.%${search}%,client.name.ilike.%${search}%`); }
    if (statusFilter !== "all") { query = query.eq("status", statusFilter); }
    const { data } = await query;
    downloadCSV(data || [], CSV_COLUMNS, `invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    addToast("CSV exported", "success");
  }

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
    setIsDeleting(true);
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (viewInvoice?.id === id) setViewInvoice(null);
      addToast("Invoice deleted", "success");
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message || "Failed to delete invoice", "error");
      setDeleteTarget(null);
    }
    setIsDeleting(false);
  }

  async function handleMarkAsPaid(id) {
    const paidAt = new Date().toISOString();
    try {
      await markInvoiceAsPaid(id, paidAt);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "paid", paid_at: paidAt } : inv)));
      if (viewInvoice?.id === id) {
        setViewInvoice((prev) => prev ? { ...prev, status: "paid", paid_at: paidAt } : null);
      }
      addToast("Invoice marked as paid", "success");
    } catch (err) {
      addToast(err.message || "Failed to mark as paid", "error");
    }
  }

  async function handleSend(id) {
    setSending(id);
    const result = await sendInvoice(id);
    if (result.success) {
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "sent", sent_at: new Date().toISOString() } : inv)));
      if (viewInvoice?.id === id) {
        setViewInvoice((prev) => prev ? { ...prev, status: "sent", sent_at: new Date().toISOString() } : null);
      }
      addToast("Invoice sent to client", "success");
    } else {
      addToast(result.error || "Failed to send invoice", "error");
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
          <p className="mt-1 text-sm text-white/35 tabular-nums">{total} invoice{total !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewInvoice(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          New Invoice
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
          label="Sort invoices"
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "amount", label: "Amount" },
            { value: "number", label: "Invoice #" },
          ]}
        />
      </Toolbar>

      {invoices.length === 0 && !loading ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <Receipt size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-sm text-white/25">
            {hasFilters ? "No invoices match your filters" : "No invoices yet \u2014 create your first invoice to get started"}
          </p>
          {!hasFilters && (
            <button
              onClick={() => setShowNewInvoice(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
            >
              <Plus size={15} />
              New Invoice
            </button>
          )}
        </div>
      ) : (
        <>
          {invoices.length > 0 && (
            <>
              <DesktopTable
                items={invoices}
                onView={setViewInvoice}
                onEdit={setEditingInvoice}
                onSend={handleSend}
                onDelete={setDeleteTarget}
                sending={sending}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                col={col}
                dir={dir}
                onColSort={toggleColSort}
              />
              <MobileCards
                items={invoices}
                onView={setViewInvoice}
                onEdit={setEditingInvoice}
                onSend={handleSend}
                onDelete={setDeleteTarget}
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
      />

      <InvoiceFormModal
        key={formResetKey}
        open={showNewInvoice}
        onClose={() => { setShowNewInvoice(false); setFormResetKey(k => k + 1); window.history.replaceState(null, "", "/admin/invoices"); }}
        onSubmit={handleCreate}
        clients={clients}
        proposalId={searchParams.get("proposalId")}
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
        onMarkAsPaid={handleMarkAsPaid}
        onDelete={setDeleteTarget}
        sending={sending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => { if (!isDeleting) setDeleteTarget(null) }}
      />
      <ConfirmDialog
        open={bulkConfirm === "delete"}
        title="Delete invoices"
        message={`Are you sure you want to delete ${selected.size} invoice${selected.size !== 1 ? "s" : ""}? This action cannot be undone.`}
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

function DesktopTable({ items, onView, onEdit, onSend, onDelete, sending, selected, onToggleSelect, onToggleSelectAll, col, dir, onColSort }) {
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
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("invoice_number")}>
              Invoice<SortIcon column="invoice_number" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Client</th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("status")}>
              Status<SortIcon column="status" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("total")}>
              Amount<SortIcon column="total" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("created_at")}>
              Created<SortIcon column="created_at" col={col} dir={dir} />
            </th>
            <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => (
            <tr key={inv.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
              <td className="px-5 py-3.5">
                <Checkbox
                  checked={selected.has(inv.id)}
                  onChange={() => onToggleSelect(inv.id)}
                  label={`Select invoice ${inv.invoice_number}`}
                />
              </td>
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
                  <IconButton onClick={() => window.open(`/preview/invoice/${inv.id}`, "_blank")} icon={Printer} label="Print / PDF" className="text-white/30 hover:text-white/50" />
                  {inv.client?.phone && (
                    <IconButton
                      onClick={async () => {
                        const t = inv.share_token || (await ensureShareToken("invoice", inv.id)).token;
                        window.open(`https://wa.me/${inv.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${inv.client.name}, an invoice has been issued: ${inv.invoice_number} for $${Number(inv.total).toFixed(2)}.${t ? ` Download: ${getSiteUrl()}/api/pdf/invoice/${inv.id}?token=${t}` : " Check your email for the PDF."}`)}`, "_blank")}
                      }
                      icon={MessageCircle}
                      label="Share via WhatsApp"
                      className="text-emerald-400/30 hover:text-emerald-400/60 hover:bg-emerald-500/[0.04]"
                    />
                  )}
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

function MobileCards({ items, onView, onEdit, onSend, onDelete, sending, selected, onToggleSelect }) {
  return (
    <div className="sm:hidden space-y-3">
      {items.map((inv) => (
        <div key={inv.id} className="border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                checked={selected.has(inv.id)}
                onChange={() => onToggleSelect(inv.id)}
                label={`Select invoice ${inv.invoice_number}`}
              />
              <div className="min-w-0">
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
            <IconButton onClick={() => window.open(`/preview/invoice/${inv.id}`, "_blank")} icon={Printer} label="Print / PDF" />
            {inv.client?.phone && (
              <IconButton
                onClick={async () => {
                  const t = inv.share_token || (await ensureShareToken("invoice", inv.id)).token;
                  window.open(`https://wa.me/${inv.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${inv.client.name}, an invoice has been issued: ${inv.invoice_number} for $${Number(inv.total).toFixed(2)}.${t ? ` Download: ${getSiteUrl()}/api/pdf/invoice/${inv.id}?token=${t}` : " Check your email for the PDF."}`)}`, "_blank")}
                }
                icon={MessageCircle}
                label="Share via WhatsApp"
                className="text-emerald-400/30 hover:text-emerald-400/60 hover:bg-emerald-500/[0.04]"
              />
            )}
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

function InvoiceFormModal({ open, onClose, onSubmit, clients, invoice, title, proposalId }) {
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState(invoice?.items || [{ description: "", quantity: 1, rate: 0 }]);
  const [tax, setTax] = useState(invoice?.tax || 0);
  const trapRef = useFocusTrap(open);

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
    if (proposalId) fd.set("proposal_id", proposalId);
    await onSubmit(fd);
    setSubmitting(false);
  }

  if (!open) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="invoice-form-title">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div ref={trapRef} className="relative w-full max-w-2xl max-h-[calc(100dvh-32px)] overflow-hidden flex flex-col border border-white/[0.08] bg-[#0c0c0c] shadow-2xl">
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
                  style={{ colorScheme: "dark" }}
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

function InvoiceDetailDrawer({ invoice, onClose, onEdit, onSend, onMarkAsPaid, onDelete, sending }) {
  if (!invoice) return null;
  const trapRef = useFocusTrap(!!invoice);

  useEffect(() => {
    if (!invoice) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [invoice, onClose]);

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
            ref={trapRef}
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

              {invoice.proposal && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex h-10 w-10 items-center justify-center text-sm font-bold border border-[#EAEFFF]/20 bg-[#EAEFFF]/5 text-[#EAEFFF]/70">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-white/30">From Proposal</p>
                    <p className="text-sm font-medium text-white/80">{invoice.proposal.title || `Proposal #${invoice.proposal.id}`}</p>
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

              {invoice.paid_at && (
                <div className="flex items-center gap-2 text-[10px] text-emerald-400/60 tabular-nums">
                  <CheckCircle size={11} />
                  Paid {formatDate(invoice.paid_at)}
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
                <button
                  onClick={() => window.open(`/preview/invoice/${invoice.id}`, "_blank")}
                  className="inline-flex items-center gap-2 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70"
                >
                  <Printer size={13} />
                  Print / PDF
                </button>
                {invoice.client?.phone && (
                  <button
                    onClick={async () => {
                      const t = invoice.share_token || (await ensureShareToken("invoice", invoice.id)).token;
                      window.open(`https://wa.me/${invoice.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${invoice.client.name}, an invoice has been issued: ${invoice.invoice_number} for $${Number(invoice.total).toFixed(2)}.${t ? ` Download: ${getSiteUrl()}/api/pdf/invoice/${invoice.id}?token=${t}` : " Check your email for the PDF."}`)}`, "_blank")}
                    }
                    className="inline-flex items-center gap-2 border border-emerald-400/20 px-4 py-2.5 text-xs font-semibold text-emerald-400/70 transition-all hover:bg-emerald-500/[0.06]"
                  >
                    <MessageCircle size={13} />
                    WhatsApp
                  </button>
                )}
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
                {(invoice.status === "sent" || invoice.status === "overdue") && (
                  <button
                    onClick={() => onMarkAsPaid(invoice.id)}
                    className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 px-4 py-2.5 text-xs font-semibold text-emerald-400/80 transition-all hover:bg-emerald-500/20 active:scale-[0.97]"
                  >
                    <CheckCircle size={13} />
                    Mark as Paid
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
