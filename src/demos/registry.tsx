"use client";

import * as React from "react";
import {
  DualSliderDemo,
  ColorPickerDemo,
  ToolbarDemo,
  DropzoneDemo,
  CompareSliderDemo,
  CanvasFrameDemo,
  ExportButtonDemo,
  ImageToolDemo,
  TimelineDemo,
} from "@/demos/tool-demos";
import {
  PanelDemo,
  DrawerDemo,
  SplitViewDemo,
  TabsDemo,
  AccordionDemo,
  FieldGroupDemo,
  ButtonDemo,
  ToggleDemo,
  SelectDemo,
  TextInputDemo,
  CheckboxDemo,
  RadioGroupDemo,
  CoordinateInputDemo,
  PresetPickerDemo,
  DialogDemo,
  PopoverDemo,
  EmptyStateDemo,
  ProgressBarDemo,
  StatusBarDemo,
  ToastDemo,
  LayerListDemo,
  FloatingToolDemo,
} from "@/demos/extended-demos";
import { DemoSlider, DemoDualSlider } from "@/demos/demo-controls";
import type { ComponentId } from "@/demos/registry-meta";

export interface ComponentEntry {
  Demo: React.ComponentType;
  // Add more fields here if needed (e.g. props source, variants).
}

const FallbackDemo: React.FC = () => (
  <div
    className="p-6 rounded-lg text-xs font-mono uppercase tracking-wider"
    style={{
      background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
      color: "var(--mk-text-muted)",
      fontFamily: "var(--mk-font-mono)",
    }}
  >
    Demo coming soon
  </div>
);

const SliderStandaloneDemo: React.FC = () => (
  <div className="w-full max-w-md">
    <DemoSlider label="Value" defaultValue={50} min={0} max={100} />
  </div>
);

const SegmentedControlDemo: React.FC = () => {
  const [value, setValue] = React.useState("grid");
  return (
    <div
      className="inline-flex p-1 rounded-xl"
      style={{ background: "color-mix(in srgb, var(--mk-text) 5%, transparent)" }}
    >
      {["grid", "list", "board"].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setValue(v)}
          className="px-2 h-[26px] text-[10px] font-mono uppercase tracking-[0.06em] rounded-lg transition-all cursor-pointer"
          style={{
            fontFamily: "var(--mk-font-mono)",
            background:
              v === value
                ? "color-mix(in srgb, var(--mk-surface) 72%, black)"
                : "transparent",
            color: v === value ? "var(--mk-text)" : "var(--mk-text-faint)",
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
};

const NumberStepperDemo: React.FC = () => {
  const [v, setV] = React.useState(0);
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setV((n) => n - 1)}
        className="w-7 h-7 rounded-lg text-sm font-mono"
        style={{
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          color: "var(--mk-text)",
        }}
      >
        −
      </button>
      <span
        className="w-10 text-center font-mono text-xs"
        style={{ color: "var(--mk-text)" }}
      >
        {v}
      </span>
      <button
        type="button"
        onClick={() => setV((n) => n + 1)}
        className="w-7 h-7 rounded-lg text-sm font-mono"
        style={{
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          color: "var(--mk-text)",
        }}
      >
        +
      </button>
    </div>
  );
};

const BadgeDemo: React.FC = () => (
  <span
    className="inline-flex items-center font-mono font-medium uppercase tracking-[0.06em] rounded leading-none px-1.5 py-0.5 text-[10px]"
    style={{
      background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
      color: "var(--mk-text)",
    }}
  >
    New
  </span>
);

const TooltipDemo: React.FC = () => (
  <span
    className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded"
    style={{
      background: "var(--mk-surface-raised)",
      color: "var(--mk-text-muted)",
    }}
  >
    Hover me
  </span>
);

const SidebarDemo: React.FC = () => (
  <div
    className="w-56 h-64 rounded-lg p-3 text-xs font-mono"
    style={{
      background: "var(--mk-surface)",
      borderColor: "var(--mk-border)",
      color: "var(--mk-text-muted)",
    }}
  >
    Sidebar container
  </div>
);

const PanelPreviewDemo: React.FC = () => (
  <div
    className="w-80 h-64 rounded-lg p-4 text-xs font-mono"
    style={{
      background: "var(--mk-surface-raised)",
      color: "var(--mk-text-muted)",
    }}
  >
    Panel preview
  </div>
);

const REGISTRY: Record<ComponentId, ComponentEntry> = {
  overview: { Demo: FallbackDemo },
  "segmented-control": { Demo: SegmentedControlDemo },
  slider: { Demo: SliderStandaloneDemo },
  "dual-slider": { Demo: DualSliderDemo },
  "number-stepper": { Demo: NumberStepperDemo },
  "color-picker": { Demo: ColorPickerDemo },
  badge: { Demo: BadgeDemo },
  sidebar: { Demo: SidebarDemo },
  tooltip: { Demo: TooltipDemo },
  toggle: { Demo: ToggleDemo },
  select: { Demo: SelectDemo },
  button: { Demo: ButtonDemo },
  "text-input": { Demo: TextInputDemo },
  checkbox: { Demo: CheckboxDemo },
  "radio-group": { Demo: RadioGroupDemo },
  "coordinate-input": { Demo: CoordinateInputDemo },
  "preset-picker": { Demo: PresetPickerDemo },
  "field-group": { Demo: FieldGroupDemo },
  panel: { Demo: PanelDemo },
  drawer: { Demo: DrawerDemo },
  "split-view": { Demo: SplitViewDemo },
  tabs: { Demo: TabsDemo },
  accordion: { Demo: AccordionDemo },
  toolbar: { Demo: ToolbarDemo },
  dropzone: { Demo: DropzoneDemo },
  "compare-slider": { Demo: CompareSliderDemo },
  "canvas-frame": { Demo: CanvasFrameDemo },
  "export-button": { Demo: ExportButtonDemo },
  "layer-list": { Demo: LayerListDemo },
  timeline: { Demo: TimelineDemo },
  dialog: { Demo: DialogDemo },
  popover: { Demo: PopoverDemo },
  "empty-state": { Demo: EmptyStateDemo },
  "progress-bar": { Demo: ProgressBarDemo },
  "status-bar": { Demo: StatusBarDemo },
  toast: { Demo: ToastDemo },
  "panel-preview": { Demo: PanelPreviewDemo },
  "image-tool": { Demo: ImageToolDemo },
  "floating-tool": { Demo: FloatingToolDemo },
};

export function getComponent(id: ComponentId): ComponentEntry {
  return REGISTRY[id] ?? { Demo: FallbackDemo };
}

export function getAllComponents(): ComponentId[] {
  return Object.keys(REGISTRY) as ComponentId[];
}
