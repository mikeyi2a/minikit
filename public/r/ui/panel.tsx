"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export type PanelMode = "docked" | "floating";

export interface PanelProps {
  title?: string;
  children: React.ReactNode;
  mode?: PanelMode;
  side?: "left" | "right";
  width?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  /** Floating only — initial position */
  defaultPosition?: { x: number; y: number };
  className?: string;
  footer?: React.ReactNode;
}

export function Panel({
  title = "Panel",
  children,
  mode = "docked",
  side = "left",
  width = 220,
  collapsible = true,
  defaultCollapsed = false,
  defaultPosition = { x: 24, y: 24 },
  className,
  footer,
}: PanelProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [pos, setPos] = React.useState(defaultPosition);
  const dragRef = React.useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);

  const startDrag = (e: React.PointerEvent) => {
    if (mode !== "floating") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { ox: e.clientX, oy: e.clientY, px: pos.x, py: pos.y };
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPos({
      x: dragRef.current.px + (e.clientX - dragRef.current.ox),
      y: dragRef.current.py + (e.clientY - dragRef.current.oy),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const shell = (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-2 shrink-0 border-b",
          mode === "floating" && "cursor-grab active:cursor-grabbing touch-none",
        )}
        style={{ borderColor: "var(--mk-border)", height: "var(--mk-control-height)" }}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
      >
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] truncate" style={mk.faint}>
          {title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {mode === "floating" && (
            <span className="text-[9px] opacity-30" style={mk.mono}>
              ⠿
            </span>
          )}
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer px-1"
              style={mk.mono}
            >
              {collapsed ? "+" : "−"}
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 min-h-0">{children}</div>
          {footer && (
            <div className="p-2 border-t shrink-0" style={{ borderColor: "var(--mk-border)" }}>
              {footer}
            </div>
          )}
        </>
      )}
    </>
  );

  if (mode === "floating") {
    return (
      <aside
        className={cn("mk-panel fixed z-40 flex flex-col rounded-xl border mk-ring-float", className)}
        style={{
          left: pos.x,
          top: pos.y,
          width: collapsed ? 160 : width,
          maxHeight: collapsed ? undefined : 420,
          background: "var(--mk-surface)",
          borderColor: "var(--mk-border)",
          color: "var(--mk-text)",
        }}
      >
        {shell}
      </aside>
    );
  }

  return (
    <aside
      className={cn("mk-panel flex flex-col shrink-0 border-r h-full", className)}
      style={{
        width: collapsed ? 36 : width,
        background: "var(--mk-surface)",
        borderColor: "var(--mk-border)",
        borderRight: side === "left" ? "1px solid var(--mk-border)" : undefined,
        borderLeft: side === "right" ? "1px solid var(--mk-border)" : undefined,
      }}
    >
      {shell}
    </aside>
  );
}
