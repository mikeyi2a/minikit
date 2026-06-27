"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropzoneProps {
  onFileAccept: (file: File) => void;
  accept?: string;
  maxSize?: number;
  preview?: string | null;
  label?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Dropzone({
  onFileAccept,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024,
  preview,
  label = "Drop image",
  hint = "or click to browse",
  className,
  disabled = false,
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validateAndAccept = (file: File) => {
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

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndAccept(file);
  };

  return (
    <div className={cn("mk-dropzone", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border border-dashed cursor-pointer transition-colors overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{
          minHeight: preview ? 160 : 120,
          borderColor: isDragging ? "var(--mk-text-muted)" : "var(--mk-border)",
          background: isDragging
            ? "color-mix(in srgb, var(--mk-text) 8%, transparent)"
            : "color-mix(in srgb, var(--mk-text) 3%, transparent)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndAccept(file);
            e.target.value = "";
          }}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.6))" }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--mk-font-mono)" }}
              >
                Replace image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 p-4 text-center pointer-events-none">
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
              style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
            >
              {label}
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-wider"
              style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
            >
              {hint}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p
          className="mt-1.5 font-mono text-[9px] uppercase tracking-wider"
          style={{ color: "#ff3366", fontFamily: "var(--mk-font-mono)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
