import { cn } from "@/lib/utils";

const LABEL_CLASS = "text-[10px] font-mono uppercase tracking-wider m-0";
const LABEL_STYLE = { color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" } as const;

export function PageSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <h3 className={LABEL_CLASS} style={LABEL_STYLE}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PageSubsection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("space-y-4 pt-5 border-t", className)}
      style={{ borderColor: "var(--mk-border)" }}
    >
      <div className="space-y-2">
        <h4 className={LABEL_CLASS} style={LABEL_STYLE}>
          {title}
        </h4>
        {description && (
          <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--mk-text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function PageStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-10", className)}>{children}</div>;
}
