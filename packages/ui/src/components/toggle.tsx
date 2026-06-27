"use client";

import * as React from "react";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface ToggleProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ label, checked, onCheckedChange, disabled, className }: ToggleProps) {
  return (
    <label
      className={cn(
        "mk-toggle inline-flex items-center gap-3 cursor-pointer select-none",
        label ? "justify-between w-full" : "justify-end shrink-0",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {label ? (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
          {label}
        </span>
      ) : null}
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer data-[state=checked]:bg-white/20 focus-visible:outline focus-visible:outline-offset-2"
        style={{ ...mk.surface(8), outlineColor: "var(--mk-text-muted)" }}
      >
        <Switch.Thumb className="block h-3.5 w-3.5 rounded-full bg-white/90 transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px] pointer-events-none" />
      </Switch.Root>
    </label>
  );
}
