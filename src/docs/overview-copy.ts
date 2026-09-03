import type { DocSlug } from "@/docs/nav";
import { DOC_META } from "@/docs/overview-pages";

export interface OverviewCopyContent {
  plainText: string;
  markdown: string;
}

const COPY: Record<DocSlug, OverviewCopyContent> = {
  introduction: {
    plainText: `Introduction

Minikit is a copy-paste component registry for building mini creative tools — dither editors, screenshot annotators, colour pickers, mockup makers, export utilities.

shadcn is for apps. Minikit is for tools. The component set, default aesthetic, and docs are calibrated for someone building a focused little tool for a specific creative task — not a dashboard or marketing site.

Built on
- React 19 + TypeScript — "use client" controlled components
- Tailwind CSS 4 — utility-first layout and sizing
- Radix UI — accessible primitives (Dialog, Select, Popover, Tabs, etc.)
- CSS variables (--mk-*) — rebrand via tokens, not source edits
- shadcn-style registry — CLI copy-paste or @mikeyi2a/minikit-ui npm import

The docs site runs on Next.js 15. Your app can be Next.js, Vite, or any React + Tailwind 4 project.

What you get
- 38 components across core controls, inputs, layout, canvas, and feedback
- CSS variable theming (--mk-* tokens)
- Live demos + copy-paste source for every component
- llms.txt so AI agents know how to compose tools

Live docs: https://minikit-flax.vercel.app

Usage guidelines
- Use for focused creative tools: Minikit components are designed for single-purpose tools — image editors, annotators, export utilities — not full application shells.
- Three install paths: npm package (@mikeyi2a/minikit-ui), CLI (@mikeyi2a/minikit-cli), or manual copy from the docs.
- Theme with CSS variables: Override --mk-* tokens to rebrand. Set data-theme="tool-dark" on <html> for the default aesthetic.`,
    markdown: '# Introduction\n\nMinikit is a copy-paste component registry for building mini creative tools — dither editors, screenshot annotators, colour pickers, mockup makers, export utilities.\n\n**shadcn is for apps.** Minikit is for tools. The component set, default aesthetic, and docs are calibrated for someone building a focused little tool for a specific creative task — not a dashboard or marketing site.\n\n## Built on\n\nMinikit is a curated component layer on a small modern stack:\n\n- **React 19 + TypeScript** — `"use client"` controlled components\n- **Tailwind CSS 4** — utility-first layout and sizing\n- **Radix UI** — accessible primitives (Dialog, Select, Popover, Tabs, etc.)\n- **CSS variables (`--mk-*`)** — rebrand via tokens, not source edits\n- **shadcn-style registry** — CLI copy-paste or `@mikeyi2a/minikit-ui` npm import\n\nThe docs site runs on Next.js 15. Your app can be Next.js, Vite, or any React + Tailwind 4 project.\n\n## What you get\n\n- 38 components across core controls, inputs, layout, canvas, and feedback\n- CSS variable theming (`--mk-*` tokens)\n- Live demos + copy-paste source for every component\n- `llms.txt` so AI agents know how to compose tools\n\n**Live docs:** https://minikit-flax.vercel.app\n\n## Usage guidelines\n\n- **Use for focused creative tools:** Minikit components are designed for single-purpose tools — image editors, annotators, export utilities — not full application shells.\n- **Three install paths:** npm package (`@mikeyi2a/minikit-ui`), CLI (`@mikeyi2a/minikit-cli`), or manual copy from the docs.\n- **Theme with CSS variables:** Override `--mk-*` tokens to rebrand. Set `data-theme="tool-dark"` on `<html>` for the default aesthetic.\n\n## vs shadcn\n\nshadcn ships DataTable, Nav, Dialog for apps. Minikit ships Slider, Dropzone, CanvasFrame, CompareSlider, Panel — the primitives you need when someone is vibe-coding a one-purpose creative tool.',
  },

  installation: {
    plainText: `Installation

Prerequisites: React 19+, Tailwind CSS 4+.

npm package — 3 steps

Step 1: Install
npm install @mikeyi2a/minikit-ui

Step 2: Add to globals.css (both imports, in this order):
@import "tailwindcss";
@import "@mikeyi2a/minikit-ui/tailwind.css";

Step 3: Import theme in layout, before globals.css:
import "@mikeyi2a/minikit-ui/styles.css";
import "./globals.css";

Set data-theme="tool-dark" on <html>. Done — no manual copying.

CLI — copy-paste into your project
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider

Manual — if not using npm or CLI
1. Add Tailwind CSS 4+ to your project
2. Copy theme tokens from src/app/globals.css in the repo, or import @mikeyi2a/minikit-ui/styles.css
3. Copy src/lib/utils.ts from the repo
4. Copy the component file from any component page (click Show code)
5. Set data-theme="tool-dark" on <html>
6. Install peer deps if needed (Radix packages listed in source imports)

Dependencies: React 19, Tailwind 4, clsx, tailwind-merge. Optional: Radix UI primitives.`,
    markdown: '# Installation\n\n## Prerequisites\n\n**React 19+**, **Tailwind CSS 4+**. The npm package relies on Tailwind to generate utility classes from the package source — without it, components fall back to inline styles only (no sizing, no layout).\n\n---\n\n## npm package — 3 steps\n\n### Step 1 — install\n\n```bash\nnpm install @mikeyi2a/minikit-ui\n```\n\n### Step 2 — add to globals.css\n\nCopy both lines into your `globals.css`, in this order:\n\n```css\n/* app/globals.css */\n@import "tailwindcss";\n@import "@mikeyi2a/minikit-ui/tailwind.css";\n```\n\nThe second line registers the package\'s utility classes with your Tailwind build. Without it, components render with inline-style fallback only — no flex layout, no sizing, no typography.\n\n### Step 3 — import the theme in your layout\n\n```tsx\n// app/layout.tsx — import before globals.css\nimport "@mikeyi2a/minikit-ui/styles.css";\nimport "./globals.css";\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en" data-theme="tool-dark">\n      <body>{children}</body>\n    </html>\n  );\n}\n```\n\n**That\'s it.** No manual copying required.\n\n---\n\n## CLI — copy-paste into your project\n\n```bash\nnpx @mikeyi2a/minikit-cli init\nnpx @mikeyi2a/minikit-cli add slider\n```\n\nFetches from the hosted registry and resolves transitive dependencies (e.g. `toolbar` also installs `tooltip`).\n\n---\n\n## Manual — if not using npm or CLI\n\n1. Add Tailwind CSS 4+ to your project\n2. Copy theme tokens from `src/app/globals.css` in the repo, or import `@mikeyi2a/minikit-ui/styles.css`\n3. Copy `src/lib/utils.ts` from the repo\n4. Copy the component file from any component page (click **Show code**)\n5. Set `data-theme="tool-dark"` on `<html>`\n6. Install peer deps if needed (Radix packages listed in source imports)\n\n## Dependencies\n\n**Core:** React 19, Tailwind 4, clsx, tailwind-merge.\n\n**Optional:** Radix UI primitives for accessible Dialog, Select, Tabs, Popover, Checkbox, and other overlays.',
  },

  theming: {
    plainText: `Theming

All components use CSS variables. Override tokens to rebrand — no component edits required.

Token reference
:root {
  --mk-bg: #ffffff;
  --mk-surface: #f5f5f5;
  --mk-surface-raised: #ebebeb;
  --mk-border: #e0e0e0;
  --mk-text: #111111;
  --mk-text-muted: #666666;
  --mk-text-faint: #999999;
  --mk-accent: #0066ff;
  --mk-radius: 8px;
  --mk-font-mono: ui-monospace, monospace;
  --mk-control-height: 32px;
}

Presets
- data-theme="tool-dark" — default Minikit aesthetic (camera-controls style)
- data-theme="light" — light neutral
- data-theme="dark" — dark neutral

Use the theme switcher in the docs sidebar to preview all three.

Brand override
[data-theme="my-brand"] {
  --mk-accent: #ff3366;
  --mk-surface: #1a1a2e;
}`,
    markdown: '# Theming\n\nAll components use CSS variables. Override tokens to rebrand — no component edits required.\n\n## Token reference\n\n```css\n:root {\n  --mk-bg: #ffffff;\n  --mk-surface: #f5f5f5;\n  --mk-surface-raised: #ebebeb;\n  --mk-border: #e0e0e0;\n  --mk-text: #111111;\n  --mk-text-muted: #666666;\n  --mk-text-faint: #999999;\n  --mk-accent: #0066ff;\n  --mk-radius: 8px;\n  --mk-font-mono: ui-monospace, monospace;\n  --mk-control-height: 32px;\n}\n```\n\n## Presets\n\n- `data-theme="tool-dark"` — default Minikit aesthetic (camera-controls style)\n- `data-theme="light"` — light neutral\n- `data-theme="dark"` — dark neutral\n\nUse the theme switcher in the docs sidebar to preview all three.\n\n## Brand override\n\n```css\n[data-theme="my-brand"] {\n  --mk-accent: #ff3366;\n  --mk-surface: #1a1a2e;\n}\n```',
  },

  "composing-a-tool": {
    plainText: `Composing a tool

A minimal image tool = file input + preview + adjustments + export. Here's the Minikit composition:

Layout
┌─────────────┬──────────────────┐
│  Sidebar    │   CanvasFrame    │
│  Dropzone   │   (preview)      │
│  Sliders    │                  │
│  ExportBtn  │                  │
└─────────────┴──────────────────┘
│           StatusBar            │
└────────────────────────────────┘

Components used
- Sidebar — docked control column
- Dropzone — load image
- Slider — brightness, contrast
- CanvasFrame — output preview
- ExportButton — PNG / copy

Live example: /image-tool

Floating variant
For overlay controls, swap Sidebar for Panel mode="floating". See the Floating Tool example at /floating-tool.`,
    markdown: '# Composing a tool\n\nA minimal image tool = file input + preview + adjustments + export. Here\'s the Minikit composition:\n\n## Layout\n\n```\n┌─────────────┬──────────────────┐\n│  Sidebar    │   CanvasFrame    │\n│  Dropzone   │   (preview)      │\n│  Sliders    │                  │\n│  ExportBtn  │                  │\n└─────────────┴──────────────────┘\n│           StatusBar            │\n└────────────────────────────────┘\n```\n\n## Components used\n\n- [Sidebar](/sidebar) — docked control column\n- [Dropzone](/dropzone) — load image\n- [Slider](/slider) — brightness, contrast\n- [CanvasFrame](/canvas-frame) — output preview\n- [ExportButton](/export-button) — PNG / copy\n\n## Live example\n\n[Open the Image Tool demo →](/image-tool)\n\n## Floating variant\n\nFor overlay controls, swap Sidebar for [Panel mode="floating"](/panel). See the [Floating Tool](/floating-tool) example.',
  },

  "llms-txt": {
    plainText: `llms.txt

llms.txt is a machine-readable guide for AI coding agents. It describes every component, when to use it, and how to compose a mini tool.

Location
- Repo root: llms.txt
- Web: /llms.txt

Usage with Cursor / Claude
Point your agent at the file or paste its contents into context when building a tool. It includes composition recipes like:

Image tool → Sidebar + Dropzone + Slider + CanvasFrame + ExportButton`,
    markdown: '# llms.txt\n\n`llms.txt` is a machine-readable guide for AI coding agents. It describes every component, when to use it, and how to compose a mini tool.\n\n## Location\n\n- Repo root: `llms.txt`\n- Web: [/llms.txt](/llms.txt)\n\n## Usage with Cursor / Claude\n\nPoint your agent at the file or paste its contents into context when building a tool. It includes composition recipes like:\n\n```\nImage tool → Sidebar + Dropzone + Slider + CanvasFrame + ExportButton\n```',
  },
};

export function getOverviewCopyContent(slug: DocSlug): OverviewCopyContent {
  const meta = DOC_META[slug];
  const content = COPY[slug];

  return {
    plainText: `${meta.title}\n\n${meta.description}\n\n${content.plainText.replace(/^[^\n]+\n\n/, "")}`,
    markdown: `# ${meta.title}\n\n${meta.description}\n\n${content.markdown.replace(/^# .+\n\n/, "")}`,
  };
}
