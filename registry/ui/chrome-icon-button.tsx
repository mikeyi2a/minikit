"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChromeIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Stop pointer events bubbling (e.g. panel drag handles). */
  stopPropagation?: boolean;
}

export function ChromeIconButton({
  className,
  children,
  stopPropagation = false,
  onPointerDown,
  style,
  ...props
}: ChromeIconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      onPointerDown={(e) => {
        if (stopPropagation) e.stopPropagation();
        onPointerDown?.(e);
      }}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg cursor-pointer transition-colors",
        "hover:bg-[color-mix(in_srgb,var(--mk-text)_10%,transparent)]",
        "active:bg-[color-mix(in_srgb,var(--mk-text)_14%,transparent)]",
        "focus-visible:outline focus-visible:outline-offset-1",
        className,
      )}
      style={{
        color: "var(--mk-text-muted)",
        fontFamily: "var(--mk-font-mono)",
        outlineColor: "var(--mk-text-muted)",
        ...style,
      }}
    >
      <span className="text-[15px] leading-none select-none">{children}</span>
    </button>
  );
}
