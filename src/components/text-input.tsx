"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  size?: "sm" | "md";
}

export function TextInput({ label, size = "sm", className, ...props }: TextInputProps) {
  return (
    <div className={cn("mk-text-input flex flex-col gap-1.5", className)}>
      {label && (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
          {label}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-lg px-2.5 font-mono focus:outline focus:outline-offset-[-1px]",
          size === "sm" ? "h-8 text-[10px]" : "h-9 text-xs",
        )}
        style={{
          ...mk.mono,
          ...mk.surface(5),
          color: "var(--mk-text-muted)",
          outlineColor: "var(--mk-text-muted)",
        }}
        {...props}
      />
    </div>
  );
}
