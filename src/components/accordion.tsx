"use client";

import type * as React from "react";

export { AccordionPanel } from "@mikeyi2a/minikit-ui";

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
