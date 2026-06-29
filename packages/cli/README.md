# @mikeyi2a/minikit-cli

Copy-paste Minikit components into your project — shadcn-style, without importing a runtime package.

**Live docs:** https://minikit-flax.vercel.app  
**Registry:** https://minikit-flax.vercel.app/r/registry.json

## When to use the CLI vs the npm package

| | **CLI** (this package) | **[@mikeyi2a/minikit-ui](https://www.npmjs.com/package/@mikeyi2a/minikit-ui)** |
|---|---|---|
| Install model | Copies source into your repo | Import from `node_modules` |
| Own/edit component code | Yes | No (wrap or fork instead) |
| Runtime dependency | None (just your copied files) | `@mikeyi2a/minikit-ui` in package.json |
| Updates | Re-run `add` or diff manually | `npm update` |
| Best for | Tweaking Slider behavior, stripping props, full control | Fastest path, standard imports |

Use **both** only if you know why — don't install the npm package *and* copy the same components.

## Install

No global install required:

```bash
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider color-picker canvas-frame
```

## Commands

### `init`

Creates `components.json`, copies `src/lib/utils.ts`, and downloads theme tokens.

```bash
npx @mikeyi2a/minikit-cli init
```

### `add <components...>`

Fetches component source from the hosted registry, resolves transitive deps, rewrites imports to your aliases, and optionally installs npm dependencies.

```bash
npx @mikeyi2a/minikit-cli add slider
npx @mikeyi2a/minikit-cli add toolbar          # also pulls tooltip
npx @mikeyi2a/minikit-cli add slider --no-install
```

**Flags**

- `--registry <url>` — override registry (default: `https://minikit-flax.vercel.app/r/registry.json`)
- `--no-install` — skip `npm install` for Radix / clsx deps

## After `add`

Import from your local copy (paths depend on `components.json`):

```tsx
"use client";
import { Slider } from "@/components/slider";
```

Add theme CSS to your layout (from `init`, or import `@/lib/minikit-theme.css`):

```tsx
import "@/lib/minikit-theme.css";

<html data-theme="tool-dark">
```

## Components (35 installable)

Browse live demos, props, and source at **https://minikit-flax.vercel.app**

**Core** — `segmented-control`, `slider`, `dual-slider`, `number-stepper`, `color-picker`, `badge`, `tooltip`

**Input** — `toggle`, `select`, `button`, `text-input`, `checkbox`, `radio-group`, `coordinate-input`, `preset-picker`, `field-group`

**Layout** — `sidebar`, `panel`, `drawer`, `split-view`, `tabs`, `accordion`

**Tool** — `toolbar`, `dropzone`, `compare-slider`, `canvas-frame`, `export-button`, `layer-list`, `timeline`

**Feedback** — `dialog`, `popover`, `empty-state`, `progress-bar`, `status-bar`, `toast`

CLI names use kebab-case (e.g. `add color-picker`, not `ColorPicker`).

**Not in registry** (composed demos only, on the docs site): Image Tool, Floating Tool, Panel Preview.

## Requirements

- React 19+, Tailwind CSS 4+
- `data-theme="tool-dark"` on `<html>` for the default aesthetic
- Peer deps installed automatically unless `--no-install` (Radix packages per component)

## Links

- Docs: https://minikit-flax.vercel.app/docs/installation
- GitHub: https://github.com/mikeyi2a/minikit
- npm UI package: https://www.npmjs.com/package/@mikeyi2a/minikit-ui
