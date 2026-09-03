"use client";

// Stub — TextInput implementation pending.
import * as React from "react";

export interface TextInputProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export function TextInput(_props: TextInputProps): React.ReactElement | null {
  return null;
}
