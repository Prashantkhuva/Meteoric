"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function StatusSelect({ value, onChange, disabled, options }) {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/70 transition-colors outline-none group">
        <StatusBadge status={value} />
        <Select.Icon>
          <ChevronDown size={10} className="opacity-30 group-hover:opacity-60 transition-opacity" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[9999] min-w-[160px] border border-white/[0.08] bg-[#0c0c0c] py-1.5 shadow-2xl"
        >
          <Select.Viewport>
            {options.map((option, i) => (
              <div key={option.value}>
                {i > 0 && <div className="mx-3 my-1 h-px bg-white/[0.04]" />}
                <Select.Item
                  value={option.value}
                  className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-white/[0.08] text-white/50 radix-highlighted:bg-white/[0.08] outline-none data-[highlighted]:bg-white/[0.08] data-[state=checked]:text-white/80"
                >
                  <Select.ItemText>
                    <StatusBadge status={option.value} />
                  </Select.ItemText>
                  {value === option.value && (
                    <span className="ml-auto text-[#EAEFFF]/50">
                      <Check size={13} />
                    </span>
                  )}
                </Select.Item>
              </div>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
