/**
 * Shared inline-style helpers for the local docs-site components.
 * Mirrors the `mk` object in `@mikeyi2a/minikit-ui`'s lib/mk-styles.
 */

export const mk = {
  surface: (alpha: number = 5): React.CSSProperties => ({
    background: `color-mix(in srgb, var(--mk-text) ${alpha}%, transparent)`,
  }),
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
