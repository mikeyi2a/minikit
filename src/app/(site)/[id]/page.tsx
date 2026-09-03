import { notFound } from "next/navigation";
import { ComponentPageContent } from "@/app/component-page";
import { COMPONENT_META, isComponentId } from "@/demos/registry-meta";
import { getComponentSource, getUtilsSource } from "@/lib/component-source";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return COMPONENT_META
    .filter((c) => c.id !== "overview")
    .map((c) => ({ id: c.id }));
}

export default async function ComponentPage({ params }: PageProps) {
  const { id } = await params;
  if (!isComponentId(id) || id === "overview") notFound();

  const source = getComponentSource(id);
  const utilsSource = getUtilsSource();

  return (
    <ComponentPageContent
      activeId={id}
      source={source}
      utilsSource={utilsSource}
    />
  );
}
