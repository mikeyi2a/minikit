"use client";

import * as React from "react";
import {
  Slider,
  DualSlider,
  CoordinateInput,
  Toggle,
  Select,
  PresetPicker,
  type SliderProps,
  type DualSliderProps,
  type CoordinateInputProps,
  type ToggleProps,
  type SelectProps,
  type PresetPickerProps,
} from "@/components";

type DemoSliderProps = Omit<SliderProps, "value" | "onValueChange"> & { defaultValue: number };

export function DemoSlider({ defaultValue, ...props }: DemoSliderProps) {
  const [value, setValue] = React.useState(defaultValue);
  return <Slider {...props} value={value} onValueChange={setValue} />;
}

type DemoDualSliderProps = Omit<DualSliderProps, "value" | "onValueChange"> & {
  defaultValue: [number, number];
};

export function DemoDualSlider({ defaultValue, ...props }: DemoDualSliderProps) {
  const [value, setValue] = React.useState(defaultValue);
  return <DualSlider {...props} value={value} onValueChange={setValue} />;
}

type DemoCoordinateProps = Omit<CoordinateInputProps, "x" | "y" | "onChange"> & {
  defaultX?: number;
  defaultY?: number;
};

export function DemoCoordinateInput({
  defaultX = 0,
  defaultY = 0,
  ...props
}: DemoCoordinateProps) {
  const [coords, setCoords] = React.useState({ x: defaultX, y: defaultY });
  return <CoordinateInput {...props} x={coords.x} y={coords.y} onChange={setCoords} />;
}

type DemoToggleProps = Omit<ToggleProps, "checked" | "onCheckedChange"> & { defaultChecked?: boolean };

export function DemoToggle({ defaultChecked = false, ...props }: DemoToggleProps) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return <Toggle {...props} checked={checked} onCheckedChange={setChecked} />;
}

type DemoSelectProps = Omit<SelectProps, "value" | "onValueChange"> & { defaultValue: string };

export function DemoSelect({ defaultValue, ...props }: DemoSelectProps) {
  const [value, setValue] = React.useState(defaultValue);
  return <Select {...props} value={value} onValueChange={setValue} />;
}

type DemoPresetProps = Omit<PresetPickerProps, "value" | "onValueChange"> & { defaultValue: string };

export function DemoPresetPicker({ defaultValue, ...props }: DemoPresetProps) {
  const [value, setValue] = React.useState(defaultValue);
  return <PresetPicker {...props} value={value} onValueChange={setValue} />;
}
