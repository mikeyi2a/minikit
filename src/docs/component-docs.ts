import type { ComponentId } from "@/demos/registry-meta";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  whenToUse: string;
  props: PropDoc[];
  usageExample?: string;
}

const BASE: PropDoc[] = [
  { name: "className", type: "string", description: "Optional CSS class." },
];

const DOCS: Partial<Record<ComponentId, ComponentDoc>> = {
  slider: {
    whenToUse: "Primary control for numeric parameters — opacity, blur, exposure, dimensions. Supports label, hint chip, ticks, and inline numeric readout.",
    props: [
      { name: "value", type: "number", description: "Current value (controlled)." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called when value changes." },
      { name: "min", type: "number", default: "0", description: "Minimum value." },
      { name: "max", type: "number", default: "100", description: "Maximum value." },
      { name: "step", type: "number", default: "1", description: "Step increment." },
      { name: "label", type: "string", description: "Label shown inside the track." },
      { name: "hint", type: "string", description: "Hint chip next to label (e.g. Drag)." },
      { name: "showValue", type: "boolean", default: "true", description: "Show numeric input." },
      { name: "tickCount", type: "number", default: "9", description: "Number of tick marks." },
      { name: "snapToTicks", type: "boolean", default: "true when tickCount > 0", description: "Soft magnetic snap to tick positions while dragging." },
      { name: "disabled", type: "boolean", default: "false", description: "Disable interaction." },
      ...BASE,
    ],
    usageExample: `<Slider label="Opacity" value={80} onValueChange={setOpacity} min={0} max={100} />`,
  },
  "dual-slider": {
    whenToUse: "Range inputs — levels, exposure min/max, filter thresholds with two handles.",
    props: [
      { name: "value", type: "[number, number]", description: "Start and end values." },
      { name: "onValueChange", type: "(value: [number, number]) => void", description: "Called on change." },
      { name: "min", type: "number", default: "0", description: "Minimum." },
      { name: "max", type: "number", default: "100", description: "Maximum." },
      { name: "step", type: "number", default: "1", description: "Step increment." },
      { name: "label", type: "string", description: "Optional label above track." },
      ...BASE,
    ],
  },
  "segmented-control": {
    whenToUse: "Compact mode switcher — Manual/Presets, Adjust/Export, tool modes in a sidebar.",
    props: [
      { name: "items", type: "SegmentedControlItem[]", description: "Tab options." },
      { name: "value", type: "string", description: "Active value." },
      { name: "onValueChange", type: "(value: T) => void", description: "Called on select." },
      { name: "size", type: '"sm" | "md"', default: "sm", description: "Control size." },
      ...BASE,
    ],
  },
  panel: {
    whenToUse: "Control surface docked to an edge or floating over the canvas. Use floating for overlay tools that shouldn't block the preview.",
    props: [
      { name: "mode", type: '"docked" | "floating"', default: "docked", description: "Docked column or draggable overlay." },
      { name: "title", type: "string", description: "Panel header title." },
      { name: "width", type: "number", default: "220", description: "Panel width in px." },
      { name: "collapsible", type: "boolean", default: "true", description: "Show collapse control." },
      { name: "defaultPosition", type: "{ x, y }", description: "Initial position when floating." },
      { name: "children", type: "ReactNode", description: "Panel content." },
      ...BASE,
    ],
  },
  dropzone: {
    whenToUse: "Entry point for file-based tools — drop or click to load images/files.",
    props: [
      { name: "onFileAccept", type: "(file: File) => void", description: "Called with accepted file." },
      { name: "accept", type: "string", default: "image/*", description: "Accepted MIME types." },
      { name: "maxSize", type: "number", default: "10MB", description: "Max file size in bytes." },
      { name: "preview", type: "string | null", description: "Preview URL for loaded file." },
      ...BASE,
    ],
  },
  "canvas-frame": {
    whenToUse: "Output preview area — wraps canvas/content with aspect ratio, zoom, and background options.",
    props: [
      { name: "children", type: "ReactNode", description: "Canvas content." },
      { name: "aspectRatio", type: "number | string", default: "16/9", description: "Preview aspect ratio." },
      { name: "zoom", type: "number", default: "1", description: "Zoom level." },
      { name: "background", type: '"transparent" | "white" | "custom"', default: "transparent", description: "Background mode." },
      { name: "onZoomChange", type: "(zoom: number) => void", description: "Zoom change handler." },
      ...BASE,
    ],
  },
  toolbar: {
    whenToUse: "Tool-mode switcher — select, draw, text, crop. Pass icons or single-key shortcuts.",
    props: [
      { name: "items", type: "ToolbarItem[]", description: "Toolbar buttons." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: "horizontal", description: "Layout direction." },
      ...BASE,
    ],
  },
  toggle: {
    whenToUse: "Boolean tool options — show grid, snap to pixel, include metadata.",
    props: [
      { name: "label", type: "string", description: "Option label." },
      { name: "checked", type: "boolean", description: "Current state." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Change handler." },
      ...BASE,
    ],
  },
  "field-group": {
    whenToUse: "Wrap any control with a consistent label + hint layout in sidebars.",
    props: [
      { name: "label", type: "string", description: "Field label." },
      { name: "hint", type: "string", description: "Hint chip." },
      { name: "layout", type: '"stack" | "row"', default: "stack", description: "Label placement." },
      { name: "children", type: "ReactNode", description: "Control(s)." },
      ...BASE,
    ],
  },
  "image-tool": {
    whenToUse: "Composed recipe: Sidebar + Dropzone + Sliders + CanvasFrame + ExportButton for a basic image editor.",
    props: [],
  },
  "floating-tool": {
    whenToUse: "Composed recipe: floating Panel over canvas with presets, StatusBar, and Toast feedback.",
    props: [],
  },
  "panel-preview": {
    whenToUse: "Composed recipe: camera-controls-style docked sidebar with SegmentedControl + Sliders.",
    props: [],
  },
};

const FALLBACK: ComponentDoc = {
  whenToUse: "See the live demo above. Copy the source from the code panel below into your project.",
  props: BASE,
};

export function getComponentDoc(id: ComponentId): ComponentDoc {
  return DOCS[id] ?? FALLBACK;
}

/** Extend docs for remaining components with category defaults */
const CATEGORY_DEFAULTS: Partial<Record<ComponentId, Partial<ComponentDoc>>> = {
  "number-stepper": {
    whenToUse: "Precise numeric input with +/- buttons — width, height, counts.",
    props: [
      { name: "value", type: "number", description: "Current value." },
      { name: "onValueChange", type: "(value: number) => void", description: "Change handler." },
      { name: "min", type: "number", default: "0", description: "Minimum." },
      { name: "max", type: "number", default: "100", description: "Maximum." },
      { name: "step", type: "number", default: "1", description: "Step." },
      { name: "label", type: "string", description: "Field label." },
      ...BASE,
    ],
  },
  "color-picker": {
    whenToUse: "Accent/foreground color selection with swatches, hex input, and optional eyedropper.",
    props: [
      { name: "value", type: "string", description: "Hex color value." },
      { name: "onValueChange", type: "(color: string) => void", description: "Change handler." },
      { name: "swatches", type: "string[]", description: "Preset colors." },
      { name: "showEyedropper", type: "boolean", default: "true", description: "Show eyedropper button." },
      ...BASE,
    ],
  },
  badge: {
    whenToUse: "Hint chips (Drag, Scroll) or status labels in control panels.",
    props: [
      { name: "variant", type: '"default" | "accent" | "muted" | "outline"', default: "default", description: "Visual style." },
      { name: "children", type: "ReactNode", description: "Badge text." },
      ...BASE,
    ],
  },
  sidebar: {
    whenToUse: "Docked control column for tool settings — left or right.",
    props: [
      { name: "children", type: "ReactNode", description: "Sidebar content." },
      { name: "width", type: "number", default: "194", description: "Width in px." },
      { name: "collapsible", type: "boolean", description: "Allow collapse." },
      { name: "side", type: '"left" | "right"', default: "left", description: "Dock side." },
      ...BASE,
    ],
  },
  tooltip: {
    whenToUse: "Hover labels with optional keyboard shortcut display.",
    props: [
      { name: "content", type: "ReactNode", description: "Tooltip text." },
      { name: "shortcut", type: "string", description: "Keyboard shortcut badge." },
      { name: "children", type: "ReactNode", description: "Trigger element." },
      ...BASE,
    ],
  },
  select: {
    whenToUse: "Dropdown for export format, blend mode, preset category.",
    props: [
      { name: "value", type: "string", description: "Selected value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Change handler." },
      { name: "options", type: "SelectOption[]", description: "Dropdown options." },
      { name: "label", type: "string", description: "Field label." },
      ...BASE,
    ],
  },
  button: {
    whenToUse: "Primary actions — Export, Apply, Reset. IconButton for compact toolbar icons.",
    props: [
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "danger"', default: "secondary", description: "Button style." },
      { name: "size", type: '"sm" | "md"', default: "sm", description: "Button size." },
      { name: "children", type: "ReactNode", description: "Button label." },
      ...BASE,
    ],
  },
  "compare-slider": {
    whenToUse: "Before/after image comparison with draggable divider.",
    props: [
      { name: "beforeSrc", type: "string", description: "Before image URL." },
      { name: "afterSrc", type: "string", description: "After image URL." },
      { name: "position", type: "number", description: "Divider position 0–100." },
      { name: "onPositionChange", type: "(pos: number) => void", description: "Position change handler." },
      ...BASE,
    ],
  },
  "export-button": {
    whenToUse: "Trigger PNG/JPG/SVG export or copy-to-clipboard with loading states.",
    props: [
      { name: "onExport", type: "(format) => void | Promise<void>", description: "Export handler." },
      { name: "formats", type: "ExportFormat[]", default: "png, jpg, clipboard", description: "Enabled formats." },
      ...BASE,
    ],
  },
  "layer-list": {
    whenToUse: "Layer stack with visibility toggles and reorder for compositing tools.",
    props: [
      { name: "layers", type: "LayerItem[]", description: "Layer list data." },
      { name: "onLayersChange", type: "(layers: LayerItem[]) => void", description: "Layer change handler." },
      { name: "activeId", type: "string", description: "Selected layer id." },
      { name: "onActiveIdChange", type: "(id: string) => void", description: "Selection handler." },
      ...BASE,
    ],
  },
  timeline: {
    whenToUse: "Animation and motion tools — scrub time, place keyframes, manage shots, and control playback.",
    props: [
      { name: "duration", type: "number", default: "4", description: "Total timeline length in seconds." },
      { name: "currentTime", type: "number", description: "Playhead position (controlled)." },
      { name: "onCurrentTimeChange", type: "(time: number) => void", description: "Called when playhead moves." },
      { name: "keyframes", type: "TimelineKeyframe[]", description: "Keyframe markers on the track." },
      { name: "onKeyframesChange", type: "(keyframes) => void", description: "Called when keyframes are dragged." },
      { name: "shots", type: "TimelineShot[]", description: "Shot tabs in the control bar." },
      { name: "playing", type: "boolean", description: "Playback state." },
      { name: "onPlayingChange", type: "(playing: boolean) => void", description: "Play/pause handler." },
      { name: "looping", type: "boolean", description: "Loop playback." },
      { name: "onAddKeyframe", type: "() => void", description: "Add keyframe at current time." },
      { name: "showControls", type: "boolean", default: "true", description: "Show top control bar." },
      ...BASE,
    ],
    usageExample: `<Timeline\n  duration={4}\n  currentTime={time}\n  onCurrentTimeChange={setTime}\n  keyframes={keyframes}\n  onKeyframesChange={setKeyframes}\n  playing={playing}\n  onPlayingChange={setPlaying}\n  onAddKeyframe={() => addKfAt(time)}\n/>`,
  },
  dialog: {
    whenToUse: "Modal confirmations — export complete, destructive actions, settings.",
    props: [
      { name: "open", type: "boolean", description: "Open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open change handler." },
      { name: "title", type: "string", description: "Dialog title." },
      { name: "description", type: "string", description: "Optional description." },
      ...BASE,
    ],
  },
  toast: {
    whenToUse: "Brief feedback — copied to clipboard, export done, error message.",
    props: [
      { name: "message", type: "string", description: "Toast text." },
      { name: "visible", type: "boolean", description: "Show/hide." },
      { name: "variant", type: '"default" | "success" | "error"', description: "Visual variant." },
      { name: "onDismiss", type: "() => void", description: "Dismiss handler." },
      ...BASE,
    ],
  },
  "text-input": {
    whenToUse: "Single-line text fields — filenames, labels, search, hex-adjacent inputs.",
    props: [
      { name: "label", type: "string", description: "Field label above input." },
      { name: "size", type: '"sm" | "md"', default: "sm", description: "Input height and text size." },
      { name: "...props", type: "InputHTMLAttributes", description: "Standard input attributes (value, onChange, placeholder, etc.)." },
      ...BASE,
    ],
  },
  checkbox: {
    whenToUse: "Boolean options in a list — include metadata, enable layers, multi-select flags.",
    props: [
      { name: "label", type: "string", description: "Checkbox label." },
      { name: "checked", type: "boolean", description: "Checked state." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Change handler." },
      { name: "disabled", type: "boolean", description: "Disable interaction." },
      ...BASE,
    ],
  },
  "radio-group": {
    whenToUse: "Single choice from a short list — export format, blend mode, output size preset.",
    props: [
      { name: "label", type: "string", description: "Group label." },
      { name: "value", type: "string", description: "Selected option value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Change handler." },
      { name: "options", type: "RadioOption[]", description: "Options with value, label, optional disabled." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: "vertical", description: "Layout direction." },
      ...BASE,
    ],
  },
  "coordinate-input": {
    whenToUse: "X/Y position pairs — anchor points, crop origin, transform offsets.",
    props: [
      { name: "label", type: "string", description: "Field label." },
      { name: "x", type: "number", description: "X coordinate." },
      { name: "y", type: "number", description: "Y coordinate." },
      { name: "onChange", type: "({ x, y }) => void", description: "Called when either axis changes." },
      { name: "min", type: "number", default: "-9999", description: "Minimum value per axis." },
      { name: "max", type: "number", default: "9999", description: "Maximum value per axis." },
      { name: "step", type: "number", default: "1", description: "Step increment." },
      ...BASE,
    ],
  },
  "preset-picker": {
    whenToUse: "Preset chip grids — filter looks, color grades, saved tool configurations.",
    props: [
      { name: "label", type: "string", description: "Section label." },
      { name: "presets", type: "PresetItem[]", description: "Preset id + label list." },
      { name: "value", type: "string", description: "Active preset id." },
      { name: "onValueChange", type: "(id: string) => void", description: "Selection handler." },
      { name: "onAdd", type: "() => void", description: "Optional handler for add (+) slot." },
      ...BASE,
    ],
  },
  drawer: {
    whenToUse: "Slide-over panels for secondary settings — export options, advanced filters, mobile layouts.",
    props: [
      { name: "open", type: "boolean", description: "Open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open change handler." },
      { name: "title", type: "string", description: "Drawer header title." },
      { name: "side", type: '"left" | "right" | "bottom"', default: "right", description: "Edge to slide from." },
      { name: "width", type: "number", default: "280", description: "Width in px (left/right)." },
      { name: "children", type: "ReactNode", description: "Drawer content." },
    ],
  },
  "split-view": {
    whenToUse: "Resizable before/after or sidebar/canvas splits — compare modes, dual-pane editors.",
    props: [
      { name: "left", type: "ReactNode", description: "Left (or top) pane content." },
      { name: "right", type: "ReactNode", description: "Right (or bottom) pane content." },
      { name: "defaultRatio", type: "number", default: "50", description: "Initial split percentage." },
      { name: "minRatio", type: "number", default: "20", description: "Minimum split percentage." },
      { name: "maxRatio", type: "number", default: "80", description: "Maximum split percentage." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: "horizontal", description: "Split direction." },
      ...BASE,
    ],
  },
  tabs: {
    whenToUse: "Tabbed sections in a panel — Adjust / Export / Info without full page navigation.",
    props: [
      { name: "items", type: "TabItem[]", description: "Tabs with value, label, and content." },
      { name: "defaultValue", type: "string", description: "Initially active tab value." },
      ...BASE,
    ],
  },
  accordion: {
    whenToUse: "Collapsible control groups in dense sidebars — group sliders by category.",
    props: [
      { name: "items", type: "AccordionItem[]", description: "Sections with id, title, content." },
      { name: "defaultOpen", type: "string[]", description: "Ids of initially expanded sections." },
      ...BASE,
    ],
  },
  popover: {
    whenToUse: "Anchored contextual panels — color swatch picker, quick actions, inline help.",
    props: [
      { name: "trigger", type: "ReactNode", description: "Element that opens the popover." },
      { name: "children", type: "ReactNode", description: "Popover content." },
      { name: "side", type: '"top" | "right" | "bottom" | "left"', default: "bottom", description: "Preferred side." },
      { name: "align", type: '"start" | "center" | "end"', default: "start", description: "Alignment along the side." },
      { name: "width", type: "number", default: "200", description: "Popover width in px." },
    ],
  },
  "empty-state": {
    whenToUse: "Placeholder when no file is loaded or a list is empty — guides users to Dropzone or first action.",
    props: [
      { name: "title", type: "string", description: "Primary message." },
      { name: "description", type: "string", description: "Supporting text." },
      { name: "action", type: "ReactNode", description: "Optional CTA (button, link)." },
      { name: "icon", type: "ReactNode", description: "Optional icon above title." },
      ...BASE,
    ],
  },
  "progress-bar": {
    whenToUse: "Export progress, batch processing, or indeterminate loading states.",
    props: [
      { name: "value", type: "number", description: "Progress 0–100 (determinate mode)." },
      { name: "label", type: "string", description: "Optional label." },
      { name: "showValue", type: "boolean", default: "true", description: "Show percentage readout." },
      { name: "variant", type: '"default" | "indeterminate"', default: "default", description: "Determinate or looping bar." },
      ...BASE,
    ],
  },
  "status-bar": {
    whenToUse: "Bottom info strip — dimensions, zoom level, cursor position, export status.",
    props: [
      { name: "items", type: "StatusBarItem[]", description: "Status segments with id, label, optional variant." },
      ...BASE,
    ],
  },
};

export function getComponentDocResolved(id: ComponentId): ComponentDoc {
  if (DOCS[id]) return DOCS[id]!;
  const extra = CATEGORY_DEFAULTS[id];
  if (extra) return { ...FALLBACK, ...extra, props: extra.props ?? FALLBACK.props };
  return FALLBACK;
}
