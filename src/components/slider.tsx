"use client";

export { Slider } from "@mikeyi2a/minikit-ui";

export interface SliderProps {
  label: string;
  hint?: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  tickCount?: number;
  snapToTicks?: boolean;
  className?: string;
  disabled?: boolean;
}
