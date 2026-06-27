import { notFound } from "next/navigation";
import { ComponentPageContent } from "@/app/component-page";
import { getComponentSource, getUtilsSource } from "@/lib/component-source";
import { COMPONENT_META, isComponentId } from "@/demos/registry-meta";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return COMPONENT_META.filter((entry) => entry.id !== "overview").map((entry) => ({
    id: entry.id,
  }));
}

export default async function ComponentRoute({ params }: PageProps) {
  const { id } = await params;

  if (!isComponentId(id) || id === "overview") {
    notFound();
  }

  const source = getComponentSource(id);
  const utilsSource = source ? getUtilsSource() : null;

  return <ComponentPageContent activeId={id} source={source} utilsSource={utilsSource} />;
}
