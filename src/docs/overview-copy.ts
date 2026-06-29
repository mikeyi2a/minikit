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
    markdown: `# Introduction

Minikit is a copy-paste component registry for building mini creative tools — dither editors, screenshot annotators, colour pickers, mockup makers, export utilities.

**shadcn is for apps.** Minikit is for tools. The component set, default aesthetic, and docs are calibrated for someone building a focused little tool for a specific creative task — not a dashboard or marketing site.

## What you get

- 38 components across core controls, inputs, layout, canvas, and feedback
- CSS variable theming (\`--mk-*\` tokens)
- Live demos + copy-paste source for every component
- \`llms.txt\` so AI agents know how to compose tools

**Live docs:** https://minikit-flax.vercel.app

## Usage guidelines

- **Use for focused creative tools:** Minikit components are designed for single-purpose tools — image editors, annotators, export utilities — not full application shells.
- **Three install paths:** npm package (\`@mikeyi2a/minikit-ui\`), CLI (\`@mikeyi2a/minikit-cli\`), or manual copy from the docs.
- **Theme with CSS variables:** Override \`--mk-*\` tokens to rebrand. Set \`data-theme="tool-dark"\` on \`<html>\` for the default aesthetic.

## vs shadcn

shadcn ships DataTable, Nav, Dialog for apps. Minikit ships Slider, Dropzone, CanvasFrame, CompareSlider, Panel — the primitives you need when someone is vibe-coding a one-purpose creative tool.`,
  },
  "getting-started": {
    plainText: `Getting started

Get a Minikit component running in under 5 minutes.

1. Clone or browse
Run the docs site locally:
git clone <repo> minikit
cd minikit
npm install
npm run dev

2. Add theme CSS
Copy src/app/globals.css theme tokens into your project, or import them. Set data-theme="tool-dark" on <html>.

3. Copy a component
Open any component page (e.g. /slider), click Show code, and copy into src/components/. Also copy src/lib/utils.ts.

4. Use it
"use client";
import { useState } from "react";
import { Slider } from "@/components/slider";

export function MyTool() {
  const [v, setV] = useState(50);
  return <Slider label="Amount" value={v} onValueChange={setV} />;
}

5. Compose
See Composing a tool (/docs/composing-a-tool) or the Image Tool example (/image-tool).`,
    markdown: `# Getting started

Get a Minikit component running in under 5 minutes.

## 1. Clone or browse

Run the docs site locally:

\`\`\`bash
git clone <repo> minikit
cd minikit
npm install
npm run dev
\`\`\`

## 2. Add theme CSS

Copy \`src/app/globals.css\` theme tokens into your project, or import them. Set \`data-theme="tool-dark"\` on \`<html>\`.

## 3. Copy a component

Open any component page (e.g. [/slider](/slider)), click **Show code**, and copy into \`src/components/\`. Also copy \`src/lib/utils.ts\`.

## 4. Use it

\`\`\`tsx
"use client";
import { useState } from "react";
import { Slider } from "@/components/slider";

export function MyTool() {
  const [v, setV] = useState(50);
  return <Slider label="Amount" value={v} onValueChange={setV} />;
}
\`\`\`

## 5. Compose

See [Composing a tool](/docs/composing-a-tool) or the [Image Tool](/image-tool) example.`,
  },
  installation: {
    plainText: `Installation

Three ways to use Minikit: npm package, CLI copy-paste, or manual copy from the docs.

npm package
npm install @mikeyi2a/minikit-ui
// app/layout.tsx
import "@mikeyi2a/minikit-ui/styles.css";
// page.tsx
import { Slider } from "@mikeyi2a/minikit-ui";
Requires React 19+, Tailwind 4+, and data-theme="tool-dark" on <html>.

CLI
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider
Fetches from the hosted registry and resolves transitive dependencies (e.g. toolbar also installs tooltip).

Manual install
1. Add Tailwind CSS 4+ to your React / Next.js project
2. Copy theme tokens from globals.css (or registry/theme.css)
3. Copy src/lib/utils.ts
4. Copy the component file from the docs code panel
5. Install peer deps if needed (Radix packages listed in source imports)

Dependencies
Core: React 19, Tailwind 4, clsx, tailwind-merge. Some components use Radix UI primitives for accessibility.`,
    markdown: `# Installation

Three ways to use Minikit: npm package, CLI copy-paste, or manual copy from the docs.

## npm package

\`\`\`bash
npm install @mikeyi2a/minikit-ui
\`\`\`

\`\`\`tsx
// app/layout.tsx
import "@mikeyi2a/minikit-ui/styles.css";

// page.tsx
import { Slider } from "@mikeyi2a/minikit-ui";
\`\`\`

Requires React 19+, Tailwind 4+, and \`data-theme="tool-dark"\` on \`<html>\`.

## CLI

\`\`\`bash
npx @mikeyi2a/minikit-cli init
npx @mikeyi2a/minikit-cli add slider
\`\`\`

Fetches from the hosted registry and resolves transitive dependencies (e.g. \`toolbar\` also installs \`tooltip\`).

## Manual install

1. Add Tailwind CSS 4+ to your React / Next.js project
2. Copy theme tokens from \`globals.css\` (or \`registry/theme.css\`)
3. Copy \`src/lib/utils.ts\`
4. Copy the component file from the docs code panel
5. Install peer deps if needed (Radix packages listed in source imports)

## Dependencies

Core: React 19, Tailwind 4, clsx, tailwind-merge. Some components use Radix UI primitives for accessibility.`,
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
    markdown: `# Theming

All components use CSS variables. Override tokens to rebrand — no component edits required.

## Token reference

\`\`\`css
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
\`\`\`

## Presets

- \`data-theme="tool-dark"\` — default Minikit aesthetic (camera-controls style)
- \`data-theme="light"\` — light neutral
- \`data-theme="dark"\` — dark neutral

Use the theme switcher in the docs sidebar to preview all three.

## Brand override

\`\`\`css
[data-theme="my-brand"] {
  --mk-accent: #ff3366;
  --mk-surface: #1a1a2e;
}
\`\`\``,
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
    markdown: `# Composing a tool

A minimal image tool = file input + preview + adjustments + export. Here's the Minikit composition:

## Layout

\`\`\`
┌─────────────┬──────────────────┐
│  Sidebar    │   CanvasFrame    │
│  Dropzone   │   (preview)      │
│  Sliders    │                  │
│  ExportBtn  │                  │
└─────────────┴──────────────────┘
│           StatusBar            │
└────────────────────────────────┘
\`\`\`

## Components used

- [Sidebar](/sidebar) — docked control column
- [Dropzone](/dropzone) — load image
- [Slider](/slider) — brightness, contrast
- [CanvasFrame](/canvas-frame) — output preview
- [ExportButton](/export-button) — PNG / copy

## Live example

[Open the Image Tool demo →](/image-tool)

## Floating variant

For overlay controls, swap Sidebar for [Panel mode="floating"](/panel). See the [Floating Tool](/floating-tool) example.`,
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
    markdown: `# llms.txt

\`llms.txt\` is a machine-readable guide for AI coding agents. It describes every component, when to use it, and how to compose a mini tool.

## Location

- Repo root: \`llms.txt\`
- Web: [/llms.txt](/llms.txt)

## Usage with Cursor / Claude

Point your agent at the file or paste its contents into context when building a tool. It includes composition recipes like:

\`\`\`
Image tool → Sidebar + Dropzone + Slider + CanvasFrame + ExportButton
\`\`\``,
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
