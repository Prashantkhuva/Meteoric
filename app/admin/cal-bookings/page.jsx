"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar as CalendarIcon, List, CalendarDays, ExternalLink, UserPlus, X, Phone, Video, MapPin } from "lucide-react"

import { Calendar } from "@/Components/ui/calendar"
import { createClient } from "@/lib/client"

const EM = "\u2014"

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
  if (!d) return EM
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
  if (!d) return EM
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatDateLong(d) {
  if (!d) return EM
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function getMeetingUrl(booking) {
  if (!booking.location) return null
  if (typeof booking.location === "string") {
    if (booking.location.startsWith("http://") || booking.location.startsWith("https://")) return booking.location
    return null
  }
  if (typeof booking.location === "object") {
    if (booking.location.url && (booking.location.url.startsWith("http://") || booking.location.url.startsWith("https://"))) return booking.location.url
    if (booking.location.joinUrl) return booking.location.joinUrl
    if (booking.location.meetingUrl) return booking.location.meetingUrl
  }
  if (booking.metadata?.videoCallUrl) return booking.metadata.videoCallUrl
  return null
}

function getLocationIcon(booking) {
  const loc = booking.location
  if (!loc) return null
  const str = typeof loc === "string" ? loc : loc.type || loc.suite || ""
  const lower = str.toLowerCase()
  if (lower.includes("zoom")) return <Video size={14} />
  if (lower.includes("meet") || lower.includes("google")) return <Video size={14} />
  if (lower.includes("teams") || lower.includes("microsoft")) return <Video size={14} />
  if (lower.includes("phone") || lower.includes("call") || lower.includes("tel")) return <Phone size={14} />
  if (lower.includes("in person") || lower.includes("office")) return <MapPin size={14} />
  return <Video size={14} />
}

export default function CalBookingsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("table")
  const [selectedDate, setSelectedDate] = useState(undefined)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [converting, setConverting] = useState(false)
  const [convertMsg, setConvertMsg] = useState(null)

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
    [bookings],
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

  async function handleConvertToLead(booking) {
    setConverting(true)
    setConvertMsg(null)
    const attendee = booking.attendees?.[0]
    if (!attendee?.email) {
      setConvertMsg({ type: "error", text: "No attendee email found for this booking." })
      setConverting(false)
      return
    }
    try {
      const supabase = createClient()
      const { error: dbErr } = await supabase.from("leads").insert({
        name: attendee.name || "Unknown",
        email: attendee.email,
        phone: attendee.phone || "",
        message: `Booking: ${booking.title || "Untitled"}`,
        status: "new",
        source: "cal.com",
      })
      if (dbErr) {
        setConvertMsg({ type: "error", text: dbErr.message })
      } else {
        setConvertMsg({ type: "success", text: `"${attendee.name || attendee.email}" added as a lead.` })
      }
    } catch (err) {
      setConvertMsg({ type: "error", text: err.message })
    }
    setConverting(false)
  }

  function statusBadge(st) {
    const s = (st || "PENDING").toUpperCase()
    let cls
    if (s === "ACCEPTED") cls = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    else if (s === "CANCELLED") cls = "bg-red-500/10 border-red-500/20 text-red-400"
    else cls = "bg-amber-500/10 border-amber-500/20 text-amber-400"
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${s === "ACCEPTED" ? "bg-emerald-400" : s === "CANCELLED" ? "bg-red-400" : "bg-amber-400"}`} />
        {s}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white/30">
          <div className="h-4 w-4 animate-spin rounded-full border border-[#EAEFFF]/30 border-t-[#EAEFFF]" />
          <span className="text-sm">Loading bookings\u2026</span>
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
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="cursor-pointer border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.015] last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="text-white/80 font-medium">{b.title || EM}</span>
                        {b.description && (
                          <span className="block text-xs text-white/20 mt-0.5 line-clamp-1">{b.description}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {attendee ? (
                          <div className="flex flex-col">
                            <span className="text-white/60 text-xs">{attendee.name || EM}</span>
                            <span className="text-white/30 text-xs">{attendee.email || ""}</span>
                          </div>
                        ) : (
                          <span className="text-white/20 text-xs">{EM}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {statusBadge(b.status)}
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
                          : EM}
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
            <style>{`
              .has-booking .rdp-day_button {
                box-shadow: inset 0 0 0 1px rgba(234, 239, 255, 0.15) !important;
              }
            `}</style>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                hasBooking: (date) => localDateStr(date) in bookingsByDate,
              }}
              modifiersClassNames={{
                hasBooking: "has-booking",
              }}
              components={{
                DayContent: (props) => {
                  const { date } = props
                  const key = localDateStr(date)
                  const count = bookingCountByDate[key]
                  return (
                    <span className="relative flex items-center justify-center w-full h-full">
                      <span className={count > 0 ? "font-semibold text-white/90" : ""}>
                        {date.getDate()}
                      </span>
                      {count > 0 && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          <span className="block h-1 w-1 rounded-full bg-[#EAEFFF]/60" />
                        </span>
                      )}
                    </span>
                  )
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
                  onClick={() => setSelectedBooking(b)}
                  className="group cursor-pointer rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-[#EAEFFF]/20 hover:bg-black/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {statusBadge(b.status)}
                        <span className="text-white/20 text-xs tabular-nums">{b.duration ? `${b.duration} min` : EM}</span>
                      </div>
                      <h3 className="text-white/80 font-medium truncate">{b.title || "Untitled Booking"}</h3>
                      {attendee && (
                        <p className="text-white/30 text-xs mt-1">
                          {attendee.name}{attendee.email ? ` \u00b7 ${attendee.email}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white/60 text-sm font-medium tabular-nums">{formatTime(b.start)}</p>
                      <p className="text-white/30 text-xs tabular-nums">{formatTime(b.end)}</p>
                    </div>
                  </div>

                  {(b.description || b.location) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.description && <span className="text-white/15 text-xs">{b.description}</span>}
                      {b.location && (
                        <span className="inline-flex items-center gap-1 text-white/25 text-xs">
                          {getLocationIcon(b)}
                          {typeof b.location === "string" ? b.location : b.location.type || "Meeting"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setSelectedBooking(null); setConvertMsg(null) }}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-[#EAEFFF]/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between border-b border-[#EAEFFF]/8 px-6 py-4">
              <h2 className="text-lg font-semibold text-white/90 truncate pr-4">
                {selectedBooking.title || "Booking Details"}
              </h2>
              <button
                onClick={() => { setSelectedBooking(null); setConvertMsg(null) }}
                className="flex-shrink-0 rounded-lg p-1.5 text-white/30 transition-all hover:bg-[#EAEFFF]/10 hover:text-white/60"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {(() => {
                const b = selectedBooking
                const attendee = b.attendees?.[0]
                const meetingUrl = getMeetingUrl(b)
                const st = (b.status || "PENDING").toUpperCase()

                return (
                  <>
                    <div className="flex items-center gap-3">
                      {statusBadge(b.status)}
                      <span className="text-white/20 text-xs tabular-nums">
                        {b.duration ? `${b.duration} min` : b.start && b.end
                          ? `${Math.round((new Date(b.end) - new Date(b.start)) / 60000)} min`
                          : EM}
                      </span>
                    </div>

                    {attendee && (
                      <div className="rounded-xl border border-[#EAEFFF]/8 bg-white/[0.02] p-4">
                        <p className="text-xs text-white/20 uppercase tracking-wider mb-2">Attendee</p>
                        <p className="text-white/80 font-medium">{attendee.name || "Unknown"}</p>
                        <p className="text-white/30 text-sm mt-0.5">{attendee.email || ""}</p>
                        {attendee.phone && <p className="text-white/20 text-xs mt-1">{attendee.phone}</p>}
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-white/20 uppercase tracking-wider mb-2">Date &amp; Time</p>
                      <p className="text-white/80 font-medium">{formatDateLong(b.start)}</p>
                      <p className="text-white/40 text-sm mt-1">
                        {formatTime(b.start)} <span className="text-white/20">&ndash;</span> {formatTime(b.end)}
                      </p>
                    </div>

                    {b.description && (
                      <div>
                        <p className="text-xs text-white/20 uppercase tracking-wider mb-2">Notes</p>
                        <p className="text-white/50 text-sm leading-relaxed">{b.description}</p>
                      </div>
                    )}

                    {b.location && (
                      <div className="rounded-xl border border-[#EAEFFF]/8 bg-white/[0.02] p-4">
                        <p className="text-xs text-white/20 uppercase tracking-wider mb-2">Location</p>
                        <p className="text-white/50 text-sm">
                          {typeof b.location === "string" ? b.location : b.location.type || "Meeting"}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                      {meetingUrl && (
                        <a
                          href={meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/30"
                        >
                          <ExternalLink size={16} />
                          Join Meeting
                        </a>
                      )}

                      {attendee?.email && (
                        <button
                          onClick={() => handleConvertToLead(b)}
                          disabled={converting}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAEFFF]/15 bg-[#EAEFFF]/5 px-4 py-2.5 text-sm font-medium text-[#EAEFFF]/80 transition-all hover:bg-[#EAEFFF]/10 hover:border-[#EAEFFF]/25 disabled:opacity-50"
                        >
                          <UserPlus size={16} />
                          {converting ? "Converting..." : "Convert to Lead"}
                        </button>
                      )}
                    </div>

                    {convertMsg && (
                      <div
                        className={`rounded-xl border px-4 py-3 text-sm ${
                          convertMsg.type === "success"
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                            : "border-red-500/20 bg-red-500/5 text-red-400"
                        }`}
                      >
                        {convertMsg.text}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
