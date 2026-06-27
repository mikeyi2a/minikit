"use client";

import { cn, clamp, stepValue, formatValue } from "../lib/utils";

export interface NumberStepperProps {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function NumberStepper({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false,
}: NumberStepperProps) {
  const adjust = (delta: number) => {
    if (disabled) return;
    const next = clamp(stepValue(value + delta, step), min, max);
    onValueChange(Number(formatValue(next, step)));
  };

  return (
    <div
      className={cn(
        "mk-number-stepper flex items-center gap-1.5",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {label && (
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] min-w-[52px]"
          style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
        >
          {label}
        </span>
      )}

      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          height: "var(--mk-control-height)",
        }}
      >
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => adjust(-step)}
          className="h-full px-2 font-mono text-sm transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          −
        </button>

        <input
          type="text"
          inputMode="decimal"
          value={formatValue(value, step)}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) {
              onValueChange(clamp(parsed, min, max));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              adjust(step);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              adjust(-step);
            }
          }}
          className="w-14 text-center font-mono text-[10px] font-medium bg-transparent focus:outline-none"
          style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
        />

        <button
          type="button"
          aria-label="Increase"
          onClick={() => adjust(step)}
          className="h-full px-2 font-mono text-sm transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}
