"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, hint, error, leadingAddon, trailingAddon, size = "md", className, ...props },
  ref,
) {
  return (
    <label
      className={cn("mk-text-input flex flex-col gap-1.5 group", className)}
      style={{ color: "var(--mk-text)" }}
    >
      {label && (
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
          style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
        >
          {label}
          {hint && (
            <span
              className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-medium tracking-normal leading-none align-middle"
              style={{
                background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
                color: "var(--mk-text-faint)",
              }}
            >
              {hint}
            </span>
          )}
        </span>
      )}
      <div
        className={cn(
          "flex items-center rounded-lg overflow-hidden transition-colors",
          size === "sm" ? "h-7" : "h-9",
        )}
        style={{
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          border: "1px solid var(--mk-border)",
        }}
      >
        {leadingAddon && (
          <span
            className="px-2 font-mono text-[10px] uppercase tracking-wider shrink-0"
            style={{
              color: "var(--mk-text-faint)",
              fontFamily: "var(--mk-font-mono)",
              background: "color-mix(in srgb, var(--mk-text) 3%, transparent)",
              height: "100%",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {leadingAddon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className="flex-1 bg-transparent px-2.5 font-mono text-[11px] outline-none placeholder:opacity-40 min-w-0"
          style={{
            color: "var(--mk-text)",
            fontFamily: "var(--mk-font-mono)",
            ...(error ? { boxShadow: "inset 0 0 0 1px #ff3366" } : null),
          }}
        />
        {trailingAddon && (
          <span
            className="px-2 font-mono text-[10px] uppercase tracking-wider shrink-0"
            style={{
              color: "var(--mk-text-faint)",
              fontFamily: "var(--mk-font-mono)",
              height: "100%",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {trailingAddon}
          </span>
        )}
      </div>
      {error && (
        <span
          className="font-mono text-[9px] uppercase tracking-wider"
          style={{ color: "#ff3366", fontFamily: "var(--mk-font-mono)" }}
        >
          {error}
        </span>
      )}
    </label>
  );
});
