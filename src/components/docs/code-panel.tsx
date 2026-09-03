"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CodePanelProps {
  code: string;
  filename?: string;
  className?: string;
  defaultOpen?: boolean;
}

export function CodePanel({
  code,
  filename = "component.tsx",
  className,
  defaultOpen = false,
}: CodePanelProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("rounded-xl border overflow-hidden", className)}
      style={{ borderColor: "var(--mk-border)" }}
    >
      <div
        className="flex items-center justify-between px-3 h-9 border-b"
        style={{
          background: "color-mix(in srgb, var(--mk-text) 4%, transparent)",
          borderColor: "var(--mk-border)",
        }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          {filename}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer hover:opacity-80"
            style={{
              color: "var(--mk-text-muted)",
              background: "color-mix(in srgb, var(--mk-text) 6%, transparent)",
              fontFamily: "var(--mk-font-mono)",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer hover:opacity-80"
            style={{
              color: "var(--mk-text-muted)",
              fontFamily: "var(--mk-font-mono)",
            }}
          >
            {open ? "Hide" : "Show"} code
          </button>
        </div>
      </div>
      {open && (
        <pre
          className="m-0 p-4 overflow-x-auto text-[11px] leading-relaxed"
          style={{
            background: "var(--mk-bg)",
            color: "var(--mk-text-muted)",
            fontFamily: "var(--mk-font-mono)",
          }}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
