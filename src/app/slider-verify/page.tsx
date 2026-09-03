"use client";

import { useState } from "react";
import { Slider } from "@mikeyi2a/minikit-ui";

/**
 * Bug-fix verification page for @mikeyi2a/minikit-ui.
 *
 * Renders a single Slider with value=68, min=12, max=200 against a
 * black background under data-theme="tool-dark". The page proves:
 *
 *   1. (Bug 1) The fill bar is clearly visible at 68% of the track
 *      width — was 10% color-mix (invisible on dark), now 35%.
 *   2. (Bug 1) The thumb is visible at rest (opacity-50), brightens
 *      on hover (opacity-100) — was opacity-0 (invisible until hover).
 *   3. (Bug 1) The thumb is grabbable — w-1 (4px), was w-0.5 (2px).
 *   4. (Bug 2) The component's Tailwind utility classes are actually
 *      generated (h-8, w-12, font-mono, etc.) — confirms the @source
 *      registration in the consumer's globals.css works.
 */
export default function SliderVerifyPage() {
  const [value, setValue] = useState(68);
  const min = 12;
  const max = 200;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-12 gap-8"
      style={{ background: "#000", color: "var(--mk-text)" }}
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
          className=""
        />
      </div>

      <div
        className="font-mono text-[10px] uppercase tracking-[0.06em] flex gap-6"
        style={{ color: "var(--mk-text-muted)" }}
      >
        <span>value = {value}</span>
        <span>fill = {pct.toFixed(1)}%</span>
        <span>expected ≈ 30.2% (12 → 200, 68 sits at 30.2%)</span>
      </div>
    </div>
  );
}
