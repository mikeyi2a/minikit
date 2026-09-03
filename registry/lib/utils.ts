import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function stepValue(value: number, step: number) {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export function formatValue(value: number, step?: number) {
  if (step !== undefined && step < 1) {
    const decimals = step.toString().split(".")[1]?.length ?? 2;
    return value.toFixed(decimals);
  }
  return String(value);
}
