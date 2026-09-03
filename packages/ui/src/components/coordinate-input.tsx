"use client";

// Stub — CoordinateInput implementation pending.
import * as React from "react";

export interface CoordinateInputProps {
  label?: string;
  x: number;
  y: number;
  onChange: (coords: { x: number; y: number }) => void;
  className?: string;
}

export function CoordinateInput(_props: CoordinateInputProps): React.ReactElement | null {
  return null;
}
