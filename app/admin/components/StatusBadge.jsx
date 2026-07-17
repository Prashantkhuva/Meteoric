import { cn } from "@/lib/utils";

const OLD_MAP = {
  new: "inquiry",
  contacted: "discovery",
  qualified: "proposal",
  won: "completed",
};

const colors = {
  inquiry: { bg: "bg-[#EAEFFF]/8", border: "border-[#EAEFFF]/20", text: "text-[#EAEFFF]/70", dot: "bg-[#EAEFFF]/60" },
  discovery: { bg: "bg-sky-500/10", border: "border-sky-500/25", text: "text-sky-400", dot: "bg-sky-400" },
  proposal: { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", dot: "bg-amber-400" },
  in_progress: { bg: "bg-[#EAEFFF]/12", border: "border-[#EAEFFF]/25", text: "text-[#EAEFFF]/80", dot: "bg-[#EAEFFF]/80" },
  completed: { bg: "bg-[#EAEFFF]/10", border: "border-[#EAEFFF]/25", text: "text-[#EAEFFF]", dot: "bg-[#EAEFFF]" },
  lost: { bg: "bg-red-500/10", border: "border-red-500/25", text: "text-red-400", dot: "bg-red-400" },
  onboarding: { bg: "bg-sky-500/8", border: "border-sky-500/20", text: "text-sky-400", dot: "bg-sky-400" },
  active: { bg: "bg-[#EAEFFF]/10", border: "border-[#EAEFFF]/25", text: "text-[#EAEFFF]", dot: "bg-[#EAEFFF]" },
  at_risk: { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", dot: "bg-amber-400" },
  inactive: { bg: "bg-white/[0.04]", border: "border-white/[0.10]", text: "text-white/40", dot: "bg-white/30" },
  churned: { bg: "bg-red-500/8", border: "border-red-500/20", text: "text-red-400/70", dot: "bg-red-400/70" },
  draft: { bg: "bg-white/[0.04]", border: "border-white/[0.06]", text: "text-white/30", dot: "bg-white/30" },
  sent: { bg: "bg-blue-500/8", border: "border-blue-400/15", text: "text-blue-300/80", dot: "bg-blue-400" },
  viewed: { bg: "bg-yellow-500/8", border: "border-yellow-400/15", text: "text-yellow-300/80", dot: "bg-yellow-400" },
  accepted: { bg: "bg-emerald-500/8", border: "border-emerald-400/15", text: "text-emerald-300/80", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-500/8", border: "border-red-400/15", text: "text-red-300/80", dot: "bg-red-400" },
  paid: { bg: "bg-emerald-500/8", border: "border-emerald-400/15", text: "text-emerald-300/80", dot: "bg-emerald-400" },
  overdue: { bg: "bg-red-500/8", border: "border-red-400/15", text: "text-red-300/80", dot: "bg-red-400" },
  cancelled: { bg: "bg-white/[0.02]", border: "border-white/[0.04]", text: "text-white/25", dot: "bg-white/20" },
  planning: { bg: "bg-white/[0.04]", border: "border-white/[0.06]", text: "text-white/30", dot: "bg-white/30" },
  review: { bg: "bg-yellow-500/8", border: "border-yellow-400/15", text: "text-yellow-300/80", dot: "bg-yellow-400" },
  on_hold: { bg: "bg-orange-500/8", border: "border-orange-400/15", text: "text-orange-300/80", dot: "bg-orange-400" },
  pending: { bg: "bg-amber-500/8", border: "border-amber-400/15", text: "text-amber-300/80", dot: "bg-amber-400" },
  approved: { bg: "bg-emerald-500/8", border: "border-emerald-400/15", text: "text-emerald-300/80", dot: "bg-emerald-400" },
};

function resolve(status) {
  return colors[OLD_MAP[status] || status] || colors.inquiry;
}

const labels = {
  inquiry: "Inquiry",
  discovery: "Discovery",
  proposal: "Proposal",
  in_progress: "In Progress",
  completed: "Completed",
  lost: "Lost",
  onboarding: "Onboarding",
  active: "Active",
  at_risk: "At Risk",
  inactive: "Inactive",
  churned: "Churned",
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  accepted: "Accepted",
  rejected: "Rejected",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
  planning: "Planning",
  review: "Review",
  on_hold: "On Hold",
  pending: "Pending",
  approved: "Approved",
};

function label(status) {
  return labels[OLD_MAP[status] || status] || status;
}

export function StatusBadge({ status, className }) {
  const s = resolve(status);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", s.bg, s.border, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      <span>{label(status)}</span>
    </span>
  );
}

export function BookingStatusBadge({ status, className }) {
  const s = (status || "PENDING").toUpperCase();
  const styles = {
    ACCEPTED: "border-emerald-500/25 bg-emerald-500/8 text-emerald-400 bg-emerald-500/10",
    CANCELLED: "border-red-500/25 bg-red-500/8 text-red-400 bg-red-500/10",
    PENDING: "border-amber-500/25 bg-amber-500/8 text-amber-400 bg-amber-500/10",
  };
  const cls = styles[s] || styles.PENDING;
  const dot = s === "ACCEPTED" ? "bg-emerald-400" : s === "CANCELLED" ? "bg-red-400" : "bg-amber-400";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", cls, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {s}
    </span>
  );
}
