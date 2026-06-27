"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "muted" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, React.CSSProperties> = {
    default: {
      background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
      color: "var(--mk-text-muted)",
    },
    accent: {
      background: "var(--mk-accent-muted)",
      color: "var(--mk-accent)",
    },
    muted: {
      background: "transparent",
      color: "var(--mk-text-faint)",
    },
    outline: {
      background: "transparent",
      color: "var(--mk-text-muted)",
      border: "1px solid var(--mk-border)",
    },
  };

  return (
    <span
      className={cn(
        "mk-badge inline-flex items-center font-mono font-medium uppercase tracking-[0.06em] rounded leading-none",
        size === "sm" ? "text-[9px] px-1 py-0.5" : "text-[10px] px-1.5 py-1",
        className,
      )}
      style={{
        fontFamily: "var(--mk-font-mono)",
        ...variantStyles[variant],
      }}
      {...props}
    >
      {children}
    </span>
  );
}
