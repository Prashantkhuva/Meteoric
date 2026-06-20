"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar as CalendarIcon, List, CalendarDays } from "lucide-react"

import { Calendar } from "@/Components/ui/calendar"

function localDateStr(d) {
  if (!d) return ""
  try {
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  } catch {
    return ""
  }
}

async function fetchBookings() {
  try {
    const res = await fetch("/api/cal-bookings", { cache: "no-store" })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { error: err.error || `API error: ${res.status}` }
    }
    return await res.json()
  } catch (err) {
    return { error: err.message }
  }
}

function formatDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatTime(d) {
  if (!d) return ""
  return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

function formatShort(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function CalBookingsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("table")
  const [selectedDate, setSelectedDate] = useState(undefined)

  useEffect(() => {
    fetchBookings().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const bookings = data?.bookings || []
  const error = data?.error

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.start) - new Date(a.start)),
    [bookings]
  )

  const bookingsByDate = useMemo(() => {
    const map = {}
    sortedBookings.forEach((b) => {
      const d = localDateStr(b.start)
      if (!map[d]) map[d] = []
      map[d].push(b)
    })
    return map
  }, [sortedBookings])

  const bookingCountByDate = useMemo(() => {
    const map = {}
    sortedBookings.forEach((b) => {
      const d = localDateStr(b.start)
      map[d] = (map[d] || 0) + 1
    })
    return map
  }, [sortedBookings])

  const selectedKey = selectedDate ? localDateStr(selectedDate) : ""
  const selectedDayBookings = selectedKey ? (bookingsByDate[selectedKey] || []) : []

  const statusColor = (s) => {
    const st = (s || "").toUpperCase()
    if (st === "ACCEPTED") return "text-emerald-400"
    if (st === "CANCELLED") return "text-red-400"
    return "text-amber-400"
  }

  const statusBg = (s) => {
    const st = (s || "").toUpperCase()
    if (st === "ACCEPTED") return "bg-emerald-500/10 border-emerald-500/20"
    if (st === "CANCELLED") return "bg-red-500/10 border-red-500/20"
    return "bg-amber-500/10 border-amber-500/20"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white/30">
          <div className="h-4 w-4 animate-spin rounded-full border border-[#EAEFFF]/30 border-t-[#EAEFFF]" />
          <span className="text-sm">Loading bookings…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Bookings</h1>
          <p className="mt-1 text-sm text-white/40">
            {bookings.length
              ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
              : "Cal.com integration"}
          </p>
        </div>
        {bookings.length > 0 && (
          <div className="flex items-center gap-1 rounded-xl border border-[#EAEFFF]/10 bg-black/40 p-1">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                view === "table" ? "bg-[#EAEFFF]/10 text-[#EAEFFF]" : "text-white/30 hover:text-white/60"
              }`}
            >
              <List size={14} />
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                view === "calendar" ? "bg-[#EAEFFF]/10 text-[#EAEFFF]" : "text-white/30 hover:text-white/60"
              }`}
            >
              <CalendarDays size={14} />
              Calendar
            </button>
          </div>
        )}
      </div>

      {!data && !loading && (
        <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
          <p className="text-sm text-white/30">
            Set <code className="text-[#EAEFFF]/60">CALCOM_API_KEY</code> in Vercel env vars to fetch bookings.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      )}

      {!error && bookings.length === 0 && data && (
        <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
          <p className="text-sm text-white/20">No bookings yet.</p>
        </div>
      )}

      {view === "table" && bookings.length > 0 && (
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
                {sortedBookings.map((b) => {
                  const attendee = b.attendees?.[0]
                  const st = (b.status || "PENDING").toUpperCase()
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
  )
}
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusBg(b.status)} ${statusColor(b.status)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusColor(b.status).replace("text-", "bg-")}`} />
                          {st}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon size={11} />
                          {formatDate(b.start)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                        {b.duration ? `${b.duration} min` : b.start && b.end
                          ? `${Math.round((new Date(b.end) - new Date(b.start)) / 60000)} min`
                          : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "calendar" && bookings.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
            <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  hasBooking: (date) => {
                    return localDateStr(date) in bookingsByDate
                  },
                }}
                modifiersClassNames={{
                  hasBooking: "has-booking",
                }}
                modifiersStyles={{
                  hasBooking: {
                    fontWeight: "600",
                    color: "rgba(234,239,255,0.9)",
                  },
                }}
                footer={
                  <div className="mt-3 border-t border-[#EAEFFF]/8 pt-3 text-xs text-white/20 text-center">
                    {selectedDate
                      ? `${selectedDayBookings.length} booking${selectedDayBookings.length !== 1 ? "s" : ""} on this day`
                      : "Select a day to view bookings"}
                  </div>
                }
              />
            </div>

            <div className="space-y-3">
              {!selectedDate && (
                <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
                  <CalendarDays size={32} className="mx-auto text-white/10 mb-2" />
                  <p className="text-sm text-white/20">Select a date on the calendar</p>
                </div>
              )}

              {selectedDate && selectedDayBookings.length === 0 && (
                <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
                  <p className="text-sm text-white/20">No bookings for {formatShort(selectedDate)}</p>
                </div>
              )}

              {selectedDayBookings.map((b) => {
                const attendee = b.attendees?.[0]
                const st = (b.status || "PENDING").toUpperCase()
                return (
                  <div
                    key={b.id}
                    className="group cursor-pointer rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-[#EAEFFF]/20 hover:bg-black/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBg(b.status)} ${statusColor(b.status)}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusColor(b.status).replace("text-", "bg-")}`} />
                            {st}
                          </span>
                          <span className="text-white/20 text-xs tabular-nums">{b.duration ? `${b.duration} min` : "—"}</span>
    </div>
  )
}
                        <h3 className="text-white/80 font-medium truncate">{b.title || "Untitled Booking"}</h3>
                        {attendee && (
                          <p className="text-white/30 text-xs mt-1">
                            {attendee.name}{attendee.email ? ` · ${attendee.email}` : ""}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/60 text-sm font-medium tabular-nums">
                          {formatTime(b.start)}
                        </p>
                        <p className="text-white/20 text-xs tabular-nums">— {formatTime(b.end)}</p>
                      </div>
                    </div>

                    {(b.description || b.location) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {b.description && (
                          <span className="text-white/15 text-xs">{b.description}</span>
                        )}
                        {b.location && (
                          <span className="text-white/15 text-xs">{b.location?.type || b.location}</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
      )}
    </div>
  )
}
