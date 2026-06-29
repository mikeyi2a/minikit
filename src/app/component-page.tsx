"use client";

import { getComponent } from "@/demos/registry";
import { getComponentDocResolved } from "@/docs/component-docs";
import { CodePanel } from "@/components/docs/code-panel";
import { PageSection, PageStack, PageSubsection } from "@/components/docs/page-section";
import { PropsTable } from "@/components/docs/props-table";
import type { ComponentId } from "@/demos/registry-meta";

export interface ComponentPageContentProps {
  activeId: ComponentId;
  source: string | null;
  utilsSource: string | null;
}

export function ComponentPageContent({ activeId, source, utilsSource }: ComponentPageContentProps) {
  const active = getComponent(activeId);
  const doc = getComponentDocResolved(activeId);
  const { Demo } = active;
  const filename = source ? `${activeId}.tsx` : undefined;

  return (
    <PageStack>
      <PageSection title="When to use">
        <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--mk-text-muted)" }}>
          {doc.whenToUse}
        </p>
      </PageSection>

      <PageSection title="Demo">
        <div
          className="rounded-xl p-8"
          style={{ background: "var(--mk-surface)", border: "1px solid var(--mk-border)", minHeight: 120 }}
        >
          <Demo />
        </div>
      </PageSection>

      {doc.usageExample && (
        <PageSection title="Usage">
          <CodePanel code={doc.usageExample} filename="example.tsx" defaultOpen />
        </PageSection>
      )}

      {doc.props.length > 0 && (
        <PageSection title="Props">
          <PropsTable props={doc.props} />
        </PageSection>
      )}

      {source && (
        <PageSection title="Source">
          <div className="flex flex-col gap-6">
            <CodePanel code={source} filename={filename} />
            {utilsSource && (
              <PageSubsection
                title="Dependencies"
                description={
                  <>
                    Also copy{" "}
                    <code
                      className="font-mono text-xs px-1 py-0.5 rounded"
                      style={{ background: "color-mix(in srgb, var(--mk-text) 8%, transparent)" }}
                    >
                      lib/utils.ts
                    </code>{" "}
                    (cn helper):
                  </>
                }
              >
                <CodePanel code={utilsSource} filename="lib/utils.ts" />
              </PageSubsection>
            )}
          </div>
        </PageSection>
      )}
    </PageStack>
  );
}

/** @deprecated Use ComponentPageContent inside DocsShellLayout */
export function ComponentPage(props: ComponentPageContentProps) {
  return <ComponentPageContent {...props} />;
}
