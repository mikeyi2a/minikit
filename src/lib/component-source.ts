import fs from "node:fs";
import path from "node:path";
import type { ComponentId } from "@/demos/registry-meta";

/** Maps component id → source filename in src/components/ */
export const COMPONENT_SOURCE_FILES: Partial<Record<ComponentId, string>> = {
  "segmented-control": "segmented-control.tsx",
  slider: "slider.tsx",
  "dual-slider": "dual-slider.tsx",
  "number-stepper": "number-stepper.tsx",
  "color-picker": "color-picker.tsx",
  badge: "badge.tsx",
  sidebar: "sidebar.tsx",
  tooltip: "tooltip.tsx",
  toggle: "toggle.tsx",
  select: "select.tsx",
  button: "button.tsx",
  "text-input": "text-input.tsx",
  checkbox: "checkbox.tsx",
  "radio-group": "radio-group.tsx",
  "coordinate-input": "coordinate-input.tsx",
  "preset-picker": "preset-picker.tsx",
  "field-group": "field-group.tsx",
  panel: "panel.tsx",
  drawer: "drawer.tsx",
  "split-view": "split-view.tsx",
  tabs: "tabs.tsx",
  accordion: "accordion.tsx",
  toolbar: "toolbar.tsx",
  dropzone: "dropzone.tsx",
  "compare-slider": "compare-slider.tsx",
  "canvas-frame": "canvas-frame.tsx",
  "export-button": "export-button.tsx",
  "layer-list": "layer-list.tsx",
  timeline: "timeline.tsx",
  dialog: "dialog.tsx",
  popover: "popover.tsx",
  "empty-state": "empty-state.tsx",
  "progress-bar": "progress-bar.tsx",
  "status-bar": "status-bar.tsx",
  toast: "toast.tsx",
};

export function getComponentSource(id: ComponentId): string | null {
  const file = COMPONENT_SOURCE_FILES[id];
  if (!file) return null;

  try {
    return fs.readFileSync(path.join(process.cwd(), "src/components", file), "utf-8");
  } catch {
    return null;
  }
}

export function getUtilsSource(): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), "src/lib/utils.ts"), "utf-8");
  } catch {
    return null;
  }
}
