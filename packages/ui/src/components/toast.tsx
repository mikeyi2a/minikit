"use client";

// Stub — Toast implementation pending.
import * as React from "react";

export interface ToastProps {
  message: string;
  variant?: "default" | "success" | "warning" | "error";
  visible: boolean;
  onDismiss: () => void;
  className?: string;
}

export function Toast(_props: ToastProps): React.ReactElement | null {
  return null;
}
