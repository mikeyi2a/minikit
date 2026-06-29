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
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-150 cursor-pointer",
          "data-[state=unchecked]:border-[var(--mk-border)] data-[state=unchecked]:bg-[color-mix(in_srgb,var(--mk-text)_8%,transparent)]",
          "data-[state=checked]:border-[var(--mk-accent)] data-[state=checked]:bg-[var(--mk-accent)]",
          "focus-visible:outline focus-visible:outline-offset-2",
        )}
        style={{ outlineColor: "var(--mk-text-muted)" }}
      >
        <Switch.Thumb
          className={cn(
            "block h-3.5 w-3.5 rounded-full transition-[transform,background-color] duration-150",
            "translate-x-0.5 pointer-events-none",
            "data-[state=unchecked]:bg-[var(--mk-text-muted)]",
            "data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-[var(--mk-bg)]",
          )}
        />
      </Switch.Root>
    </label>
  );
}
