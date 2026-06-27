"use client";

import { CopyPageButton } from "@/components/docs/copy-page-button";
import { OverviewContent } from "@/docs/overview-pages";
import type { DocSlug } from "@/docs/nav";

export interface OverviewPageClientProps {
  slug: DocSlug;
  plainText: string;
  markdown: string;
}

export function OverviewPageClient({ slug, plainText, markdown }: OverviewPageClientProps) {
  return (
    <div className="space-y-10">
      <div
        className="flex justify-end pb-8 border-b"
        style={{ borderColor: "var(--mk-border)" }}
      >
        <CopyPageButton plainText={plainText} markdown={markdown} />
      </div>
      <OverviewContent slug={slug} />
    </div>
  );
}
