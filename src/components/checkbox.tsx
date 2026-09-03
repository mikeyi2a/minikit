"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ label, checked, onCheckedChange, disabled, className }: CheckboxProps) {
  return (
    <label
      className={cn(
        "mk-checkbox flex items-center gap-2 cursor-pointer",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        disabled={disabled}
        className="flex h-4 w-4 items-center justify-center rounded border transition-colors"
        style={{ borderColor: "var(--mk-border)", ...mk.surface(5) }}
      >
        <CheckboxPrimitive.Indicator className="text-[10px]" style={{ color: "var(--mk-text)" }}>
          ✓
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={mk.label}>
        {label}
      </span>
    </label>
  );
}
