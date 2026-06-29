"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
        className="absolute top-3 right-3 z-10 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          color: "var(--mk-text-muted)",
          background: "color-mix(in srgb, var(--mk-text) 10%, transparent)",
          fontFamily: "var(--mk-font-mono)",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        className="m-0 pl-5 pr-[4.5rem] py-5 text-[13px] overflow-x-auto leading-[1.75]"
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
