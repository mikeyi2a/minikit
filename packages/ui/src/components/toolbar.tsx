"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Tooltip } from "./tooltip";

export interface ToolbarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export interface ToolbarProps {
  items: ToolbarItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Toolbar({ items, orientation = "horizontal", className }: ToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-orientation={orientation}
      className={cn(
        "mk-toolbar inline-flex gap-1 p-1 rounded-xl",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      style={{
        background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
      }}
    >
      {items.map((item) => {
        const button = (
          <button
            key={item.id}
            type="button"
            role="toolbaritem"
            aria-label={item.label}
            aria-pressed={item.active}
            disabled={item.disabled}
            onClick={item.onClick}
            className={cn(
              "flex items-center justify-center rounded-lg transition-all cursor-pointer",
              orientation === "vertical" ? "w-8 h-8" : "h-8 min-w-8 px-2",
              item.disabled && "opacity-40 cursor-not-allowed",
            )}
            style={{
              background: item.active
                ? "color-mix(in srgb, var(--mk-text) 12%, transparent)"
                : "transparent",
              color: item.active ? "var(--mk-text)" : "var(--mk-text-muted)",
            }}
          >
            {item.icon ?? (
              <span
                className="font-mono text-[11px] font-medium uppercase leading-none"
                style={{ fontFamily: "var(--mk-font-mono)" }}
              >
                {item.shortcut?.length === 1
                  ? item.shortcut
                  : item.label.charAt(0)}
              </span>
            )}
          </button>
        );

        if (item.shortcut) {
          return (
            <Tooltip key={item.id} content={item.label} shortcut={item.shortcut}>
              {button}
            </Tooltip>
          );
        }

        return <React.Fragment key={item.id}>{button}</React.Fragment>;
      })}
    </div>
  );
}
