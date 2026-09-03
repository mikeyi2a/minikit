"use client";

import type * as React from "react";

export { FieldGroup } from "@mikeyi2a/minikit-ui";

export interface FieldGroupProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  layout?: "stack" | "row";
}
