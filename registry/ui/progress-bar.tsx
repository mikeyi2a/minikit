"use client";

import * as React from "react";
import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  variant?: "default" | "indeterminate";
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  className,
  variant = "default",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("mk-progress-bar flex flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={mk.label}>
              {label}
            </span>
          )}
          {showValue && variant === "default" && (
            <span className="font-mono text-[9px]" style={mk.faint}>
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <Progress.Root
        value={variant === "indeterminate" ? undefined : clamped}
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={mk.surface(8)}
      >
        <Progress.Indicator
          className={cn(
            "h-full rounded-full transition-all",
            variant === "indeterminate" && "w-1/3 animate-[indeterminate_1.2s_ease-in-out_infinite]",
          )}
          style={{
            background: "var(--mk-text-muted)",
            transform: variant === "default" ? `translateX(-${100 - clamped}%)` : undefined,
          }}
        />
      </Progress.Root>
    </div>
  );
}
