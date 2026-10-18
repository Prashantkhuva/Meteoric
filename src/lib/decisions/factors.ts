const RUNNER_UP_MARGIN = 0.2;

function fmtDate(date: string) {
  return date;
}

function isOverdue(dateStr: string, timeStr: string | null) {
  const time = timeStr && /^\d{2}:\d{2}$/.test(timeStr) ? timeStr : "23:59";
  const due = new Date(`${dateStr}T${time}:00`);
  if (Number.isNaN(due.getTime())) return false;
  return due.getTime() < Date.now();
}

function truncate(text: string, max = 60) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function explainFactors(
  lead: Record<string, any>,
  result: Record<string, any>,
): string[] {
  const factors: string[] = [];

  if (lead?.budget) factors.push(`budget: ${truncate(String(lead.budget))}`);
  if (lead?.services) factors.push(`services: ${truncate(String(lead.services))}`);
  if (lead?.timeline) factors.push(`timeline: ${truncate(String(lead.timeline))}`);

  if (lead?.follow_up_at) {
    const overdue = isOverdue(String(lead.follow_up_at), lead?.follow_up_time || null);
    const status = lead?.follow_up_status ? ` (${lead.follow_up_status})` : "";
    factors.push(
      `follow-up: ${overdue ? "overdue since" : "scheduled"} ${fmtDate(String(lead.follow_up_at))}${status}`,
    );
  } else if (lead?.follow_up_note) {
    factors.push(`follow-up note: ${truncate(String(lead.follow_up_note), 80)}`);
  }

  const details = String(lead?.details || "").trim();
  if (details.length >= 80) factors.push(`details: ${details.length} chars of context`);
  else if (details) factors.push(`details: ${truncate(details)}`);

  const quality = result?.quality;
  const probs = result?.probabilities?.quality;
  if (quality && probs && typeof probs === "object") {
    const entries = Object.entries(probs as Record<string, number>)
      .filter(([k]) => k !== quality)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0));
    const runner = entries[0];
    if (runner && (runner[1] || 0) > 0 && (probs as Record<string, number>)[quality] - runner[1] < RUNNER_UP_MARGIN) {
      factors.push(`close call: ${quality} vs ${runner[0]} (${Math.round(runner[1] * 100)}% runner-up)`);
    }
  }

  if (factors.length === 0) {
    factors.push("sparse input: little context beyond contact fields");
  }

  return factors.slice(0, 3);
}
