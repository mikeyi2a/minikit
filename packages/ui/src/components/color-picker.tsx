"use client";

import * as React from "react";
import { cn } from "../lib/utils";

const DEFAULT_SWATCHES = [
  "#0066FF",
  "#FF3366",
  "#00CC88",
  "#FFAA00",
  "#9933FF",
  "#00BBFF",
  "#FFFFFF",
  "#111111",
  "#666666",
  "#E0E0E0",
  "#FF6B35",
  "#2EC4B6",
];

export interface ColorPickerProps {
  value: string;
  onValueChange: (color: string) => void;
  swatches?: string[];
  showEyedropper?: boolean;
  label?: string;
  className?: string;
}

function normalizeHex(input: string): string | null {
  const cleaned = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned
      .split("")
      .map((c) => c + c)
      .join("")
      .toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }
  return null;
}

export function ColorPicker({
  value,
  onValueChange,
  swatches = DEFAULT_SWATCHES,
  showEyedropper = true,
  label,
  className,
}: ColorPickerProps) {
  const [hexInput, setHexInput] = React.useState(value);
  const eyedropperSupported = typeof window !== "undefined" && "EyeDropper" in window;

  React.useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexCommit = () => {
    const normalized = normalizeHex(hexInput);
    if (normalized) {
      onValueChange(normalized);
      setHexInput(normalized);
    } else {
      setHexInput(value);
    }
  };

  const pickFromScreen = async () => {
    if (!eyedropperSupported) return;
    try {
      // @ts-expect-error EyeDropper is not in TS lib yet
      const dropper = new EyeDropper();
      const result = await dropper.open();
      const normalized = normalizeHex(result.sRGBHex);
      if (normalized) onValueChange(normalized);
    } catch {
      // user cancelled
    }
  };

  return (
    <div className={cn("mk-color-picker flex flex-col gap-2", className)}>
      {label && (
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
          style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
        >
          {label}
        </span>
      )}

      <div className="grid grid-cols-6 gap-1.5">
        {swatches.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Select ${color}`}
            aria-pressed={value.toUpperCase() === color.toUpperCase()}
            onClick={() => onValueChange(color)}
            className="aspect-square rounded-md cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-offset-2"
            style={{
              background: color,
              outlineColor: "var(--mk-text-muted)",
              boxShadow:
                value.toUpperCase() === color.toUpperCase()
                  ? `0 0 0 2px var(--mk-bg), 0 0 0 3px var(--mk-text-muted)`
                  : undefined,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <div
          className="w-8 h-8 rounded-lg shrink-0 border"
          style={{
            background: value,
            borderColor: "var(--mk-border)",
          }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={handleHexCommit}
          onKeyDown={(e) => e.key === "Enter" && handleHexCommit()}
          spellCheck={false}
          className="flex-1 h-8 px-2 rounded-lg font-mono text-[10px] uppercase focus:outline focus:outline-offset-[-1px]"
          style={{
            fontFamily: "var(--mk-font-mono)",
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: "var(--mk-text-muted)",
            outlineColor: "var(--mk-text-muted)",
          }}
        />
        {showEyedropper && eyedropperSupported && (
          <button
            type="button"
            onClick={pickFromScreen}
            aria-label="Pick color from screen"
            className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 shrink-0"
            style={{
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              color: "var(--mk-text-muted)",
            }}
          >
            ◉
          </button>
        )}
      </div>
    </div>
  );
}
