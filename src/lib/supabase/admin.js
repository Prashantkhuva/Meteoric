export const STATUS = {
  new: { label: "New", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  contacted: { label: "Contacted", color: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)" },
  qualified: { label: "Qualified", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  proposal: { label: "Proposal", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
  won: { label: "Won", color: "#EAEFFF", bg: "rgba(234,239,255,0.08)", border: "rgba(234,239,255,0.2)" },
  lost: { label: "Lost", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
};

export const BOOKING_STATUS = {
  ACCEPTED: { label: "Accepted", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  CANCELLED: { label: "Cancelled", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  PENDING: { label: "Pending", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
};

export function getStatus(s) {
  return STATUS[s] || STATUS.new;
}

export function getBookingStatus(s) {
  const key = (s || "PENDING").toUpperCase();
  return BOOKING_STATUS[key] || BOOKING_STATUS.PENDING;
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  };
  if (opts.time !== false) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return d.toLocaleDateString("en-US", options);
}

export function formatShort(dateStr) {
  if (!dateStr) return "\u2014";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateLong(d) {
  if (!d) return "\u2014";
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const funnelStages = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Won" },
];

export const SIDEBAR_WIDTH_EXPANDED = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 60;
