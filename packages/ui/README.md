# @mikeyi2a/minikit-ui

React components for mini creative tools — sliders, panels, dropzones, timelines, and more.

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
import { Slider } from "@mikeyi2a/minikit-ui";

<Slider label="Opacity" value={80} onValueChange={setOpacity} min={0} max={100} />
```

## Theming

Override `--mk-*` CSS variables. Presets: `data-theme="tool-dark"` (default), `"light"`, `"dark"`.
