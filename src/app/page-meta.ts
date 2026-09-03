import type { DocSlug } from "@/docs/nav";
import { isDocSlug } from "@/docs/nav";
import { DOC_META } from "@/docs/overview-pages";
import { COMPONENT_META, isComponentId, type ComponentId } from "@/demos/registry-meta";

export interface PageMeta {
  title: string;
  description?: string;
  pathLabel: string;
  activeDoc?: DocSlug;
  activeComponentId?: ComponentId;
}

export function resolvePageMeta(pathname: string): PageMeta | null {
  if (pathname.startsWith("/docs/")) {
    const slug = pathname.slice("/docs/".length);
    if (isDocSlug(slug)) {
      const meta = DOC_META[slug];
      return {
        title: meta.title,
        description: meta.description,
        pathLabel: pathname,
        activeDoc: slug,
      };
    }
    return null;
  }

  const id = pathname.slice(1);
  if (id && isComponentId(id) && id !== "overview") {
    const meta = COMPONENT_META.find((entry) => entry.id === id);
    if (meta) {
      return {
        title: meta.name,
        description: meta.description,
        pathLabel: pathname,
        activeComponentId: id,
      };
    }
  }

  return null;
}
