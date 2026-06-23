"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Calendar as CalendarIcon, List, CalendarDays, ExternalLink, UserPlus, X, Download, ChevronUp, ChevronDown } from "lucide-react"
import { Calendar } from "@/Components/ui/calendar"
import { createLeadFromBooking } from "../actions"
import { formatDate, formatShort, formatTime, formatDateLong } from "@/lib/admin"
import { cn } from "@/lib/utils"
import { useToast } from "../_components/ToastContext"
import { BookingStatusBadge } from "../_components/StatusBadge"
import { Toolbar, FilterChip, ClearFiltersButton, SortDropdown } from "../_components/Toolbar"
import { useFilters } from "../_components/useFilters"
import { useFocusTrap } from "../_components/useFocusTrap"
import { useShortcuts } from "../_components/useShortcuts"
import { downloadCSV } from "../_components/csv-export"

const EM = "\u2014"

const CSV_COLUMNS = [
  { label: "Title", accessor: (b) => b.title || "" },
  { label: "Attendee Name", accessor: (b) => b.attendees?.[0]?.name || "" },
  { label: "Attendee Email", accessor: (b) => b.attendees?.[0]?.email || "" },
  { label: "Status", accessor: (b) => b.status || "" },
  { label: "Date", accessor: (b) => formatDate(b.start) },
  { label: "Duration (min)", accessor: (b) => b.duration || "" },
  { label: "Description", accessor: (b) => b.description || "" },
]

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

function SortIcon({ column, col, dir }) {
  if (col !== column) return null;
  return dir === "asc" ? (
    <ChevronUp size={11} className="inline ml-0.5 text-[#EAEFFF]" />
  ) : (
    <ChevronDown size={11} className="inline ml-0.5 text-[#EAEFFF]" />
  );
}

export default function CalBookingsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("table")
  const [selectedDate, setSelectedDate] = useState(undefined)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showConvertForm, setShowConvertForm] = useState(false)
  const [formResetKey, setFormResetKey] = useState(0)
  const [converting, setConverting] = useState(false)
  const [convertMsg, setConvertMsg] = useState(null)
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, status: statusFilter, sort, col, dir } = filters;
  const addToast = useToast()
  const searchRef = useRef(null);

  useEffect(() => {
    fetchBookings().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const bookings = useMemo(() => data?.bookings || [], [data?.bookings])
  const error = data?.error

  const sortedBookings = useMemo(() => {
    let result = [...bookings]
    if (sort === "oldest") {
      result.sort((a, b) => new Date(a.start) - new Date(b.start))
    } else if (sort === "name") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    } else if (sort === "status") {
      result.sort((a, b) => (a.status || "").localeCompare(b.status || ""))
    } else {
      result.sort((a, b) => new Date(b.start) - new Date(a.start))
    }
    if (col && dir) {
      result.sort((a, b) => {
        let va, vb;
        switch (col) {
          case "title":
            va = (a.title || "").toLowerCase(); vb = (b.title || "").toLowerCase();
            return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
          case "attendee":
            va = (a.attendees?.[0]?.name || "").toLowerCase();
            vb = (b.attendees?.[0]?.name || "").toLowerCase();
            return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
          case "status":
            va = (a.status || "").toLowerCase(); vb = (b.status || "").toLowerCase();
            return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
          case "date":
            va = new Date(a.start).getTime(); vb = new Date(b.start).getTime();
            return dir === "asc" ? va - vb : vb - va;
          case "duration":
            va = a.duration || 0; vb = b.duration || 0;
            return dir === "asc" ? va - vb : vb - va;
          default:
            return 0;
        }
      });
    }
    return result
  }, [bookings, sort, col, dir])

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

  useShortcuts(
    useMemo(() => ({
      "/": () => searchRef.current?.focus(),
      "Escape": () => { if (selectedBooking) setSelectedBooking(null); },
    }), [selectedBooking])
  );

  const handleExportCSV = useCallback(() => {
    downloadCSV(filteredBookings, CSV_COLUMNS, "bookings");
  }, [filteredBookings]);

  async function handleConvertToLead(e) {
    e.preventDefault()
    setConverting(true)
    setConvertMsg(null)
    try {
      await createLeadFromBooking(new FormData(e.target))
      setConvertMsg({ type: "success", text: "Lead added successfully." })
      addToast("Lead created from booking", "success")
      setTimeout(() => { setShowConvertForm(false); setConvertMsg(null) }, 1500)
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

  const hasFilters = search || statusFilter !== "all";

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
          <p className="text-sm text-white/25">No bookings yet \u2014 bookings will appear here once clients schedule through your Cal.com booking page.</p>
        </div>
      )}

      {view === "table" && bookings.length > 0 && (
        <>
          <Toolbar
            search={search}
            onSearchChange={(v) => setFilters({ search: v, page: 1 })}
            resultCount={filteredBookings.length}
            searchRef={searchRef}
          >
            <button
              onClick={handleExportCSV}
              className="rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors"
              aria-label="Export CSV"
            >
              <Download size={12} className="inline mr-1" />
              CSV
            </button>
            <ClearFiltersButton onClick={() => setFilters({ search: "", status: "all" })} visible={hasFilters} />
            <FilterChip active={statusFilter === "all"} onClick={() => setFilters({ status: "all", page: 1 })}>All</FilterChip>
            {["ACCEPTED", "PENDING", "CANCELLED"].map((s) => (
              <FilterChip key={s} active={statusFilter === s} onClick={() => setFilters({ status: s, page: 1 })}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </FilterChip>
            ))}
            <SortDropdown
              value={sort}
              onChange={(v) => setFilters({ sort: v })}
              label="Sort bookings"
              options={[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "name", label: "Title" },
                { value: "status", label: "Status" },
              ]}
            />
          </Toolbar>
          <BookingsTable
            bookings={filteredBookings}
            onSelect={setSelectedBooking}
            col={col}
            dir={dir}
            onColSort={toggleColSort}
          />
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
          key={formResetKey}
          booking={selectedBooking}
          onClose={() => { setSelectedBooking(null); setFormResetKey(k => k + 1); setConvertMsg(null); setShowConvertForm(false) }}
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

function BookingsTable({ bookings, onSelect, col, dir, onColSort }) {
  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("title")}>
                Title<SortIcon column="title" col={col} dir={dir} />
              </th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("attendee")}>
                Attendee<SortIcon column="attendee" col={col} dir={dir} />
              </th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("status")}>
                Status<SortIcon column="status" col={col} dir={dir} />
              </th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("date")}>
                Date<SortIcon column="date" col={col} dir={dir} />
              </th>
              <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors" onClick={() => onColSort("duration")}>
                Duration<SortIcon column="duration" col={col} dir={dir} />
              </th>
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
  const trapRef = useFocusTrap(!!booking)

  useEffect(() => {
    if (!booking) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [booking, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={trapRef}
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
