"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Landmark,
  Star,
  X,
} from "lucide-react";
import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "../actions";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/ToastContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AUD"];

function BankAccountForm({ open, onClose, onSubmit, account }) {
  const [submitting, setSubmitting] = useState(false);
  const trapRef = useFocusTrap(open);

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
    fd.set("is_default", fd.get("is_default") === "on" ? "true" : "false");
    if (account) fd.set("id", account.id);
    await onSubmit(fd);
    setSubmitting(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={trapRef}
        className="relative w-full max-w-lg max-h-full overflow-y-auto border border-white/[0.08] bg-[#0c0c0c] shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0c0c0c] px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-white/90">
            {account ? "Edit Bank Account" : "Add Bank Account"}
          </h2>
          <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white/50 transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Label *</label>
                <input
                  name="label"
                  required
                  maxLength={100}
                  defaultValue={account?.label || ""}
                  placeholder="e.g. Wise USD"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Bank Name</label>
                <input
                  name="bank_name"
                  maxLength={100}
                  defaultValue={account?.bank_name || ""}
                  placeholder="e.g. Wise, HDFC"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Account Holder *</label>
              <input
                name="account_holder"
                required
                maxLength={200}
                defaultValue={account?.account_holder || ""}
                placeholder="Full name on account"
                className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Account Number</label>
                <input
                  name="account_number"
                  maxLength={50}
                  defaultValue={account?.account_number || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">IBAN</label>
                <input
                  name="iban"
                  maxLength={50}
                  defaultValue={account?.iban || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">SWIFT / BIC</label>
                <input
                  name="swift_bic"
                  maxLength={20}
                  defaultValue={account?.swift_bic || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Routing Number</label>
                <input
                  name="routing_number"
                  maxLength={30}
                  defaultValue={account?.routing_number || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">IFSC</label>
                <input
                  name="ifsc"
                  maxLength={20}
                  defaultValue={account?.ifsc || ""}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Currency</label>
                <select
                  name="currency"
                  defaultValue={account?.currency || "USD"}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  style={{ colorScheme: "dark" }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">Country</label>
                <input
                  name="country"
                  maxLength={50}
                  defaultValue={account?.country || ""}
                  placeholder="e.g. India, UK"
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white/80 transition-all focus:border-[#EAEFFF]/20 outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_default"
                defaultChecked={account?.is_default || false}
                className="w-4 h-4 rounded border-white/20 bg-black/60 accent-[#EAEFFF]"
              />
              <span className="text-xs text-white/50">Set as default account</span>
            </label>

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
                {submitting ? "Saving..." : account ? "Save Changes" : "Add Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchAccounts() {
    setLoading(true);
    const result = await getBankAccounts();
    if (result.error) {
      addToast(result.error, "error");
    } else {
      setAccounts(result.data || []);
    }
    setLoading(false);
  }

  async function handleCreate(fd) {
    const result = await createBankAccount(fd);
    if (result.error) {
      addToast(result.error, "error");
    } else {
      addToast("Bank account created", "success");
      setShowForm(false);
      fetchAccounts();
    }
  }

  async function handleUpdate(fd) {
    const result = await updateBankAccount(fd);
    if (result.error) {
      addToast(result.error, "error");
    } else {
      addToast("Bank account updated", "success");
      setEditing(null);
      fetchAccounts();
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteBankAccount(deleteTarget.id);
    if (result.error) {
      addToast(result.error, "error");
    } else {
      addToast("Bank account deleted", "success");
      setDeleteTarget(null);
      fetchAccounts();
    }
    setIsDeleting(false);
  }

  return (
    <div className="p-5 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Bank Accounts</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">{accounts.length} account{accounts.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={14} />
          Add Account
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-20">
          <Landmark size={32} className="mx-auto text-white/10 mb-3" />
          <p className="text-white/30 text-sm">No bank accounts yet</p>
          <p className="text-white/20 text-xs mt-1">Add a bank account to include in invoice payments</p>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="border border-white/[0.06] bg-[#0a0a0a] p-4 flex items-center justify-between hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 flex items-center justify-center bg-white/[0.04] shrink-0">
                  <Landmark size={16} className="text-white/30" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white/80 truncate">{account.label}</p>
                    {account.is_default && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400/80 bg-amber-400/[0.08] px-1.5 py-0.5 border border-amber-400/15">
                        <Star size={9} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/35 truncate">
                    {account.bank_name ? `${account.bank_name} · ` : ""}
                    {account.account_holder}
                    {account.currency ? ` · ${account.currency}` : ""}
                    {account.account_number ? ` · •••${account.account_number.slice(-4)}` : ""}
                    {account.iban ? ` · ${account.iban.slice(-4)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <button
                  onClick={() => setEditing(account)}
                  className="p-1.5 text-white/20 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
                  aria-label="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(account)}
                  className="p-1.5 text-white/20 hover:text-red-400/60 transition-colors hover:bg-white/[0.04]"
                  aria-label="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BankAccountForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
      />

      {editing && (
        <BankAccountForm
          open={!!editing}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
          account={editing}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Bank Account"
        description={`Delete "${deleteTarget?.label}"? This cannot be undone.`}
        loading={isDeleting}
      />
    </div>
  );
}
