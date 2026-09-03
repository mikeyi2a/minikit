"use client";

import * as React from "react";
import { cn, clamp } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface CoordinateInputProps {
  label?: string;
  x: number;
  y: number;
  onChange: (coords: { x: number; y: number }) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function CoordinateInput({
  label,
  x,
  y,
  onChange,
  min = -9999,
  max = 9999,
  step = 1,
  className,
}: CoordinateInputProps) {
  const field = (axis: "x" | "y", value: number) => (
    <div className="flex items-center gap-1 flex-1">
      <span className="font-mono text-[9px] uppercase w-3" style={mk.faint}>
        {axis}
      </span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (!isNaN(n)) {
            onChange(
              axis === "x"
                ? { x: clamp(n, min, max), y }
                : { x, y: clamp(n, min, max) },
            );
          }
        }}
        className="flex-1 h-8 rounded-lg px-1.5 font-mono text-[10px] text-center focus:outline-none"
        style={{ ...mk.mono, ...mk.surface(5), color: "var(--mk-text-muted)" }}
      />
    </div>
  );

  return (
    <div className={cn("mk-coordinate-input flex flex-col gap-1.5", className)}>
      {label && (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
          {label}
        </span>
      )}
      <div className="flex gap-1.5">{field("x", x)}{field("y", y)}</div>
    </div>
  );
}
