"use client";

import { useState, useEffect } from "react";
import { Brain, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { getDecisionsAccuracy, getDecisionsRecent, reviewDecision } from "../actions";
import { KPICard } from "../components/KPICard";
import { useToast } from "../components/ToastContext";
import { formatDate } from "@/lib/supabase/admin";

const qualityStyles = {
  hot: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  warm: "bg-amber-500/10 border-amber-500/25 text-amber-400",
  cold: "bg-sky-500/10 border-sky-500/25 text-sky-400",
  spam: "bg-red-500/10 border-red-500/25 text-red-400",
};

function QualityBadge({ quality }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${qualityStyles[quality] || qualityStyles.cold}`}>
      {quality || "—"}
    </span>
  );
}

function VerdictBadge({ verdict }) {
  if (!verdict) return <span className="text-xs text-white/30">Unreviewed</span>;
  if (verdict === "agree") {
    return <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><ThumbsUp size={12} /> Agree</span>;
  }
  return <span className="inline-flex items-center gap-1 text-xs text-red-400"><ThumbsDown size={12} /> Disagree</span>;
}

export default function DecisionsPage() {
  const [accuracy, setAccuracy] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true);
    const [acc, recent] = await Promise.all([getDecisionsAccuracy(), getDecisionsRecent()]);
    if (acc.error) addToast(acc.error, "error");
    else setAccuracy(acc.data);
    if (recent.error) addToast(recent.error, "error");
    else setRows(recent.data || []);
    setLoading(false);
  }

  async function handleReview(id, verdict) {
    setReviewingId(id);
    const res = await reviewDecision(id, verdict);
    setReviewingId(null);
    if (res.error) {
      addToast(res.error, "error");
      return;
    }
    addToast(`Marked as ${verdict}`, "success");
    load();
  }

  const agreement =
    accuracy && accuracy.reviewed > 0 ? Math.round((accuracy.agree / accuracy.reviewed) * 100) : null;

  return (
    <div className="p-5 lg:p-8 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Decisions</h1>
          <p className="mt-1 text-sm text-white/40">
            Shadow-mode AI lead triage — nothing changes automatically.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEFFF]/20 bg-[#EAEFFF]/8 px-3 py-1 text-xs text-[#EAEFFF]/70">
          <Brain size={13} /> Jev · typesafe/jev-1.13
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-white/40" size={24} />
        </div>
      ) : rows.length === 0 && !accuracy?.total ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] px-6 py-14 text-center">
          <Brain className="mx-auto text-white/20" size={28} />
          <p className="mt-3 text-sm text-white/50">No decisions yet.</p>
          <p className="mt-1 text-xs text-white/30">
            Enable AI_DECISIONS_ENABLED and create a lead to start collecting shadow decisions.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Total Decisions" value={accuracy?.total ?? 0} accent subtext="All time" />
            <KPICard label="Reviewed" value={accuracy?.reviewed ?? 0} subtext={`${Math.max((accuracy?.total ?? 0) - (accuracy?.reviewed ?? 0), 0)} pending`} />
            <KPICard
              label="Agreement"
              value={agreement == null ? "—" : `${agreement}%`}
              subtext={accuracy?.reviewed ? `${accuracy.agree} agree · ${accuracy.disagree} disagree` : "No reviews yet"}
            />
            <KPICard
              label="Avg Confidence"
              value={accuracy?.avgConfidence == null ? "—" : `${Math.round(accuracy.avgConfidence * 100)}%`}
              subtext="Headline (quality)"
            />
          </div>

          <div className="border border-white/[0.06] bg-[#0a0a0a] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Quality</th>
                  <th className="px-4 py-3 font-medium">Next Status</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Verdict</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Review</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const r = row.result || {};
                  return (
                    <tr key={row.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-white/70">#{row.entity_id}</td>
                      <td className="px-4 py-3"><QualityBadge quality={r.quality} /></td>
                      <td className="px-4 py-3 text-white/60 capitalize">{r.suggested_next_status || "—"}</td>
                      <td className="px-4 py-3 text-white/60 uppercase">{r.service_category || "—"}</td>
                      <td className="px-4 py-3 tabular-nums text-white/60">{Math.round((row.confidence ?? 0) * 100)}%</td>
                      <td className="px-4 py-3"><VerdictBadge verdict={row.verdict} /></td>
                      <td className="px-4 py-3 text-xs text-white/30 max-w-[160px] truncate" title={row.model_version || ""}>
                        {row.model_version || "—"}
                      </td>
                      <td className="px-4 py-3 text-white/50 whitespace-nowrap">{formatDate(row.created_at)}</td>
                      <td className="px-4 py-3">
                        {row.verdict ? (
                          <button
                            onClick={() => handleReview(row.id, row.verdict === "agree" ? "disagree" : "agree")}
                            className="text-xs text-white/40 hover:text-white/70 transition-colors"
                          >
                            Change
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleReview(row.id, "agree")}
                              disabled={reviewingId === row.id}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              <ThumbsUp size={11} /> Agree
                            </button>
                            <button
                              onClick={() => handleReview(row.id, "disagree")}
                              disabled={reviewingId === row.id}
                              className="inline-flex items-center gap-1 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                            >
                              <ThumbsDown size={11} /> Disagree
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
