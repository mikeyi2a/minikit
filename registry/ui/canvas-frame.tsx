"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CanvasBackground = "transparent" | "white" | "custom";

export interface CanvasFrameProps {
  children?: React.ReactNode;
  aspectRatio?: number | string;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  background?: CanvasBackground;
  backgroundColor?: string;
  label?: string;
  className?: string;
  showZoomControls?: boolean;
}

export function CanvasFrame({
  children,
  aspectRatio = 16 / 9,
  zoom = 1,
  onZoomChange,
  background = "transparent",
  backgroundColor = "#ffffff",
  label = "Preview",
  className,
  showZoomControls = true,
}: CanvasFrameProps) {
  const ratioStyle = typeof aspectRatio === "number" ? `${aspectRatio}` : aspectRatio;

  const bgStyle: React.CSSProperties =
    background === "transparent"
      ? {
          backgroundImage: `
            linear-gradient(45deg, color-mix(in srgb, var(--mk-text) 6%, transparent) 25%, transparent 25%),
            linear-gradient(-45deg, color-mix(in srgb, var(--mk-text) 6%, transparent) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--mk-text) 6%, transparent) 75%),
            linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--mk-text) 6%, transparent) 75%)
          `,
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          backgroundColor: "var(--mk-bg)",
        }
      : {
          backgroundColor: background === "white" ? "#ffffff" : backgroundColor,
        };

  return (
    <div className={cn("mk-canvas-frame flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          {label}
        </span>

        {showZoomControls && onZoomChange && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
              className="h-6 w-6 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80"
              style={{
                background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
                color: "var(--mk-text-muted)",
                fontFamily: "var(--mk-font-mono)",
              }}
            >
              −
            </button>
            <span
              className="font-mono text-[9px] w-10 text-center uppercase"
              style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => onZoomChange(Math.min(4, zoom + 0.25))}
              className="h-6 w-6 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80"
              style={{
                background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
                color: "var(--mk-text-muted)",
                fontFamily: "var(--mk-font-mono)",
              }}
            >
              +
            </button>
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          border: "1px solid var(--mk-border)",
          ...bgStyle,
        }}
      >
        <div
          className="flex items-center justify-center w-full origin-center transition-transform"
          style={{
            aspectRatio: ratioStyle,
            transform: `scale(${zoom})`,
          }}
        >
          {children ?? (
            <span
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
            >
              Canvas output
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
