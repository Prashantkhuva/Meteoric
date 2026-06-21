export const STATUS_COLORS = {
  new: "#34d399",
  contacted: "#38bdf8",
  qualified: "#7c6aff",
  proposal: "#c8a97e",
  won: "#EAEFFF",
  lost: "#ef4444",
};

export const STATUS_LIST = [
  { value: "new", label: "New", color: "#34d399" },
  { value: "contacted", label: "Contacted", color: "#38bdf8" },
  { value: "qualified", label: "Qualified", color: "#7c6aff" },
  { value: "proposal", label: "Proposal", color: "#c8a97e" },
  { value: "won", label: "Won", color: "#EAEFFF" },
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
