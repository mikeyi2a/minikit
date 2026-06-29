"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { cn, clamp } from "../lib/utils";

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

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const n = parseInt(normalized.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((c) => Math.round(clamp(c, 0, 255)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s: s * 100, v: max * 100 };
}

function hsvToRgb(h: number, s: number, v: number) {
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;
  let rn = 0;
  let gn = 0;
  let bn = 0;
  if (h < 60) [rn, gn, bn] = [c, x, 0];
  else if (h < 120) [rn, gn, bn] = [x, c, 0];
  else if (h < 180) [rn, gn, bn] = [0, c, x];
  else if (h < 240) [rn, gn, bn] = [0, x, c];
  else if (h < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];
  return {
    r: (rn + m) * 255,
    g: (gn + m) * 255,
    b: (bn + m) * 255,
  };
}

function hsvToHex(h: number, s: number, v: number) {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

function hueColor(h: number) {
  return hsvToHex(h, 100, 100);
}

function ColorPanel({
  h,
  s,
  v,
  swatches,
  value,
  onChange,
}: {
  h: number;
  s: number;
  v: number;
  swatches: string[];
  value: string;
  onChange: (hex: string) => void;
}) {
  const svRef = React.useRef<HTMLDivElement>(null);
  const draggingSv = React.useRef(false);

  const updateSv = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!svRef.current) return;
      const rect = svRef.current.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);
      onChange(hsvToHex(h, x * 100, (1 - y) * 100));
    },
    [h, onChange],
  );

  const onSvPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingSv.current = true;
    updateSv(e.clientX, e.clientY);
  };

  const onSvPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingSv.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateSv(e.clientX, e.clientY);
  };

  const onSvPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggingSv.current = false;
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div
        ref={svRef}
        className="relative h-28 w-full rounded-lg cursor-crosshair touch-none select-none overflow-hidden"
        style={{ background: hueColor(h) }}
        onPointerDown={onSvPointerDown}
        onPointerMove={onSvPointerMove}
        onPointerUp={onSvPointerUp}
        onPointerCancel={onSvPointerUp}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000, transparent)" }} />
        <div
          className="absolute w-3 h-3 rounded-full border-2 pointer-events-none"
          style={{
            left: `${s}%`,
            top: `${100 - v}%`,
            transform: "translate(-50%, -50%)",
            borderColor: v > 55 ? "#111" : "#fff",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      <div className="relative h-2.5 w-full rounded-full cursor-pointer touch-none select-none"
        style={{
          background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);
          const pick = (clientX: number) => {
            const rect = el.getBoundingClientRect();
            const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
            onChange(hsvToHex(pct * 360, s, v));
          };
          pick(e.clientX);
          const onMove = (ev: PointerEvent) => {
            if (!el.hasPointerCapture(ev.pointerId)) return;
            pick(ev.clientX);
          };
          const onUp = (ev: PointerEvent) => {
            el.releasePointerCapture(ev.pointerId);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerup", onUp);
        }}
      >
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full border-2 pointer-events-none"
          style={{
            left: `${(h / 360) * 100}%`,
            transform: "translate(-50%, -50%)",
            background: hueColor(h),
            borderColor: "#fff",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
          }}
        />
      </div>

      <div className="grid grid-cols-6 gap-1">
        {swatches.slice(0, 12).map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Select ${color}`}
            aria-pressed={value.toUpperCase() === color.toUpperCase()}
            onClick={() => onChange(color)}
            className="aspect-square rounded-md cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-offset-1"
            style={{
              background: color,
              outlineColor: "var(--mk-text-muted)",
              boxShadow:
                value.toUpperCase() === color.toUpperCase()
                  ? `0 0 0 1px var(--mk-bg), 0 0 0 2px var(--mk-text-muted)`
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
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
  const [open, setOpen] = React.useState(false);
  const eyedropperSupported = typeof window !== "undefined" && "EyeDropper" in window;

  const rgb = hexToRgb(value) ?? { r: 17, g: 17, b: 17 };
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

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

  const applyColor = (hex: string) => {
    onValueChange(hex);
    setHexInput(hex);
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
            onClick={() => applyColor(color)}
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
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label="Open color picker"
              className="w-8 h-8 rounded-lg shrink-0 border cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-offset-2"
              style={{
                background: value,
                borderColor: "var(--mk-border)",
                outlineColor: "var(--mk-text-muted)",
              }}
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={6}
              className="z-50 w-52 rounded-xl border p-2.5 shadow-xl"
              style={{
                background: "var(--mk-surface-raised)",
                borderColor: "var(--mk-border)",
              }}
            >
              <ColorPanel
                h={hsv.h}
                s={hsv.s}
                v={hsv.v}
                swatches={swatches}
                value={value}
                onChange={applyColor}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

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
