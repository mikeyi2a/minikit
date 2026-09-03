"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChromeIconButton } from "@/components/chrome-icon-button";

export interface SidebarProps {
  title?: string;
  side?: "left" | "right";
  width?: number | string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({
  title,
  side = "left",
  width = 194,
  collapsible = false,
  defaultCollapsed = false,
  header,
  footer,
  children,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  if (collapsed && collapsible) {
    return (
      <aside
        className={cn("mk-sidebar flex flex-col shrink-0", className)}
        style={{
          width: 36,
          background: "var(--mk-surface)",
          borderRight: side === "left" ? "1px solid var(--mk-border)" : undefined,
          borderLeft: side === "right" ? "1px solid var(--mk-border)" : undefined,
        }}
      >
        <ChromeIconButton
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="w-full rounded-none"
        >
          {side === "left" ? "›" : "‹"}
        </ChromeIconButton>
      </aside>
    );
  }

  return (
    <aside
      className={cn("mk-sidebar flex flex-col shrink-0 p-2", className)}
      style={{
        width,
        background: "var(--mk-surface)",
        color: "var(--mk-text)",
        borderRight: side === "left" ? "1px solid var(--mk-border)" : undefined,
        borderLeft: side === "right" ? "1px solid var(--mk-border)" : undefined,
      }}
    >
      {(title || header || collapsible) && (
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex-1 min-w-0">
            {header ??
              (title && (
                <span
                  className="font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
                >
                  {title}
                </span>
              ))}
          </div>
          {collapsible && (
            <ChromeIconButton
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              {side === "left" ? "‹" : "›"}
            </ChromeIconButton>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-1.5 min-h-0 overflow-y-auto">{children}</div>

      {footer && (
        <div
          className="mt-2 pt-2"
          style={{ borderTop: "1px solid var(--mk-border)" }}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
