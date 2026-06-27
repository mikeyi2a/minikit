"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  disabled,
}: SelectProps) {
  return (
    <div className={cn("mk-select flex flex-col gap-1.5", className)}>
      {label && (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
          {label}
        </span>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className="flex h-8 w-full items-center justify-between rounded-lg px-2.5 font-mono text-[10px] uppercase tracking-wide cursor-pointer focus:outline focus:outline-offset-[-1px]"
          style={{ ...mk.mono, ...mk.surface(5), color: "var(--mk-text-muted)", outlineColor: "var(--mk-text-muted)" }}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="opacity-50">▾</SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 overflow-hidden rounded-lg border shadow-lg"
            style={{
              background: "var(--mk-surface-raised)",
              borderColor: "var(--mk-border)",
            }}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="flex h-8 items-center rounded-md px-2 font-mono text-[10px] uppercase tracking-wide cursor-pointer outline-none data-[highlighted]:opacity-100 opacity-70"
                  style={{ ...mk.mono, color: "var(--mk-text-muted)" }}
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
