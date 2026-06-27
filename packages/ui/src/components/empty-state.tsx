"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mk-empty-state flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed min-h-[160px]",
        className,
      )}
      style={{ borderColor: "var(--mk-border)", ...mk.surface(3) }}
    >
      {icon && <div className="mb-3 opacity-40">{icon}</div>}
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em]" style={mk.label}>
        {title}
      </span>
      {description && (
        <p className="text-[10px] mt-1.5 max-w-xs" style={{ color: "var(--mk-text-faint)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
