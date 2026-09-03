"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ExportFormat = "png" | "jpg" | "svg" | "clipboard";

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => void | Promise<void>;
  formats?: ExportFormat[];
  className?: string;
  disabled?: boolean;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  png: "PNG",
  jpg: "JPG",
  svg: "SVG",
  clipboard: "Copy",
};

type ExportState = "idle" | "exporting" | "success" | "error";

export function ExportButton({
  onExport,
  formats = ["png", "jpg", "clipboard"],
  className,
  disabled = false,
}: ExportButtonProps) {
  const [state, setState] = React.useState<ExportState>("idle");
  const [activeFormat, setActiveFormat] = React.useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
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
      }, 2000);
    }
  };

  return (
    <div className={cn("mk-export-button flex flex-col gap-1.5", className)}>
      <div className="flex flex-wrap gap-1">
        {formats.map((format) => {
          const isActive = state === "exporting" && activeFormat === format;
          const isSuccess = state === "success" && activeFormat === format;

          return (
            <button
              key={format}
              type="button"
              disabled={disabled || state === "exporting"}
              onClick={() => handleExport(format)}
              className={cn(
                "h-8 px-3 rounded-lg font-mono text-[10px] font-medium uppercase tracking-[0.06em] cursor-pointer transition-all",
                (disabled || state === "exporting") && "opacity-50 cursor-not-allowed",
              )}
              style={{
                fontFamily: "var(--mk-font-mono)",
                background:
                  format === formats[0]
                    ? "color-mix(in srgb, var(--mk-text) 12%, transparent)"
                    : "color-mix(in srgb, var(--mk-text) 5%, transparent)",
                color: isSuccess ? "#00cc88" : "var(--mk-text-muted)",
              }}
            >
              {isActive ? "…" : isSuccess ? "Done" : FORMAT_LABELS[format]}
            </button>
          );
        })}
      </div>

      {state === "error" && (
        <span
          className="font-mono text-[9px] uppercase tracking-wider"
          style={{ color: "#ff3366", fontFamily: "var(--mk-font-mono)" }}
        >
          Export failed
        </span>
      )}
    </div>
  );
}
