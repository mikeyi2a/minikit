"use client";

// Stub — StatusBar implementation pending.
import * as React from "react";

export interface StatusBarItem {
  id: string;
  label: string;
  variant?: "default" | "success" | "warning" | "error";
}

export interface StatusBarProps {
  items: StatusBarItem[];
  className?: string;
}

export function StatusBar(_props: StatusBarProps): React.ReactElement | null {
  return null;
}
