"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  side?: "left" | "right" | "bottom";
  width?: number;
  children: React.ReactNode;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  side = "right",
  width = 280,
  children,
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const positionStyles: React.CSSProperties =
    side === "bottom"
      ? { left: 0, right: 0, bottom: 0, maxHeight: "70vh" }
      : side === "left"
        ? { left: 0, top: 0, bottom: 0, width }
        : { right: 0, top: 0, bottom: 0, width };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "mk-drawer fixed z-50 flex flex-col border shadow-2xl",
          side === "bottom" ? "rounded-t-xl border-b-0" : "",
        )}
        style={{
          ...positionStyles,
          background: "var(--mk-surface)",
          borderColor: "var(--mk-border)",
        }}
      >
        <div
          className="flex items-center justify-between px-3 shrink-0 border-b"
          style={{ borderColor: "var(--mk-border)", height: "var(--mk-control-height)" }}
        >
          {title && (
            <span className="font-mono text-[10px] uppercase tracking-[0.08em]" style={mk.faint}>
              {title}
            </span>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ml-auto text-[10px] opacity-50 hover:opacity-80 cursor-pointer"
            style={mk.mono}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </aside>
    </>
  );
}
