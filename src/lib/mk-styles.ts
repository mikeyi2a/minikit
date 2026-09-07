/**
 * Shared inline-style helpers for the local docs-site components.
 * Mirrors the `mk` object in `@mikeyi2a/minikit-ui`'s lib/mk-styles.
 */

export const mk = {
  surface: (alpha: number = 5): React.CSSProperties => ({
    background: `color-mix(in srgb, var(--mk-text) ${alpha}%, transparent)`,
    // Subtle inner glow on all four edges — 1px ring at 40% white + 8px halo at 20%.
    boxShadow: [
      `inset 0 0 0 1px color-mix(in srgb, var(--mk-text) 40%, transparent)`,
      `inset 0 0 8px 0 color-mix(in srgb, var(--mk-text) 20%, transparent)`,
    ].join(", "),
  }),
  /** Inner glow for light surfaces (e.g. white thumb, active toggle). */
  lightGlow: {
    boxShadow:
      "inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 4px 0 rgba(255, 255, 255, 0.15)",
  } as React.CSSProperties,
  mono: { fontFamily: "var(--mk-font-mono)" } as React.CSSProperties,
  label: {
    fontFamily: "var(--mk-font-mono)",
    color: "var(--mk-text-muted)",
  } as React.CSSProperties,
  faint: {
    fontFamily: "var(--mk-font-mono)",
    color: "var(--mk-text-faint)",
  } as React.CSSProperties,
  /** CSS classes — ring halos instead of blur shadows (see theme.css) */
  ring: "mk-ring",
  ringElevated: "mk-ring-elevated",
  ringFloat: "mk-ring-float",
  ringInset: "mk-ring-inset",
};
