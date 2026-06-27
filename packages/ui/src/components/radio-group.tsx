"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function RadioGroup({
  label,
  value,
  onValueChange,
  options,
  orientation = "vertical",
  className,
}: RadioGroupProps) {
  return (
    <div className={cn("mk-radio-group flex flex-col gap-2", className)}>
      {label && (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
          {label}
        </span>
      )}
      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        className={cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}
      >
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <RadioGroupPrimitive.Item
              value={opt.value}
              disabled={opt.disabled}
              className="h-3.5 w-3.5 rounded-full border flex items-center justify-center"
              style={{ borderColor: "var(--mk-border)" }}
            >
              <RadioGroupPrimitive.Indicator className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--mk-text)" }} />
            </RadioGroupPrimitive.Item>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={mk.label}>
              {opt.label}
            </span>
          </label>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
}
