"use client";

// Stub — Tooltip implementation pending. toolbar.tsx imports Tooltip from here.
// Real Radix-based implementation will replace this file.
import * as React from "react";

export interface TooltipProps {
  content?: React.ReactNode;
  shortcut?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Tooltip({ children }: TooltipProps): React.ReactElement | null {
  return <>{children}</>;
}
