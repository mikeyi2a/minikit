/**
 * Sync component sources → registry/, public/r/, and packages/ui/src/
 * Generates registry.json with dependencies and registryDependencies.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COMPONENT_SOURCE_FILES: Record<string, string> = {
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

const COMPONENT_META: { id: string; name: string; description: string }[] = [
  { id: "segmented-control", name: "SegmentedControl", description: "Compact mode switcher / tab bar." },
  { id: "slider", name: "Slider", description: "Value slider with label, hint, ticks, readout." },
  { id: "dual-slider", name: "DualSlider", description: "Two-handle range slider." },
  { id: "number-stepper", name: "NumberStepper", description: "+/− numeric input with keyboard support." },
  { id: "color-picker", name: "ColorPicker", description: "Swatches, hex input, eyedropper." },
  { id: "badge", name: "Badge", description: "Hint chip or status label." },
  { id: "sidebar", name: "Sidebar", description: "Docked collapsible control column." },
  { id: "tooltip", name: "Tooltip", description: "Shortcut-aware hover tooltip." },
  { id: "toggle", name: "Toggle", description: "On/off switch for tool options." },
  { id: "select", name: "Select", description: "Dropdown for formats, presets, modes." },
  { id: "button", name: "Button", description: "Primary, secondary, ghost, danger + IconButton." },
  { id: "text-input", name: "TextInput", description: "Single-line text field." },
  { id: "checkbox", name: "Checkbox", description: "Multi-option toggles." },
  { id: "radio-group", name: "RadioGroup", description: "Single choice from a list." },
  { id: "coordinate-input", name: "CoordinateInput", description: "X/Y position pair." },
  { id: "preset-picker", name: "PresetPicker", description: "Preset chip grid with add slot." },
  { id: "field-group", name: "FieldGroup", description: "Label + control layout wrapper." },
  { id: "panel", name: "Panel", description: "Docked or floating draggable panel." },
  { id: "drawer", name: "Drawer", description: "Slide-over panel from edge." },
  { id: "split-view", name: "SplitView", description: "Resizable before/after split." },
  { id: "tabs", name: "Tabs", description: "Horizontal tabbed sections." },
  { id: "accordion", name: "Accordion", description: "Collapsible control sections." },
  { id: "toolbar", name: "Toolbar", description: "Tool-mode icon strip — select, draw, annotate." },
  { id: "dropzone", name: "Dropzone", description: "File drop with preview." },
  { id: "compare-slider", name: "CompareSlider", description: "Before/after image compare." },
  { id: "canvas-frame", name: "CanvasFrame", description: "Output preview with zoom + bg." },
  { id: "export-button", name: "ExportButton", description: "Export with loading states." },
  { id: "layer-list", name: "LayerList", description: "Layer stack with visibility + reorder." },
  { id: "timeline", name: "Timeline", description: "Animation timeline with keyframes, shots, and playback." },
  { id: "dialog", name: "Dialog", description: "Modal for settings or confirmations." },
  { id: "popover", name: "Popover", description: "Anchored contextual panel." },
  { id: "empty-state", name: "EmptyState", description: "Placeholder when nothing loaded." },
  { id: "progress-bar", name: "ProgressBar", description: "Determinate or indeterminate progress." },
  { id: "status-bar", name: "StatusBar", description: "Bottom info strip (dims, zoom, status)." },
  { id: "toast", name: "Toast", description: "Ephemeral success/error message." },
];

const SHARED_LIB = ["utils.ts", "mk-styles.ts", "slider-ticks.ts"] as const;

const EXTRA_REGISTRY_DEPS: Record<string, string[]> = {
  toolbar: ["tooltip"],
  slider: [],
};

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function readSrc(file: string): string {
  return fs.readFileSync(path.join(ROOT, "src", file), "utf-8");
}

function writeFile(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function rewriteForPackage(source: string): string {
  return source
    .replace(/from "@\/lib\/utils"/g, 'from "../lib/utils"')
    .replace(/from "@\/lib\/mk-styles"/g, 'from "../lib/mk-styles"')
    .replace(/from "@\/lib\/slider-ticks"/g, 'from "../lib/slider-ticks"');
}

function parseNpmDeps(source: string): string[] {
  const deps = new Set<string>(["clsx", "tailwind-merge"]);
  for (const match of source.matchAll(/from ["'](@radix-ui\/[^"']+)["']/g)) {
    deps.add(match[1]);
  }
  return [...deps].sort();
}

function parseRelativeComponentDeps(source: string, componentId: string): string[] {
  const deps = new Set<string>();
  for (const match of source.matchAll(/from ["']\.\/([^"']+)["']/g)) {
    const base = match[1].replace(/\.tsx?$/, "");
    if (COMPONENT_SOURCE_FILES[base] && base !== componentId) {
      deps.add(base);
    }
  }
  return [...deps];
}

function getRegistryDeps(componentId: string, source: string): string[] {
  const deps = new Set([
    ...parseRelativeComponentDeps(source, componentId),
    ...(EXTRA_REGISTRY_DEPS[componentId] ?? []),
  ]);
  return [...deps].sort();
}

function extractThemeCss(globals: string): string {
  const marker = "/* ── Minikit theme tokens";
  const start = globals.indexOf(marker);
  const end = globals.indexOf("* {", start);
  const tokens = start >= 0 ? globals.slice(start, end).trim() : "";
  const keyframes = globals.includes("@keyframes indeterminate")
    ? globals.slice(globals.indexOf("@keyframes indeterminate")).trim()
    : "";
  return `/* Minikit theme — import in your app layout */\n${tokens}\n\n${keyframes}\n`;
}

function parseExports(source: string): string[] {
  const names: string[] = [];
  for (const match of source.matchAll(/^export function (\w+)/gm)) {
    names.push(match[1]);
  }
  return names;
}

function sync() {
  const globals = readSrc("app/globals.css");

  const dirs = {
    registryUi: path.join(ROOT, "registry/ui"),
    registryLib: path.join(ROOT, "registry/lib"),
    publicR: path.join(ROOT, "public/r"),
    publicUi: path.join(ROOT, "public/r/ui"),
    publicLib: path.join(ROOT, "public/r/lib"),
    pkgComponents: path.join(ROOT, "packages/ui/src/components"),
    pkgLib: path.join(ROOT, "packages/ui/src/lib"),
    pkgStyles: path.join(ROOT, "packages/ui/styles"),
  };

  for (const dir of Object.values(dirs)) {
    ensureDir(dir);
  }

  const themeCss = extractThemeCss(globals);
  writeFile(path.join(ROOT, "registry/theme.css"), themeCss);
  writeFile(path.join(dirs.publicR, "theme.css"), themeCss);
  writeFile(path.join(dirs.pkgStyles, "theme.css"), themeCss);

  for (const libFile of SHARED_LIB) {
    const content = readSrc(`lib/${libFile}`);
    writeFile(path.join(dirs.registryLib, libFile), content);
    writeFile(path.join(dirs.publicLib, libFile), content);
    writeFile(path.join(dirs.pkgLib, libFile), content);
  }

  const exportLines: string[] = [
    `export { cn, clamp, stepValue, formatValue } from "./lib/utils";`,
    `export { mk } from "./lib/mk-styles";`,
  ];

  const items: object[] = [];

  for (const meta of COMPONENT_META) {
    const fileName = COMPONENT_SOURCE_FILES[meta.id];
    if (!fileName) continue;

    const source = readSrc(`components/${fileName}`);
    const registryDeps = getRegistryDeps(meta.id, source);
    const npmDeps = parseNpmDeps(source);

    const needsMkStyles = source.includes("@/lib/mk-styles");
    const needsSliderTicks = source.includes("@/lib/slider-ticks");

    const files: { path: string; type: string }[] = [
      { path: `ui/${fileName}`, type: "registry:ui" },
      { path: "lib/utils.ts", type: "registry:lib" },
    ];
    if (needsMkStyles) files.push({ path: "lib/mk-styles.ts", type: "registry:lib" });
    if (needsSliderTicks) files.push({ path: "lib/slider-ticks.ts", type: "registry:lib" });

    writeFile(path.join(dirs.registryUi, fileName), source);
    writeFile(path.join(dirs.publicUi, fileName), source);
    writeFile(path.join(dirs.pkgComponents, fileName), rewriteForPackage(source));

    for (const exportName of parseExports(source)) {
      exportLines.push(`export { ${exportName} } from "./components/${fileName.replace(/\.tsx$/, "")}";`);
    }

    items.push({
      name: meta.id,
      type: "registry:ui",
      title: meta.name,
      description: meta.description,
      files,
      dependencies: npmDeps,
      registryDependencies: registryDeps,
    });
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "minikit",
    homepage: process.env.MINIKIT_REGISTRY_URL ?? "https://minikit-flax.vercel.app",
    items,
  };

  const registryJson = JSON.stringify(registry, null, 2);
  writeFile(path.join(ROOT, "registry/registry.json"), registryJson);
  writeFile(path.join(dirs.publicR, "registry.json"), registryJson);

  const indexTs = `${exportLines.join("\n")}\n`;
  writeFile(path.join(ROOT, "packages/ui/src/index.ts"), indexTs);

  console.log(`Synced ${items.length} components → registry/, public/r/, packages/ui/src/`);
}

sync();
