"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface SidebarSectionProps {
  /**
   * Section label — rendered as a mono uppercase faint label above the content.
   * Omit if this is the first unnamed group (e.g. a single row of controls).
   */
  label?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SidebarSection — groups related controls with tight internal spacing and
 * a wider visual break from adjacent sections.
 *
 * Vertical rhythm rules:
 *   - Internal gap:  4px  (gap-1)  — tight within a group
 *   - Section gap:  10px  (gap-2.5) — breathing room between groups
 *   - Label margin: 4px  (mb-1)   — tight below the label
 *   - Label style:   mono, 9px, uppercase, tracking-wider, faint color
 *
 * Nesting:
 *   <SidebarSection label="Adjustments">
 *     <Slider ... />    ← gap-1 (4px)
 *     <Slider ... />    ← gap-1 (4px)
 *   </SidebarSection>
 *   ← gap-2.5 (10px) between sections
 *   <SidebarSection label="Export">
 *     <ExportButton ... />
 *   </SidebarSection>
 */
export function SidebarSection({ label, children, className }: SidebarSectionProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <span
          className="mb-1 font-mono text-[9px] uppercase tracking-wider select-none"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          {label}
        </span>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
