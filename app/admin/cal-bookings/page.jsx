"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar as CalendarIcon, List, CalendarDays, ExternalLink, UserPlus, X } from "lucide-react"
import { Calendar } from "@/Components/ui/calendar"
import { createClient } from "@/lib/client"
import { formatDate, formatShort, formatTime, formatDateLong } from "@/lib/admin"
import { cn } from "@/lib/utils"
import { useToast } from "../_components/ToastContext"
import { BookingStatusBadge } from "../_components/StatusBadge"
import { Toolbar, FilterChip, ClearFiltersButton } from "../_components/Toolbar"

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

function getLocationLabel(booking) {
  const loc = booking.location
  if (!loc) return null
  if (typeof loc === "string") return loc
  return loc.type || "Meeting"
}

export default function CalBookingsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("table")
  const [selectedDate, setSelectedDate] = useState(undefined)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showConvertForm, setShowConvertForm] = useState(false)
  const [converting, setConverting] = useState(false)
  const [convertMsg, setConvertMsg] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const addToast = useToast()

  useEffect(() => {
    fetchBookings().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const bookings = useMemo(() => data?.bookings || [], [data?.bookings])
  const error = data?.error

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.start) - new Date(a.start)),
    [bookings],
  )

  const filteredBookings = useMemo(() => {
    let result = sortedBookings
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((b) =>
        (b.title?.toLowerCase() || "").includes(q) ||
        b.attendees?.some((a) =>
          (a.name?.toLowerCase() || "").includes(q) || (a.email?.toLowerCase() || "").includes(q)
        )
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((b) => (b.status || "PENDING").toUpperCase() === statusFilter)
    }
    return result
  }, [sortedBookings, search, statusFilter])

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

  async function handleConvertToLead(e) {
    e.preventDefault()
    setConverting(true)
    setConvertMsg(null)
    const fd = new FormData(e.target)
    try {
      const supabase = createClient()
      const { error: dbErr } = await supabase.from("leads").insert({
        name: fd.get("name") || "Unknown",
        email: fd.get("email") || "",
        phone: fd.get("phone") || "",
        company: fd.get("company") || "",
        services: fd.get("services") || "",
        details: fd.get("details") || "",
        budget: fd.get("budget") || "",
        status: "new",
      })
      if (dbErr) {
        setConvertMsg({ type: "error", text: dbErr.message })
      } else {
        setConvertMsg({ type: "success", text: "Lead added successfully." })
        addToast("Lead created from booking", "success")
        setTimeout(() => { setShowConvertForm(false); setConvertMsg(null) }, 1500)
      }
    } catch (err) {
      setConvertMsg({ type: "error", text: err.message })
    }
    setConverting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 lg:p-8">
        <div className="flex items-center gap-3 text-white/40">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
          <span className="text-sm">Loading bookings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Bookings</h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">
            {bookings.length
              ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
              : "Cal.com integration"}
          </p>
        </div>
        {bookings.length > 0 && (
          <div className="flex items-center border border-white/[0.06] bg-[#0a0a0a] p-0.5" role="radiogroup" aria-label="View mode">
            <button
              onClick={() => setView("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all",
                view === "table" ? "bg-[#EAEFFF]/10 text-[#EAEFFF]" : "text-white/35 hover:text-white/70"
              )}
              role="radio"
              aria-checked={view === "table"}
            >
              <List size={14} />
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all",
                view === "calendar" ? "bg-[#EAEFFF]/10 text-[#EAEFFF]" : "text-white/35 hover:text-white/70"
              )}
              role="radio"
              aria-checked={view === "calendar"}
            >
              <CalendarDays size={14} />
              Calendar
            </button>
          </div>
        )}
      </div>

      {!data && !loading && (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-8 text-center">
          <p className="text-sm text-white/40">
            Set <code className="text-[#EAEFFF]/60">CALCOM_API_KEY</code> in Vercel env vars to fetch bookings.
          </p>
        </div>
      )}

      {error && (
        <div className="border border-red-500/10 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      )}

      {!error && bookings.length === 0 && data && (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <p className="text-sm text-white/25">No bookings yet.</p>
        </div>
      )}

      {view === "table" && bookings.length > 0 && (
        <>
          <Toolbar search={search} onSearchChange={setSearch} resultCount={filteredBookings.length}>
            <ClearFiltersButton onClick={() => { setSearch(""); setStatusFilter("all"); }} visible={!!search || statusFilter !== "all"} />
            <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All</FilterChip>
            {["ACCEPTED", "PENDING", "CANCELLED"].map((s) => (
              <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </FilterChip>
            ))}
          </Toolbar>
          <BookingsTable bookings={filteredBookings} onSelect={setSelectedBooking} />
        </>
      )}

      {view === "calendar" && bookings.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="border border-white/[0.06] bg-[#0a0a0a] p-4">
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
                <div className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-white/25 text-center">
                  {selectedDate
                    ? `${selectedDayBookings.length} booking${selectedDayBookings.length !== 1 ? "s" : ""} on this day`
                    : "Select a day to view bookings"}
                </div>
              }
            />
          </div>

          <div className="space-y-3">
            {!selectedDate && (
              <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
                <CalendarDays size={32} className="mx-auto text-white/10 mb-2" />
                <p className="text-sm text-white/25">Select a date on the calendar</p>
              </div>
            )}

            {selectedDate && selectedDayBookings.length === 0 && (
              <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
                <p className="text-sm text-white/25">No bookings for {formatShort(selectedDate)}</p>
              </div>
            )}

            {selectedDayBookings.map((b) => {
              const attendee = b.attendees?.[0]
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="group cursor-pointer border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all hover:border-white/[0.10]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <BookingStatusBadge status={b.status} />
                        <span className="text-white/30 text-xs tabular-nums">
                          {b.duration ? `${b.duration} min` : EM}
                        </span>
                      </div>
                      <h3 className="text-sm text-white/80 font-medium truncate">{b.title || "Untitled Booking"}</h3>
                      {attendee && (
                        <p className="text-xs text-white/30 mt-1">
                          {attendee.name}{attendee.email ? ` \u00b7 ${attendee.email}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-white/60 font-medium tabular-nums">{formatTime(b.start)}</p>
                      <p className="text-xs text-white/30 tabular-nums">{formatTime(b.end)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedBooking && (
        <BookingDetailDialog
          booking={selectedBooking}
          onClose={() => { setSelectedBooking(null); setConvertMsg(null); setShowConvertForm(false) }}
          showConvertForm={showConvertForm}
          setShowConvertForm={setShowConvertForm}
          handleConvertToLead={handleConvertToLead}
          converting={converting}
          convertMsg={convertMsg}
        />
      )}
    </div>
  )
}

function BookingsTable({ bookings, onSelect }) {
  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Title</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Attendee</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Date</th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Duration</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-white/20">
                  No bookings match your filters
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const attendee = b.attendees?.[0]
                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelect(b)}
                    className="cursor-pointer border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-white/80 font-medium">{b.title || EM}</span>
                      {b.description && (
                        <span className="block text-xs text-white/25 mt-0.5 line-clamp-1">{b.description}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {attendee ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-white/60">{attendee.name || EM}</span>
                          <span className="text-xs text-white/30">{attendee.email || ""}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/25">{EM}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/30 tabular-nums">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon size={11} className="text-white/30" />
                        {formatDate(b.start)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/30 tabular-nums">
                      {b.duration ? `${b.duration} min` : b.start && b.end
                        ? `${Math.round((new Date(b.end) - new Date(b.start)) / 60000)} min`
                        : EM}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BookingDetailDialog({ booking, onClose, showConvertForm, setShowConvertForm, handleConvertToLead, converting, convertMsg, setConvertMsg }) {
  const attendee = booking.attendees?.[0]
  const meetingUrl = getMeetingUrl(booking)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-lg border border-white/[0.08] bg-[#0c0c0c] shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#0c0c0c] px-6 py-4 z-10">
          <h2 id="booking-detail-title" className="text-base font-semibold text-white/90 truncate pr-4">
            {booking.title || "Booking Details"}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex items-center gap-3">
            <BookingStatusBadge status={booking.status} />
            <span className="text-xs text-white/25 tabular-nums">
              {booking.duration ? `${booking.duration} min` : EM}
            </span>
          </div>

          {attendee && (
            <div className="border border-white/[0.06] bg-white/[0.015] p-4">
              <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-2">Attendee</p>
              <p className="text-sm text-white/80 font-medium">{attendee.name || "Unknown"}</p>
              <p className="text-xs text-white/40 mt-0.5">{attendee.email || ""}</p>
              {attendee.phone && <p className="text-xs text-white/25 mt-1">{attendee.phone}</p>}
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-2">Date &amp; Time</p>
            <p className="text-sm text-white/80 font-medium">{formatDateLong(booking.start)}</p>
            <p className="text-xs text-white/45 mt-1">
              {formatTime(booking.start)} <span className="text-white/25">&ndash;</span> {formatTime(booking.end)}
            </p>
          </div>

          {booking.description && (
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-2">Notes</p>
              <p className="text-sm text-white/50 leading-relaxed">{booking.description}</p>
            </div>
          )}

          {booking.location && (
            <div className="border border-white/[0.06] bg-white/[0.015] p-4">
              <p className="text-[10px] font-semibold tracking-wider text-white/25 uppercase mb-2">Location</p>
              <p className="text-sm text-white/50">
                {getLocationLabel(booking)}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            {meetingUrl && (
              <a
                href={meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/30"
              >
                <ExternalLink size={16} />
                Join Meeting
              </a>
            )}

            {attendee?.email && !showConvertForm && (
              <button
                onClick={() => setShowConvertForm(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-sm font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
              >
                <UserPlus size={16} />
                Convert to Lead
              </button>
            )}
          </div>

          {showConvertForm && (
            <form onSubmit={handleConvertToLead} className="space-y-4 pt-2 border-t border-white/[0.06]">
              <p className="text-xs font-semibold tracking-wider text-white/30 uppercase">New Lead</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="conv-name" className="block text-[10px] font-medium text-white/35 uppercase mb-1">Name *</label>
                  <input
                    id="conv-name"
                    name="name"
                    defaultValue={attendee?.name || ""}
                    required
                    className="w-full border border-white/[0.06] bg-black/60 px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
                  />
                </div>
                <div>
                  <label htmlFor="conv-email" className="block text-[10px] font-medium text-white/35 uppercase mb-1">Email *</label>
                  <input
                    id="conv-email"
                    name="email"
                    type="email"
                    defaultValue={attendee?.email || ""}
                    required
                    className="w-full border border-white/[0.06] bg-black/60 px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
                  />
                </div>
                <div>
                  <label htmlFor="conv-phone" className="block text-[10px] font-medium text-white/35 uppercase mb-1">Phone</label>
                  <input
                    id="conv-phone"
                    name="phone"
                    defaultValue={attendee?.phone || ""}
                    className="w-full border border-white/[0.06] bg-black/60 px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
                  />
                </div>
                <div>
                  <label htmlFor="conv-company" className="block text-[10px] font-medium text-white/35 uppercase mb-1">Company</label>
                  <input
                    id="conv-company"
                    name="company"
                    className="w-full border border-white/[0.06] bg-black/60 px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
                    placeholder="e.g. Acme Inc"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="conv-services" className="block text-[10px] font-medium text-white/35 uppercase mb-1">Services</label>
                <input
                  id="conv-services"
                  name="services"
                  className="w-full border border-white/[0.06] bg-black/60 px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
                  placeholder="e.g. Web Design, SEO"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="conv-budget" className="block text-[10px] font-medium text-white/35 uppercase mb-1">Budget</label>
                  <input
                    id="conv-budget"
                    name="budget"
                    className="w-full border border-white/[0.06] bg-black/60 px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
                    placeholder="e.g. $5k-$10k"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowConvertForm(false); setConvertMsg(null) }}
                    className="flex-1 border border-white/[0.08] px-4 py-2.5 text-sm text-white/45 transition-all hover:bg-white/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={converting}
                    className="flex-1 bg-[#EAEFFF] px-4 py-2.5 text-sm font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
                  >
                    {converting ? "Saving..." : "Save Lead"}
                  </button>
                </div>
              </div>
              {convertMsg && (
                <div
                  className={cn(
                    "border px-4 py-3 text-sm",
                    convertMsg.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                      : "border-red-500/20 bg-red-500/5 text-red-400"
                  )}
                >
                  {convertMsg.text}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
