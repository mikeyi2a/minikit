"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionPanelProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  className?: string;
}

export function AccordionPanel({ items, defaultOpen, className }: AccordionPanelProps) {
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={defaultOpen ?? items.slice(0, 1).map((i) => i.id)}
      className={cn("mk-accordion flex flex-col gap-1", className)}
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="rounded-lg overflow-hidden"
          style={{ ...mk.surface(4) }}
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between px-2.5 h-9 font-mono text-[10px] uppercase tracking-[0.06em] cursor-pointer group">
              <span style={mk.label}>{item.title}</span>
              <span
                className="flex items-center justify-center w-5 h-5 text-sm opacity-50 group-data-[state=open]:rotate-180 transition-transform shrink-0"
                aria-hidden
              >
                ▾
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-2.5 pb-2.5 pt-0 flex flex-col gap-1.5">
            {item.content}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
