import { Calendar } from "lucide-react";

const CAL_API = "https://api.cal.com/v2";

async function getBookings() {
  const key = process.env.CALCOM_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${CAL_API}/bookings`, {
      headers: {
        Authorization: `Bearer ${key}`,
        "cal-api-version": "2024-08-13",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { error: `Cal.com API error: ${res.status}` };
    const json = await res.json();
    const bookings = json.data || json.bookings || [];
    return { bookings };
  } catch (err) {
    return { error: err.message };
  }
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CalBookingsPage() {
  const result = await getBookings();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Bookings</h1>
        <p className="mt-1 text-sm text-white/40">
          {result?.bookings
            ? `${result.bookings.length} booking${result.bookings.length !== 1 ? "s" : ""}`
            : "Cal.com integration"}
        </p>
      </div>

      {!result && (
        <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
          <p className="text-sm text-white/30">
            Set <code className="text-[#EAEFFF]/60">CALCOM_API_KEY</code> in Vercel env vars to fetch bookings.
          </p>
        </div>
      )}

      {result?.error && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400/80">{result.error}</p>
        </div>
      )}

      {result?.bookings && result.bookings.length === 0 && (
        <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
          <p className="text-sm text-white/20">No bookings yet.</p>
        </div>
      )}

      {result?.bookings && result.bookings.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md">
          <div className="absolute -top-40 -right-40 h-60 w-60 rounded-full bg-[#EAEFFF]/[0.015] blur-[80px]" />
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EAEFFF]/8">
                  <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Title</th>
                  <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Attendee</th>
                  <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Status</th>
                  <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Date</th>
                  <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Duration</th>
                </tr>
              </thead>
              <tbody>
                {result.bookings.map((b) => {
                  const attendee = b.attendees?.[0];
                  const status = (b.status || "PENDING").toUpperCase();
                  return (
                    <tr key={b.id} className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.015] last:border-0">
                      <td className="px-5 py-4">
                        <span className="text-white/80 font-medium">{b.title || "—"}</span>
                        {b.description && (
                          <span className="block text-xs text-white/20 mt-0.5 line-clamp-1">{b.description}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {attendee ? (
                          <div className="flex flex-col">
                            <span className="text-white/60 text-xs">{attendee.name || "—"}</span>
                            <span className="text-white/30 text-xs">{attendee.email || ""}</span>
                          </div>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                          status === "ACCEPTED" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                          status === "CANCELLED" ? "border-red-500/20 bg-red-500/5 text-red-400" :
                          "border-amber-500/20 bg-amber-500/5 text-amber-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            status === "ACCEPTED" ? "bg-emerald-400" :
                            status === "CANCELLED" ? "bg-red-400" : "bg-amber-400"
                          }`} />
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={11} />
                          {formatDate(b.startTime)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                        {b.startTime && b.endTime
                          ? `${Math.round((new Date(b.endTime) - new Date(b.startTime)) / 60000)} min`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
