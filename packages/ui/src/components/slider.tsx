"use client";

import * as React from "react";
import { cn, clamp, stepValue, formatValue } from "../lib/utils";
import { getTickPcts, getTickValues, snapToNearestTick, valueToPct } from "../lib/slider-ticks";

export interface SliderProps {
  label?: string;
  hint?: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  tickCount?: number;
  snapToTicks?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  label,
  hint,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  tickCount = 9,
  snapToTicks = tickCount > 0,
  className,
  disabled = false,
}: SliderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [livePct, setLivePct] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState<string | null>(null);
  const draggingRef = React.useRef(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const lastValueRef = React.useRef(value);

  const tickValues = React.useMemo(() => getTickValues(min, max, tickCount), [min, max, tickCount]);
  const ticks = React.useMemo(() => getTickPcts(tickCount), [tickCount]);

  const percentage = valueToPct(value, min, max);
  const displayPct = livePct ?? percentage;

  const stepOnly = React.useCallback(
    (raw: number) => {
      const v = clamp(stepValue(raw, step), min, max);
      return Number(formatValue(v, step));
    },
    [min, max, step],
  );

  const applySnap = React.useCallback(
    (raw: number, forceSnap = false) => {
      let v = clamp(stepValue(raw, step), min, max);
      if (snapToTicks && tickCount > 0) {
        const snapped = snapToNearestTick(v, tickValues, min, max, tickCount);
        if (forceSnap || snapped !== v) {
          const threshold = ((max - min) / (tickCount + 1)) * 0.55;
          if (forceSnap || Math.abs(v - snapped) < threshold) {
            v = clamp(stepValue(snapped, step), min, max);
          }
        }
      }
      return Number(formatValue(v, step));
    },
    [min, max, step, snapToTicks, tickCount, tickValues],
  );

  const commitInput = (raw: string) => {
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onValueChange(applySnap(parsed));
    }
    setEditValue(null);
  };

  const currentInputValue = () => {
    if (editValue !== null) {
      const parsed = parseFloat(editValue);
      if (!isNaN(parsed)) return parsed;
    }
    return value;
  };

  const nudge = (delta: number) => {
    const next = stepOnly(currentInputValue() + delta);
    onValueChange(next);
    setEditValue(formatValue(next, step));
  };

  const updateFromClientX = React.useCallback(
    (clientX: number, finalSnap = false) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const rawPct = (x / rect.width) * 100;
      const raw = min + (rawPct / 100) * (max - min);
      const next = applySnap(raw, finalSnap);
      if (draggingRef.current) {
        setLivePct(valueToPct(next, min, max));
      }
      lastValueRef.current = next;
      onValueChange(next);
    },
    [disabled, min, max, onValueChange, applySnap],
  );

  const endDrag = () => {
    if (draggingRef.current && snapToTicks) {
      const snapped = applySnap(lastValueRef.current, true);
      if (snapped !== lastValueRef.current) {
        onValueChange(snapped);
        setLivePct(valueToPct(snapped, min, max));
      }
    }
    draggingRef.current = false;
    setIsDragging(false);
    setLivePct(null);
  };

  const startDrag = (clientX: number) => {
    if (disabled) return;
    setEditValue(null);
    draggingRef.current = true;
    setIsDragging(true);
    updateFromClientX(clientX);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startDrag(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    updateFromClientX(e.clientX, true);
    endDrag();
  };

  return (
    <div
      className={cn(
        "mk-slider relative flex items-center gap-1.5 group",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      style={{ height: "var(--mk-control-height)" }}
    >
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (disabled) return;
          const delta =
            e.key === "ArrowRight" || e.key === "ArrowUp"
              ? step
              : e.key === "ArrowLeft" || e.key === "ArrowDown"
                ? -step
                : 0;
          if (delta !== 0) {
            e.preventDefault();
            onValueChange(stepOnly(value + delta));
          }
        }}
        className="relative flex-1 overflow-hidden rounded-lg cursor-pointer touch-none select-none focus-visible:outline focus-visible:outline-offset-[-1px]"
        style={{
          height: "var(--mk-control-height)",
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          outlineColor: "var(--mk-text-muted)",
        }}
      >
        {ticks.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {ticks.map((left) => (
              <div
                key={left}
                className="absolute top-1/2 w-px h-2 rounded-full"
                style={{
                  left: `${left}%`,
                  transform: "translate(-50%, -50%)",
                  background: "color-mix(in srgb, var(--mk-text) 12%, transparent)",
                }}
              />
            ))}
          </div>
        )}

        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: `${displayPct}%`,
            background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
            transition: isDragging ? "none" : undefined,
          }}
        />

        <div
          className={cn(
            "absolute top-1/2 w-0.5 rounded-full pointer-events-none transition-opacity",
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-60",
          )}
          style={{
            left: `${displayPct}%`,
            height: "calc(var(--mk-control-height) - 12px)",
            transform: "translate(-50%, -50%)",
            background: "var(--mk-text)",
            transition: isDragging ? "opacity 150ms ease" : undefined,
          }}
        />

        {label && (
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] flex items-center"
              style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
            >
              {label}
              {hint && (
                <span
                  className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-medium tracking-normal leading-none"
                  style={{
                    background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
                    color: "var(--mk-text-faint)",
                  }}
                >
                  {hint}
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {showValue && (
        <input
          type="text"
          inputMode="decimal"
          value={editValue ?? formatValue(value, step)}
          onFocus={() => setEditValue(formatValue(value, step))}
          onBlur={(e) => commitInput(e.target.value)}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              nudge(step);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              nudge(-step);
            } else if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "Escape") {
              setEditValue(null);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-12 font-mono text-[10px] font-medium text-right px-1.5 rounded-lg focus:outline focus:outline-offset-[-1px] transition-all shrink-0"
          style={{
            height: "var(--mk-control-height)",
            fontFamily: "var(--mk-font-mono)",
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: "var(--mk-text-muted)",
            outlineColor: "var(--mk-text-muted)",
          }}
        />
      )}
    </div>
  );
}
