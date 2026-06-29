# @mikeyi2a/minikit-ui

React components for mini creative tools — sliders, panels, dropzones, timelines, and more.

**Live docs:** https://minikit-flax.vercel.app  
**Copy-paste alternative:** [@mikeyi2a/minikit-cli](https://www.npmjs.com/package/@mikeyi2a/minikit-cli)

## Install

```bash
npm install @mikeyi2a/minikit-ui
```

Peer dependencies: React 19+, Tailwind CSS 4+, and Radix UI packages as needed per component.

## Setup

```tsx
// app/layout.tsx
import "@mikeyi2a/minikit-ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="tool-dark">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
import { Slider, ColorPicker, CanvasFrame } from "@mikeyi2a/minikit-ui";

<Slider label="Opacity" value={80} onValueChange={setOpacity} min={0} max={100} />
```

## Components (38)

Full demos, props tables, and copy-paste source: **https://minikit-flax.vercel.app**

### Core
SegmentedControl, Slider, DualSlider, NumberStepper, ColorPicker, Badge, Tooltip

### Input
Toggle, Select, Button, TextInput, Checkbox, RadioGroup, CoordinateInput, PresetPicker, FieldGroup

### Layout
Sidebar, Panel, Drawer, SplitView, Tabs, Accordion

### Tool / Canvas
Toolbar, Dropzone, CompareSlider, CanvasFrame, ExportButton, LayerList, Timeline

### Feedback
Dialog, Popover, EmptyState, ProgressBar, StatusBar, Toast

### Composed examples (docs only)
[Image Tool](https://minikit-flax.vercel.app/image-tool) · [Floating Tool](https://minikit-flax.vercel.app/floating-tool) · [Panel Preview](https://minikit-flax.vercel.app/panel-preview)

## Theming

Override `--mk-*` CSS variables. Presets: `data-theme="tool-dark"` (default), `"light"`, `"dark"`.

See https://minikit-flax.vercel.app/docs/theming

## When to use CLI instead

If you want to **own and edit** component source (shadcn-style), use the CLI:

```bash
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider
```

## Links

- Docs: https://minikit-flax.vercel.app
- GitHub: https://github.com/mikeyi2a/minikit
- CLI: https://www.npmjs.com/package/@mikeyi2a/minikit-cli
