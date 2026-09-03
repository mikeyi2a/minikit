"use client";

import * as React from "react";
import {
  SegmentedControl, Slider, DualSlider, NumberStepper, ColorPicker, Badge, Sidebar,
  Tooltip, Toggle, Select, Button, IconButton, TextInput, Checkbox, RadioGroup,
  CoordinateInput, PresetPicker, FieldGroup, Panel, Drawer, SplitView, Tabs,
  AccordionPanel, Toolbar, Dropzone, CompareSlider, CanvasFrame, ExportButton,
  LayerList, Timeline, Dialog, Popover, PopoverLabel, EmptyState, ProgressBar,
  StatusBar, Toast,
} from "@/components";

export default function TestAll() {
  const [val, setVal] = React.useState(50);
  const [range, setRange] = React.useState<[number, number]>([20, 80]);
  const [num, setNum] = React.useState(0);
  const [color, setColor] = React.useState("#ff3366");
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const [preset, setPreset] = React.useState("soft");
  const [tog, setTog] = React.useState(true);
  const [sel, setSel] = React.useState("png");
  const [check, setCheck] = React.useState(true);
  const [blend, setBlend] = React.useState("normal");

  return (
    <div className="min-h-screen p-8 flex flex-col gap-6" style={{ background: "var(--mk-bg)" }}>
      <h1 className="font-mono text-[14px] uppercase tracking-wider" style={{ color: "var(--mk-text)" }}>
        All 33 components — visual smoke test
      </h1>

      {/* CORE */}
      <Section title="Core controls">
        <Row label="SegmentedControl">
          <SegmentedControl
            value={preset}
            onValueChange={setPreset}
            items={[{ value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]}
          />
        </Row>
        <Row label="Slider">
          <Slider label="Value" value={val} onValueChange={setVal} min={0} max={100} />
        </Row>
        <Row label="DualSlider">
          <DualSlider label="Range" value={range} onValueChange={setRange} min={0} max={100} />
        </Row>
        <Row label="NumberStepper">
          <NumberStepper label="Count" value={num} onValueChange={setNum} min={-10} max={10} />
        </Row>
        <Row label="ColorPicker">
          <ColorPicker label="Color" value={color} onValueChange={setColor} swatches={["#ff3366", "#00cc88", "#0066ff", "#ffaa00"]} />
        </Row>
        <Row label="Badge">
          <Badge variant="default">default</Badge>
          <Badge variant="accent">accent</Badge>
          <Badge variant="muted">muted</Badge>
          <Badge variant="outline">outline</Badge>
        </Row>
        <Row label="Tooltip">
          <Tooltip content="hello world" shortcut="⌘K">
            <Button variant="secondary">hover me</Button>
          </Tooltip>
        </Row>
      </Section>

      {/* INPUTS */}
      <Section title="Inputs">
        <Row label="Toggle">
          <Toggle label="Show grid" checked={tog} onCheckedChange={setTog} />
        </Row>
        <Row label="Select">
          <Select
            label="Format"
            value={sel}
            onValueChange={setSel}
            options={[{ value: "png", label: "PNG" }, { value: "jpg", label: "JPG" }]}
          />
        </Row>
        <Row label="Button">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <IconButton label="Undo">↩</IconButton>
        </Row>
        <Row label="TextInput">
          <TextInput label="Project name" defaultValue="dither-studio" />
        </Row>
        <Row label="Checkbox">
          <Checkbox label="Include metadata" checked={check} onCheckedChange={setCheck} />
        </Row>
        <Row label="RadioGroup">
          <RadioGroup
            label="Blend mode"
            value={blend}
            onValueChange={setBlend}
            options={[{ value: "normal", label: "Normal" }, { value: "multiply", label: "Multiply" }]}
          />
        </Row>
        <Row label="CoordinateInput">
          <CoordinateInput label="Position" x={120} y={48} onChange={() => {}} />
        </Row>
        <Row label="PresetPicker">
          <PresetPicker
            label="Dither"
            value={preset}
            onValueChange={setPreset}
            onAdd={() => {}}
            presets={[{ id: "soft", label: "Soft" }, { id: "hard", label: "Hard" }, { id: "newsprint", label: "News" }]}
          />
        </Row>
        <Row label="FieldGroup">
          <FieldGroup label="Brush size" hint="Drag">
            <Slider label="Size" value={val} onValueChange={setVal} min={1} max={64} showValue />
          </FieldGroup>
        </Row>
      </Section>

      {/* LAYOUT */}
      <Section title="Layout">
        <Row label="Panel">
          <Panel mode="docked" title="Panel" width={220}>
            <p className="text-[10px]" style={{ color: "var(--mk-text-faint)" }}>
              Docked panel content
            </p>
          </Panel>
        </Row>
        <Row label="Drawer">
          <Button variant="secondary" onClick={() => setShowDrawer(true)}>Open drawer</Button>
          <Drawer open={showDrawer} onOpenChange={setShowDrawer} title="Drawer">
            <p>Drawer content</p>
          </Drawer>
        </Row>
        <Row label="SplitView">
          <div className="w-full h-32">
            <SplitView
              left={<div className="h-full flex items-center justify-center" style={{ background: "var(--mk-surface)" }}>L</div>}
              right={<div className="h-full flex items-center justify-center">R</div>}
            />
          </div>
        </Row>
        <Row label="Tabs">
          <Tabs
            items={[
              { value: "a", label: "Adjust", content: <p>tab A</p> },
              { value: "b", label: "Crop", content: <p>tab B</p> },
            ]}
          />
        </Row>
        <Row label="AccordionPanel">
          <AccordionPanel
            items={[
              { id: "t", title: "Transform", content: <p>content</p> },
              { id: "f", title: "Filters", content: <p>more</p> },
            ]}
          />
        </Row>
      </Section>

      {/* TOOL */}
      <Section title="Tool / canvas">
        <Row label="Toolbar">
          <Toolbar
            items={[
              { id: "1", label: "Select", shortcut: "V" },
              { id: "2", label: "Draw", shortcut: "B" },
            ]}
            orientation="horizontal"
          />
        </Row>
        <Row label="Dropzone">
          <Dropzone onFileAccept={() => {}} />
        </Row>
        <Row label="CompareSlider">
          <div className="w-64 h-32">
            <CompareSlider beforeSrc="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9'><rect width='16' height='9' fill='%23ff3366'/></svg>" afterSrc="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9'><rect width='16' height='9' fill='%2300cc88'/></svg>" />
          </div>
        </Row>
        <Row label="CanvasFrame">
          <div className="w-64 h-32">
            <CanvasFrame />
          </div>
        </Row>
        <Row label="ExportButton">
          <ExportButton onExport={async () => {}} />
        </Row>
        <Row label="LayerList">
          <div className="w-64">
            <LayerList
              layers={[
                { id: "1", name: "Background", visible: true },
                { id: "2", name: "Dither", visible: true },
              ]}
              activeId="1"
              onActiveChange={() => {}}
              onToggleVisible={() => {}}
              onToggleLocked={() => {}}
              onReorder={() => {}}
            />
          </div>
        </Row>
        <Row label="Timeline">
          <div className="w-full h-32">
            <Timeline
              shots={[{ id: "s1", label: "Shot 1" }]}
              keyframes={[]}
              currentTime={0}
              duration={4}
              onCurrentTimeChange={() => {}}
            />
          </div>
        </Row>
      </Section>

      {/* FEEDBACK */}
      <Section title="Feedback">
        <Row label="Dialog">
          <Button variant="secondary" onClick={() => setShowDialog(true)}>Open dialog</Button>
          <Dialog
            open={showDialog}
            onOpenChange={setShowDialog}
            title="Confirm"
            description="Are you sure?"
            footer={<Button variant="primary" onClick={() => setShowDialog(false)}>OK</Button>}
          />
        </Row>
        <Row label="Popover">
          <Popover trigger={<Button variant="secondary">Open popover</Button>} width={220}>
            <PopoverLabel>Settings</PopoverLabel>
            <p>popover body</p>
          </Popover>
        </Row>
        <Row label="EmptyState">
          <div className="w-64">
            <EmptyState title="Nothing here" description="Drop a file to start" />
          </div>
        </Row>
        <Row label="ProgressBar">
          <ProgressBar label="Loading" value={42} />
        </Row>
        <Row label="StatusBar">
          <StatusBar items={[{ id: "1", label: "READY", variant: "success" }]} />
        </Row>
        <Row label="Toast">
          <Button variant="primary" onClick={() => setToast(true)}>Show toast</Button>
          <Toast message="Done" variant="success" visible={toast} onDismiss={() => setToast(false)} />
        </Row>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 p-4 rounded-xl border" style={{ borderColor: "var(--mk-border)" }}>
      <h2 className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--mk-text-muted)" }}>
        {title}
      </h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="font-mono text-[9px] uppercase tracking-wider pt-1.5 w-32 shrink-0"
        style={{ color: "var(--mk-text-faint)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 flex-wrap flex-1">{children}</div>
    </div>
  );
}
