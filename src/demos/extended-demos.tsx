"use client";

import * as React from "react";
import {
  Panel,
  Drawer,
  SplitView,
  Tabs,
  AccordionPanel,
  FieldGroup,
  Button,
  IconButton,
  Toggle,
  Select,
  TextInput,
  Checkbox,
  RadioGroup,
  CoordinateInput,
  PresetPicker,
  Dialog,
  Popover,
  PopoverLabel,
  EmptyState,
  ProgressBar,
  StatusBar,
  Toast,
  LayerList,
  Slider,
} from "@/components";
import {
  DemoSlider,
  DemoToggle,
  DemoSelect,
  DemoCoordinateInput,
  DemoPresetPicker,
} from "@/demos/demo-controls";

export function PanelDemo() {
  const [opacity, setOpacity] = React.useState(80);
  const [blur, setBlur] = React.useState(4);

  return (
    <div className="relative h-[360px] rounded-xl border overflow-hidden" style={{ borderColor: "var(--mk-border)" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] uppercase opacity-30">Canvas · drag the floating panel</span>
      </div>
      <Panel mode="floating" title="Adjustments" defaultPosition={{ x: 16, y: 16 }} width={200}>
        <Slider label="Opacity" value={opacity} onValueChange={setOpacity} min={0} max={100} />
        <Slider label="Blur" value={blur} onValueChange={setBlur} min={0} max={20} />
      </Panel>
      <Panel mode="floating" title="Info" defaultPosition={{ x: 16, y: 200 }} width={200} collapsible>
        <p className="text-[10px] m-0" style={{ color: "var(--mk-text-faint)" }}>
          Floating panels can be dragged, collapsed, and stacked over the canvas.
        </p>
      </Panel>
    </div>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onOpenChange={setOpen} title="Export settings">
        <div className="flex flex-col gap-3">
          <DemoSelect
            label="Format"
            defaultValue="png"
            options={[
              { value: "png", label: "PNG" },
              { value: "jpg", label: "JPG" },
            ]}
          />
          <DemoToggle label="Transparent bg" defaultChecked />
        </div>
      </Drawer>
    </>
  );
}

export function SplitViewDemo() {
  return (
    <SplitView
      left={
        <div className="p-4 h-full flex items-center justify-center" style={{ background: "var(--mk-bg)" }}>
          <span className="font-mono text-[10px] uppercase opacity-40">Source</span>
        </div>
      }
      right={
        <div className="p-4 h-full flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase opacity-40">Output</span>
        </div>
      }
    />
  );
}

export function TabsDemo() {
  return (
    <Tabs
      items={[
        {
          value: "adjust",
          label: "Adjust",
          content: (
            <DemoSlider label="Exposure" defaultValue={0} min={-100} max={100} />
          ),
        },
        {
          value: "crop",
          label: "Crop",
          content: <DemoCoordinateInput label="Origin" />,
        },
        {
          value: "export",
          label: "Export",
          content: <TextInput label="Filename" defaultValue="output.png" readOnly />,
        },
      ]}
    />
  );
}

export function AccordionDemo() {
  return (
    <AccordionPanel
      items={[
        {
          id: "transform",
          title: "Transform",
          content: <DemoSlider label="Rotate" defaultValue={0} min={-180} max={180} />,
        },
        {
          id: "filters",
          title: "Filters",
          content: <DemoSlider label="Blur" defaultValue={0} min={0} max={20} />,
        },
      ]}
    />
  );
}

export function FieldGroupDemo() {
  const [brush, setBrush] = React.useState(12);
  const [grid, setGrid] = React.useState(true);

  return (
    <div className="max-w-xs flex flex-col gap-3">
      <FieldGroup label="Brush size" hint="Drag">
        <Slider label="" value={brush} onValueChange={setBrush} min={1} max={64} showValue />
      </FieldGroup>
      <FieldGroup label="Show grid" layout="row">
        <Toggle checked={grid} onCheckedChange={setGrid} />
      </FieldGroup>
    </div>
  );
}

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Export</Button>
      <Button variant="secondary">Reset</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete</Button>
      <IconButton label="Undo">↩</IconButton>
      <IconButton label="Grid" active>⊞</IconButton>
    </div>
  );
}

export function ToggleDemo() {
  const [grid, setGrid] = React.useState(true);
  const [snap, setSnap] = React.useState(false);
  return (
    <div className="max-w-xs flex flex-col gap-3">
      <Toggle label="Show grid" checked={grid} onCheckedChange={setGrid} />
      <Toggle label="Snap to pixel" checked={snap} onCheckedChange={setSnap} />
    </div>
  );
}

export function SelectDemo() {
  const [fmt, setFmt] = React.useState("png");
  return (
    <div className="max-w-xs">
      <Select
        label="Export format"
        value={fmt}
        onValueChange={setFmt}
        options={[
          { value: "png", label: "PNG" },
          { value: "jpg", label: "JPG" },
          { value: "webp", label: "WebP" },
          { value: "svg", label: "SVG" },
        ]}
      />
    </div>
  );
}

export function TextInputDemo() {
  return (
    <div className="max-w-xs">
      <TextInput label="Project name" placeholder="my-tool" defaultValue="dither-studio" />
    </div>
  );
}

export function CheckboxDemo() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Checkbox label="Include metadata" checked={a} onCheckedChange={setA} />
      <Checkbox label="Flatten layers" checked={b} onCheckedChange={setB} />
    </div>
  );
}

export function RadioGroupDemo() {
  const [blend, setBlend] = React.useState("normal");
  return (
    <RadioGroup
      label="Blend mode"
      value={blend}
      onValueChange={setBlend}
      options={[
        { value: "normal", label: "Normal" },
        { value: "multiply", label: "Multiply" },
        { value: "screen", label: "Screen" },
      ]}
    />
  );
}

export function CoordinateInputDemo() {
  const [coords, setCoords] = React.useState({ x: 120, y: 48 });
  return (
    <div className="max-w-xs">
      <CoordinateInput label="Position" x={coords.x} y={coords.y} onChange={setCoords} />
    </div>
  );
}

export function PresetPickerDemo() {
  const [preset, setPreset] = React.useState("soft");
  return (
    <PresetPicker
      label="Dither preset"
      value={preset}
      onValueChange={setPreset}
      onAdd={() => {}}
      presets={[
        { id: "soft", label: "Soft" },
        { id: "hard", label: "Hard" },
        { id: "newsprint", label: "News" },
      ]}
    />
  );
}

export function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Export complete"
        description="Your image was saved to downloads."
        footer={<Button variant="primary" onClick={() => setOpen(false)}>Done</Button>}
      />
    </>
  );
}

export function PopoverDemo() {
  return (
    <Popover
      trigger={<Button variant="secondary">Brush settings</Button>}
      width={220}
    >
      <PopoverLabel>Size & hardness</PopoverLabel>
      <div className="flex flex-col gap-1.5">
        <DemoSlider label="Size" defaultValue={8} min={1} max={64} />
        <DemoSlider label="Hardness" defaultValue={70} min={0} max={100} />
      </div>
    </Popover>
  );
}

export function EmptyStateDemo() {
  return (
    <EmptyState
      title="No image loaded"
      description="Drop an image or click to browse"
      action={<Button variant="secondary">Browse files</Button>}
    />
  );
}

export function ProgressBarDemo() {
  const [value, setValue] = React.useState(35);
  React.useEffect(() => {
    const t = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="max-w-sm flex flex-col gap-4">
      <ProgressBar label="Exporting" value={value} />
      <ProgressBar label="Processing" value={0} variant="indeterminate" showValue={false} />
    </div>
  );
}

export function StatusBarDemo() {
  return (
    <StatusBar
      items={[
        { id: "dims", label: "1920 × 1080" },
        { id: "zoom", label: "100%" },
        { id: "status", label: "Ready", variant: "success" },
      ]}
    />
  );
}

export function ToastDemo() {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Show toast</Button>
      <Toast message="Copied to clipboard" variant="success" visible={visible} onDismiss={() => setVisible(false)} />
    </>
  );
}

export function LayerListDemo() {
  const [layers, setLayers] = React.useState([
    { id: "1", name: "Background", visible: true },
    { id: "2", name: "Dither layer", visible: true },
    { id: "3", name: "Annotation", visible: false, locked: true },
  ]);
  const [active, setActive] = React.useState("2");

  return (
    <div className="max-w-xs">
      <LayerList
        layers={layers}
        activeId={active}
        onActiveChange={setActive}
        onToggleVisible={(id) =>
          setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, visible: l.visible === false } : l)))
        }
        onToggleLocked={(id) =>
          setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)))
        }
        onReorder={(from, to) =>
          setLayers((ls) => {
            const next = [...ls];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return next;
          })
        }
      />
    </div>
  );
}

export function FloatingToolDemo() {
  const [toast, setToast] = React.useState(false);
  return (
    <div className="relative h-[400px] rounded-xl border overflow-hidden" style={{ borderColor: "var(--mk-border)", background: "var(--mk-bg)" }}>
      <EmptyState title="Drop image to start" description="Floating panels stay out of the way" />
      <Panel mode="floating" title="Dither" defaultPosition={{ x: 20, y: 20 }}>
        <DemoPresetPicker
          label="Preset"
          defaultValue="soft"
          presets={[{ id: "soft", label: "Soft" }, { id: "hard", label: "Hard" }]}
        />
        <DemoSlider label="Threshold" defaultValue={128} min={0} max={255} />
        <Button variant="primary" onClick={() => setToast(true)}>Apply</Button>
      </Panel>
      <StatusBar
        className="absolute bottom-0 left-0 right-0"
        items={[{ id: "s", label: "Floating tool demo" }]}
      />
      <Toast message="Applied dither" visible={toast} onDismiss={() => setToast(false)} variant="success" />
    </div>
  );
}
