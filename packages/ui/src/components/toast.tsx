"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface ToastProps {
  message: string;
  variant?: "default" | "success" | "error";
  visible: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Toast({ message, variant = "default", visible, onDismiss, className }: ToastProps) {
  React.useEffect(() => {
    if (!visible || !onDismiss) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  if (!visible) return null;

  const borderColor =
    variant === "success" ? "#00cc88" : variant === "error" ? "#ff3366" : "var(--mk-border)";

  return (
    <div
      className={cn(
        "mk-toast fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-3 h-9 rounded-lg border mk-ring-elevated",
        className,
      )}
      style={{
        ...mk.mono,
        background: "var(--mk-surface-raised)",
        borderColor,
        color: "var(--mk-text-muted)",
        fontSize: "10px",
      }}
      role="status"
    >
      <span className="uppercase tracking-wider">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="opacity-50 hover:opacity-80 cursor-pointer">
          ✕
        </button>
      )}
    </div>
  );
}
