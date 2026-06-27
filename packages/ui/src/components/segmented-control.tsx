"use client";

import { cn } from "../lib/utils";

export interface SegmentedControlItem<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onValueChange,
  className,
  size = "sm",
}: SegmentedControlProps<T>) {
  return (
    <nav
      role="tablist"
      className={cn("mk-segmented-control flex gap-1 p-1 rounded-xl", className)}
      style={{
        background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
      }}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "mk-segmented-control-item flex-1 font-mono font-medium uppercase tracking-[0.06em] transition-all cursor-pointer whitespace-nowrap rounded-lg",
              size === "sm" ? "h-[26px] text-[10px] px-1" : "h-8 text-xs px-2",
              isActive
                ? "shadow-sm"
                : "hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed",
            )}
            style={{
              fontFamily: "var(--mk-font-mono)",
              background: isActive ? "color-mix(in srgb, var(--mk-surface) 72%, black)" : "transparent",
              color: isActive ? "var(--mk-text)" : "var(--mk-text-faint)",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
