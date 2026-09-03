"use client";

import * as React from "react";
import { cn, clamp, stepValue, formatValue } from "@/lib/utils";

export interface DualSliderProps {
  label?: string;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  showValues?: boolean;
  className?: string;
  disabled?: boolean;
}

type ActiveHandle = "start" | "end";

export function DualSlider({
  label,
  value: [start, end],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValues = true,
  className,
  disabled = false,
}: DualSliderProps) {
  const [activeHandle, setActiveHandle] = React.useState<ActiveHandle | null>(null);
  const [liveRange, setLiveRange] = React.useState<{ start: number; end: number } | null>(null);
  const draggingRef = React.useRef(false);
  const activeHandleRef = React.useRef<ActiveHandle | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const startPct = liveRange ? liveRange.start : ((start - min) / (max - min)) * 100;
  const endPct = liveRange ? liveRange.end : ((end - min) / (max - min)) * 100;

  const valueFromClientX = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const raw = min + (x / rect.width) * (max - min);
      return clamp(stepValue(raw, step), min, max);
    },
    [min, max, step],
  );

  const pickHandle = React.useCallback(
    (clientX: number): ActiveHandle => {
      const val = valueFromClientX(clientX);
      const distStart = Math.abs(val - start);
      const distEnd = Math.abs(val - end);
      return distStart <= distEnd ? "start" : "end";
    },
    [valueFromClientX, start, end],
  );

  const pctFromClientX = React.useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    return (x / rect.width) * 100;
  }, []);

  const updateHandle = React.useCallback(
    (handle: ActiveHandle, clientX: number) => {
      if (disabled) return;
      const pct = pctFromClientX(clientX);
      const next = valueFromClientX(clientX);
      const baseStartPct = ((start - min) / (max - min)) * 100;
      const baseEndPct = ((end - min) / (max - min)) * 100;

      if (draggingRef.current) {
        setLiveRange((prev) => ({
          start: handle === "start" ? pct : (prev?.start ?? baseStartPct),
          end: handle === "end" ? pct : (prev?.end ?? baseEndPct),
        }));
      }

      if (handle === "start") {
        onValueChange([Math.min(next, end), end]);
      } else {
        onValueChange([start, Math.max(next, start)]);
      }
    },
    [disabled, pctFromClientX, valueFromClientX, start, end, min, max, onValueChange],
  );

  const endDrag = React.useCallback(() => {
    draggingRef.current = false;
    activeHandleRef.current = null;
    setActiveHandle(null);
    setLiveRange(null);
  }, []);

  const beginDrag = React.useCallback(
    (e: React.PointerEvent, handle?: ActiveHandle) => {
      if (disabled || e.button !== 0 || !trackRef.current) return;
      e.preventDefault();
      trackRef.current.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      const active = handle ?? pickHandle(e.clientX);
      activeHandleRef.current = active;
      setActiveHandle(active);
      updateHandle(active, e.clientX);
    },
    [disabled, pickHandle, updateHandle],
  );

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current?.hasPointerCapture(e.pointerId)) return;
    const handle = activeHandleRef.current;
    if (!handle) return;
    updateHandle(handle, e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current?.hasPointerCapture(e.pointerId)) return;
    trackRef.current.releasePointerCapture(e.pointerId);
    endDrag();
  };

  return (
    <div
      className={cn(
        "mk-dual-slider flex flex-col gap-1.5",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {label && (
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
          style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
        >
          {label}
        </span>
      )}

      <div className="flex items-center gap-1.5">
        {showValues && (
          <span
            className="w-8 text-right font-mono text-[10px]"
            style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
          >
            {formatValue(start, step)}
          </span>
        )}

        <div
          ref={trackRef}
          className="relative flex-1 rounded-lg cursor-pointer touch-none select-none"
          style={{
            height: "var(--mk-control-height)",
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          }}
          onPointerDown={(e) => beginDrag(e)}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Range fill */}
          <div
            className="absolute inset-y-0 pointer-events-none"
            style={{
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
              background: "color-mix(in srgb, var(--mk-text) 12%, transparent)",
            }}
          />

          {/* Start handle */}
          <div
            role="slider"
            aria-valuemin={min}
            aria-valuemax={end}
            aria-valuenow={start}
            aria-label={label ? `${label} minimum` : "Range minimum"}
            tabIndex={disabled ? -1 : 0}
            className="absolute top-1/2 w-1 rounded-full cursor-ew-resize touch-none"
            style={{
              left: `${startPct}%`,
              height: "calc(var(--mk-control-height) - 10px)",
              transform: "translate(-50%, -50%)",
              background: "var(--mk-text)",
              opacity: activeHandle === "start" ? 1 : 0.7,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              beginDrag(e, "start");
            }}
          />

          {/* End handle */}
          <div
            role="slider"
            aria-valuemin={start}
            aria-valuemax={max}
            aria-valuenow={end}
            aria-label={label ? `${label} maximum` : "Range maximum"}
            tabIndex={disabled ? -1 : 0}
            className="absolute top-1/2 w-1 rounded-full cursor-ew-resize touch-none"
            style={{
              left: `${endPct}%`,
              height: "calc(var(--mk-control-height) - 10px)",
              transform: "translate(-50%, -50%)",
              background: "var(--mk-text)",
              opacity: activeHandle === "end" ? 1 : 0.7,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              beginDrag(e, "end");
            }}
          />
        </div>

        {showValues && (
          <span
            className="w-8 font-mono text-[10px]"
            style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
          >
            {formatValue(end, step)}
          </span>
        )}
      </div>
    </div>
  );
}
