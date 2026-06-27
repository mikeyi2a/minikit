"use client";

import * as React from "react";
import {
  SegmentedControl,
  Slider,
  NumberStepper,
  Badge,
  Sidebar,
  Tooltip,
} from "@/components";
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
import {
  COMPONENT_META,
  COMPONENT_COUNT,
  type ComponentId,
  type ComponentMeta,
} from "@/demos/registry-meta";

export type { ComponentId } from "@/demos/registry-meta";

export interface ComponentEntry extends ComponentMeta {
  Demo: React.ComponentType;
}

function SegmentedControlDemo() {
  const [mode, setMode] = React.useState<"manual" | "presets">("manual");
  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <SegmentedControl
        items={[
          { value: "manual", label: "Manual" },
          { value: "presets", label: "Presets" },
        ]}
        value={mode}
        onValueChange={setMode}
      />
      <p className="text-xs" style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}>
        Active: {mode}
      </p>
    </div>
  );
}

function SliderDemo() {
  const [tilt, setTilt] = React.useState(0);
  const [zoom, setZoom] = React.useState(2.2);
  const [fov, setFov] = React.useState(45);

  return (
    <div className="flex flex-col gap-1.5 max-w-sm">
      <Slider label="Tilt X" hint="Drag" value={tilt} onValueChange={setTilt} min={-180} max={180} />
      <Slider label="FOV" value={fov} onValueChange={setFov} min={1} max={120} />
      <Slider
        label="Zoom"
        hint="Scroll"
        value={zoom}
        onValueChange={setZoom}
        min={0.1}
        max={10}
        step={0.01}
      />
    </div>
  );
}

function NumberStepperDemo() {
  const [width, setWidth] = React.useState(1920);
  const [height, setHeight] = React.useState(1080);

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <NumberStepper label="Width" value={width} onValueChange={setWidth} min={1} max={8192} step={1} />
      <NumberStepper label="Height" value={height} onValueChange={setHeight} min={1} max={8192} step={1} />
    </div>
  );
}

function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Drag</Badge>
      <Badge variant="accent">Live</Badge>
      <Badge variant="muted">Scroll</Badge>
      <Badge variant="outline">Space Drag</Badge>
    </div>
  );
}

function SidebarDemo() {
  const [tab, setTab] = React.useState<"manual" | "presets">("manual");
  const [tilt, setTilt] = React.useState(-12);
  const [roll, setRoll] = React.useState(-72);
  const [fov, setFov] = React.useState(45);

  return (
    <div
      className="flex rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--mk-border)", height: 320 }}
    >
      <Sidebar title="Controls" collapsible width={194}>
        <SegmentedControl
          items={[
            { value: "manual", label: "Manual" },
            { value: "presets", label: "Presets" },
          ]}
          value={tab}
          onValueChange={setTab}
        />
        {tab === "manual" ? (
          <>
            <Slider label="Tilt X" hint="Drag" value={tilt} onValueChange={setTilt} min={-180} max={180} />
            <Slider label="Roll" value={roll} onValueChange={setRoll} min={-180} max={180} />
            <Slider label="FOV" value={fov} onValueChange={setFov} min={1} max={120} />
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center flex-1 rounded-lg border border-dashed"
            style={{
              borderColor: "var(--mk-border)",
              background: "color-mix(in srgb, var(--mk-text) 3%, transparent)",
              minHeight: 180,
            }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
            >
              No Presets Found
            </span>
          </div>
        )}
      </Sidebar>
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "var(--mk-bg)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          Canvas area
        </span>
      </div>
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip content="Reset view" shortcut="R">
        <button
          type="button"
          className="h-8 px-3 rounded-lg font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: "var(--mk-text-muted)",
            fontFamily: "var(--mk-font-mono)",
          }}
        >
          Hover me
        </button>
      </Tooltip>
      <Tooltip content="Toggle grid" shortcut="G" side="bottom">
        <button
          type="button"
          className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: "var(--mk-text-muted)",
            fontFamily: "var(--mk-font-mono)",
          }}
        >
          ⊞
        </button>
      </Tooltip>
    </div>
  );
}

function PanelPreviewDemo() {
  const [tab, setTab] = React.useState<"manual" | "presets">("manual");
  const [controls, setControls] = React.useState([
    { id: "tilt-x", label: "Tilt X", value: 0, min: -180, max: 180, hint: "Drag" },
    { id: "tilt-y", label: "Tilt Y", value: 0, min: -180, max: 180, hint: "Drag" },
    { id: "roll", label: "Roll", value: -72, min: -180, max: 180 },
    { id: "fov", label: "FOV", value: 45, min: 1, max: 120 },
    { id: "zoom", label: "Zoom", value: 2.2, min: 0.1, max: 10, hint: "Scroll", step: 0.01 },
  ]);

  const update = (id: string, value: number) => {
    setControls((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  return (
    <div
      className="inline-flex flex-col rounded-xl overflow-hidden"
      style={{
        background: "var(--mk-surface)",
        border: "1px solid var(--mk-border)",
        width: 194,
      }}
    >
      <div className="p-2">
        <SegmentedControl
          items={[
            { value: "manual", label: "Manual" },
            { value: "presets", label: "Presets" },
          ]}
          value={tab}
          onValueChange={setTab}
        />
        <div className="flex flex-col gap-1.5 mt-2 pb-1">
          {tab === "manual"
            ? controls.map((c) => (
                <Slider
                  key={c.id}
                  label={c.label}
                  hint={c.hint}
                  value={c.value}
                  onValueChange={(v) => update(c.id, v)}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                />
              ))
            : (
              <div
                className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg"
                style={{
                  borderColor: "var(--mk-border)",
                  background: "color-mix(in srgb, var(--mk-text) 3%, transparent)",
                }}
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
                >
                  No Presets Found
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function OverviewDemo() {
  const groups = [
    { title: "Core", items: ["Slider", "DualSlider", "ColorPicker", "SegmentedControl"] },
    { title: "Input", items: ["Toggle", "Select", "Button", "PresetPicker"] },
    { title: "Layout", items: ["Panel", "Sidebar", "Drawer", "SplitView", "Tabs"] },
    { title: "Tool", items: ["CanvasFrame", "Dropzone", "CompareSlider", "LayerList"] },
    { title: "Feedback", items: ["Dialog", "Toast", "ProgressBar", "EmptyState"] },
  ];

  return (
    <div className="max-w-lg space-y-5">
      <p className="text-sm leading-relaxed m-0" style={{ color: "var(--mk-text-muted)" }}>
        {COMPONENT_COUNT} components for building mini creative tools. All use{" "}
        <code className="text-xs">--mk-*</code> tokens — override to rebrand. Panels can dock or float.
      </p>
      {groups.map((g) => (
        <div key={g.title}>
          <span
            className="block font-mono text-[9px] uppercase tracking-wider mb-1.5"
            style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
          >
            {g.title}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((name) => (
              <Badge key={name} variant="outline">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const DEMOS: Record<ComponentId, React.ComponentType> = {
  overview: OverviewDemo,
  "floating-tool": FloatingToolDemo,
  "image-tool": ImageToolDemo,
  "panel-preview": PanelPreviewDemo,
  "segmented-control": SegmentedControlDemo,
  slider: SliderDemo,
  "dual-slider": DualSliderDemo,
  "number-stepper": NumberStepperDemo,
  "color-picker": ColorPickerDemo,
  badge: BadgeDemo,
  sidebar: SidebarDemo,
  tooltip: TooltipDemo,
  toggle: ToggleDemo,
  select: SelectDemo,
  button: ButtonDemo,
  "text-input": TextInputDemo,
  checkbox: CheckboxDemo,
  "radio-group": RadioGroupDemo,
  "coordinate-input": CoordinateInputDemo,
  "preset-picker": PresetPickerDemo,
  "field-group": FieldGroupDemo,
  panel: PanelDemo,
  drawer: DrawerDemo,
  "split-view": SplitViewDemo,
  tabs: TabsDemo,
  accordion: AccordionDemo,
  toolbar: ToolbarDemo,
  dropzone: DropzoneDemo,
  "compare-slider": CompareSliderDemo,
  "canvas-frame": CanvasFrameDemo,
  "export-button": ExportButtonDemo,
  "layer-list": LayerListDemo,
  timeline: TimelineDemo,
  dialog: DialogDemo,
  popover: PopoverDemo,
  "empty-state": EmptyStateDemo,
  "progress-bar": ProgressBarDemo,
  "status-bar": StatusBarDemo,
  toast: ToastDemo,
};

export const COMPONENT_REGISTRY: ComponentEntry[] = COMPONENT_META.map((meta) => ({
  ...meta,
  Demo: DEMOS[meta.id],
}));

export function getComponent(id: ComponentId): ComponentEntry {
  return COMPONENT_REGISTRY.find((c) => c.id === id) ?? COMPONENT_REGISTRY[0];
}
