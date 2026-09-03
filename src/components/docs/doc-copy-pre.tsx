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

export function DocCopyPre({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("relative rounded-xl border", className)}
      style={{ borderColor: "var(--mk-border)", background: "var(--mk-surface)" }}
    >
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          color: copied ? "var(--mk-text)" : "var(--mk-text-muted)",
          background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre
        className="m-0 pl-5 pr-12 py-5 text-[13px] overflow-x-auto leading-[1.75]"
        style={{
          color: "var(--mk-text-muted)",
          fontFamily: "var(--mk-font-mono)",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
