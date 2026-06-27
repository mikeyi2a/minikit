"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CopyPageButtonProps {
  plainText: string;
  markdown: string;
  className?: string;
}

export function CopyPageButton({ plainText, markdown, className }: CopyPageButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<"page" | "markdown" | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const copy = async (text: string, kind: "page" | "markdown") => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setOpen(false);
    setTimeout(() => setCopied(null), 2000);
  };

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = copied === "markdown" ? "Copied MD" : copied === "page" ? "Copied" : "Copy page";

  return (
    <div ref={menuRef} className={cn("relative inline-flex", className)}>
      <div
        className="inline-flex rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--mk-border)" }}
      >
        <button
          type="button"
          onClick={() => copy(plainText, "page")}
          className="px-3 h-8 text-[11px] font-mono uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            color: "var(--mk-text-muted)",
            background: "color-mix(in srgb, var(--mk-text) 4%, transparent)",
            fontFamily: "var(--mk-font-mono)",
          }}
        >
          {label}
        </button>
        <button
          type="button"
          aria-label="Copy options"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="px-2 h-8 border-l cursor-pointer hover:opacity-80 transition-opacity flex items-center"
          style={{
            color: "var(--mk-text-faint)",
            background: "color-mix(in srgb, var(--mk-text) 4%, transparent)",
            borderColor: "var(--mk-border)",
          }}
        >
          <ChevronIcon open={open} />
        </button>
      </div>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[11rem] rounded-lg border py-1 z-20 shadow-lg"
          style={{
            background: "var(--mk-surface-raised)",
            borderColor: "var(--mk-border)",
          }}
        >
          <button
            type="button"
            onClick={() => copy(markdown, "markdown")}
            className="w-full text-left px-3 py-2 text-xs cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "var(--mk-text-muted)" }}
          >
            Copy as Markdown
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={cn("transition-transform", open && "rotate-180")}
    >
      <path
        d="M2 4L5 7L8 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
