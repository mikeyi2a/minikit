"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { mk } from "@/lib/mk-styles";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  width?: number;
}

export function Popover({ trigger, children, side = "bottom", align = "start", width = 200 }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className="z-50 rounded-xl border p-2 mk-ring-elevated"
          style={{
            width,
            background: "var(--mk-surface-raised)",
            borderColor: "var(--mk-border)",
          }}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function PopoverLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[9px] uppercase tracking-wider mb-2 px-1" style={mk.faint}>
      {children}
    </span>
  );
}
