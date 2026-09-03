"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";

export interface PresetItem {
  id: string;
  label: string;
}

export interface PresetPickerProps {
  label?: string;
  presets: PresetItem[];
  value?: string;
  onValueChange: (id: string) => void;
  onAdd?: () => void;
  className?: string;
}

export function PresetPicker({
  label,
  presets,
  value,
  onValueChange,
  onAdd,
  className,
}: PresetPickerProps) {
  return (
    <div className={cn("mk-preset-picker flex flex-col gap-2", className)}>
      {label && (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]" style={mk.label}>
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-1">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onValueChange(p.id)}
            className="h-7 px-2 rounded-lg font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-85"
            style={{
              ...mk.mono,
              ...mk.surface(value === p.id ? 14 : 5),
              color: value === p.id ? "var(--mk-text)" : "var(--mk-text-faint)",
            }}
          >
            {p.label}
          </button>
        ))}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="h-7 w-7 rounded-lg font-mono text-sm cursor-pointer flex items-center justify-center"
            style={{ ...mk.surface(5), color: "var(--mk-text-faint)" }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
