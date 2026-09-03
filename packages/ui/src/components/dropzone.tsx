"use client";

// Stub — Dropzone implementation pending.
import * as React from "react";

export interface DropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Dropzone(_props: DropzoneProps): React.ReactElement | null {
  return null;
}
