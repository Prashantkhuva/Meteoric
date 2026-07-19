"use client";

import { useState, useEffect } from "react";
import { getReviewsPaginated, updateReviewStatus, toggleReviewVerified, deleteReview } from "../actions";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { StatusBadge } from "../components/StatusBadge";
import { Toolbar, FilterChip, ClearFiltersButton } from "../components/Toolbar";
import { useToast } from "../components/ToastContext";
import { Star, Check, X, Trash2, ChevronUp, ChevronDown, BadgeCheck } from "lucide-react";

const PAGE_SIZE = 15;

const statusFilters = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Stars({ count }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= count ? "text-amber-400 fill-amber-400" : "text-white/10"} />
      ))}
    </span>
  );
}

function SortIcon({ column, col, dir }) {
  if (col !== column) return null;
  return dir === "asc" ? <ChevronUp size={11} className="inline ml-0.5 text-[#EAEFFF]" /> : <ChevronDown size={11} className="inline ml-0.5 text-[#EAEFFF]" />;
}

export default function ReviewsPageContent() {
  const addToast = useToast();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortCol, setSortCol] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    getReviewsPaginated({ page, pageSize: PAGE_SIZE, status: statusFilter || undefined, search: search || undefined, col: sortCol, dir: sortDir }).then((res) => {
      if (!cancelled) {
        setReviews(res.data);
        setTotal(res.total);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [page, statusFilter, search, sortCol, sortDir]);

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
    setPage(1);
  }

  async function handleStatusChange(id, newStatus) {
    const res = await updateReviewStatus(id, newStatus);
    if (res?.error) {
      addToast(res.error, "error");
      return;
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    addToast(`Review ${newStatus}`, "success");
  }

  async function handleVerifiedToggle(id, current) {
    const res = await toggleReviewVerified(id, !current);
    if (res?.error) {
      addToast(res.error, "error");
      return;
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_verified: !current } : r)));
    addToast(!current ? "Marked as verified" : "Verification removed", "success");
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setIsDeleting(true);
    const res = await deleteReview(confirmDelete);
    setIsDeleting(false);
    setConfirmDelete(null);
    if (res?.error) {
      addToast(res.error, "error");
      return;
    }
    setReviews((prev) => prev.filter((r) => r.id !== confirmDelete));
    setTotal((t) => t - 1);
    addToast("Review deleted", "success");
  }

  return (
    <div className="p-5 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Reviews</h1>
          <p className="text-sm text-white/40 mt-1">{total} total</p>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search reviews..."
      >
        {statusFilters.map((f) => (
          <FilterChip
            key={f.value}
            active={statusFilter === f.value}
            onClick={() => { setStatusFilter(f.value); setPage(1); }}
          >
            {f.label}
          </FilterChip>
        ))}
        {(statusFilter || search) && (
          <ClearFiltersButton onClick={() => { setStatusFilter(""); setSearch(""); setPage(1); }} />
        )}
      </Toolbar>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.12em] text-white/30">
              <th className="text-left px-5 py-3 font-medium cursor-pointer hover:text-white/50" onClick={() => handleSort("name")}>
                Name <SortIcon column="name" col={sortCol} dir={sortDir} />
              </th>
              <th className="text-left px-5 py-3 font-medium">Rating</th>
              <th className="text-left px-5 py-3 font-medium cursor-pointer hover:text-white/50" onClick={() => handleSort("created_at")}>
                Date <SortIcon column="created_at" col={sortCol} dir={sortDir} />
              </th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center">
                <div className="flex items-center justify-center gap-2 text-white/30">
                  <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
                  <span className="text-sm">Loading reviews...</span>
                </div>
              </td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-white/30">No reviews found</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-white/80 font-medium flex items-center gap-1.5">
                        {r.name}
                        {r.is_verified && <BadgeCheck size={13} className="text-[#EAEFFF]/60 shrink-0" />}
                      </p>
                      <p className="text-white/30 text-xs">{r.email}</p>
                      {r.company && <p className="text-white/20 text-xs">{r.company}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3"><Stars count={r.rating} /></td>
                  <td className="px-5 py-3 text-white/40 text-xs">{formatDate(r.created_at)}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(r.id, "approved")}
                            className="p-1.5 rounded-lg text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(r.id, "rejected")}
                            className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Reject"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <button
                          onClick={() => handleStatusChange(r.id, "pending")}
                          className="p-1.5 rounded-lg text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-xs"
                          title="Revoke approval"
                        >
                          Undo
                        </button>
                      )}
                      {r.status === "rejected" && (
                        <button
                          onClick={() => handleStatusChange(r.id, "pending")}
                          className="p-1.5 rounded-lg text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-xs"
                          title="Reconsider"
                        >
                          Undo
                        </button>
                      )}
                      <button
                        onClick={() => handleVerifiedToggle(r.id, r.is_verified)}
                        className={`p-1.5 rounded-lg transition-colors ${r.is_verified ? "text-[#EAEFFF]/80 hover:text-[#EAEFFF] hover:bg-[#EAEFFF]/10" : "text-white/20 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/5"}`}
                        title={r.is_verified ? "Remove verification" : "Mark as verified client"}
                      >
                        <BadgeCheck size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(r.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-white/30">
            <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
            <span className="text-sm">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No reviews found</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-white/80 font-medium text-sm flex items-center gap-1.5">
                    {r.name}
                    {r.is_verified && <BadgeCheck size={13} className="text-[#EAEFFF]/60 shrink-0" />}
                  </p>
                  <p className="text-white/30 text-xs">{r.email}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Stars count={r.rating} />
                <span className="text-white/20 text-xs">{formatDate(r.created_at)}</span>
              </div>
              {expanded === r.id ? (
                <p className="text-white/50 text-xs leading-relaxed mb-3">{r.content}</p>
              ) : (
                <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">{r.content}</p>
              )}
              {r.content?.length > 100 && (
                <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-[#EAEFFF]/50 text-xs hover:text-[#EAEFFF]/80 mb-3">
                  {expanded === r.id ? "Show less" : "Read more"}
                </button>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                {r.status === "pending" && (
                  <>
                    <button onClick={() => handleStatusChange(r.id, "approved")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                      <Check size={12} /> Approve
                    </button>
                    <button onClick={() => handleStatusChange(r.id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                      <X size={12} /> Reject
                    </button>
                  </>
                )}
                {(r.status === "approved" || r.status === "rejected") && (
                  <button onClick={() => handleStatusChange(r.id, "pending")} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
                    Reset to Pending
                  </button>
                )}
                <button onClick={() => handleVerifiedToggle(r.id, r.is_verified)} className={`p-1.5 rounded-lg transition-colors ${r.is_verified ? "text-[#EAEFFF]/80 bg-[#EAEFFF]/10" : "text-white/20 hover:text-[#EAEFFF]/60 hover:bg-[#EAEFFF]/5"}`} title={r.is_verified ? "Remove verification" : "Mark as verified"}>
                  <BadgeCheck size={14} />
                </button>
                <button onClick={() => setConfirmDelete(r.id)} className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete review"
        message="This will permanently remove this review. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        destructive
        loading={isDeleting}
      />
    </div>
  );
}
