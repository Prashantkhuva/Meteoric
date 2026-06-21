export const STATUS_COLORS = {
  inquiry: "rgba(234,239,255,0.4)",
  discovery: "#38bdf8",
  proposal: "#c8a97e",
  in_progress: "rgba(234,239,255,0.7)",
  completed: "#EAEFFF",
  lost: "#ef4444",
};

export const STATUS_LIST = [
  { value: "inquiry", label: "Inquiry", color: "rgba(234,239,255,0.4)" },
  { value: "discovery", label: "Discovery", color: "#38bdf8" },
  { value: "proposal", label: "Proposal", color: "#c8a97e" },
  { value: "in_progress", label: "In Progress", color: "rgba(234,239,255,0.7)" },
  { value: "completed", label: "Completed", color: "#EAEFFF" },
  { value: "lost", label: "Lost", color: "#ef4444" },
];

export const STATUS_MAP = Object.fromEntries(
  STATUS_LIST.map((s) => [s.value, s])
);

export const BOOKING_STATUS_STYLES = {
  ACCEPTED: "border-emerald-500/25 bg-emerald-500/8 text-emerald-400",
  CANCELLED: "border-red-500/25 bg-red-500/8 text-red-400",
  PENDING: "border-amber-500/25 bg-amber-500/8 text-amber-400",
};

export const SURFACES = {
  body: "bg-[#070707]",
  card: "bg-[#0a0a0a]",
  elevated: "bg-[#121212]",
  overlay: "bg-black/70",
};

export const radii = "rounded-xl";
export const radiiSm = "rounded-lg";
export const radiiFull = "rounded-full";
