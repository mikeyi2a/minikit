"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  content,
  shortcut,
  children,
  side = "top",
  delayDuration = 300,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn("mk-tooltip z-50 animate-in fade-in-0 zoom-in-95", className)}
            style={{
              background: "var(--mk-surface-raised)",
              border: "1px solid var(--mk-border)",
              borderRadius: "var(--mk-radius-sm)",
              padding: "4px 8px",
              fontFamily: "var(--mk-font-mono)",
              fontSize: "10px",
              color: "var(--mk-text-muted)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            <span className="flex items-center gap-2">
              <span>{content}</span>
              {shortcut && (
                <kbd
                  className="px-1 py-0.5 rounded text-[9px] leading-none"
                  style={{
                    background: "color-mix(in srgb, var(--mk-text) 8%, transparent)",
                    color: "var(--mk-text-faint)",
                  }}
                >
                  {shortcut}
                </kbd>
              )}
            </span>
            <TooltipPrimitive.Arrow
              style={{
                fill: "var(--mk-surface-raised)",
              }}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
