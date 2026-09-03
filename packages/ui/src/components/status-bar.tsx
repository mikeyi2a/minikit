"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface StatusBarItem {
  id: string;
  label: string;
  variant?: "default" | "success" | "warning" | "error";
}

export interface StatusBarProps {
  items: StatusBarItem[];
  className?: string;
}

const variantColor: Record<NonNullable<StatusBarItem["variant"]>, string> = {
  default: "var(--mk-text-faint)",
  success: "#00cc88",
  warning: "#ffaa00",
  error: "#ff3366",
};

export function StatusBar({ items, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "mk-status-bar flex items-center justify-between gap-4 px-3 h-7 border-t font-mono text-[9px] uppercase tracking-wider",
        className,
      )}
      style={{
        ...mk.mono,
        borderColor: "var(--mk-border)",
        background: "var(--mk-surface)",
        color: "var(--mk-text-faint)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {items.map((item) => (
          <span key={item.id} style={{ color: variantColor[item.variant ?? "default"] }}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
