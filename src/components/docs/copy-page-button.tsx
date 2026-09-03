"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface CopyPageButtonProps {
  plainText: string;
  markdown: string;
  className?: string;
}

export function CopyPageButton({
  plainText,
  markdown,
  className,
}: CopyPageButtonProps) {
  const [copied, setCopied] = React.useState<"plain" | "md" | null>(null);

  const copy = async (text: string, kind: "plain" | "md") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Fallback: select + execCommand for environments without clipboard API
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(kind);
        setTimeout(() => setCopied(null), 1500);
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => copy(plainText, "plain")}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 h-7 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          fontFamily: "var(--mk-font-mono)",
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          color: "var(--mk-text-muted)",
        }}
        aria-label="Copy page as plain text"
      >
        {copied === "plain" ? <CheckIcon /> : <CopyIcon />}
        {copied === "plain" ? "Copied" : "Copy text"}
      </button>
      <button
        type="button"
        onClick={() => copy(markdown, "md")}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 h-7 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          fontFamily: "var(--mk-font-mono)",
          background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
          color: "var(--mk-text-muted)",
        }}
        aria-label="Copy page as markdown"
      >
        {copied === "md" ? <CheckIcon /> : <CopyIcon />}
        {copied === "md" ? "Copied" : "Copy md"}
      </button>
    </div>
  );
}
