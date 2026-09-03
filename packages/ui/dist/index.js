// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function stepValue(value, step) {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}
function formatValue(value, step) {
  if (step !== void 0 && step < 1) {
    const decimals = step.toString().split(".")[1]?.length ?? 2;
    return value.toFixed(decimals);
  }
  return String(value);
}

// src/lib/mk-styles.ts
var mk = {
  surface: (alpha = 5) => ({
    background: `color-mix(in srgb, var(--mk-text) ${alpha}%, transparent)`
  }),
  mono: { fontFamily: "var(--mk-font-mono)" },
  label: {
    fontFamily: "var(--mk-font-mono)",
    color: "var(--mk-text-muted)"
  },
  faint: {
    fontFamily: "var(--mk-font-mono)",
    color: "var(--mk-text-faint)"
  }
};

// src/components/segmented-control.tsx
import { jsx } from "react/jsx-runtime";
function SegmentedControl({
  items,
  value,
  onValueChange,
  className,
  size = "sm"
}) {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      role: "tablist",
      className: cn("mk-segmented-control flex gap-1 p-1 rounded-xl", className),
      style: {
        background: "color-mix(in srgb, var(--mk-text) 5%, transparent)"
      },
      children: items.map((item) => {
        const isActive = item.value === value;
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            disabled: item.disabled,
            onClick: () => onValueChange(item.value),
            className: cn(
              "mk-segmented-control-item flex-1 font-mono font-medium uppercase tracking-[0.06em] transition-all cursor-pointer whitespace-nowrap rounded-lg",
              size === "sm" ? "h-[26px] text-[10px] px-1" : "h-8 text-xs px-2",
              isActive ? "shadow-sm" : "hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            ),
            style: {
              fontFamily: "var(--mk-font-mono)",
              background: isActive ? "color-mix(in srgb, var(--mk-surface) 72%, black)" : "transparent",
              color: isActive ? "var(--mk-text)" : "var(--mk-text-faint)"
            },
            children: item.label
          },
          item.value
        );
      })
    }
  );
}

// src/components/slider.tsx
import * as React from "react";

// src/lib/slider-ticks.ts
function getTickPcts(tickCount) {
  if (tickCount <= 0) return [];
  return Array.from({ length: tickCount }, (_, i) => (i + 1) / (tickCount + 1) * 100);
}
function getTickValues(min, max, tickCount) {
  return getTickPcts(tickCount).map((pct) => min + pct / 100 * (max - min));
}
function snapToNearestTick(value, tickValues, min, max, tickCount) {
  if (tickValues.length === 0) return value;
  const range = max - min;
  const threshold = range / (tickCount + 1) * 0.55;
  let snapped = value;
  let nearestDist = threshold;
  for (const tick of tickValues) {
    const dist = Math.abs(value - tick);
    if (dist < nearestDist) {
      nearestDist = dist;
      snapped = tick;
    }
  }
  return snapped;
}
function valueToPct(value, min, max) {
  if (max <= min) return 0;
  return (value - min) / (max - min) * 100;
}

// src/components/slider.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function Slider({
  label,
  hint,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  tickCount = 9,
  snapToTicks = tickCount > 0,
  className,
  disabled = false
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [livePct, setLivePct] = React.useState(null);
  const [editValue, setEditValue] = React.useState(null);
  const draggingRef = React.useRef(false);
  const trackRef = React.useRef(null);
  const lastValueRef = React.useRef(value);
  const tickValues = React.useMemo(() => getTickValues(min, max, tickCount), [min, max, tickCount]);
  const ticks = React.useMemo(() => getTickPcts(tickCount), [tickCount]);
  const percentage = valueToPct(value, min, max);
  const displayPct = livePct ?? percentage;
  const stepOnly = React.useCallback(
    (raw) => {
      const v = clamp(stepValue(raw, step), min, max);
      return Number(formatValue(v, step));
    },
    [min, max, step]
  );
  const applySnap = React.useCallback(
    (raw, forceSnap = false) => {
      let v = clamp(stepValue(raw, step), min, max);
      if (snapToTicks && tickCount > 0) {
        const snapped = snapToNearestTick(v, tickValues, min, max, tickCount);
        if (forceSnap || snapped !== v) {
          const threshold = (max - min) / (tickCount + 1) * 0.55;
          if (forceSnap || Math.abs(v - snapped) < threshold) {
            v = clamp(stepValue(snapped, step), min, max);
          }
        }
      }
      return Number(formatValue(v, step));
    },
    [min, max, step, snapToTicks, tickCount, tickValues]
  );
  const commitInput = (raw) => {
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onValueChange(applySnap(parsed));
    }
    setEditValue(null);
  };
  const currentInputValue = () => {
    if (editValue !== null) {
      const parsed = parseFloat(editValue);
      if (!isNaN(parsed)) return parsed;
    }
    return value;
  };
  const nudge = (delta) => {
    const next = stepOnly(currentInputValue() + delta);
    onValueChange(next);
    setEditValue(formatValue(next, step));
  };
  const updateFromClientX = React.useCallback(
    (clientX, finalSnap = false) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const rawPct = x / rect.width * 100;
      const raw = min + rawPct / 100 * (max - min);
      const next = applySnap(raw, finalSnap);
      if (draggingRef.current) {
        setLivePct(valueToPct(next, min, max));
      }
      lastValueRef.current = next;
      onValueChange(next);
    },
    [disabled, min, max, onValueChange, applySnap]
  );
  const endDrag = () => {
    if (draggingRef.current && snapToTicks) {
      const snapped = applySnap(lastValueRef.current, true);
      if (snapped !== lastValueRef.current) {
        onValueChange(snapped);
        setLivePct(valueToPct(snapped, min, max));
      }
    }
    draggingRef.current = false;
    setIsDragging(false);
    setLivePct(null);
  };
  const startDrag = (clientX) => {
    if (disabled) return;
    setEditValue(null);
    draggingRef.current = true;
    setIsDragging(true);
    updateFromClientX(clientX);
  };
  const onPointerDown = (e) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startDrag(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    updateFromClientX(e.clientX, true);
    endDrag();
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "mk-slider relative flex items-center gap-1.5 group",
        disabled && "opacity-50 pointer-events-none",
        className
      ),
      style: { height: "var(--mk-control-height)" },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: trackRef,
            role: "slider",
            "aria-valuemin": min,
            "aria-valuemax": max,
            "aria-valuenow": value,
            "aria-label": label,
            tabIndex: disabled ? -1 : 0,
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
            onKeyDown: (e) => {
              if (disabled) return;
              const delta = e.key === "ArrowRight" || e.key === "ArrowUp" ? step : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -step : 0;
              if (delta !== 0) {
                e.preventDefault();
                onValueChange(stepOnly(value + delta));
              }
            },
            className: "relative flex-1 overflow-hidden rounded-lg cursor-pointer touch-none select-none focus-visible:outline focus-visible:outline-offset-[-1px]",
            style: {
              height: "var(--mk-control-height)",
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              outlineColor: "var(--mk-text-muted)"
            },
            children: [
              ticks.length > 0 && /* @__PURE__ */ jsx2("div", { className: "absolute inset-0 pointer-events-none", children: ticks.map((left) => /* @__PURE__ */ jsx2(
                "div",
                {
                  className: "absolute top-1/2 w-px h-2 rounded-full",
                  style: {
                    left: `${left}%`,
                    transform: "translate(-50%, -50%)",
                    background: "color-mix(in srgb, var(--mk-text) 12%, transparent)"
                  }
                },
                left
              )) }),
              /* @__PURE__ */ jsx2(
                "div",
                {
                  className: "absolute inset-y-0 left-0 pointer-events-none",
                  style: {
                    width: `${displayPct}%`,
                    background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
                    transition: isDragging ? "none" : void 0
                  }
                }
              ),
              /* @__PURE__ */ jsx2(
                "div",
                {
                  className: cn(
                    "absolute top-1/2 w-0.5 rounded-full pointer-events-none transition-opacity",
                    isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  ),
                  style: {
                    left: `${displayPct}%`,
                    height: "calc(var(--mk-control-height) - 12px)",
                    transform: "translate(-50%, -50%)",
                    background: "var(--mk-text)",
                    transition: isDragging ? "opacity 150ms ease" : void 0
                  }
                }
              ),
              label && /* @__PURE__ */ jsx2("div", { className: "absolute inset-y-0 left-2.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em] flex items-center",
                  style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" },
                  children: [
                    label,
                    hint && /* @__PURE__ */ jsx2(
                      "span",
                      {
                        className: "ml-1.5 px-1 py-0.5 rounded text-[9px] font-medium tracking-normal leading-none",
                        style: {
                          background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
                          color: "var(--mk-text-faint)"
                        },
                        children: hint
                      }
                    )
                  ]
                }
              ) })
            ]
          }
        ),
        showValue && /* @__PURE__ */ jsx2(
          "input",
          {
            type: "text",
            inputMode: "decimal",
            value: editValue ?? formatValue(value, step),
            onFocus: () => setEditValue(formatValue(value, step)),
            onBlur: (e) => commitInput(e.target.value),
            onChange: (e) => setEditValue(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                nudge(step);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                nudge(-step);
              } else if (e.key === "Enter") {
                e.preventDefault();
                e.target.blur();
              } else if (e.key === "Escape") {
                setEditValue(null);
                e.target.blur();
              }
            },
            className: "w-12 font-mono text-[10px] font-medium text-right px-1.5 rounded-lg focus:outline focus:outline-offset-[-1px] transition-all shrink-0",
            style: {
              height: "var(--mk-control-height)",
              fontFamily: "var(--mk-font-mono)",
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              color: "var(--mk-text-muted)",
              outlineColor: "var(--mk-text-muted)"
            }
          }
        )
      ]
    }
  );
}

// src/components/dual-slider.tsx
import * as React2 from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function DualSlider({
  label,
  value: [start, end],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValues = true,
  className,
  disabled = false
}) {
  const [activeHandle, setActiveHandle] = React2.useState(null);
  const [liveRange, setLiveRange] = React2.useState(null);
  const draggingRef = React2.useRef(false);
  const activeHandleRef = React2.useRef(null);
  const trackRef = React2.useRef(null);
  const startPct = liveRange ? liveRange.start : (start - min) / (max - min) * 100;
  const endPct = liveRange ? liveRange.end : (end - min) / (max - min) * 100;
  const valueFromClientX = React2.useCallback(
    (clientX) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const raw = min + x / rect.width * (max - min);
      return clamp(stepValue(raw, step), min, max);
    },
    [min, max, step]
  );
  const pickHandle = React2.useCallback(
    (clientX) => {
      const val = valueFromClientX(clientX);
      const distStart = Math.abs(val - start);
      const distEnd = Math.abs(val - end);
      return distStart <= distEnd ? "start" : "end";
    },
    [valueFromClientX, start, end]
  );
  const pctFromClientX = React2.useCallback((clientX) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    return x / rect.width * 100;
  }, []);
  const updateHandle = React2.useCallback(
    (handle, clientX) => {
      if (disabled) return;
      const pct = pctFromClientX(clientX);
      const next = valueFromClientX(clientX);
      const baseStartPct = (start - min) / (max - min) * 100;
      const baseEndPct = (end - min) / (max - min) * 100;
      if (draggingRef.current) {
        setLiveRange((prev) => ({
          start: handle === "start" ? pct : prev?.start ?? baseStartPct,
          end: handle === "end" ? pct : prev?.end ?? baseEndPct
        }));
      }
      if (handle === "start") {
        onValueChange([Math.min(next, end), end]);
      } else {
        onValueChange([start, Math.max(next, start)]);
      }
    },
    [disabled, pctFromClientX, valueFromClientX, start, end, min, max, onValueChange]
  );
  const endDrag = React2.useCallback(() => {
    draggingRef.current = false;
    activeHandleRef.current = null;
    setActiveHandle(null);
    setLiveRange(null);
  }, []);
  const beginDrag = React2.useCallback(
    (e, handle) => {
      if (disabled || e.button !== 0 || !trackRef.current) return;
      e.preventDefault();
      trackRef.current.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      const active = handle ?? pickHandle(e.clientX);
      activeHandleRef.current = active;
      setActiveHandle(active);
      updateHandle(active, e.clientX);
    },
    [disabled, pickHandle, updateHandle]
  );
  const onPointerMove = (e) => {
    if (!trackRef.current?.hasPointerCapture(e.pointerId)) return;
    const handle = activeHandleRef.current;
    if (!handle) return;
    updateHandle(handle, e.clientX);
  };
  const onPointerUp = (e) => {
    if (!trackRef.current?.hasPointerCapture(e.pointerId)) return;
    trackRef.current.releasePointerCapture(e.pointerId);
    endDrag();
  };
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      className: cn(
        "mk-dual-slider flex flex-col gap-1.5",
        disabled && "opacity-50 pointer-events-none",
        className
      ),
      children: [
        label && /* @__PURE__ */ jsx3(
          "span",
          {
            className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
            style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-1.5", children: [
          showValues && /* @__PURE__ */ jsx3(
            "span",
            {
              className: "w-8 text-right font-mono text-[10px]",
              style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
              children: formatValue(start, step)
            }
          ),
          /* @__PURE__ */ jsxs2(
            "div",
            {
              ref: trackRef,
              className: "relative flex-1 rounded-lg cursor-pointer touch-none select-none",
              style: {
                height: "var(--mk-control-height)",
                background: "color-mix(in srgb, var(--mk-text) 5%, transparent)"
              },
              onPointerDown: (e) => beginDrag(e),
              onPointerMove,
              onPointerUp,
              onPointerCancel: onPointerUp,
              children: [
                /* @__PURE__ */ jsx3(
                  "div",
                  {
                    className: "absolute inset-y-0 pointer-events-none",
                    style: {
                      left: `${startPct}%`,
                      width: `${endPct - startPct}%`,
                      background: "color-mix(in srgb, var(--mk-text) 12%, transparent)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx3(
                  "div",
                  {
                    role: "slider",
                    "aria-valuemin": min,
                    "aria-valuemax": end,
                    "aria-valuenow": start,
                    "aria-label": label ? `${label} minimum` : "Range minimum",
                    tabIndex: disabled ? -1 : 0,
                    className: "absolute top-1/2 w-1 rounded-full cursor-ew-resize touch-none",
                    style: {
                      left: `${startPct}%`,
                      height: "calc(var(--mk-control-height) - 10px)",
                      transform: "translate(-50%, -50%)",
                      background: "var(--mk-text)",
                      opacity: activeHandle === "start" ? 1 : 0.7
                    },
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      beginDrag(e, "start");
                    }
                  }
                ),
                /* @__PURE__ */ jsx3(
                  "div",
                  {
                    role: "slider",
                    "aria-valuemin": start,
                    "aria-valuemax": max,
                    "aria-valuenow": end,
                    "aria-label": label ? `${label} maximum` : "Range maximum",
                    tabIndex: disabled ? -1 : 0,
                    className: "absolute top-1/2 w-1 rounded-full cursor-ew-resize touch-none",
                    style: {
                      left: `${endPct}%`,
                      height: "calc(var(--mk-control-height) - 10px)",
                      transform: "translate(-50%, -50%)",
                      background: "var(--mk-text)",
                      opacity: activeHandle === "end" ? 1 : 0.7
                    },
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      beginDrag(e, "end");
                    }
                  }
                )
              ]
            }
          ),
          showValues && /* @__PURE__ */ jsx3(
            "span",
            {
              className: "w-8 font-mono text-[10px]",
              style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
              children: formatValue(end, step)
            }
          )
        ] })
      ]
    }
  );
}

// src/components/number-stepper.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function NumberStepper({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false
}) {
  const adjust = (delta) => {
    if (disabled) return;
    const next = clamp(stepValue(value + delta, step), min, max);
    onValueChange(Number(formatValue(next, step)));
  };
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: cn(
        "mk-number-stepper flex items-center gap-1.5",
        disabled && "opacity-50 pointer-events-none",
        className
      ),
      children: [
        label && /* @__PURE__ */ jsx4(
          "span",
          {
            className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em] min-w-[52px]",
            style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxs3(
          "div",
          {
            className: "flex items-center rounded-lg overflow-hidden",
            style: {
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              height: "var(--mk-control-height)"
            },
            children: [
              /* @__PURE__ */ jsx4(
                "button",
                {
                  type: "button",
                  "aria-label": "Decrease",
                  onClick: () => adjust(-step),
                  className: "h-full px-2 font-mono text-sm transition-colors hover:opacity-80 cursor-pointer",
                  style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
                  children: "\u2212"
                }
              ),
              /* @__PURE__ */ jsx4(
                "input",
                {
                  type: "text",
                  inputMode: "decimal",
                  value: formatValue(value, step),
                  onChange: (e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) {
                      onValueChange(clamp(parsed, min, max));
                    }
                  },
                  onKeyDown: (e) => {
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      adjust(step);
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      adjust(-step);
                    }
                  },
                  className: "w-14 text-center font-mono text-[10px] font-medium bg-transparent focus:outline-none",
                  style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }
                }
              ),
              /* @__PURE__ */ jsx4(
                "button",
                {
                  type: "button",
                  "aria-label": "Increase",
                  onClick: () => adjust(step),
                  className: "h-full px-2 font-mono text-sm transition-colors hover:opacity-80 cursor-pointer",
                  style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
                  children: "+"
                }
              )
            ]
          }
        )
      ]
    }
  );
}

// src/components/color-picker.tsx
import * as React3 from "react";
import * as Popover from "@radix-ui/react-popover";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var DEFAULT_SWATCHES = [
  "#0066FF",
  "#FF3366",
  "#00CC88",
  "#FFAA00",
  "#9933FF",
  "#00BBFF",
  "#FFFFFF",
  "#111111",
  "#666666",
  "#E0E0E0",
  "#FF6B35",
  "#2EC4B6"
];
function normalizeHex(input) {
  const cleaned = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned.split("").map((c) => c + c).join("").toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }
  return null;
}
function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const n = parseInt(normalized.slice(1), 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((c) => Math.round(clamp(c, 0, 255)).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}
function rgbToHsv(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = (gn - bn) / d % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s: s * 100, v: max * 100 };
}
function hsvToRgb(h, s, v) {
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(h / 60 % 2 - 1));
  const m = vn - c;
  let rn = 0;
  let gn = 0;
  let bn = 0;
  if (h < 60) [rn, gn, bn] = [c, x, 0];
  else if (h < 120) [rn, gn, bn] = [x, c, 0];
  else if (h < 180) [rn, gn, bn] = [0, c, x];
  else if (h < 240) [rn, gn, bn] = [0, x, c];
  else if (h < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];
  return {
    r: (rn + m) * 255,
    g: (gn + m) * 255,
    b: (bn + m) * 255
  };
}
function hsvToHex(h, s, v) {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}
function hueColor(h) {
  return hsvToHex(h, 100, 100);
}
function ColorPanel({
  h,
  s,
  v,
  swatches,
  value,
  onChange
}) {
  const svRef = React3.useRef(null);
  const draggingSv = React3.useRef(false);
  const updateSv = React3.useCallback(
    (clientX, clientY) => {
      if (!svRef.current) return;
      const rect = svRef.current.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);
      onChange(hsvToHex(h, x * 100, (1 - y) * 100));
    },
    [h, onChange]
  );
  const onSvPointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingSv.current = true;
    updateSv(e.clientX, e.clientY);
  };
  const onSvPointerMove = (e) => {
    if (!draggingSv.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateSv(e.clientX, e.clientY);
  };
  const onSvPointerUp = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggingSv.current = false;
  };
  return /* @__PURE__ */ jsxs4("div", { className: "flex flex-col gap-2.5", children: [
    /* @__PURE__ */ jsxs4(
      "div",
      {
        ref: svRef,
        className: "relative h-28 w-full rounded-lg cursor-crosshair touch-none select-none overflow-hidden",
        style: { background: hueColor(h) },
        onPointerDown: onSvPointerDown,
        onPointerMove: onSvPointerMove,
        onPointerUp: onSvPointerUp,
        onPointerCancel: onSvPointerUp,
        children: [
          /* @__PURE__ */ jsx5("div", { className: "absolute inset-0", style: { background: "linear-gradient(to right, #fff, transparent)" } }),
          /* @__PURE__ */ jsx5("div", { className: "absolute inset-0", style: { background: "linear-gradient(to top, #000, transparent)" } }),
          /* @__PURE__ */ jsx5(
            "div",
            {
              className: "absolute w-3 h-3 rounded-full border-2 pointer-events-none",
              style: {
                left: `${s}%`,
                top: `${100 - v}%`,
                transform: "translate(-50%, -50%)",
                borderColor: v > 55 ? "#111" : "#fff",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.25)"
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx5(
      "div",
      {
        className: "relative h-2.5 w-full rounded-full cursor-pointer touch-none select-none",
        style: {
          background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
        },
        onPointerDown: (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);
          const pick = (clientX) => {
            const rect = el.getBoundingClientRect();
            const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
            onChange(hsvToHex(pct * 360, s, v));
          };
          pick(e.clientX);
          const onMove = (ev) => {
            if (!el.hasPointerCapture(ev.pointerId)) return;
            pick(ev.clientX);
          };
          const onUp = (ev) => {
            el.releasePointerCapture(ev.pointerId);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerup", onUp);
        },
        children: /* @__PURE__ */ jsx5(
          "div",
          {
            className: "absolute top-1/2 w-3 h-3 rounded-full border-2 pointer-events-none",
            style: {
              left: `${h / 360 * 100}%`,
              transform: "translate(-50%, -50%)",
              background: hueColor(h),
              borderColor: "#fff",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.35)"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx5("div", { className: "grid grid-cols-6 gap-1", children: swatches.slice(0, 12).map((color) => /* @__PURE__ */ jsx5(
      "button",
      {
        type: "button",
        "aria-label": `Select ${color}`,
        "aria-pressed": value.toUpperCase() === color.toUpperCase(),
        onClick: () => onChange(color),
        className: "aspect-square rounded-md cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-offset-1",
        style: {
          background: color,
          outlineColor: "var(--mk-text-muted)",
          boxShadow: value.toUpperCase() === color.toUpperCase() ? `0 0 0 1px var(--mk-bg), 0 0 0 2px var(--mk-text-muted)` : void 0
        }
      },
      color
    )) })
  ] });
}
function ColorPicker({
  value,
  onValueChange,
  swatches = DEFAULT_SWATCHES,
  showEyedropper = true,
  label,
  className
}) {
  const [hexInput, setHexInput] = React3.useState(value);
  const [open, setOpen] = React3.useState(false);
  const eyedropperSupported = typeof window !== "undefined" && "EyeDropper" in window;
  const rgb = hexToRgb(value) ?? { r: 17, g: 17, b: 17 };
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  React3.useEffect(() => {
    setHexInput(value);
  }, [value]);
  const handleHexCommit = () => {
    const normalized = normalizeHex(hexInput);
    if (normalized) {
      onValueChange(normalized);
      setHexInput(normalized);
    } else {
      setHexInput(value);
    }
  };
  const pickFromScreen = async () => {
    if (!eyedropperSupported) return;
    try {
      const dropper = new EyeDropper();
      const result = await dropper.open();
      const normalized = normalizeHex(result.sRGBHex);
      if (normalized) onValueChange(normalized);
    } catch {
    }
  };
  const applyColor = (hex) => {
    onValueChange(hex);
    setHexInput(hex);
  };
  return /* @__PURE__ */ jsxs4("div", { className: cn("mk-color-picker flex flex-col gap-2", className), children: [
    label && /* @__PURE__ */ jsx5(
      "span",
      {
        className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
        style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" },
        children: label
      }
    ),
    /* @__PURE__ */ jsx5("div", { className: "grid grid-cols-6 gap-1.5", children: swatches.map((color) => /* @__PURE__ */ jsx5(
      "button",
      {
        type: "button",
        "aria-label": `Select ${color}`,
        "aria-pressed": value.toUpperCase() === color.toUpperCase(),
        onClick: () => applyColor(color),
        className: "aspect-square rounded-md cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-offset-2",
        style: {
          background: color,
          outlineColor: "var(--mk-text-muted)",
          boxShadow: value.toUpperCase() === color.toUpperCase() ? `0 0 0 2px var(--mk-bg), 0 0 0 3px var(--mk-text-muted)` : void 0
        }
      },
      color
    )) }),
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxs4(Popover.Root, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx5(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsx5(
          "button",
          {
            type: "button",
            "aria-label": "Open color picker",
            className: "w-8 h-8 rounded-lg shrink-0 border cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-offset-2",
            style: {
              background: value,
              borderColor: "var(--mk-border)",
              outlineColor: "var(--mk-text-muted)"
            }
          }
        ) }),
        /* @__PURE__ */ jsx5(Popover.Portal, { children: /* @__PURE__ */ jsx5(
          Popover.Content,
          {
            side: "bottom",
            align: "start",
            sideOffset: 6,
            className: "z-50 w-52 rounded-xl border p-2.5 shadow-xl",
            style: {
              background: "var(--mk-surface-raised)",
              borderColor: "var(--mk-border)"
            },
            children: /* @__PURE__ */ jsx5(
              ColorPanel,
              {
                h: hsv.h,
                s: hsv.s,
                v: hsv.v,
                swatches,
                value,
                onChange: applyColor
              }
            )
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx5(
        "input",
        {
          type: "text",
          value: hexInput,
          onChange: (e) => setHexInput(e.target.value),
          onBlur: handleHexCommit,
          onKeyDown: (e) => e.key === "Enter" && handleHexCommit(),
          spellCheck: false,
          className: "flex-1 h-8 px-2 rounded-lg font-mono text-[10px] uppercase focus:outline focus:outline-offset-[-1px]",
          style: {
            fontFamily: "var(--mk-font-mono)",
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: "var(--mk-text-muted)",
            outlineColor: "var(--mk-text-muted)"
          }
        }
      ),
      showEyedropper && eyedropperSupported && /* @__PURE__ */ jsx5(
        "button",
        {
          type: "button",
          onClick: pickFromScreen,
          "aria-label": "Pick color from screen",
          className: "h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 shrink-0",
          style: {
            background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: "var(--mk-text-muted)"
          },
          children: "\u25C9"
        }
      )
    ] })
  ] });
}

// src/components/badge.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function Badge({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}) {
  const variantStyles = {
    default: {
      background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
      color: "var(--mk-text-muted)"
    },
    accent: {
      background: "var(--mk-accent-muted)",
      color: "var(--mk-accent)"
    },
    muted: {
      background: "transparent",
      color: "var(--mk-text-faint)"
    },
    outline: {
      background: "transparent",
      color: "var(--mk-text-muted)",
      border: "1px solid var(--mk-border)"
    }
  };
  return /* @__PURE__ */ jsx6(
    "span",
    {
      className: cn(
        "mk-badge inline-flex items-center font-mono font-medium uppercase tracking-[0.06em] rounded leading-none",
        size === "sm" ? "text-[9px] px-1 py-0.5" : "text-[10px] px-1.5 py-1",
        className
      ),
      style: {
        fontFamily: "var(--mk-font-mono)",
        ...variantStyles[variant]
      },
      ...props,
      children
    }
  );
}

// src/components/sidebar.tsx
import * as React4 from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function Sidebar({
  title,
  side = "left",
  width = 194,
  collapsible = false,
  defaultCollapsed = false,
  header,
  footer,
  children,
  className
}) {
  const [collapsed, setCollapsed] = React4.useState(defaultCollapsed);
  if (collapsed && collapsible) {
    return /* @__PURE__ */ jsx7(
      "aside",
      {
        className: cn("mk-sidebar flex flex-col shrink-0", className),
        style: {
          width: 36,
          background: "var(--mk-surface)",
          borderRight: side === "left" ? "1px solid var(--mk-border)" : void 0,
          borderLeft: side === "right" ? "1px solid var(--mk-border)" : void 0
        },
        children: /* @__PURE__ */ jsx7(
          "button",
          {
            type: "button",
            onClick: () => setCollapsed(false),
            "aria-label": "Expand sidebar",
            className: "h-9 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity",
            style: { color: "var(--mk-text-faint)" },
            children: side === "left" ? "\u203A" : "\u2039"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxs5(
    "aside",
    {
      className: cn("mk-sidebar flex flex-col shrink-0 p-2", className),
      style: {
        width,
        background: "var(--mk-surface)",
        color: "var(--mk-text)",
        borderRight: side === "left" ? "1px solid var(--mk-border)" : void 0,
        borderLeft: side === "right" ? "1px solid var(--mk-border)" : void 0
      },
      children: [
        (title || header || collapsible) && /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-2 gap-2", children: [
          /* @__PURE__ */ jsx7("div", { className: "flex-1 min-w-0", children: header ?? (title && /* @__PURE__ */ jsx7(
            "span",
            {
              className: "font-mono text-[10px] font-medium uppercase tracking-[0.08em]",
              style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
              children: title
            }
          )) }),
          collapsible && /* @__PURE__ */ jsx7(
            "button",
            {
              type: "button",
              onClick: () => setCollapsed(true),
              "aria-label": "Collapse sidebar",
              className: "text-[10px] cursor-pointer hover:opacity-80 transition-opacity shrink-0",
              style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
              children: side === "left" ? "\u2039" : "\u203A"
            }
          )
        ] }),
        /* @__PURE__ */ jsx7("div", { className: "flex-1 flex flex-col gap-1.5 min-h-0 overflow-y-auto", children }),
        footer && /* @__PURE__ */ jsx7(
          "div",
          {
            className: "mt-2 pt-2",
            style: { borderTop: "1px solid var(--mk-border)" },
            children: footer
          }
        )
      ]
    }
  );
}

// src/components/tooltip.tsx
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function Tooltip({
  content,
  shortcut,
  children,
  side = "top",
  delayDuration = 300,
  className
}) {
  return /* @__PURE__ */ jsx8(TooltipPrimitive.Provider, { delayDuration, children: /* @__PURE__ */ jsxs6(TooltipPrimitive.Root, { children: [
    /* @__PURE__ */ jsx8(TooltipPrimitive.Trigger, { asChild: true, children }),
    /* @__PURE__ */ jsx8(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs6(
      TooltipPrimitive.Content,
      {
        side,
        sideOffset: 6,
        className: cn("mk-tooltip z-50 animate-in fade-in-0 zoom-in-95", className),
        style: {
          background: "var(--mk-surface-raised)",
          border: "1px solid var(--mk-border)",
          borderRadius: "var(--mk-radius-sm)",
          padding: "4px 8px",
          fontFamily: "var(--mk-font-mono)",
          fontSize: "10px",
          color: "var(--mk-text-muted)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
        },
        children: [
          /* @__PURE__ */ jsxs6("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx8("span", { children: content }),
            shortcut && /* @__PURE__ */ jsx8(
              "kbd",
              {
                className: "px-1 py-0.5 rounded text-[9px] leading-none",
                style: {
                  background: "color-mix(in srgb, var(--mk-text) 8%, transparent)",
                  color: "var(--mk-text-faint)"
                },
                children: shortcut
              }
            )
          ] }),
          /* @__PURE__ */ jsx8(
            TooltipPrimitive.Arrow,
            {
              style: {
                fill: "var(--mk-surface-raised)"
              }
            }
          )
        ]
      }
    ) })
  ] }) });
}

// src/components/toggle.tsx
import * as Switch from "@radix-ui/react-switch";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
function Toggle({ label, checked, onCheckedChange, disabled, className }) {
  return /* @__PURE__ */ jsxs7(
    "label",
    {
      className: cn(
        "mk-toggle inline-flex items-center gap-3 cursor-pointer select-none",
        label ? "justify-between w-full" : "justify-end shrink-0",
        disabled && "opacity-50 pointer-events-none",
        className
      ),
      children: [
        label ? /* @__PURE__ */ jsx9("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }) : null,
        /* @__PURE__ */ jsx9(
          Switch.Root,
          {
            checked,
            onCheckedChange,
            disabled,
            className: "relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer data-[state=checked]:bg-white/20 focus-visible:outline focus-visible:outline-offset-2",
            style: { ...mk.surface(8), outlineColor: "var(--mk-text-muted)" },
            children: /* @__PURE__ */ jsx9(Switch.Thumb, { className: "block h-3.5 w-3.5 rounded-full bg-white/90 transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px] pointer-events-none" })
          }
        )
      ]
    }
  );
}

// src/components/select.tsx
import * as SelectPrimitive from "@radix-ui/react-select";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select\u2026",
  className,
  disabled
}) {
  return /* @__PURE__ */ jsxs8("div", { className: cn("mk-select flex flex-col gap-1.5", className), children: [
    label && /* @__PURE__ */ jsx10("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }),
    /* @__PURE__ */ jsxs8(SelectPrimitive.Root, { value, onValueChange, disabled, children: [
      /* @__PURE__ */ jsxs8(
        SelectPrimitive.Trigger,
        {
          className: "flex h-8 w-full items-center justify-between rounded-lg px-2.5 font-mono text-[10px] uppercase tracking-wide cursor-pointer focus:outline focus:outline-offset-[-1px]",
          style: { ...mk.mono, ...mk.surface(5), color: "var(--mk-text-muted)", outlineColor: "var(--mk-text-muted)" },
          children: [
            /* @__PURE__ */ jsx10(SelectPrimitive.Value, { placeholder }),
            /* @__PURE__ */ jsx10(SelectPrimitive.Icon, { className: "opacity-50", children: "\u25BE" })
          ]
        }
      ),
      /* @__PURE__ */ jsx10(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsx10(
        SelectPrimitive.Content,
        {
          className: "z-50 overflow-hidden rounded-lg border shadow-lg",
          style: {
            background: "var(--mk-surface-raised)",
            borderColor: "var(--mk-border)"
          },
          position: "popper",
          sideOffset: 4,
          children: /* @__PURE__ */ jsx10(SelectPrimitive.Viewport, { className: "p-1", children: options.map((opt) => /* @__PURE__ */ jsx10(
            SelectPrimitive.Item,
            {
              value: opt.value,
              disabled: opt.disabled,
              className: "flex h-8 items-center rounded-md px-2 font-mono text-[10px] uppercase tracking-wide cursor-pointer outline-none data-[highlighted]:opacity-100 opacity-70",
              style: { ...mk.mono, color: "var(--mk-text-muted)" },
              children: /* @__PURE__ */ jsx10(SelectPrimitive.ItemText, { children: opt.label })
            },
            opt.value
          )) })
        }
      ) })
    ] })
  ] });
}

// src/components/button.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function Button({
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}) {
  const variants = {
    primary: { ...mk.surface(14), color: "var(--mk-text)" },
    secondary: { ...mk.surface(8), color: "var(--mk-text-muted)" },
    ghost: { background: "transparent", color: "var(--mk-text-muted)" },
    danger: { background: "color-mix(in srgb, #ff3366 15%, transparent)", color: "#ff6688" }
  };
  return /* @__PURE__ */ jsx11(
    "button",
    {
      type: "button",
      className: cn(
        "mk-button inline-flex items-center justify-center rounded-lg font-mono font-medium uppercase tracking-[0.06em] transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        size === "sm" ? "h-8 px-3 text-[10px]" : "h-9 px-4 text-xs",
        className
      ),
      style: { ...mk.mono, ...variants[variant] },
      ...props,
      children
    }
  );
}
function IconButton({
  label,
  active = false,
  size = "sm",
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx11(
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": active,
      className: cn(
        "mk-icon-button inline-flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-40",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        className
      ),
      style: {
        ...mk.mono,
        ...mk.surface(active ? 12 : 5),
        color: active ? "var(--mk-text)" : "var(--mk-text-muted)"
      },
      ...props,
      children
    }
  );
}

// src/components/text-input.tsx
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
function TextInput({ label, size = "sm", className, ...props }) {
  return /* @__PURE__ */ jsxs9("div", { className: cn("mk-text-input flex flex-col gap-1.5", className), children: [
    label && /* @__PURE__ */ jsx12("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }),
    /* @__PURE__ */ jsx12(
      "input",
      {
        className: cn(
          "w-full rounded-lg px-2.5 font-mono focus:outline focus:outline-offset-[-1px]",
          size === "sm" ? "h-8 text-[10px]" : "h-9 text-xs"
        ),
        style: {
          ...mk.mono,
          ...mk.surface(5),
          color: "var(--mk-text-muted)",
          outlineColor: "var(--mk-text-muted)"
        },
        ...props
      }
    )
  ] });
}

// src/components/checkbox.tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
function Checkbox({ label, checked, onCheckedChange, disabled, className }) {
  return /* @__PURE__ */ jsxs10(
    "label",
    {
      className: cn(
        "mk-checkbox flex items-center gap-2 cursor-pointer",
        disabled && "opacity-50 pointer-events-none",
        className
      ),
      children: [
        /* @__PURE__ */ jsx13(
          CheckboxPrimitive.Root,
          {
            checked,
            onCheckedChange: (v) => onCheckedChange(v === true),
            disabled,
            className: "flex h-4 w-4 items-center justify-center rounded border transition-colors",
            style: { borderColor: "var(--mk-border)", ...mk.surface(5) },
            children: /* @__PURE__ */ jsx13(CheckboxPrimitive.Indicator, { className: "text-[10px]", style: { color: "var(--mk-text)" }, children: "\u2713" })
          }
        ),
        /* @__PURE__ */ jsx13("span", { className: "font-mono text-[10px] uppercase tracking-[0.06em]", style: mk.label, children: label })
      ]
    }
  );
}

// src/components/radio-group.tsx
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
function RadioGroup({
  label,
  value,
  onValueChange,
  options,
  orientation = "vertical",
  className
}) {
  return /* @__PURE__ */ jsxs11("div", { className: cn("mk-radio-group flex flex-col gap-2", className), children: [
    label && /* @__PURE__ */ jsx14("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }),
    /* @__PURE__ */ jsx14(
      RadioGroupPrimitive.Root,
      {
        value,
        onValueChange,
        className: cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"),
        children: options.map((opt) => /* @__PURE__ */ jsxs11("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx14(
            RadioGroupPrimitive.Item,
            {
              value: opt.value,
              disabled: opt.disabled,
              className: "h-3.5 w-3.5 rounded-full border flex items-center justify-center",
              style: { borderColor: "var(--mk-border)" },
              children: /* @__PURE__ */ jsx14(RadioGroupPrimitive.Indicator, { className: "h-1.5 w-1.5 rounded-full", style: { background: "var(--mk-text)" } })
            }
          ),
          /* @__PURE__ */ jsx14("span", { className: "font-mono text-[10px] uppercase tracking-[0.06em]", style: mk.label, children: opt.label })
        ] }, opt.value))
      }
    )
  ] });
}

// src/components/coordinate-input.tsx
import { jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
function CoordinateInput({
  label,
  x,
  y,
  onChange,
  min = -9999,
  max = 9999,
  step = 1,
  className
}) {
  const field = (axis, value) => /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-1 flex-1", children: [
    /* @__PURE__ */ jsx15("span", { className: "font-mono text-[9px] uppercase w-3", style: mk.faint, children: axis }),
    /* @__PURE__ */ jsx15(
      "input",
      {
        type: "number",
        value,
        step,
        onChange: (e) => {
          const n = parseFloat(e.target.value);
          if (!isNaN(n)) {
            onChange(
              axis === "x" ? { x: clamp(n, min, max), y } : { x, y: clamp(n, min, max) }
            );
          }
        },
        className: "flex-1 h-8 rounded-lg px-1.5 font-mono text-[10px] text-center focus:outline-none",
        style: { ...mk.mono, ...mk.surface(5), color: "var(--mk-text-muted)" }
      }
    )
  ] });
  return /* @__PURE__ */ jsxs12("div", { className: cn("mk-coordinate-input flex flex-col gap-1.5", className), children: [
    label && /* @__PURE__ */ jsx15("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }),
    /* @__PURE__ */ jsxs12("div", { className: "flex gap-1.5", children: [
      field("x", x),
      field("y", y)
    ] })
  ] });
}

// src/components/preset-picker.tsx
import { jsx as jsx16, jsxs as jsxs13 } from "react/jsx-runtime";
function PresetPicker({
  label,
  presets,
  value,
  onValueChange,
  onAdd,
  className
}) {
  return /* @__PURE__ */ jsxs13("div", { className: cn("mk-preset-picker flex flex-col gap-2", className), children: [
    label && /* @__PURE__ */ jsx16("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }),
    /* @__PURE__ */ jsxs13("div", { className: "flex flex-wrap gap-1", children: [
      presets.map((p) => /* @__PURE__ */ jsx16(
        "button",
        {
          type: "button",
          onClick: () => onValueChange(p.id),
          className: "h-7 px-2 rounded-lg font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-85",
          style: {
            ...mk.mono,
            ...mk.surface(value === p.id ? 14 : 5),
            color: value === p.id ? "var(--mk-text)" : "var(--mk-text-faint)"
          },
          children: p.label
        },
        p.id
      )),
      onAdd && /* @__PURE__ */ jsx16(
        "button",
        {
          type: "button",
          onClick: onAdd,
          className: "h-7 w-7 rounded-lg font-mono text-sm cursor-pointer flex items-center justify-center",
          style: { ...mk.surface(5), color: "var(--mk-text-faint)" },
          children: "+"
        }
      )
    ] })
  ] });
}

// src/components/field-group.tsx
import { jsx as jsx17, jsxs as jsxs14 } from "react/jsx-runtime";
function FieldGroup({
  label,
  hint,
  children,
  className,
  layout = "stack"
}) {
  return /* @__PURE__ */ jsxs14(
    "div",
    {
      className: cn(
        "mk-field-group",
        layout === "row" ? "flex items-center justify-between gap-2" : "flex flex-col gap-1.5",
        className
      ),
      children: [
        (label || hint) && /* @__PURE__ */ jsxs14("div", { className: cn("flex items-center gap-1.5", layout === "row" && "shrink-0"), children: [
          label && /* @__PURE__ */ jsx17("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]", style: mk.label, children: label }),
          hint && /* @__PURE__ */ jsx17(
            "span",
            {
              className: "px-1 py-0.5 rounded text-[9px] font-medium uppercase leading-none",
              style: { ...mk.mono, ...mk.surface(10), color: "var(--mk-text-faint)" },
              children: hint
            }
          )
        ] }),
        /* @__PURE__ */ jsx17("div", { className: cn(layout === "row" ? "flex-1 min-w-0 flex justify-end items-center" : void 0), children })
      ]
    }
  );
}

// src/components/panel.tsx
import * as React5 from "react";
import { Fragment, jsx as jsx18, jsxs as jsxs15 } from "react/jsx-runtime";
function Panel({
  title = "Panel",
  children,
  mode = "docked",
  side = "left",
  width = 220,
  collapsible = true,
  defaultCollapsed = false,
  defaultPosition = { x: 24, y: 24 },
  className,
  footer
}) {
  const [collapsed, setCollapsed] = React5.useState(defaultCollapsed);
  const [pos, setPos] = React5.useState(defaultPosition);
  const dragRef = React5.useRef(null);
  const startDrag = (e) => {
    if (mode !== "floating") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { ox: e.clientX, oy: e.clientY, px: pos.x, py: pos.y };
  };
  const onDrag = (e) => {
    if (!dragRef.current) return;
    setPos({
      x: dragRef.current.px + (e.clientX - dragRef.current.ox),
      y: dragRef.current.py + (e.clientY - dragRef.current.oy)
    });
  };
  const endDrag = () => {
    dragRef.current = null;
  };
  const shell = /* @__PURE__ */ jsxs15(Fragment, { children: [
    /* @__PURE__ */ jsxs15(
      "div",
      {
        className: cn(
          "flex items-center justify-between gap-2 px-2 shrink-0 border-b",
          mode === "floating" && "cursor-grab active:cursor-grabbing touch-none"
        ),
        style: { borderColor: "var(--mk-border)", height: "var(--mk-control-height)" },
        onPointerDown: startDrag,
        onPointerMove: onDrag,
        onPointerUp: endDrag,
        children: [
          /* @__PURE__ */ jsx18("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.08em] truncate", style: mk.faint, children: title }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-1 shrink-0", children: [
            mode === "floating" && /* @__PURE__ */ jsx18("span", { className: "text-[9px] opacity-30", style: mk.mono, children: "\u283F" }),
            collapsible && /* @__PURE__ */ jsx18(
              "button",
              {
                type: "button",
                onClick: () => setCollapsed((c) => !c),
                className: "text-[10px] opacity-50 hover:opacity-80 cursor-pointer px-1",
                style: mk.mono,
                children: collapsed ? "+" : "\u2212"
              }
            )
          ] })
        ]
      }
    ),
    !collapsed && /* @__PURE__ */ jsxs15(Fragment, { children: [
      /* @__PURE__ */ jsx18("div", { className: "flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 min-h-0", children }),
      footer && /* @__PURE__ */ jsx18("div", { className: "p-2 border-t shrink-0", style: { borderColor: "var(--mk-border)" }, children: footer })
    ] })
  ] });
  if (mode === "floating") {
    return /* @__PURE__ */ jsx18(
      "aside",
      {
        className: cn("mk-panel fixed z-40 flex flex-col rounded-xl border shadow-2xl", className),
        style: {
          left: pos.x,
          top: pos.y,
          width: collapsed ? 160 : width,
          maxHeight: collapsed ? void 0 : 420,
          background: "var(--mk-surface)",
          borderColor: "var(--mk-border)",
          color: "var(--mk-text)"
        },
        children: shell
      }
    );
  }
  return /* @__PURE__ */ jsx18(
    "aside",
    {
      className: cn("mk-panel flex flex-col shrink-0 border-r h-full", className),
      style: {
        width: collapsed ? 36 : width,
        background: "var(--mk-surface)",
        borderColor: "var(--mk-border)",
        borderRight: side === "left" ? "1px solid var(--mk-border)" : void 0,
        borderLeft: side === "right" ? "1px solid var(--mk-border)" : void 0
      },
      children: shell
    }
  );
}

// src/components/drawer.tsx
import * as React6 from "react";
import { Fragment as Fragment2, jsx as jsx19, jsxs as jsxs16 } from "react/jsx-runtime";
function Drawer({
  open,
  onOpenChange,
  title,
  side = "right",
  width = 280,
  children
}) {
  React6.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);
  if (!open) return null;
  const positionStyles = side === "bottom" ? { left: 0, right: 0, bottom: 0, maxHeight: "70vh" } : side === "left" ? { left: 0, top: 0, bottom: 0, width } : { right: 0, top: 0, bottom: 0, width };
  return /* @__PURE__ */ jsxs16(Fragment2, { children: [
    /* @__PURE__ */ jsx19(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50",
        onClick: () => onOpenChange(false),
        "aria-hidden": true
      }
    ),
    /* @__PURE__ */ jsxs16(
      "aside",
      {
        className: cn(
          "mk-drawer fixed z-50 flex flex-col border shadow-2xl",
          side === "bottom" ? "rounded-t-xl border-b-0" : ""
        ),
        style: {
          ...positionStyles,
          background: "var(--mk-surface)",
          borderColor: "var(--mk-border)"
        },
        children: [
          /* @__PURE__ */ jsxs16(
            "div",
            {
              className: "flex items-center justify-between px-3 shrink-0 border-b",
              style: { borderColor: "var(--mk-border)", height: "var(--mk-control-height)" },
              children: [
                title && /* @__PURE__ */ jsx19("span", { className: "font-mono text-[10px] uppercase tracking-[0.08em]", style: mk.faint, children: title }),
                /* @__PURE__ */ jsx19(
                  "button",
                  {
                    type: "button",
                    onClick: () => onOpenChange(false),
                    className: "ml-auto text-[10px] opacity-50 hover:opacity-80 cursor-pointer",
                    style: mk.mono,
                    children: "\u2715"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx19("div", { className: "flex-1 overflow-y-auto p-3", children })
        ]
      }
    )
  ] });
}

// src/components/split-view.tsx
import * as React7 from "react";
import { jsx as jsx20, jsxs as jsxs17 } from "react/jsx-runtime";
function SplitView({
  left,
  right,
  defaultRatio = 50,
  minRatio = 20,
  maxRatio = 80,
  className,
  orientation = "horizontal"
}) {
  const [ratio, setRatio] = React7.useState(defaultRatio);
  const containerRef = React7.useRef(null);
  const startDrag = (e) => {
    const getPos = (ev) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const clientY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      const pct = isH ? (clientX - rect.left) / rect.width * 100 : (clientY - rect.top) / rect.height * 100;
      setRatio(clamp(pct, minRatio, maxRatio));
    };
    getPos(e.nativeEvent);
    const onMove = (ev) => getPos(ev);
    const onEnd = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };
  const isH = orientation === "horizontal";
  return /* @__PURE__ */ jsxs17(
    "div",
    {
      ref: containerRef,
      className: cn("mk-split-view flex overflow-hidden rounded-xl border", isH ? "flex-row" : "flex-col", className),
      style: { borderColor: "var(--mk-border)", minHeight: isH ? 200 : 320 },
      children: [
        /* @__PURE__ */ jsx20("div", { className: "overflow-auto min-w-0 min-h-0", style: { [isH ? "width" : "height"]: `${ratio}%` }, children: left }),
        /* @__PURE__ */ jsx20(
          "div",
          {
            role: "separator",
            "aria-orientation": orientation,
            className: cn("shrink-0 flex items-center justify-center touch-none", isH ? "w-1 cursor-ew-resize" : "h-1 cursor-ns-resize"),
            style: { background: "var(--mk-border)" },
            onMouseDown: startDrag,
            onTouchStart: startDrag
          }
        ),
        /* @__PURE__ */ jsx20("div", { className: "flex-1 overflow-auto min-w-0 min-h-0", children: right })
      ]
    }
  );
}

// src/components/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx21, jsxs as jsxs18 } from "react/jsx-runtime";
function Tabs({ items, defaultValue, className }) {
  return /* @__PURE__ */ jsxs18(TabsPrimitive.Root, { defaultValue: defaultValue ?? items[0]?.value, className: cn("mk-tabs flex flex-col gap-3", className), children: [
    /* @__PURE__ */ jsx21(TabsPrimitive.List, { className: "flex gap-1 border-b pb-px", style: { borderColor: "var(--mk-border)" }, children: items.map((item) => /* @__PURE__ */ jsx21(
      TabsPrimitive.Trigger,
      {
        value: item.value,
        className: "px-3 h-8 font-mono text-[10px] uppercase tracking-[0.06em] cursor-pointer opacity-50 data-[state=active]:opacity-100 transition-opacity border-b-2 border-transparent data-[state=active]:border-white/40 -mb-px",
        style: mk.label,
        children: item.label
      },
      item.value
    )) }),
    items.map((item) => /* @__PURE__ */ jsx21(
      TabsPrimitive.Content,
      {
        value: item.value,
        className: "outline-none data-[state=inactive]:hidden",
        children: item.content
      },
      item.value
    ))
  ] });
}

// src/components/accordion.tsx
import * as Accordion from "@radix-ui/react-accordion";
import { jsx as jsx22, jsxs as jsxs19 } from "react/jsx-runtime";
function AccordionPanel({ items, defaultOpen, className }) {
  return /* @__PURE__ */ jsx22(
    Accordion.Root,
    {
      type: "multiple",
      defaultValue: defaultOpen ?? items.slice(0, 1).map((i) => i.id),
      className: cn("mk-accordion flex flex-col gap-1", className),
      children: items.map((item) => /* @__PURE__ */ jsxs19(
        Accordion.Item,
        {
          value: item.id,
          className: "rounded-lg overflow-hidden",
          style: { ...mk.surface(4) },
          children: [
            /* @__PURE__ */ jsx22(Accordion.Header, { children: /* @__PURE__ */ jsxs19(Accordion.Trigger, { className: "flex w-full items-center justify-between px-2.5 h-9 font-mono text-[10px] uppercase tracking-[0.06em] cursor-pointer group", children: [
              /* @__PURE__ */ jsx22("span", { style: mk.label, children: item.title }),
              /* @__PURE__ */ jsx22(
                "span",
                {
                  className: "flex items-center justify-center w-5 h-5 text-sm opacity-50 group-data-[state=open]:rotate-180 transition-transform shrink-0",
                  "aria-hidden": true,
                  children: "\u25BE"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx22(Accordion.Content, { className: "px-2.5 pb-2.5 pt-0 flex flex-col gap-1.5", children: item.content })
          ]
        },
        item.id
      ))
    }
  );
}

// src/components/toolbar.tsx
import * as React8 from "react";
import { jsx as jsx23 } from "react/jsx-runtime";
function Toolbar({ items, orientation = "horizontal", className }) {
  return /* @__PURE__ */ jsx23(
    "div",
    {
      role: "toolbar",
      "aria-orientation": orientation,
      className: cn(
        "mk-toolbar inline-flex gap-1 p-1 rounded-xl",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      ),
      style: {
        background: "color-mix(in srgb, var(--mk-text) 5%, transparent)"
      },
      children: items.map((item) => {
        const button = /* @__PURE__ */ jsx23(
          "button",
          {
            type: "button",
            role: "toolbaritem",
            "aria-label": item.label,
            "aria-pressed": item.active,
            disabled: item.disabled,
            onClick: item.onClick,
            className: cn(
              "flex items-center justify-center rounded-lg transition-all cursor-pointer",
              orientation === "vertical" ? "w-8 h-8" : "h-8 min-w-8 px-2",
              item.disabled && "opacity-40 cursor-not-allowed"
            ),
            style: {
              background: item.active ? "color-mix(in srgb, var(--mk-text) 12%, transparent)" : "transparent",
              color: item.active ? "var(--mk-text)" : "var(--mk-text-muted)"
            },
            children: item.icon ?? /* @__PURE__ */ jsx23(
              "span",
              {
                className: "font-mono text-[11px] font-medium uppercase leading-none",
                style: { fontFamily: "var(--mk-font-mono)" },
                children: item.shortcut?.length === 1 ? item.shortcut : item.label.charAt(0)
              }
            )
          },
          item.id
        );
        if (item.shortcut) {
          return /* @__PURE__ */ jsx23(Tooltip, { content: item.label, shortcut: item.shortcut, children: button }, item.id);
        }
        return /* @__PURE__ */ jsx23(React8.Fragment, { children: button }, item.id);
      })
    }
  );
}

// src/components/dropzone.tsx
import * as React9 from "react";
import { Fragment as Fragment4, jsx as jsx24, jsxs as jsxs20 } from "react/jsx-runtime";
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function Dropzone({
  onFileAccept,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024,
  preview,
  label = "Drop image",
  hint = "or click to browse",
  className,
  disabled = false
}) {
  const inputRef = React9.useRef(null);
  const [isDragging, setIsDragging] = React9.useState(false);
  const [error, setError] = React9.useState(null);
  const validateAndAccept = (file) => {
    setError(null);
    if (maxSize && file.size > maxSize) {
      setError(`File too large (max ${formatBytes(maxSize)})`);
      return;
    }
    if (accept && accept !== "*") {
      const patterns = accept.split(",").map((p) => p.trim());
      const matches = patterns.some((pattern) => {
        if (pattern.endsWith("/*")) {
          const type = pattern.replace("/*", "");
          return file.type.startsWith(type);
        }
        return file.type === pattern || file.name.endsWith(pattern.replace("*", ""));
      });
      if (!matches) {
        setError("File type not accepted");
        return;
      }
    }
    onFileAccept(file);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndAccept(file);
  };
  return /* @__PURE__ */ jsxs20("div", { className: cn("mk-dropzone", className), children: [
    /* @__PURE__ */ jsxs20(
      "div",
      {
        role: "button",
        tabIndex: disabled ? -1 : 0,
        onClick: () => !disabled && inputRef.current?.click(),
        onKeyDown: (e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        },
        onDragOver: (e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        onDrop,
        className: cn(
          "relative flex flex-col items-center justify-center rounded-xl border border-dashed cursor-pointer transition-colors overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed"
        ),
        style: {
          minHeight: preview ? 160 : 120,
          borderColor: isDragging ? "var(--mk-text-muted)" : "var(--mk-border)",
          background: isDragging ? "color-mix(in srgb, var(--mk-text) 8%, transparent)" : "color-mix(in srgb, var(--mk-text) 3%, transparent)"
        },
        children: [
          /* @__PURE__ */ jsx24(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept,
              className: "hidden",
              disabled,
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) validateAndAccept(file);
                e.target.value = "";
              }
            }
          ),
          preview ? /* @__PURE__ */ jsxs20(Fragment4, { children: [
            /* @__PURE__ */ jsx24(
              "img",
              {
                src: preview,
                alt: "Preview",
                className: "absolute inset-0 w-full h-full object-cover"
              }
            ),
            /* @__PURE__ */ jsx24(
              "div",
              {
                className: "absolute inset-0 flex items-end justify-center pb-3 opacity-0 hover:opacity-100 transition-opacity",
                style: { background: "linear-gradient(transparent 50%, rgba(0,0,0,0.6))" },
                children: /* @__PURE__ */ jsx24(
                  "span",
                  {
                    className: "font-mono text-[10px] uppercase tracking-wider",
                    style: { color: "rgba(255,255,255,0.8)", fontFamily: "var(--mk-font-mono)" },
                    children: "Replace image"
                  }
                )
              }
            )
          ] }) : /* @__PURE__ */ jsxs20("div", { className: "flex flex-col items-center gap-1 p-4 text-center pointer-events-none", children: [
            /* @__PURE__ */ jsx24(
              "span",
              {
                className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
                style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" },
                children: label
              }
            ),
            /* @__PURE__ */ jsx24(
              "span",
              {
                className: "font-mono text-[9px] uppercase tracking-wider",
                style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
                children: hint
              }
            )
          ] })
        ]
      }
    ),
    error && /* @__PURE__ */ jsx24(
      "p",
      {
        className: "mt-1.5 font-mono text-[9px] uppercase tracking-wider",
        style: { color: "#ff3366", fontFamily: "var(--mk-font-mono)" },
        children: error
      }
    )
  ] });
}

// src/components/compare-slider.tsx
import * as React10 from "react";
import { jsx as jsx25, jsxs as jsxs21 } from "react/jsx-runtime";
function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  position: controlledPosition,
  onPositionChange,
  className,
  aspectRatio = "16 / 9"
}) {
  const [internalPosition, setInternalPosition] = React10.useState(50);
  const [isDragging, setIsDragging] = React10.useState(false);
  const containerRef = React10.useRef(null);
  const position = controlledPosition ?? internalPosition;
  const setPosition = (next) => {
    const clamped = clamp(next, 0, 100);
    if (onPositionChange) onPositionChange(clamped);
    else setInternalPosition(clamped);
  };
  const updateFromClientX = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = (clientX - rect.left) / rect.width * 100;
    setPosition(pct);
  };
  const startDrag = (clientX) => {
    setIsDragging(true);
    updateFromClientX(clientX);
    const onMove = (e) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClientX(x);
    };
    const onEnd = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };
  return /* @__PURE__ */ jsxs21(
    "div",
    {
      ref: containerRef,
      className: cn("mk-compare-slider relative overflow-hidden rounded-xl select-none touch-none", className),
      style: {
        aspectRatio,
        border: "1px solid var(--mk-border)"
      },
      onMouseDown: (e) => startDrag(e.clientX),
      onTouchStart: (e) => startDrag(e.touches[0].clientX),
      children: [
        /* @__PURE__ */ jsx25("img", { src: afterSrc, alt: afterLabel, className: "absolute inset-0 w-full h-full object-cover", draggable: false }),
        /* @__PURE__ */ jsx25(
          "div",
          {
            className: "absolute inset-0 overflow-hidden",
            style: { clipPath: `inset(0 ${100 - position}% 0 0)` },
            children: /* @__PURE__ */ jsx25(
              "img",
              {
                src: beforeSrc,
                alt: beforeLabel,
                className: "absolute inset-0 w-full h-full object-cover",
                draggable: false
              }
            )
          }
        ),
        /* @__PURE__ */ jsx25(
          "div",
          {
            className: "absolute inset-y-0 w-px pointer-events-none",
            style: {
              left: `${position}%`,
              background: "var(--mk-text)",
              boxShadow: "0 0 8px rgba(0,0,0,0.4)"
            }
          }
        ),
        /* @__PURE__ */ jsx25(
          "div",
          {
            className: "absolute top-1/2 flex items-center justify-center rounded-full pointer-events-none",
            style: {
              left: `${position}%`,
              width: 28,
              height: 28,
              transform: "translate(-50%, -50%)",
              background: "var(--mk-text)",
              boxShadow: isDragging ? "0 0 0 4px var(--mk-accent-muted)" : "0 2px 8px rgba(0,0,0,0.3)"
            },
            children: /* @__PURE__ */ jsx25("span", { style: { color: "var(--mk-bg)", fontSize: 10, fontFamily: "var(--mk-font-mono)" }, children: "\u2194" })
          }
        ),
        /* @__PURE__ */ jsx25(
          "span",
          {
            className: "absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider pointer-events-none",
            style: {
              background: "rgba(0,0,0,0.5)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--mk-font-mono)"
            },
            children: beforeLabel
          }
        ),
        /* @__PURE__ */ jsx25(
          "span",
          {
            className: "absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider pointer-events-none",
            style: {
              background: "rgba(0,0,0,0.5)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--mk-font-mono)"
            },
            children: afterLabel
          }
        )
      ]
    }
  );
}

// src/components/canvas-frame.tsx
import { jsx as jsx26, jsxs as jsxs22 } from "react/jsx-runtime";
function CanvasFrame({
  children,
  aspectRatio = 16 / 9,
  zoom = 1,
  onZoomChange,
  background = "transparent",
  backgroundColor = "#ffffff",
  label = "Preview",
  className,
  showZoomControls = true
}) {
  const ratioStyle = typeof aspectRatio === "number" ? `${aspectRatio}` : aspectRatio;
  const bgStyle = background === "transparent" ? {
    backgroundImage: `
            linear-gradient(45deg, color-mix(in srgb, var(--mk-text) 6%, transparent) 25%, transparent 25%),
            linear-gradient(-45deg, color-mix(in srgb, var(--mk-text) 6%, transparent) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--mk-text) 6%, transparent) 75%),
            linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--mk-text) 6%, transparent) 75%)
          `,
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
    backgroundColor: "var(--mk-bg)"
  } : {
    backgroundColor: background === "white" ? "#ffffff" : backgroundColor
  };
  return /* @__PURE__ */ jsxs22("div", { className: cn("mk-canvas-frame flex flex-col gap-2", className), children: [
    /* @__PURE__ */ jsxs22("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx26(
        "span",
        {
          className: "font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
          style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
          children: label
        }
      ),
      showZoomControls && onZoomChange && /* @__PURE__ */ jsxs22("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx26(
          "button",
          {
            type: "button",
            "aria-label": "Zoom out",
            onClick: () => onZoomChange(Math.max(0.25, zoom - 0.25)),
            className: "h-6 w-6 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80",
            style: {
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              color: "var(--mk-text-muted)",
              fontFamily: "var(--mk-font-mono)"
            },
            children: "\u2212"
          }
        ),
        /* @__PURE__ */ jsxs22(
          "span",
          {
            className: "font-mono text-[9px] w-10 text-center uppercase",
            style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
            children: [
              Math.round(zoom * 100),
              "%"
            ]
          }
        ),
        /* @__PURE__ */ jsx26(
          "button",
          {
            type: "button",
            "aria-label": "Zoom in",
            onClick: () => onZoomChange(Math.min(4, zoom + 0.25)),
            className: "h-6 w-6 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80",
            style: {
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              color: "var(--mk-text-muted)",
              fontFamily: "var(--mk-font-mono)"
            },
            children: "+"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx26(
      "div",
      {
        className: "relative overflow-hidden rounded-xl",
        style: {
          border: "1px solid var(--mk-border)",
          ...bgStyle
        },
        children: /* @__PURE__ */ jsx26(
          "div",
          {
            className: "flex items-center justify-center w-full origin-center transition-transform",
            style: {
              aspectRatio: ratioStyle,
              transform: `scale(${zoom})`
            },
            children: children ?? /* @__PURE__ */ jsx26(
              "span",
              {
                className: "font-mono text-[10px] uppercase tracking-wider",
                style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
                children: "Canvas output"
              }
            )
          }
        )
      }
    )
  ] });
}

// src/components/export-button.tsx
import * as React11 from "react";
import { jsx as jsx27, jsxs as jsxs23 } from "react/jsx-runtime";
var FORMAT_LABELS = {
  png: "PNG",
  jpg: "JPG",
  svg: "SVG",
  clipboard: "Copy"
};
function ExportButton({
  onExport,
  formats = ["png", "jpg", "clipboard"],
  className,
  disabled = false
}) {
  const [state, setState] = React11.useState("idle");
  const [activeFormat, setActiveFormat] = React11.useState(null);
  const handleExport = async (format) => {
    if (disabled || state === "exporting") return;
    setState("exporting");
    setActiveFormat(format);
    try {
      await onExport(format);
      setState("success");
      setTimeout(() => {
        setState("idle");
        setActiveFormat(null);
      }, 1500);
    } catch {
      setState("error");
      setTimeout(() => {
        setState("idle");
        setActiveFormat(null);
      }, 2e3);
    }
  };
  return /* @__PURE__ */ jsxs23("div", { className: cn("mk-export-button flex flex-col gap-1.5", className), children: [
    /* @__PURE__ */ jsx27("div", { className: "flex flex-wrap gap-1", children: formats.map((format) => {
      const isActive = state === "exporting" && activeFormat === format;
      const isSuccess = state === "success" && activeFormat === format;
      return /* @__PURE__ */ jsx27(
        "button",
        {
          type: "button",
          disabled: disabled || state === "exporting",
          onClick: () => handleExport(format),
          className: cn(
            "h-8 px-3 rounded-lg font-mono text-[10px] font-medium uppercase tracking-[0.06em] cursor-pointer transition-all",
            (disabled || state === "exporting") && "opacity-50 cursor-not-allowed"
          ),
          style: {
            fontFamily: "var(--mk-font-mono)",
            background: format === formats[0] ? "color-mix(in srgb, var(--mk-text) 12%, transparent)" : "color-mix(in srgb, var(--mk-text) 5%, transparent)",
            color: isSuccess ? "#00cc88" : "var(--mk-text-muted)"
          },
          children: isActive ? "\u2026" : isSuccess ? "Done" : FORMAT_LABELS[format]
        },
        format
      );
    }) }),
    state === "error" && /* @__PURE__ */ jsx27(
      "span",
      {
        className: "font-mono text-[9px] uppercase tracking-wider",
        style: { color: "#ff3366", fontFamily: "var(--mk-font-mono)" },
        children: "Export failed"
      }
    )
  ] });
}

// src/components/layer-list.tsx
import { jsx as jsx28, jsxs as jsxs24 } from "react/jsx-runtime";
function LayerList({
  layers,
  activeId,
  onActiveChange,
  onToggleVisible,
  onToggleLocked,
  onReorder,
  className
}) {
  const move = (index, dir) => {
    const next = index + dir;
    if (next < 0 || next >= layers.length) return;
    onReorder?.(index, next);
  };
  return /* @__PURE__ */ jsx28("div", { className: cn("mk-layer-list flex flex-col gap-0.5", className), children: layers.map((layer, index) => {
    const active = activeId === layer.id;
    return /* @__PURE__ */ jsxs24(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => onActiveChange?.(layer.id),
        onKeyDown: (e) => e.key === "Enter" && onActiveChange?.(layer.id),
        className: cn(
          "flex items-center gap-1.5 h-8 px-2 rounded-lg cursor-pointer transition-colors",
          active && "ring-1 ring-inset"
        ),
        style: {
          ...mk.surface(active ? 10 : 4),
          boxShadow: active ? "inset 0 0 0 1px var(--mk-text-faint)" : void 0
        },
        children: [
          /* @__PURE__ */ jsx28(
            "button",
            {
              type: "button",
              className: "text-[10px] opacity-50 hover:opacity-80 w-4",
              onClick: (e) => {
                e.stopPropagation();
                onToggleVisible?.(layer.id);
              },
              children: layer.visible !== false ? "\u25C9" : "\u25CB"
            }
          ),
          /* @__PURE__ */ jsx28("span", { className: "flex-1 truncate font-mono text-[10px] uppercase tracking-wide", style: mk.label, children: layer.name }),
          onToggleLocked && /* @__PURE__ */ jsx28(
            "button",
            {
              type: "button",
              className: "text-[9px] opacity-40 hover:opacity-70",
              onClick: (e) => {
                e.stopPropagation();
                onToggleLocked(layer.id);
              },
              children: layer.locked ? "\u{1F512}" : "\u{1F513}"
            }
          ),
          onReorder && /* @__PURE__ */ jsxs24("div", { className: "flex flex-col -my-1", children: [
            /* @__PURE__ */ jsx28("button", { type: "button", className: "text-[8px] leading-none opacity-40 hover:opacity-70", onClick: (e) => {
              e.stopPropagation();
              move(index, -1);
            }, children: "\u25B2" }),
            /* @__PURE__ */ jsx28("button", { type: "button", className: "text-[8px] leading-none opacity-40 hover:opacity-70", onClick: (e) => {
              e.stopPropagation();
              move(index, 1);
            }, children: "\u25BC" })
          ] })
        ]
      },
      layer.id
    );
  }) });
}

// src/components/timeline.tsx
import * as React12 from "react";
import { jsx as jsx29, jsxs as jsxs25 } from "react/jsx-runtime";
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const whole = Math.floor(secs);
  const frac = Math.round((secs - whole) * 100);
  return `${String(mins).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${String(frac).padStart(2, "0")}`;
}
function timeToPct(time, duration) {
  if (duration <= 0) return 0;
  return clamp(time / duration * 100, 0, 100);
}
function pctToTime(pct, duration) {
  return clamp(pct / 100 * duration, 0, duration);
}
function ToolbarBtn({
  children,
  onClick,
  active,
  accent,
  className
}) {
  return /* @__PURE__ */ jsx29(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "h-7 px-2.5 rounded-md font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-85 shrink-0",
        className
      ),
      style: {
        fontFamily: "var(--mk-font-mono)",
        background: accent ? "var(--mk-timeline-accent, #e8722a)" : active ? "color-mix(in srgb, var(--mk-text) 12%, transparent)" : "color-mix(in srgb, var(--mk-text) 6%, transparent)",
        color: accent ? "#111" : active ? "var(--mk-text)" : "var(--mk-text-muted)",
        border: active && !accent ? "1px solid var(--mk-timeline-accent, #e8722a)" : "1px solid transparent"
      },
      children
    }
  );
}
function IconBtn({
  label,
  onClick,
  active,
  children
}) {
  return /* @__PURE__ */ jsx29(
    "button",
    {
      type: "button",
      "aria-label": label,
      onClick,
      className: "h-7 w-7 flex items-center justify-center rounded-md cursor-pointer transition-opacity hover:opacity-85 shrink-0",
      style: {
        background: active ? "color-mix(in srgb, var(--mk-text) 12%, transparent)" : "color-mix(in srgb, var(--mk-text) 6%, transparent)",
        color: active ? "var(--mk-text)" : "var(--mk-text-muted)"
      },
      children
    }
  );
}
function Timeline({
  duration = 4,
  currentTime,
  onCurrentTimeChange,
  keyframes = [],
  onKeyframesChange,
  shots = [{ id: "1", label: "1" }],
  activeShotId,
  onActiveShotChange,
  playing = false,
  onPlayingChange,
  looping = false,
  onLoopingChange,
  onAddShot,
  onAddKeyframe,
  onClearKeyframes,
  onPresets,
  onEasing,
  showControls = true,
  className
}) {
  const trackRef = React12.useRef(null);
  const draggingRef = React12.useRef(null);
  const keyframesRef = React12.useRef(keyframes);
  const onKeyframesChangeRef = React12.useRef(onKeyframesChange);
  keyframesRef.current = keyframes;
  onKeyframesChangeRef.current = onKeyframesChange;
  const activeShot = activeShotId ?? shots[0]?.id;
  const seekFromClientX = React12.useCallback(
    (clientX) => {
      if (!trackRef.current || duration <= 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      onCurrentTimeChange(Number(pctToTime(x / rect.width * 100, duration).toFixed(2)));
    },
    [duration, onCurrentTimeChange]
  );
  React12.useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      if (draggingRef.current === "playhead") {
        seekFromClientX(e.clientX);
        return;
      }
      if (!trackRef.current || duration <= 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left, 0, rect.width);
      const time = Number(pctToTime(x / rect.width * 100, duration).toFixed(2));
      const id = draggingRef.current;
      const onChange = onKeyframesChangeRef.current;
      if (!onChange) return;
      onChange(
        keyframesRef.current.map((kf) => kf.id === id ? { ...kf, time } : kf).sort((a, b) => a.time - b.time)
      );
    };
    const onUp = () => {
      draggingRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [duration, seekFromClientX]);
  const playheadPct = timeToPct(currentTime, duration);
  const tickCount = Math.min(Math.ceil(duration), 12);
  return /* @__PURE__ */ jsxs25(
    "div",
    {
      className: cn("rounded-xl border overflow-hidden select-none", className),
      style: {
        background: "var(--mk-surface)",
        borderColor: "var(--mk-border)",
        ["--mk-timeline-accent"]: "#e8722a"
      },
      children: [
        showControls && /* @__PURE__ */ jsxs25(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 border-b overflow-x-auto",
            style: { borderColor: "var(--mk-border)", background: "color-mix(in srgb, var(--mk-text) 3%, transparent)" },
            children: [
              /* @__PURE__ */ jsx29(ToolbarBtn, { onClick: () => {
              }, children: "< Sequence" }),
              /* @__PURE__ */ jsxs25("div", { className: "flex items-center gap-1", children: [
                shots.map((shot) => /* @__PURE__ */ jsx29(
                  ToolbarBtn,
                  {
                    active: shot.id === activeShot,
                    onClick: () => onActiveShotChange?.(shot.id),
                    children: shot.label
                  },
                  shot.id
                )),
                onAddShot && /* @__PURE__ */ jsx29(ToolbarBtn, { onClick: onAddShot, children: "+ Add shot" })
              ] }),
              /* @__PURE__ */ jsx29(
                "div",
                {
                  className: "w-px h-5 shrink-0 mx-0.5",
                  style: { background: "var(--mk-border)" }
                }
              ),
              /* @__PURE__ */ jsxs25(
                "span",
                {
                  className: "font-mono text-[10px] tabular-nums shrink-0",
                  style: { color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" },
                  children: [
                    formatTime(currentTime),
                    " / ",
                    formatTime(duration)
                  ]
                }
              ),
              /* @__PURE__ */ jsxs25(
                "span",
                {
                  className: "inline-flex items-center gap-1 font-mono text-[10px] shrink-0 px-2 py-1 rounded-md",
                  style: {
                    color: "var(--mk-text-faint)",
                    background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
                    fontFamily: "var(--mk-font-mono)"
                  },
                  children: [
                    /* @__PURE__ */ jsx29(ClockIcon, {}),
                    duration,
                    "s"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs25("div", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsx29(IconBtn, { label: "Go to start", onClick: () => onCurrentTimeChange(0), children: /* @__PURE__ */ jsx29(SkipStartIcon, {}) }),
                /* @__PURE__ */ jsx29(IconBtn, { label: playing ? "Pause" : "Play", active: playing, onClick: () => onPlayingChange?.(!playing), children: playing ? /* @__PURE__ */ jsx29(PauseIcon, {}) : /* @__PURE__ */ jsx29(PlayIcon, {}) }),
                /* @__PURE__ */ jsx29(IconBtn, { label: "Loop", active: looping, onClick: () => onLoopingChange?.(!looping), children: /* @__PURE__ */ jsx29(LoopIcon, {}) })
              ] }),
              /* @__PURE__ */ jsx29(
                "div",
                {
                  className: "w-px h-5 shrink-0 mx-0.5",
                  style: { background: "var(--mk-border)" }
                }
              ),
              onPresets && /* @__PURE__ */ jsx29(ToolbarBtn, { onClick: onPresets, children: "Presets \u25BE" }),
              onEasing && /* @__PURE__ */ jsx29(ToolbarBtn, { onClick: onEasing, children: /* @__PURE__ */ jsxs25("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx29(EasingIcon, {}),
                "Easing"
              ] }) }),
              onAddKeyframe && /* @__PURE__ */ jsx29(ToolbarBtn, { accent: true, onClick: onAddKeyframe, children: "+ Add KF" }),
              /* @__PURE__ */ jsx29("div", { className: "flex-1 min-w-2" }),
              onClearKeyframes && /* @__PURE__ */ jsx29(ToolbarBtn, { onClick: onClearKeyframes, children: "Clear all KF" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs25("div", { className: "px-4 pt-3 pb-4", children: [
          /* @__PURE__ */ jsxs25("div", { className: "relative h-5 mb-1", children: [
            /* @__PURE__ */ jsx29("div", { className: "absolute inset-x-0 bottom-0 flex justify-between pointer-events-none", children: Array.from({ length: tickCount + 1 }, (_, i) => {
              const t = i / tickCount * duration;
              return /* @__PURE__ */ jsx29(
                "span",
                {
                  className: "font-mono text-[9px] -translate-x-1/2 first:translate-x-0 last:translate-x-[-100%]",
                  style: { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" },
                  children: Number.isInteger(t) ? `${t}s` : `${t.toFixed(1)}s`
                },
                i
              );
            }) }),
            /* @__PURE__ */ jsx29(
              "div",
              {
                className: "absolute top-0 bottom-0 w-0 pointer-events-none",
                style: { left: `${playheadPct}%`, transform: "translateX(-50%)" },
                children: /* @__PURE__ */ jsx29(
                  "div",
                  {
                    className: "w-0 h-0 mx-auto",
                    style: {
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "5px solid var(--mk-timeline-accent, #e8722a)"
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx29("div", { className: "relative h-2 mb-2 flex items-end", children: Array.from({ length: tickCount * 4 + 1 }, (_, i) => /* @__PURE__ */ jsx29(
            "div",
            {
              className: "flex-1 flex justify-center",
              children: /* @__PURE__ */ jsx29(
                "div",
                {
                  className: "w-px",
                  style: {
                    height: i % 4 === 0 ? 0 : 4,
                    background: "color-mix(in srgb, var(--mk-text) 15%, transparent)"
                  }
                }
              )
            },
            i
          )) }),
          /* @__PURE__ */ jsxs25(
            "div",
            {
              ref: trackRef,
              className: "relative h-9 rounded-full cursor-pointer",
              style: { background: "color-mix(in srgb, var(--mk-text) 8%, transparent)" },
              onPointerDown: (e) => {
                if (e.target.dataset.keyframe) return;
                draggingRef.current = "playhead";
                seekFromClientX(e.clientX);
              },
              children: [
                /* @__PURE__ */ jsx29(
                  "div",
                  {
                    className: "absolute top-1/2 left-3 right-3 h-0.5 -translate-y-1/2 rounded-full pointer-events-none",
                    style: { background: "var(--mk-timeline-accent, #e8722a)" }
                  }
                ),
                /* @__PURE__ */ jsx29(
                  "div",
                  {
                    className: "absolute top-0 bottom-0 w-px pointer-events-none",
                    style: {
                      left: `${playheadPct}%`,
                      background: "var(--mk-timeline-accent, #e8722a)",
                      opacity: 0.5
                    }
                  }
                ),
                keyframes.map((kf) => {
                  const pct = timeToPct(kf.time, duration);
                  return /* @__PURE__ */ jsx29(
                    "button",
                    {
                      type: "button",
                      "data-keyframe": kf.id,
                      "aria-label": `Keyframe at ${formatTime(kf.time)}`,
                      className: "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 rounded-[1px] cursor-grab active:cursor-grabbing border z-10",
                      style: {
                        left: `${pct}%`,
                        background: "var(--mk-text)",
                        borderColor: "color-mix(in srgb, var(--mk-text) 30%, transparent)",
                        boxShadow: "0 0 0 1px color-mix(in srgb, var(--mk-text) 20%, transparent)"
                      },
                      onPointerDown: (e) => {
                        e.stopPropagation();
                        draggingRef.current = kf.id;
                      }
                    },
                    kf.id
                  );
                })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function PlayIcon() {
  return /* @__PURE__ */ jsx29("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx29("path", { d: "M2 1.5L8.5 5 2 8.5V1.5Z" }) });
}
function PauseIcon() {
  return /* @__PURE__ */ jsxs25("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "currentColor", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx29("rect", { x: "2", y: "1.5", width: "2", height: "7", rx: "0.5" }),
    /* @__PURE__ */ jsx29("rect", { x: "6", y: "1.5", width: "2", height: "7", rx: "0.5" })
  ] });
}
function LoopIcon() {
  return /* @__PURE__ */ jsxs25("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx29("path", { d: "M3.5 4H2.5a3.5 3.5 0 0 0 0 7h1", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx29("path", { d: "M8.5 8H9.5a3.5 3.5 0 0 0 0-7h-1", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx29("path", { d: "M2 2.5L2.5 4 4 3.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx29("path", { d: "M10 9.5L9.5 8 8 8.5", strokeLinecap: "round", strokeLinejoin: "round" })
  ] });
}
function SkipStartIcon() {
  return /* @__PURE__ */ jsxs25("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "currentColor", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx29("rect", { x: "1.5", y: "1.5", width: "1.5", height: "7", rx: "0.3" }),
    /* @__PURE__ */ jsx29("path", { d: "M4 1.5L8.5 5 4 8.5V1.5Z" })
  ] });
}
function ClockIcon() {
  return /* @__PURE__ */ jsxs25("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", stroke: "currentColor", strokeWidth: "1.1", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx29("circle", { cx: "5", cy: "5", r: "3.5" }),
    /* @__PURE__ */ jsx29("path", { d: "M5 3.2V5l1.4 1.4", strokeLinecap: "round" })
  ] });
}
function EasingIcon() {
  return /* @__PURE__ */ jsx29("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", stroke: "currentColor", strokeWidth: "1.2", "aria-hidden": true, children: /* @__PURE__ */ jsx29("path", { d: "M1.5 8.5C1.5 8.5 3 3 5 3s3.5 5.5 3.5 5.5", strokeLinecap: "round" }) });
}

// src/components/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { jsx as jsx30, jsxs as jsxs26 } from "react/jsx-runtime";
function Dialog({ open, onOpenChange, title, description, children, footer }) {
  return /* @__PURE__ */ jsx30(DialogPrimitive.Root, { open, onOpenChange, children: /* @__PURE__ */ jsxs26(DialogPrimitive.Portal, { children: [
    /* @__PURE__ */ jsx30(DialogPrimitive.Overlay, { className: "fixed inset-0 z-50 bg-black/60" }),
    /* @__PURE__ */ jsxs26(
      DialogPrimitive.Content,
      {
        className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-4 shadow-2xl",
        style: { background: "var(--mk-surface)", borderColor: "var(--mk-border)" },
        children: [
          /* @__PURE__ */ jsx30(DialogPrimitive.Title, { className: "font-mono text-sm font-semibold m-0", style: mk.mono, children: title }),
          description && /* @__PURE__ */ jsx30(DialogPrimitive.Description, { className: "text-xs mt-1.5 mb-3", style: { color: "var(--mk-text-muted)" }, children: description }),
          children && /* @__PURE__ */ jsx30("div", { className: "my-3", children }),
          footer && /* @__PURE__ */ jsx30("div", { className: "flex justify-end gap-2 mt-4", children: footer }),
          /* @__PURE__ */ jsx30(
            DialogPrimitive.Close,
            {
              className: "absolute top-3 right-3 text-[10px] opacity-50 hover:opacity-80 cursor-pointer",
              style: mk.mono,
              "aria-label": "Close",
              children: "\u2715"
            }
          )
        ]
      }
    )
  ] }) });
}

// src/components/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx31, jsxs as jsxs27 } from "react/jsx-runtime";
function Popover2({ trigger, children, side = "bottom", align = "start", width = 200 }) {
  return /* @__PURE__ */ jsxs27(PopoverPrimitive.Root, { children: [
    /* @__PURE__ */ jsx31(PopoverPrimitive.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsx31(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx31(
      PopoverPrimitive.Content,
      {
        side,
        align,
        sideOffset: 6,
        className: "z-50 rounded-xl border p-2 shadow-xl",
        style: {
          width,
          background: "var(--mk-surface-raised)",
          borderColor: "var(--mk-border)"
        },
        children
      }
    ) })
  ] });
}
function PopoverLabel({ children }) {
  return /* @__PURE__ */ jsx31("span", { className: "block font-mono text-[9px] uppercase tracking-wider mb-2 px-1", style: mk.faint, children });
}

// src/components/empty-state.tsx
import { jsx as jsx32, jsxs as jsxs28 } from "react/jsx-runtime";
function EmptyState({ title, description, action, icon, className }) {
  return /* @__PURE__ */ jsxs28(
    "div",
    {
      className: cn(
        "mk-empty-state flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed min-h-[160px]",
        className
      ),
      style: { borderColor: "var(--mk-border)", ...mk.surface(3) },
      children: [
        icon && /* @__PURE__ */ jsx32("div", { className: "mb-3 opacity-40", children: icon }),
        /* @__PURE__ */ jsx32("span", { className: "font-mono text-[10px] font-medium uppercase tracking-[0.08em]", style: mk.label, children: title }),
        description && /* @__PURE__ */ jsx32("p", { className: "text-[10px] mt-1.5 max-w-xs", style: { color: "var(--mk-text-faint)" }, children: description }),
        action && /* @__PURE__ */ jsx32("div", { className: "mt-4", children: action })
      ]
    }
  );
}

// src/components/progress-bar.tsx
import * as Progress from "@radix-ui/react-progress";
import { jsx as jsx33, jsxs as jsxs29 } from "react/jsx-runtime";
function ProgressBar({
  value,
  label,
  showValue = true,
  className,
  variant = "default"
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return /* @__PURE__ */ jsxs29("div", { className: cn("mk-progress-bar flex flex-col gap-1.5", className), children: [
    (label || showValue) && /* @__PURE__ */ jsxs29("div", { className: "flex items-center justify-between", children: [
      label && /* @__PURE__ */ jsx33("span", { className: "font-mono text-[10px] uppercase tracking-[0.06em]", style: mk.label, children: label }),
      showValue && variant === "default" && /* @__PURE__ */ jsxs29("span", { className: "font-mono text-[9px]", style: mk.faint, children: [
        Math.round(clamped),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx33(
      Progress.Root,
      {
        value: variant === "indeterminate" ? void 0 : clamped,
        className: "h-1.5 w-full overflow-hidden rounded-full",
        style: mk.surface(8),
        children: /* @__PURE__ */ jsx33(
          Progress.Indicator,
          {
            className: cn(
              "h-full rounded-full transition-all",
              variant === "indeterminate" && "w-1/3 animate-[indeterminate_1.2s_ease-in-out_infinite]"
            ),
            style: {
              background: "var(--mk-text-muted)",
              transform: variant === "default" ? `translateX(-${100 - clamped}%)` : void 0
            }
          }
        )
      }
    )
  ] });
}

// src/components/status-bar.tsx
import { jsx as jsx34 } from "react/jsx-runtime";
var variantColor = {
  default: "var(--mk-text-faint)",
  success: "#00cc88",
  warning: "#ffaa00",
  error: "#ff3366"
};
function StatusBar({ items, className }) {
  return /* @__PURE__ */ jsx34(
    "div",
    {
      className: cn(
        "mk-status-bar flex items-center justify-between gap-4 px-3 h-7 border-t font-mono text-[9px] uppercase tracking-wider",
        className
      ),
      style: {
        ...mk.mono,
        borderColor: "var(--mk-border)",
        background: "var(--mk-surface)",
        color: "var(--mk-text-faint)"
      },
      children: /* @__PURE__ */ jsx34("div", { className: "flex items-center gap-3 min-w-0", children: items.map((item) => /* @__PURE__ */ jsx34("span", { style: { color: variantColor[item.variant ?? "default"] }, children: item.label }, item.id)) })
    }
  );
}

// src/components/toast.tsx
import * as React13 from "react";
import { jsx as jsx35, jsxs as jsxs30 } from "react/jsx-runtime";
function Toast({ message, variant = "default", visible, onDismiss, className }) {
  React13.useEffect(() => {
    if (!visible || !onDismiss) return;
    const t = setTimeout(onDismiss, 3e3);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);
  if (!visible) return null;
  const borderColor = variant === "success" ? "#00cc88" : variant === "error" ? "#ff3366" : "var(--mk-border)";
  return /* @__PURE__ */ jsxs30(
    "div",
    {
      className: cn(
        "mk-toast fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-3 h-9 rounded-lg border shadow-lg",
        className
      ),
      style: {
        ...mk.mono,
        background: "var(--mk-surface-raised)",
        borderColor,
        color: "var(--mk-text-muted)",
        fontSize: "10px"
      },
      role: "status",
      children: [
        /* @__PURE__ */ jsx35("span", { className: "uppercase tracking-wider", children: message }),
        onDismiss && /* @__PURE__ */ jsx35("button", { type: "button", onClick: onDismiss, className: "opacity-50 hover:opacity-80 cursor-pointer", children: "\u2715" })
      ]
    }
  );
}
export {
  AccordionPanel,
  Badge,
  Button,
  CanvasFrame,
  Checkbox,
  ColorPicker,
  CompareSlider,
  CoordinateInput,
  Dialog,
  Drawer,
  Dropzone,
  DualSlider,
  EmptyState,
  ExportButton,
  FieldGroup,
  IconButton,
  LayerList,
  NumberStepper,
  Panel,
  Popover2 as Popover,
  PopoverLabel,
  PresetPicker,
  ProgressBar,
  RadioGroup,
  SegmentedControl,
  Select,
  Sidebar,
  Slider,
  SplitView,
  StatusBar,
  Tabs,
  TextInput,
  Timeline,
  Toast,
  Toggle,
  Toolbar,
  Tooltip,
  clamp,
  cn,
  formatValue,
  mk,
  stepValue
};
//# sourceMappingURL=index.js.map