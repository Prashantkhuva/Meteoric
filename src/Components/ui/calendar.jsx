"use client"

import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      animate
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        today: "!text-[#EAEFFF] !font-semibold",
        selected: "!bg-[#EAEFFF]/15 !text-[#EAEFFF] !rounded-lg",
        range_middle: "!bg-[#EAEFFF]/10 !text-white/80 !rounded-none",
        range_start: "!bg-[#EAEFFF] !text-black !rounded-l-lg",
        range_end: "!bg-[#EAEFFF] !text-black !rounded-r-lg",
        chevron: "!fill-[#EAEFFF]/40",
        day_button: cn(
          "!text-white/60 !rounded-lg !text-sm !size-9",
          "hover:!bg-[#EAEFFF]/10 hover:!text-white/90",
          "focus-visible:!ring-1 focus-visible:!ring-[#EAEFFF]/30 focus-visible:!outline-none",
          "aria-selected:!bg-[#EAEFFF]/15 aria-selected:!text-[#EAEFFF]",
        ),
        month_caption: "!text-white/80 !text-sm !font-medium !px-1",
        nav: "!gap-1",
        month_grid: "!mt-2",
        weekdays: "!text-white/30 !text-xs !font-normal",
        weekday: "!text-white/30 !size-9 !font-normal",
        week: "!mt-0.5",
        day: "!text-white/60 !size-9 !text-sm",
        outside: "!text-white/10",
        disabled: "!text-white/10 !line-through !opacity-50",
        hidden: "!invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
