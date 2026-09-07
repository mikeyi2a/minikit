import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Slider } from "@mikeyi2a/minikit-ui";
import "./index.css";

/**
 * Bug-fix verification for @mikeyi2a/minikit-ui.
 *
 * Single-file consumer. data-theme="tool-dark" (via the
 * :root tokens above), value=68, min=12, max=200, on a black
 * background. Proves:
 *   1. Fill bar is clearly visible at ~30% of the track width
 *      (was 10% color-mix, now 35%).
 *   2. Thumb is visible at rest (opacity-50) and brightens on
 *      hover (opacity-100). Was opacity-0 until hover.
 *   3. Thumb is grabbable (w-1 = 4px, was w-0.5 = 2px).
 *   4. Tailwind utility classes are generated (h-8, w-12,
 *      font-mono, tracking-[0.06em]) — proves the
 *      @mikeyi2a/minikit-ui/tailwind.css import works.
 */
export default function App() {
  const [value, setValue] = useState(68);
  const min = 12;
  const max = 200;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-12 gap-8"
      style={{ background: "#000" }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-[0.06em]"
        style={{ color: "var(--mk-text-faint)" }}
      >
        Bug-fix verification · data-theme="tool-dark"
      </div>

      <div className="w-[480px] flex flex-col gap-2">
        <Slider
          label="Value"
          hint={`min ${min} · max ${max}`}
          value={value}
          onValueChange={setValue}
          min={min}
          max={max}
          tickCount={0}
        />
      </div>

      <div
        className="font-mono text-[10px] uppercase tracking-[0.06em] flex gap-6"
        style={{ color: "var(--mk-text-muted)" }}
      >
        <span>value = {value}</span>
        <span>fill = {pct.toFixed(1)}%</span>
        <span>expected ≈ 29.8%</span>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
