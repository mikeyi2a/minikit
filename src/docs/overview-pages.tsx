import type { DocSlug } from "@/docs/nav";
import { COMPONENT_META, type ComponentCategory } from "@/demos/registry-meta";
import {
  DocArticle,
  DocGuideline,
  DocHeading,
  DocInlineCode,
  DocIntro,
  DocIntroText,
  DocLead,
  DocLink,
  DocList,
  DocListItem,
  DocParagraph,
  DocPre,
  DocSection,
  DocStrong,
} from "@/components/docs/doc-prose";

export function OverviewContent({ slug }: { slug: DocSlug }) {
  switch (slug) {
    case "introduction":
      return <Introduction />;
    case "getting-started":
      return <GettingStarted />;
    case "installation":
      return <Installation />;
    case "theming":
      return <Theming />;
    case "composing-a-tool":
      return <ComposingTool />;
    case "llms-txt":
      return <LlmsTxtDoc />;
    default:
      return null;
  }
}

function Introduction() {
  return (
    <DocArticle>
      <DocIntro>
        <DocLead>
          Minikit is a copy-paste component registry for building mini creative tools — dither editors, screenshot annotators, colour pickers, mockup makers, export utilities.
        </DocLead>
        <DocIntroText>
          <DocStrong>shadcn is for apps.</DocStrong> Minikit is for tools. The component set, default aesthetic, and docs are calibrated for someone building a focused little tool for a specific creative task — not a dashboard or marketing site.
        </DocIntroText>
      </DocIntro>

      <DocSection>
        <DocHeading>Built on</DocHeading>
        <DocParagraph>
          Minikit is not a from-scratch UI framework. It is a curated component layer on top of a small, modern stack — the same foundations most React tool apps already use.
        </DocParagraph>
        <DocList>
          <DocListItem>
            <DocStrong>React 19 + TypeScript</DocStrong> — all components are{" "}
            <DocInlineCode>&quot;use client&quot;</DocInlineCode> and controlled. You own the state; Minikit renders the control surface.
          </DocListItem>
          <DocListItem>
            <DocStrong>Tailwind CSS 4</DocStrong> — utility classes for layout and sizing. No separate component CSS files to import beyond theme tokens.
          </DocListItem>
          <DocListItem>
            <DocStrong>Radix UI</DocStrong> — accessible primitives where it matters (Dialog, Select, Tabs, Popover, Checkbox, and others). Radix handles focus traps and keyboard behaviour; Minikit styles them to match the tool aesthetic.
          </DocListItem>
          <DocListItem>
            <DocStrong>CSS variables (<DocInlineCode>--mk-*</DocInlineCode>)</DocStrong> — all colour, spacing, and typography flow through tokens. Rebrand without editing component source. See{" "}
            <DocLink href="/docs/theming">Theming</DocLink>.
          </DocListItem>
          <DocListItem>
            <DocStrong>shadcn-style registry</DocStrong> — copy-paste source, a JSON manifest, and a CLI (<DocInlineCode>@mikeyi2a/minikit-cli</DocInlineCode>) that pulls files into your project. Or skip the copy step and import via{" "}
            <DocInlineCode>@mikeyi2a/minikit-ui</DocInlineCode>.
          </DocListItem>
        </DocList>
        <DocParagraph>
          The docs site itself is Next.js 15 (App Router). Your app can be Next.js, Vite, or any React setup — you only need React, Tailwind 4, and the theme CSS.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>What you get</DocHeading>
        <DocList>
          <DocListItem>38 components across core controls, inputs, layout, canvas, and feedback</DocListItem>
          <DocListItem>
            CSS variable theming (<DocInlineCode>--mk-*</DocInlineCode> tokens)
          </DocListItem>
          <DocListItem>Live demos + copy-paste source for every component</DocListItem>
          <DocListItem>
            <DocInlineCode>llms.txt</DocInlineCode> so AI agents know how to compose tools
          </DocListItem>
        </DocList>
      </DocSection>

      <DocSection>
        <DocHeading>Documentation</DocHeading>
        <DocList>
          <DocListItem>
            Live site:{" "}
            <a
              href="https://minikit-flax.vercel.app"
              className="underline underline-offset-[3px]"
              style={{ color: "var(--mk-text)" }}
              target="_blank"
              rel="noreferrer"
            >
              minikit-flax.vercel.app
            </a>
          </DocListItem>
          <DocListItem>
            npm:{" "}
            <DocInlineCode>@mikeyi2a/minikit-ui</DocInlineCode> (import) ·{" "}
            <DocInlineCode>@mikeyi2a/minikit-cli</DocInlineCode> (copy-paste)
          </DocListItem>
          <DocListItem>
            Registry JSON:{" "}
            <a
              href="https://minikit-flax.vercel.app/r/registry.json"
              className="underline underline-offset-[3px]"
              style={{ color: "var(--mk-text)" }}
              target="_blank"
              rel="noreferrer"
            >
              /r/registry.json
            </a>
          </DocListItem>
        </DocList>
      </DocSection>

      <DocSection>
        <DocHeading>Components</DocHeading>
        <DocParagraph>
          38 components with live demos and props tables.{" "}
          <DocLink href="/segmented-control">Browse all →</DocLink>
        </DocParagraph>
        <ComponentCatalog />
      </DocSection>

      <DocSection>
        <DocHeading>Usage guidelines</DocHeading>
        <DocList>
          <DocGuideline title="Use for focused creative tools">
            Minikit components are designed for single-purpose tools — image editors, annotators, export utilities — not full application shells.
          </DocGuideline>
          <DocGuideline title="Three install paths">
            <DocLink href="/docs/installation">npm package</DocLink> (fastest),{" "}
            <DocLink href="/docs/installation">CLI</DocLink> (own the source), or manual copy from any component page.
          </DocGuideline>
          <DocGuideline title="Theme with CSS variables">
            Override <DocInlineCode>--mk-*</DocInlineCode> tokens to rebrand. Set <DocInlineCode>data-theme=&quot;tool-dark&quot;</DocInlineCode> on <DocInlineCode>&lt;html&gt;</DocInlineCode> for the default aesthetic.
          </DocGuideline>
        </DocList>
      </DocSection>
    </DocArticle>
  );
}

function GettingStarted() {
  return (
    <DocArticle>
      <DocIntro>
        <DocLead>Get a Minikit component running in under 5 minutes.</DocLead>
      </DocIntro>

      <DocSection>
        <DocHeading>Fast path — npm package</DocHeading>
        <DocPre>{`npm install @mikeyi2a/minikit-ui`}</DocPre>
        <DocPre>{`// app/layout.tsx
import "@mikeyi2a/minikit-ui/styles.css";

// page.tsx
"use client";
import { useState } from "react";
import { Slider } from "@mikeyi2a/minikit-ui";

export function MyTool() {
  const [v, setV] = useState(50);
  return <Slider label="Amount" value={v} onValueChange={setV} />;
}`}</DocPre>
        <DocParagraph>
          Set <DocInlineCode>data-theme=&quot;tool-dark&quot;</DocInlineCode> on <DocInlineCode>&lt;html&gt;</DocInlineCode>. See{" "}
          <DocLink href="/docs/installation">Installation</DocLink> for CLI and manual options.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>Or browse the live docs</DocHeading>
        <DocParagraph>
          Every component has a demo, props table, and copy-paste source at{" "}
          <a
            href="https://minikit-flax.vercel.app"
            className="underline underline-offset-[3px]"
            style={{ color: "var(--mk-text)" }}
            target="_blank"
            rel="noreferrer"
          >
            minikit-flax.vercel.app
          </a>
          . Open e.g. <DocLink href="/slider">Slider</DocLink>, click <DocStrong>Show code</DocStrong>, copy into{" "}
          <DocInlineCode>src/components/</DocInlineCode>.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>Run this repo locally</DocHeading>
        <DocParagraph>Fork or clone to hack on Minikit itself:</DocParagraph>
        <DocPre>
          {`git clone https://github.com/mikeyi2a/minikit\ncd minikit\nnpm install\nnpm run dev`}
        </DocPre>
      </DocSection>

      <DocSection>
        <DocHeading>Compose a tool</DocHeading>
        <DocParagraph>
          See <DocLink href="/docs/composing-a-tool">Composing a tool</DocLink> or the{" "}
          <DocLink href="/image-tool">Image Tool</DocLink> example.
        </DocParagraph>
      </DocSection>
    </DocArticle>
  );
}

function Installation() {
  return (
    <DocArticle>
      <DocIntro>
        <DocLead>Three ways to use Minikit: npm package, CLI copy-paste, or manual copy from the docs.</DocLead>
      </DocIntro>

      <DocSection>
        <DocHeading>npm package</DocHeading>
        <DocPre>{`npm install @mikeyi2a/minikit-ui`}</DocPre>
        <DocPre>{`// app/layout.tsx
import "@mikeyi2a/minikit-ui/styles.css";

// page.tsx
import { Slider } from "@mikeyi2a/minikit-ui";

<Slider label="Opacity" value={80} onValueChange={setOpacity} />`}</DocPre>
        <DocParagraph>
          Requires React 19+, Tailwind 4+, and <DocInlineCode>data-theme="tool-dark"</DocInlineCode> on{" "}
          <DocInlineCode>&lt;html&gt;</DocInlineCode>.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>CLI</DocHeading>
        <DocPre>{`npx @mikeyi2a/minikit-cli init\nnpx @mikeyi2a/minikit-cli add slider`}</DocPre>
        <DocParagraph>
          Fetches from{" "}
          <a
            href="https://minikit-flax.vercel.app/r/registry.json"
            className="underline underline-offset-[3px]"
            style={{ color: "var(--mk-text)" }}
            target="_blank"
            rel="noreferrer"
          >
            minikit-flax.vercel.app/r/registry.json
          </a>
          . Resolves transitive dependencies (e.g. <DocInlineCode>toolbar</DocInlineCode> also installs{" "}
          <DocInlineCode>tooltip</DocInlineCode>). See the{" "}
          <a
            href="https://www.npmjs.com/package/@mikeyi2a/minikit-cli"
            className="underline underline-offset-[3px]"
            style={{ color: "var(--mk-text)" }}
            target="_blank"
            rel="noreferrer"
          >
            CLI readme on npm
          </a>
          .
        </DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>Manual install</DocHeading>
        <DocList ordered>
          <DocListItem>Add Tailwind CSS 4+ to your React / Next.js project</DocListItem>
          <DocListItem>
            Copy theme tokens from <DocInlineCode>globals.css</DocInlineCode> or import{" "}
            <DocInlineCode>registry/theme.css</DocInlineCode>
          </DocListItem>
          <DocListItem>
            Copy <DocInlineCode>src/lib/utils.ts</DocInlineCode>
          </DocListItem>
          <DocListItem>Copy the component file from the docs code panel</DocListItem>
          <DocListItem>Install peer deps if needed (Radix packages listed in source imports)</DocListItem>
        </DocList>
      </DocSection>

      <DocSection>
        <DocHeading>Dependencies</DocHeading>
        <DocList>
          <DocGuideline title="Core">
            React 19, Tailwind 4, clsx, tailwind-merge
          </DocGuideline>
          <DocGuideline title="Optional">
            Radix UI primitives for accessible Dialog, Select, Tabs, and other overlay components
          </DocGuideline>
        </DocList>
      </DocSection>

      <DocSection>
        <DocHeading>All components</DocHeading>
        <DocParagraph>35 installable via CLI · 38 total including composed demos.</DocParagraph>
        <ComponentCatalog includePreview />
      </DocSection>
    </DocArticle>
  );
}

function Theming() {
  return (
    <DocArticle>
      <DocIntro>
        <DocLead>All components use CSS variables. Override tokens to rebrand — no component edits required.</DocLead>
      </DocIntro>

      <DocSection>
        <DocHeading>Token reference</DocHeading>
        <DocPre>
          {`:root {
  --mk-bg: #ffffff;
  --mk-surface: #f5f5f5;
  --mk-surface-raised: #ebebeb;
  --mk-border: #e0e0e0;
  --mk-text: #111111;
  --mk-text-muted: #666666;
  --mk-text-faint: #999999;
  --mk-accent: #0066ff;
  --mk-radius: 8px;
  --mk-font-mono: ui-monospace, monospace;
  --mk-control-height: 32px;
}`}
        </DocPre>
      </DocSection>

      <DocSection>
        <DocHeading>Presets</DocHeading>
        <DocList>
          <DocListItem>
            <DocInlineCode>data-theme=&quot;tool-dark&quot;</DocInlineCode> — default Minikit aesthetic (camera-controls style)
          </DocListItem>
          <DocListItem>
            <DocInlineCode>data-theme=&quot;light&quot;</DocInlineCode> — light neutral
          </DocListItem>
          <DocListItem>
            <DocInlineCode>data-theme=&quot;dark&quot;</DocInlineCode> — dark neutral
          </DocListItem>
        </DocList>
        <DocParagraph>Use the theme switcher in the docs sidebar to preview all three.</DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>Brand override</DocHeading>
        <DocPre>
          {`[data-theme="my-brand"] {
  --mk-accent: #ff3366;
  --mk-surface: #1a1a2e;
}`}
        </DocPre>
      </DocSection>
    </DocArticle>
  );
}

function ComposingTool() {
  return (
    <DocArticle>
      <DocIntro>
        <DocLead>
          A minimal image tool = file input + preview + adjustments + export. Here&apos;s the Minikit composition:
        </DocLead>
      </DocIntro>

      <DocSection>
        <DocHeading>Layout</DocHeading>
        <DocPre>
          {`┌─────────────┬──────────────────┐
│  Sidebar    │   CanvasFrame    │
│  Dropzone   │   (preview)      │
│  Sliders    │                  │
│  ExportBtn  │                  │
└─────────────┴──────────────────┘
│           StatusBar            │
└────────────────────────────────┘`}
        </DocPre>
      </DocSection>

      <DocSection>
        <DocHeading>Components used</DocHeading>
        <DocList>
          <DocListItem>
            <DocLink href="/sidebar">Sidebar</DocLink> — docked control column
          </DocListItem>
          <DocListItem>
            <DocLink href="/dropzone">Dropzone</DocLink> — load image
          </DocListItem>
          <DocListItem>
            <DocLink href="/slider">Slider</DocLink> — brightness, contrast
          </DocListItem>
          <DocListItem>
            <DocLink href="/canvas-frame">CanvasFrame</DocLink> — output preview
          </DocListItem>
          <DocListItem>
            <DocLink href="/export-button">ExportButton</DocLink> — PNG / copy
          </DocListItem>
        </DocList>
      </DocSection>

      <DocSection>
        <DocHeading>Live example</DocHeading>
        <DocParagraph>
          <DocLink href="/image-tool">Open the Image Tool demo →</DocLink>
        </DocParagraph>
      </DocSection>

      <DocSection>
        <DocHeading>Floating variant</DocHeading>
        <DocParagraph>
          For overlay controls, swap Sidebar for{" "}
          <DocLink href="/panel">Panel mode=&quot;floating&quot;</DocLink>. See the{" "}
          <DocLink href="/floating-tool">Floating Tool</DocLink> example.
        </DocParagraph>
      </DocSection>
    </DocArticle>
  );
}

function LlmsTxtDoc() {
  return (
    <DocArticle>
      <DocIntro>
        <DocLead>
          <DocInlineCode>llms.txt</DocInlineCode> is a machine-readable guide for AI coding agents. It describes every component, when to use it, and how to compose a mini tool.
        </DocLead>
      </DocIntro>

      <DocSection>
        <DocHeading>Location</DocHeading>
        <DocList>
          <DocListItem>
            Repo root: <DocInlineCode>llms.txt</DocInlineCode>
          </DocListItem>
          <DocListItem>
            Web: <DocLink href="/llms.txt">/llms.txt</DocLink>
          </DocListItem>
        </DocList>
      </DocSection>

      <DocSection>
        <DocHeading>Usage with Cursor / Claude</DocHeading>
        <DocParagraph>
          Point your agent at the file or paste its contents into context when building a tool. It includes composition recipes like:
        </DocParagraph>
        <DocPre>Image tool → Sidebar + Dropzone + Slider + CanvasFrame + ExportButton</DocPre>
      </DocSection>
    </DocArticle>
  );
}

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  core: "Core",
  input: "Input",
  layout: "Layout",
  tool: "Tool / Canvas",
  feedback: "Feedback",
  preview: "Composed examples",
};

function ComponentCatalog({ includePreview = false }: { includePreview?: boolean }) {
  const categories = (["core", "input", "layout", "tool", "feedback", "preview"] as ComponentCategory[]).filter(
    (c) => includePreview || c !== "preview",
  );

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const items = COMPONENT_META.filter(
          (c) => c.category === category && c.id !== "overview",
        );
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <p
              className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] mb-2"
              style={{ color: "var(--mk-text-muted)" }}
            >
              {CATEGORY_LABELS[category]}
            </p>
            <DocList>
              {items.map((item) => (
                <DocListItem key={item.id}>
                  <DocLink href={`/${item.id}`}>{item.name}</DocLink>
                  {" — "}
                  {item.description}
                </DocListItem>
              ))}
            </DocList>
          </div>
        );
      })}
    </div>
  );
}

export const DOC_META: Record<DocSlug, { title: string; description: string }> = {
  introduction: { title: "Introduction", description: "What Minikit is and who it's for." },
  "getting-started": { title: "Getting started", description: "Run your first component in 5 minutes." },
  installation: { title: "Installation", description: "npm package, CLI, and manual copy install." },
  theming: { title: "Theming", description: "Override --mk-* tokens to rebrand." },
  "composing-a-tool": { title: "Composing a tool", description: "Build an image tool from Minikit pieces." },
  "llms-txt": { title: "llms.txt", description: "AI-readable component reference." },
};
