export type ClientHealthBand = "healthy" | "watch" | "at_risk" | "new";

export type ClientHealth = {
  score: number; // 0-100
  band: ClientHealthBand;
  reasons: string[];
};

type ProjectSignal = {
  status: string | null;
  deadline?: string | null;
};

type InvoiceSignal = {
  status: string | null;
  due_date?: string | null;
  paid_at?: string | null;
};

/**
 * Deterministic client-health score from project + invoice signals.
 * No AI call — pure rules so it's cheap, instant, and auditable.
 */
export function scoreClientHealth(input: {
  projects?: ProjectSignal[] | null;
  invoices?: InvoiceSignal[] | null;
}): ClientHealth {
  const projects = input.projects || [];
  const invoices = input.invoices || [];
  const reasons: string[] = [];
  let score = 50;

  if (projects.length === 0 && invoices.length === 0) {
    return { score: 50, band: "new", reasons: ["No projects or invoices yet"] };
  }

  const now = Date.now();
  const dayMs = 86_400_000;

  const completed = projects.filter((p) => p.status === "completed");
  const inProgress = projects.filter((p) => p.status === "in_progress");
  const overdueProjects = inProgress.filter((p) => {
    if (!p.deadline) return false;
    const d = Date.parse(p.deadline);
    return Number.isFinite(d) && d < now;
  });

  if (completed.length) {
    score += Math.min(24, completed.length * 8);
    reasons.push(`${completed.length} completed project${completed.length > 1 ? "s" : ""}`);
  }
  if (inProgress.length) {
    score += Math.min(12, inProgress.length * 4);
    reasons.push(`${inProgress.length} active project${inProgress.length > 1 ? "s" : ""}`);
  }
  if (overdueProjects.length) {
    score -= Math.min(20, overdueProjects.length * 10);
    reasons.push(`${overdueProjects.length} project past deadline`);
  }
  if (projects.length === 0) {
    reasons.push("No projects linked");
  }

  const paid = invoices.filter((inv) => inv.status === "paid" || inv.paid_at);
  const overdueInvoices = invoices.filter((inv) => {
    if (inv.status === "paid" || inv.paid_at) return false;
    if (inv.status === "overdue") return true;
    if (!inv.due_date) return false;
    const d = Date.parse(inv.due_date);
    return Number.isFinite(d) && d < now;
  });
  const openInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && !inv.paid_at && !overdueInvoices.includes(inv),
  );

  if (paid.length) {
    score += Math.min(24, paid.length * 8);
    reasons.push(`${paid.length} paid invoice${paid.length > 1 ? "s" : ""}`);
  }
  if (overdueInvoices.length) {
    score -= Math.min(30, overdueInvoices.length * 15);
    reasons.push(`${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? "s" : ""}`);
  }
  if (openInvoices.length) {
    reasons.push(`${openInvoices.length} invoice${openInvoices.length > 1 ? "s" : ""} awaiting payment`);
  }
  if (invoices.length === 0) {
    reasons.push("No invoices linked");
  }

  // Paid ratio bonus when there is invoice history
  if (invoices.length >= 2 && paid.length === invoices.length) {
    score += 10;
    reasons.push("100% invoice pay rate");
  }

  score = Math.max(0, Math.min(100, score));

  const band: ClientHealthBand =
    score >= 70 ? "healthy" : score >= 40 ? "watch" : "at_risk";

  return { score, band, reasons };
}

export const HEALTH_BAND_LABEL: Record<ClientHealthBand, string> = {
  healthy: "Healthy",
  watch: "Watch",
  at_risk: "At risk",
  new: "New",
};

export const HEALTH_BAND_COLOR: Record<ClientHealthBand, string> = {
  healthy: "text-emerald-400/80 border-emerald-400/20 bg-emerald-400/5",
  watch: "text-amber-400/80 border-amber-400/20 bg-amber-400/5",
  at_risk: "text-red-400/80 border-red-400/20 bg-red-400/5",
  new: "text-white/40 border-white/10 bg-white/[0.03]",
};
