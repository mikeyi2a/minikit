"use client";

import * as React from "react";
import { cn, clamp } from "../lib/utils";

export interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  position?: number;
  onPositionChange?: (position: number) => void;
  className?: string;
  aspectRatio?: string;
}

export function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  position: controlledPosition,
  onPositionChange,
  className,
  aspectRatio = "16 / 9",
}: CompareSliderProps) {
  const [internalPosition, setInternalPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const position = controlledPosition ?? internalPosition;

  const setPosition = (next: number) => {
    const clamped = clamp(next, 0, 100);
    if (onPositionChange) onPositionChange(clamped);
    else setInternalPosition(clamped);
  };

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(pct);
  };

  const startDrag = (clientX: number) => {
    setIsDragging(true);
    updateFromClientX(clientX);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClientX(x);
    };
    const onEnd = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  return (
    <div
      ref={containerRef}
      className={cn("mk-compare-slider relative overflow-hidden rounded-xl select-none touch-none", className)}
      style={{
        aspectRatio,
        border: "1px solid var(--mk-border)",
      }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
    >
      {/* After (full background) */}
      <img src={afterSrc} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 w-px pointer-events-none"
        style={{
          left: `${position}%`,
          background: "var(--mk-text)",
          boxShadow: "0 0 8px rgba(0,0,0,0.4)",
        }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 flex items-center justify-center rounded-full pointer-events-none"
        style={{
          left: `${position}%`,
          width: 28,
          height: 28,
          transform: "translate(-50%, -50%)",
          background: "var(--mk-text)",
          boxShadow: isDragging ? "0 0 0 4px var(--mk-accent-muted)" : "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ color: "var(--mk-bg)", fontSize: 10, fontFamily: "var(--mk-font-mono)" }}>↔</span>
      </div>

      {/* Labels */}
      <span
        className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.5)",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "var(--mk-font-mono)",
        }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.5)",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "var(--mk-font-mono)",
        }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
