export default function SiteLoading() {
  return (
    <div
      className="flex h-full min-h-[12rem] items-center justify-center"
      style={{ color: "var(--mk-text-muted)" }}
    >
      <p className="m-0 text-sm font-mono uppercase tracking-wider" style={{ fontFamily: "var(--mk-font-mono)" }}>
        Loading…
      </p>
    </div>
  );
}
