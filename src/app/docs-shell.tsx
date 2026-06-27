"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OVERVIEW_NAV } from "@/docs/nav";
import { COMPONENT_META, type ComponentId } from "@/demos/registry-meta";
import { resolvePageMeta } from "@/app/page-meta";

type Theme = "tool-dark" | "light" | "dark";

const THEMES: { id: Theme; label: string }[] = [
  { id: "tool-dark", label: "Tool Dark" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const TOP_BAR_CLASS = "shrink-0 h-[4.5rem] px-4 border-b flex items-center";

function componentHref(id: ComponentId) {
  return `/${id}`;
}

/** Persistent docs shell — sidebar stays mounted across navigations. */
export default function DocsShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [theme, setTheme] = React.useState<Theme>("tool-dark");

  const pageMeta = resolvePageMeta(pathname);

  const core = COMPONENT_META.filter((c) => c.category === "core" && c.id !== "overview");
  const input = COMPONENT_META.filter((c) => c.category === "input");
  const layout = COMPONENT_META.filter((c) => c.category === "layout");
  const tool = COMPONENT_META.filter((c) => c.category === "tool");
  const feedback = COMPONENT_META.filter((c) => c.category === "feedback");
  const preview = COMPONENT_META.filter((c) => c.category === "preview");

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  // Scroll main content only — sidebar keeps its position.
  React.useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  if (!pageMeta) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <nav
        className="w-56 shrink-0 flex flex-col h-screen border-r"
        style={{ background: "var(--mk-surface)", borderColor: "var(--mk-border)" }}
      >
        <div className={TOP_BAR_CLASS} style={{ borderColor: "var(--mk-border)" }}>
          <div className="min-w-0">
            <Link href="/docs/introduction" className="no-underline block" style={{ color: "inherit" }}>
              <h1 className="font-mono text-sm font-semibold tracking-tight m-0 leading-none" style={{ fontFamily: "var(--mk-font-mono)" }}>
                Minikit
              </h1>
            </Link>
            <p className="text-[10px] mt-1.5 m-0 uppercase tracking-wider leading-none" style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}>
              Docs
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-4">
          <NavSection title="Overview">
            {OVERVIEW_NAV.map((item) => (
              <NavLink
                key={item.slug}
                href={item.href}
                label={item.label}
                active={pageMeta.activeDoc === item.slug}
              />
            ))}
          </NavSection>

          <NavSection title="Core">
            {core.map((c) => (
              <NavLink key={c.id} href={componentHref(c.id)} label={c.name} active={pageMeta.activeComponentId === c.id} />
            ))}
          </NavSection>

          {input.length > 0 && (
            <NavSection title="Input">
              {input.map((c) => (
                <NavLink key={c.id} href={componentHref(c.id)} label={c.name} active={pageMeta.activeComponentId === c.id} />
              ))}
            </NavSection>
          )}

          {layout.length > 0 && (
            <NavSection title="Layout">
              {layout.map((c) => (
                <NavLink key={c.id} href={componentHref(c.id)} label={c.name} active={pageMeta.activeComponentId === c.id} />
              ))}
            </NavSection>
          )}

          {tool.length > 0 && (
            <NavSection title="Tool">
              {tool.map((c) => (
                <NavLink key={c.id} href={componentHref(c.id)} label={c.name} active={pageMeta.activeComponentId === c.id} />
              ))}
            </NavSection>
          )}

          {feedback.length > 0 && (
            <NavSection title="Feedback">
              {feedback.map((c) => (
                <NavLink key={c.id} href={componentHref(c.id)} label={c.name} active={pageMeta.activeComponentId === c.id} />
              ))}
            </NavSection>
          )}

          {preview.length > 0 && (
            <NavSection title="Examples">
              {preview.map((c) => (
                <NavLink key={c.id} href={componentHref(c.id)} label={c.name} active={pageMeta.activeComponentId === c.id} />
              ))}
            </NavSection>
          )}
        </div>

        <div className="shrink-0 p-3 border-t space-y-2" style={{ borderColor: "var(--mk-border)" }}>
          <span className="block text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}>
            Theme
          </span>
          <div className="flex flex-col gap-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  "text-left px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wide cursor-pointer transition-colors",
                  theme === t.id ? "opacity-100" : "opacity-50 hover:opacity-75",
                )}
                style={{
                  fontFamily: "var(--mk-font-mono)",
                  background: theme === t.id ? "color-mix(in srgb, var(--mk-text) 8%, transparent)" : "transparent",
                  color: "var(--mk-text-muted)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden" style={{ background: "var(--mk-bg)" }}>
        <header
          className={cn(TOP_BAR_CLASS, "justify-between gap-4 pr-6 shrink-0")}
          style={{ background: "var(--mk-surface)", borderColor: "var(--mk-border)", color: "var(--mk-text)" }}
        >
          <div className="min-w-0">
            <h2 className="text-base font-semibold m-0 leading-none tracking-[-0.01em]" style={{ color: "var(--mk-text)" }}>
              {pageMeta.title}
            </h2>
            {pageMeta.description && (
              <p className="text-xs mt-2 m-0 leading-relaxed max-w-md line-clamp-2" style={{ color: "var(--mk-text-muted)" }}>
                {pageMeta.description}
              </p>
            )}
          </div>
          <span
            className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md"
            style={{
              color: "var(--mk-text-faint)",
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              fontFamily: "var(--mk-font-mono)",
            }}
          >
            {pageMeta.pathLabel}
          </span>
        </header>

        <div
          ref={mainRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-8 py-10 md:px-12 md:py-12"
          style={{ background: "var(--mk-bg)" }}
        >
          <div className="w-full max-w-[44rem] mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block px-2 mb-1 text-[9px] uppercase tracking-wider" style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}>
        {title}
      </span>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "block px-2 py-1.5 rounded-md text-xs no-underline transition-colors",
        active ? "font-medium" : "font-normal hover:opacity-80",
      )}
      style={{
        background: active ? "color-mix(in srgb, var(--mk-text) 8%, transparent)" : "transparent",
        color: active ? "var(--mk-text)" : "var(--mk-text-muted)",
      }}
    >
      {label}
    </Link>
  );
}
