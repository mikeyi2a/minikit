import type { CSSProperties } from "react";

/** Shared inline tokens used across Minikit default theme */
export const mk = {
  surface: (alpha = 5): CSSProperties => ({
    background: `color-mix(in srgb, var(--mk-text) ${alpha}%, transparent)`,
  }),
  mono: { fontFamily: "var(--mk-font-mono)" } as CSSProperties,
  label: {
    fontFamily: "var(--mk-font-mono)",
    color: "var(--mk-text-muted)",
  } as CSSProperties,
  faint: {
    fontFamily: "var(--mk-font-mono)",
    color: "var(--mk-text-faint)",
  } as CSSProperties,
  /** CSS classes — ring halos instead of blur shadows (see theme.css) */
  ring: "mk-ring",
  ringElevated: "mk-ring-elevated",
  ringFloat: "mk-ring-float",
  ringInset: "mk-ring-inset",
};
