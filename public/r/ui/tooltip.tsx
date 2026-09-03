"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  shortcut?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  shortcut,
  side = "top",
  align = "center",
  delayDuration = 400,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={4}
            className={cn(
              "z-50 px-2 py-1 rounded text-[10px] font-mono font-medium tracking-[0.06em] uppercase leading-none",
              className,
            )}
            style={{
              background: "color-mix(in srgb, var(--mk-text) 85%, transparent)",
              color: "color-mix(in srgb, var(--mk-surface) 85%, transparent)",
              fontFamily: "var(--mk-font-mono)",
            }}
          >
            {content}
            {shortcut && (
              <span
                className="ml-2 opacity-60"
                style={{ fontFamily: "var(--mk-font-mono)" }}
              >
                {shortcut}
              </span>
            )}
            <TooltipPrimitive.Arrow
              style={{
                fill: "color-mix(in srgb, var(--mk-text) 85%, transparent)",
              }}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
