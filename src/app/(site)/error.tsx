"use client";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="m-0 text-sm" style={{ color: "var(--mk-text-muted)" }}>
        Something went wrong loading this page.
      </p>
      {process.env.NODE_ENV === "development" && error.message ? (
        <pre
          className="m-0 max-w-full overflow-x-auto rounded-lg border px-4 py-3 text-left text-xs leading-relaxed"
          style={{
            color: "var(--mk-text-faint)",
            borderColor: "var(--mk-border)",
            background: "var(--mk-surface)",
            fontFamily: "var(--mk-font-mono)",
          }}
        >
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="rounded-lg border px-4 py-2 text-xs font-mono uppercase tracking-wide cursor-pointer"
        style={{
          color: "var(--mk-text)",
          borderColor: "var(--mk-border)",
          background: "var(--mk-surface)",
          fontFamily: "var(--mk-font-mono)",
        }}
      >
        Try again
      </button>
    </div>
  );
}
