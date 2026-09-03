"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { mk } from "../lib/mk-styles";
import { ChromeIconButton } from "./chrome-icon-button";

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
          "mk-drawer fixed z-50 flex flex-col border mk-ring-float",
          side === "bottom" ? "rounded-t-xl border-b-0" : "",
        )}
        style={{
          ...positionStyles,
          background: "var(--mk-surface)",
          borderColor: "var(--mk-border)",
        }}
      >
        <div
          className="flex items-center justify-between gap-2 px-2 shrink-0 border-b min-h-10"
          style={{ borderColor: "var(--mk-border)" }}
        >
          {title && (
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] pl-1" style={mk.faint}>
              {title}
            </span>
          )}
          <ChromeIconButton
            className={title ? undefined : "ml-auto"}
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
          >
            ✕
          </ChromeIconButton>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </aside>
    </>
  );
}
