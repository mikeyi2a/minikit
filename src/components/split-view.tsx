"use client";

import * as React from "react";
import { cn, clamp } from "@/lib/utils";

export interface SplitViewProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function SplitView({
  left,
  right,
  defaultRatio = 50,
  minRatio = 20,
  maxRatio = 80,
  className,
  orientation = "horizontal",
}: SplitViewProps) {
  const [ratio, setRatio] = React.useState(defaultRatio);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const getPos = (ev: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const clientY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      const pct = isH
        ? ((clientX - rect.left) / rect.width) * 100
        : ((clientY - rect.top) / rect.height) * 100;
      setRatio(clamp(pct, minRatio, maxRatio));
    };

    getPos(e.nativeEvent);

    const onMove = (ev: MouseEvent | TouchEvent) => getPos(ev);
    const onEnd = () => {
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

  const isH = orientation === "horizontal";

  return (
    <div
      ref={containerRef}
      className={cn("mk-split-view flex overflow-hidden rounded-xl border", isH ? "flex-row" : "flex-col", className)}
      style={{ borderColor: "var(--mk-border)", minHeight: isH ? 200 : 320 }}
    >
      <div className="overflow-auto min-w-0 min-h-0" style={{ [isH ? "width" : "height"]: `${ratio}%` }}>
        {left}
      </div>
      <div
        role="separator"
        aria-orientation={orientation}
        className={cn("shrink-0 flex items-center justify-center touch-none", isH ? "w-1 cursor-ew-resize" : "h-1 cursor-ns-resize")}
        style={{ background: "var(--mk-border)" }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      />
      <div className="flex-1 overflow-auto min-w-0 min-h-0">{right}</div>
    </div>
  );
}
