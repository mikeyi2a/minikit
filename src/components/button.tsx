"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export function Button({
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
    primary: { ...mk.surface(14), color: "var(--mk-text)" },
    secondary: { ...mk.surface(8), color: "var(--mk-text-muted)" },
    ghost: { background: "transparent", color: "var(--mk-text-muted)" },
    danger: { background: "color-mix(in srgb, #ff3366 15%, transparent)", color: "#ff6688" },
  };

  return (
    <button
      type="button"
      className={cn(
        "mk-button inline-flex items-center justify-center rounded-lg font-mono font-medium uppercase tracking-[0.06em] transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        size === "sm" ? "h-8 px-3 text-[10px]" : "h-9 px-4 text-xs",
        className,
      )}
      style={{ ...mk.mono, ...variants[variant] }}
      {...props}
    >
      {children}
    </button>
  );
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  size?: "sm" | "md";
}

export function IconButton({
  label,
  active = false,
  size = "sm",
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "mk-icon-button inline-flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-40",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        className,
      )}
      style={{
        ...mk.mono,
        ...mk.surface(active ? 12 : 5),
        color: active ? "var(--mk-text)" : "var(--mk-text-muted)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
