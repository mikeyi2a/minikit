import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minikit — Docs",
  description: "Copy-paste component registry for mini creative tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" data-theme="tool-dark" suppressHydrationWarning>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
