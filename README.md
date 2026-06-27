# Minikit

Copy-paste component registry for mini creative tools — dither editors, annotators, color pickers, export utilities.

Includes a **Next.js docs site** with live demos, props tables, and copy-paste source for every component.

## Quick start (docs site)

```bash
npm install
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) → redirects to `/docs/introduction`

## Install in your project

### npm package

```bash
npm install @mikeyi2a/minikit-ui
```

```tsx
import "@mikeyi2a/minikit-ui/styles.css";
import { Slider } from "@mikeyi2a/minikit-ui";
```

### CLI (copy-paste)

```bash
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider
```

### Manual

Copy component source from the docs code panel + `lib/utils.ts` + theme tokens from `globals.css`.

## Components (38)

**Core** — SegmentedControl, Slider, DualSlider, NumberStepper, ColorPicker, Badge, Tooltip

**Input** — Toggle, Select, Button, TextInput, Checkbox, RadioGroup, CoordinateInput, PresetPicker, FieldGroup

**Layout** — Sidebar, Panel, Drawer, SplitView, Tabs, Accordion

**Tool** — Toolbar, Dropzone, CompareSlider, CanvasFrame, ExportButton, LayerList, Timeline

**Feedback** — Dialog, Popover, EmptyState, ProgressBar, StatusBar, Toast

All components use `--mk-*` CSS variables. Set `data-theme="tool-dark"` on `<html>` for the default aesthetic.

## Composed examples

- **Panel Preview** — camera-controls-style sidebar
- **Image Tool** — Dropzone + Sliders + CanvasFrame + Export
- **Floating Tool** — floating Panel + presets + Toast

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Radix UI primitives (select components)

## Repo scripts

```bash
npm run sync:all    # sync registry + ui package sources
npm run build:ui    # build @minikit/ui package
npm run build:cli   # build minikit CLI
```
