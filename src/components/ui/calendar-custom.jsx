"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function startDay(year, month) {
  return new Date(year, month, 1).getDay()
}

function localDateStr(d) {
  if (!d) return ""
  try {
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  } catch {
    return ""
  }
}

export function CalendarCustom({
  selected,
  onSelect,
  bookingCountByDate,
}) {
  const today = useMemo(() => new Date(), [])
  const [viewMonth, setViewMonth] = useState(() => selected || today)

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()

  const days = useMemo(() => {
    const total = daysInMonth(year, month)
    const start = startDay(year, month)
    const cells = []

    for (let i = 0; i < start; i++) {
      cells.push(null)
    }

    for (let d = 1; d <= total; d++) {
      const date = new Date(year, month, d)
      const key = localDateStr(date)
      cells.push({
        day: d,
        date,
        key,
        count: bookingCountByDate?.[key] || 0,
        isToday: localDateStr(date) === localDateStr(today),
        isSelected: selected && localDateStr(date) === localDateStr(selected),
      })
    }

    return cells
  }, [year, month, bookingCountByDate, selected, today])

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  const canGoPrev = month > 0 || year > today.getFullYear() - 5
  const canGoNext = month < 11 || year < today.getFullYear() + 2

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1 text-white/30 hover:text-white/70 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-white/80">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="p-1 text-white/30 hover:text-white/70 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="flex items-center justify-center h-9 text-xs font-normal text-white/30"
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((cell, i) => {
          if (!cell) {
            return <div key={`empty-${i}`} className="h-9" />
          }

          return (
            <button
              key={cell.key}
              onClick={() => onSelect?.(cell.date)}
              className={cn(
                "relative flex items-center justify-center h-9 w-full text-sm rounded-lg transition-all outline-none",
                "focus-visible:ring-1 focus-visible:ring-[#EAEFFF]/30",
                cell.isSelected
                  ? "bg-[#EAEFFF]/15 text-[#EAEFFF] font-semibold"
                  : cell.isToday
                    ? "text-[#EAEFFF] font-semibold"
                    : "text-white/60 hover:bg-[#EAEFFF]/10 hover:text-white/90"
              )}
            >
              <span>{cell.day}</span>
              {cell.count > 0 && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-[2px]">
                  {Array.from({ length: Math.min(cell.count, 3) }).map((_, ci) => (
                    <span
                      key={ci}
                      className={cn(
                        "block h-1 w-1 rounded-full",
                        cell.isSelected ? "bg-[#EAEFFF]" : "bg-[#EAEFFF]/60"
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
