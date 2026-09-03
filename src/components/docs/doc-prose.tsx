import Link from "next/link";
import { cn } from "@/lib/utils";
import { DOC_SECTION_CLASS } from "@/components/docs/doc-layout";

/** Top-level page content wrapper. */
export function DocArticle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article className={cn("space-y-12", className)}>
      {children}
    </article>
  );
}

/** Opening block: lead + optional supporting paragraphs with clear separation. */
export function DocIntro({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[42rem] [&>*+*]:mt-6 [&>*+*]:pt-6 [&>*+*]:border-t [&>*+*]:border-[var(--mk-border)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DocLead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-lg m-0 leading-[1.65] tracking-[-0.01em]"
      style={{ color: "var(--mk-text)" }}
    >
      {children}
    </p>
  );
}

/** Supporting copy that follows a lead inside DocIntro. */
export function DocIntroText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[15px] m-0 leading-[1.7]"
      style={{ color: "var(--mk-text-muted)" }}
    >
      {children}
    </p>
  );
}

export function DocParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[15px] m-0 leading-[1.7]"
      style={{ color: "var(--mk-text-muted)" }}
    >
      {children}
    </p>
  );
}

export function DocSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(DOC_SECTION_CLASS, className)}
      style={{ borderColor: "var(--mk-border)" }}
    >
      {children}
    </section>
  );
}

export function DocHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-[17px] font-semibold m-0 tracking-[-0.01em] scroll-mt-24 leading-snug"
      style={{ color: "var(--mk-text)" }}
    >
      {children}
    </h2>
  );
}

export function DocSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-medium m-0 tracking-[-0.01em]"
      style={{ color: "var(--mk-text)" }}
    >
      {children}
    </h3>
  );
}

export function DocList({ ordered, children }: { ordered?: boolean; children: React.ReactNode }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "m-0 pl-[1.375rem] space-y-3.5 text-[15px] leading-[1.7]",
        ordered ? "list-decimal" : "list-disc",
      )}
      style={{ color: "var(--mk-text-muted)" }}
    >
      {children}
    </Tag>
  );
}

export function DocListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="pl-1.5 marker:text-[var(--mk-text-faint)]">
      {children}
    </li>
  );
}

/** Guideline bullet: bold lead-in label followed by body text. */
export function DocGuideline({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="pl-1.5 marker:text-[var(--mk-text-faint)] leading-[1.7]">
      <span className="font-semibold" style={{ color: "var(--mk-text)" }}>
        {title}
      </span>
      <span style={{ color: "var(--mk-text-muted)" }}>: </span>
      <span style={{ color: "var(--mk-text-muted)" }}>{children}</span>
    </li>
  );
}

export function DocInlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="font-mono text-[13px] px-1.5 py-0.5 rounded"
      style={{
        color: "var(--mk-text)",
        background: "color-mix(in srgb, var(--mk-text) 8%, transparent)",
        fontFamily: "var(--mk-font-mono)",
      }}
    >
      {children}
    </code>
  );
}

export function DocPre({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="m-0 px-5 py-5 rounded-xl text-[13px] overflow-x-auto leading-[1.75] border"
      style={{
        background: "var(--mk-surface)",
        borderColor: "var(--mk-border)",
        color: "var(--mk-text-muted)",
        fontFamily: "var(--mk-font-mono)",
      }}
    >
      {children}
    </pre>
  );
}

/** Stack related code blocks with tighter internal rhythm. */
export function DocCodeGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3.5", className)}>{children}</div>;
}

export function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="underline underline-offset-[3px] decoration-[color-mix(in_srgb,var(--mk-text)_25%,transparent)] hover:decoration-[var(--mk-text)] transition-colors"
      style={{ color: "var(--mk-text)" }}
    >
      {children}
    </Link>
  );
}

export function DocStrong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold" style={{ color: "var(--mk-text)" }}>{children}</strong>;
}
