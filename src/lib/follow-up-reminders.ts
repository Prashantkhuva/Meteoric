import { createServiceClient } from "@/lib/supabase/service";
import { createNotification, NOTIFICATION_TYPES } from "@/lib/notifications";
import { sendFollowUpReminder } from "@/lib/email/email";

// Follow-up times are stored as IST wall time (Asia/Kolkata, UTC+5:30).
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Reminder windows. Cron runs every 5 minutes; each closed window is exactly
// 5 minutes wide so every schedule grid point falls inside at least one
// window (no reminder can be skipped between two runs).
const WINDOWS = [
  { leadMinutes: 15, min: 10, max: 15 },
  { leadMinutes: 5, min: 0, max: 5 },
] as const;

const EXCLUDED_STATUSES = ["completed", "lost"];

function formatWhen(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const ampm = hh >= 12 ? "PM" : "AM";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${d} ${months[m - 1]} ${y}, ${hour12}:${String(mm).padStart(2, "0")} ${ampm} IST`;
}

export async function checkFollowUpReminders(): Promise<{
  checked: number;
  sent: number;
  errors: string[];
}> {
  const errors: string[] = [];
  const supabase = createServiceClient();
  if (!supabase) return { checked: 0, sent: 0, errors: ["Service client unavailable"] };

  const now = Date.now();
  const todayIst = new Date(now + IST_OFFSET_MS).toISOString().slice(0, 10);

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, company, follow_up_at, follow_up_time, follow_up_note, status")
    .eq("follow_up_at", todayIst)
    .not("follow_up_time", "is", null)
    .not("status", "in", `(${EXCLUDED_STATUSES.join(",")})`);

  if (error) {
    return { checked: 0, sent: 0, errors: [error.message] };
  }

  let sent = 0;
  for (const lead of leads || []) {
    const time = lead.follow_up_time;
    if (!time) continue;

    const targetUtc = Date.parse(`${lead.follow_up_at}T${time}:00+05:30`);
    if (Number.isNaN(targetUtc)) continue;

    const minutesUntil = (targetUtc - now) / 60000;

    for (const w of WINDOWS) {
      if (minutesUntil < w.min || minutesUntil > w.max) continue;

      const name = lead.name || "Lead";
      const when = formatWhen(lead.follow_up_at!, time);
      const dedupeKey = `followup_${w.leadMinutes}m:${lead.id}:${lead.follow_up_at}`;

      const inserted = await createNotification({
        type: NOTIFICATION_TYPES.LEAD_FOLLOW_UP,
        title: `Follow-up with ${name} in ${w.leadMinutes} min`,
        body: lead.follow_up_note
          ? `${when} · ${lead.follow_up_note}`
          : when,
        entityType: "lead",
        entityId: lead.id,
        dedupeKey,
      });

      if (!inserted) continue;

      try {
        await sendFollowUpReminder(
          { name: lead.name, company: lead.company },
          when,
          w.leadMinutes,
          lead.follow_up_note,
        );
        sent++;
      } catch (err) {
        errors.push(`email lead ${lead.id}: ${(err as Error).message}`);
      }
    }
  }

  return { checked: leads?.length ?? 0, sent, errors };
}
