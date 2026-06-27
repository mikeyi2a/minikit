export type DocSlug =
  | "introduction"
  | "getting-started"
  | "installation"
  | "theming"
  | "composing-a-tool"
  | "llms-txt";

export interface DocNavItem {
  slug: DocSlug;
  label: string;
  href: string;
}

export const OVERVIEW_NAV: DocNavItem[] = [
  { slug: "introduction", label: "Introduction", href: "/docs/introduction" },
  { slug: "getting-started", label: "Getting started", href: "/docs/getting-started" },
  { slug: "installation", label: "Installation", href: "/docs/installation" },
  { slug: "theming", label: "Theming", href: "/docs/theming" },
  { slug: "composing-a-tool", label: "Composing a tool", href: "/docs/composing-a-tool" },
  { slug: "llms-txt", label: "llms.txt", href: "/docs/llms-txt" },
];

export const DOC_SLUGS = OVERVIEW_NAV.map((item) => item.slug);

export function isDocSlug(slug: string): slug is DocSlug {
  return DOC_SLUGS.includes(slug as DocSlug);
}
