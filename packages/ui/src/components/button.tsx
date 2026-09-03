"use client";

// Stub — Button/IconButton implementation pending.
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button(_props: ButtonProps): React.ReactElement | null {
  return null;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

export function IconButton(_props: IconButtonProps): React.ReactElement | null {
  return null;
}
