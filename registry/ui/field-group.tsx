"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface FieldGroupProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  layout?: "stack" | "row";
}

export function FieldGroup({
  label,
  hint,
  children,
  className,
  layout = "stack",
}: FieldGroupProps) {
  return (
    <div
      className={cn(
        "mk-field-group",
        layout === "row" ? "flex items-center justify-between gap-2" : "flex flex-col gap-1.5",
        className,
      )}
    >
      {(label || hint) && (
        <div className={cn("flex items-center gap-1.5", layout === "row" && "shrink-0")}>
          {label && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
              {label}
            </span>
          )}
          {hint && (
            <span
              className="px-1 py-0.5 rounded text-[9px] font-medium uppercase leading-none"
              style={{ ...mk.mono, ...mk.surface(10), color: "var(--mk-text-faint)" }}
            >
              {hint}
            </span>
          )}
        </div>
      )}
      <div className={cn(layout === "row" ? "flex-1 min-w-0 flex justify-end items-center" : undefined)}>
        {children}
      </div>
    </div>
  );
}
