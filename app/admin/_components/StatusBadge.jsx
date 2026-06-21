import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }) {
  const colors = {
    new: { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400", dot: "bg-emerald-400" },
    contacted: { bg: "bg-sky-500/10", border: "border-sky-500/25", text: "text-sky-400", dot: "bg-sky-400" },
    qualified: { bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-400", dot: "bg-violet-400" },
    proposal: { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", dot: "bg-amber-400" },
    won: { bg: "bg-[#EAEFFF]/10", border: "border-[#EAEFFF]/25", text: "text-[#EAEFFF]", dot: "bg-[#EAEFFF]" },
    lost: { bg: "bg-red-500/10", border: "border-red-500/25", text: "text-red-400", dot: "bg-red-400" },
  };
  const s = colors[status] || colors.new;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", s.bg, s.border, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      <span>{status}</span>
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
