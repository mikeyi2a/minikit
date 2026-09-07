import type { CSSProperties } from "react";

/** Shared inline tokens used across Minikit default theme */
export const mk = {
  surface: (alpha = 5): CSSProperties => ({
    background: `color-mix(in srgb, var(--mk-text) ${alpha}%, transparent)`,
    // Subtle inner glow on all four edges. The ring + glow use values
    // STRONGER than the surface alpha so they're visible on top of the
    // background tint (otherwise they'd blend in and disappear).
    boxShadow: [
      `inset 0 0 0 1px color-mix(in srgb, var(--mk-text) ${Math.max(25, alpha + 12)}%, transparent)`,
      `inset 0 0 8px 0 color-mix(in srgb, var(--mk-text) ${Math.max(15, Math.round(alpha * 0.75))}%, transparent)`,
    ].join(", "),
  }),
  /** Inner glow for light surfaces (e.g. white thumb, active toggle). */
  lightGlow: {
    boxShadow:
      "inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 4px 0 rgba(255, 255, 255, 0.15)",
  } as CSSProperties,
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
