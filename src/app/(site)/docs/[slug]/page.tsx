import { notFound } from "next/navigation";
import { OverviewPageClient } from "@/app/docs/overview-page-client";
import { DOC_META } from "@/docs/overview-pages";
import { getOverviewCopyContent } from "@/docs/overview-copy";
import { DOC_SLUGS, isDocSlug } from "@/docs/nav";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isDocSlug(slug)) notFound();

  const { plainText, markdown } = getOverviewCopyContent(slug);

  return <OverviewPageClient slug={slug} plainText={plainText} markdown={markdown} />;
}
