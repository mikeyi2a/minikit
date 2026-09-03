"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? items[0]?.value} className={cn("mk-tabs flex flex-col gap-3", className)}>
      <TabsPrimitive.List className="flex gap-1 border-b pb-px" style={{ borderColor: "var(--mk-border)" }}>
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className="px-3 h-8 font-mono text-[10px] uppercase tracking-[0.06em] cursor-pointer opacity-50 data-[state=active]:opacity-100 transition-opacity border-b-2 border-transparent data-[state=active]:border-white/40 -mb-px"
            style={mk.label}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="outline-none data-[state=inactive]:hidden"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
