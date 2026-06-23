"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function StatusSelect({ value, onChange, disabled, options }) {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white/70 transition-colors outline-none">
        <StatusBadge status={value} />
        <Select.Icon>
          <ChevronDown size={10} className="opacity-40" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-[9999] w-36 border border-white/[0.08] bg-[#0c0c0c] p-1 shadow-2xl"
        >
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/[0.06] text-white/50 radix-highlighted:bg-white/[0.06] outline-none data-[highlighted]:bg-white/[0.06]"
              >
                <Select.ItemText>
                  <StatusBadge status={option.value} />
                </Select.ItemText>
                {value === option.value && (
                  <span className="ml-auto text-[#EAEFFF]/40">
                    <Check size={12} />
                  </span>
                )}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
