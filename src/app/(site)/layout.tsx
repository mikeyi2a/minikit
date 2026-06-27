import DocsShellLayout from "@/app/docs-shell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <DocsShellLayout>{children}</DocsShellLayout>;
}
