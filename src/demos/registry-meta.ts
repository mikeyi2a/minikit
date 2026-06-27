export type ComponentId =
  | "overview"
  | "segmented-control"
  | "slider"
  | "dual-slider"
  | "number-stepper"
  | "color-picker"
  | "badge"
  | "sidebar"
  | "tooltip"
  | "toggle"
  | "select"
  | "button"
  | "text-input"
  | "checkbox"
  | "radio-group"
  | "coordinate-input"
  | "preset-picker"
  | "field-group"
  | "panel"
  | "drawer"
  | "split-view"
  | "tabs"
  | "accordion"
  | "toolbar"
  | "dropzone"
  | "compare-slider"
  | "canvas-frame"
  | "export-button"
  | "layer-list"
  | "timeline"
  | "dialog"
  | "popover"
  | "empty-state"
  | "progress-bar"
  | "status-bar"
  | "toast"
  | "panel-preview"
  | "image-tool"
  | "floating-tool";

export type ComponentCategory = "core" | "input" | "layout" | "tool" | "feedback" | "preview";

export interface ComponentMeta {
  id: ComponentId;
  name: string;
  description: string;
  category: ComponentCategory;
}

export const COMPONENT_META: ComponentMeta[] = [
  { id: "overview", name: "Overview", description: "Full component matrix and capabilities.", category: "core" },
  { id: "floating-tool", name: "Floating Tool", description: "Composed demo — floating Panel + presets + StatusBar + Toast.", category: "preview" },
  { id: "image-tool", name: "Image Tool", description: "Sidebar tool — Dropzone + Sliders + CanvasFrame + Export.", category: "preview" },
  { id: "panel-preview", name: "Panel Preview", description: "Camera-controls-style docked panel.", category: "preview" },
  // Core controls
  { id: "segmented-control", name: "SegmentedControl", description: "Compact mode switcher / tab bar.", category: "core" },
  { id: "slider", name: "Slider", description: "Value slider with label, hint, ticks, readout.", category: "core" },
  { id: "dual-slider", name: "DualSlider", description: "Two-handle range slider.", category: "core" },
  { id: "number-stepper", name: "NumberStepper", description: "+/− numeric input with keyboard support.", category: "core" },
  { id: "color-picker", name: "ColorPicker", description: "Swatches, hex input, eyedropper.", category: "core" },
  { id: "badge", name: "Badge", description: "Hint chip or status label.", category: "core" },
  { id: "tooltip", name: "Tooltip", description: "Shortcut-aware hover tooltip.", category: "core" },
  // Inputs
  { id: "toggle", name: "Toggle", description: "On/off switch for tool options.", category: "input" },
  { id: "select", name: "Select", description: "Dropdown for formats, presets, modes.", category: "input" },
  { id: "button", name: "Button", description: "Primary, secondary, ghost, danger + IconButton.", category: "input" },
  { id: "text-input", name: "TextInput", description: "Single-line text field.", category: "input" },
  { id: "checkbox", name: "Checkbox", description: "Multi-option toggles.", category: "input" },
  { id: "radio-group", name: "RadioGroup", description: "Single choice from a list.", category: "input" },
  { id: "coordinate-input", name: "CoordinateInput", description: "X/Y position pair.", category: "input" },
  { id: "preset-picker", name: "PresetPicker", description: "Preset chip grid with add slot.", category: "input" },
  { id: "field-group", name: "FieldGroup", description: "Label + control layout wrapper.", category: "input" },
  // Layout
  { id: "sidebar", name: "Sidebar", description: "Docked collapsible control column.", category: "layout" },
  { id: "panel", name: "Panel", description: "Docked or floating draggable panel.", category: "layout" },
  { id: "drawer", name: "Drawer", description: "Slide-over panel from edge.", category: "layout" },
  { id: "split-view", name: "SplitView", description: "Resizable before/after split.", category: "layout" },
  { id: "tabs", name: "Tabs", description: "Horizontal tabbed sections.", category: "layout" },
  { id: "accordion", name: "Accordion", description: "Collapsible control sections.", category: "layout" },
  // Tool / canvas
  { id: "toolbar", name: "Toolbar", description: "Tool-mode icon strip — select, draw, annotate. H or V.", category: "tool" },
  { id: "dropzone", name: "Dropzone", description: "File drop with preview.", category: "tool" },
  { id: "compare-slider", name: "CompareSlider", description: "Before/after image compare.", category: "tool" },
  { id: "canvas-frame", name: "CanvasFrame", description: "Output preview with zoom + bg.", category: "tool" },
  { id: "export-button", name: "ExportButton", description: "Export with loading states.", category: "tool" },
  { id: "layer-list", name: "LayerList", description: "Layer stack with visibility + reorder.", category: "tool" },
  { id: "timeline", name: "Timeline", description: "Animation timeline with keyframes, shots, and playback.", category: "tool" },
  // Feedback
  { id: "dialog", name: "Dialog", description: "Modal for settings or confirmations.", category: "feedback" },
  { id: "popover", name: "Popover", description: "Anchored contextual panel.", category: "feedback" },
  { id: "empty-state", name: "EmptyState", description: "Placeholder when nothing loaded.", category: "feedback" },
  { id: "progress-bar", name: "ProgressBar", description: "Determinate or indeterminate progress.", category: "feedback" },
  { id: "status-bar", name: "StatusBar", description: "Bottom info strip (dims, zoom, status).", category: "feedback" },
  { id: "toast", name: "Toast", description: "Ephemeral success/error message.", category: "feedback" },
];

export function isComponentId(id: string): id is ComponentId {
  return COMPONENT_META.some((entry) => entry.id === id);
}

export const COMPONENT_COUNT = COMPONENT_META.filter((c) => c.id !== "overview").length;
