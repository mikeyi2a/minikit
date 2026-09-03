# Minikit

Copy-paste component registry for mini creative tools — dither editors, annotators, color pickers, export utilities.

**Live docs:** https://minikit-flax.vercel.app  
**GitHub:** https://github.com/mikeyi2a/minikit

Includes a Next.js docs site with live demos, props tables, and copy-paste source for every component.

## Install in your project

### npm package (fastest)

```bash
npm install @mikeyi2a/minikit-ui
```

```tsx
import "@mikeyi2a/minikit-ui/styles.css";
import { Slider } from "@mikeyi2a/minikit-ui";
```

### CLI (copy-paste, own the source)

```bash
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider
```

Registry: https://minikit-flax.vercel.app/r/registry.json

### Manual

Copy component source from the [docs code panel](https://minikit-flax.vercel.app/slider) + `lib/utils.ts` + theme tokens.

## Components (38)

Browse live demos and props at https://minikit-flax.vercel.app

| Category | Components |
|---|---|
| **Core** | SegmentedControl, Slider, DualSlider, NumberStepper, ColorPicker, Badge, Tooltip |
| **Input** | Toggle, Select, Button, TextInput, Checkbox, RadioGroup, CoordinateInput, PresetPicker, FieldGroup |
| **Layout** | Sidebar, Panel, Drawer, SplitView, Tabs, Accordion |
| **Tool** | Toolbar, Dropzone, CompareSlider, CanvasFrame, ExportButton, LayerList, Timeline |
| **Feedback** | Dialog, Popover, EmptyState, ProgressBar, StatusBar, Toast |

**Composed examples:** [Image Tool](https://minikit-flax.vercel.app/image-tool) · [Floating Tool](https://minikit-flax.vercel.app/floating-tool) · [Panel Preview](https://minikit-flax.vercel.app/panel-preview)

All components use `--mk-*` CSS variables. Set `data-theme="tool-dark"` on `<html>` for the default aesthetic.

## npm packages

| Package | Purpose |
|---|---|
| [@mikeyi2a/minikit-ui](https://www.npmjs.com/package/@mikeyi2a/minikit-ui) | Import components |
| [@mikeyi2a/minikit-cli](https://www.npmjs.com/package/@mikeyi2a/minikit-cli) | Copy components into your repo |

## Develop this repo

```bash
npm install
npm run dev          # docs site → http://localhost:3005
npm run sync:all     # sync registry + ui package sources
npm run build:all    # sync + docs + ui + cli
```

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Radix UI primitives (select components)
