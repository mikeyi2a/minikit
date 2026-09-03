# Minikit — Project Plan

> Registry-first component kit for mini creative tools.  
> Status: **v1 complete** · **V2 packages shipped** (`@mikeyi2a/minikit-ui` + `@mikeyi2a/minikit-cli`).
> Live docs + registry: https://minikit-flax.vercel.app · Repo: https://github.com/mikeyi2a/minikit

---

## Goal (v1) — done

Ship a shadcn-style, copy-paste component registry with:
- Live component browser ✅
- Overview documentation ✅
- Per-component props + copy snippets ✅ (38 components)
- `llms.txt` for AI agents ✅
- Registry manifest + CLI ✅
- One composed tool example documented end-to-end ✅

---

## What exists today

| Area | Status |
|---|---|
| Next.js docs site (`localhost:3005`) | ✅ |
| 38 components (core, input, layout, tool, feedback) | ✅ |
| Default theme (`--mk-*` tokens, tool-dark) | ✅ |
| 3 composed demos (Image Tool, Floating Tool, Panel Preview) | ✅ |
| Overview docs (Intro, Install, etc.) | ✅ |
| Per-component props tables | ✅ |
| Copy-paste / code panel | ✅ |
| Theming guide page | ✅ |
| Composing-a-tool written guide | ✅ |
| `llms.txt` | ✅ |
| Registry JSON manifest (35 installable components) | ✅ |
| `registry/ui/` + `public/r/` synced sources | ✅ |
| `npx @mikeyi2a/minikit-cli init` / `add <component>` CLI | ✅ |
| `@mikeyi2a/minikit-ui` npm package | ✅ |

---

## V2 — packages (done)

### `@mikeyi2a/minikit-ui`
- `npm install @mikeyi2a/minikit-ui` + `import { Slider } from "@mikeyi2a/minikit-ui"`
- Theme CSS: `import "@mikeyi2a/minikit-ui/styles.css"`
- Built with tsup from synced `packages/ui/src/`

### `minikit` CLI
- `npx @mikeyi2a/minikit-cli init` — writes `components.json`, copies utils + theme
- `npx @mikeyi2a/minikit-cli add slider` — fetches from `/r/registry.json`, resolves deps, rewrites imports

### Sync script
- `npm run sync:all` → `registry/`, `public/r/`, `packages/ui/src/`

---

## Components (38)

**Core** — SegmentedControl, Slider, DualSlider, NumberStepper, ColorPicker, Badge, Tooltip

**Input** — Toggle, Select, Button, TextInput, Checkbox, RadioGroup, CoordinateInput, PresetPicker, FieldGroup

**Layout** — Sidebar, Panel, Drawer, SplitView, Tabs, Accordion

**Tool** — Toolbar, Dropzone, CompareSlider, CanvasFrame, ExportButton, LayerList, Timeline

**Feedback** — Dialog, Popover, EmptyState, ProgressBar, StatusBar, Toast

**Preview demos** (not in registry): Image Tool, Floating Tool, Panel Preview

---

## Repo scripts

```bash
npm run dev          # docs site
npm run sync:all     # sync registry + ui package sources
npm run build        # docs site
npm run build:ui     # @mikeyi2a/minikit-ui package
npm run build:cli    # minikit CLI
npm run build:all    # full pipeline
```

---

## Out of scope (post-V2)

- Syntax highlighting (Shiki) in code panels
- Auto-generated props from TS AST
- StackBlitz embeds
- VSCode extension / Figma kit
