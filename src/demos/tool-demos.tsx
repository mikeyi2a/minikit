"use client";

import * as React from "react";
import {
  DualSlider,
  ColorPicker,
  Toolbar,
  Dropzone,
  CompareSlider,
  CanvasFrame,
  ExportButton,
  Slider,
  Sidebar,
  SegmentedControl,
  Timeline,
  type ExportFormat,
  type TimelineKeyframe,
  type TimelineShot,
} from "@/components";

export function DualSliderDemo() {
  const [range, setRange] = React.useState<[number, number]>([20, 80]);
  const [exposure, setExposure] = React.useState<[number, number]>([-0.5, 1.2]);

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <DualSlider label="Levels range" value={range} onValueChange={setRange} min={0} max={100} />
      <DualSlider
        label="Exposure"
        value={exposure}
        onValueChange={setExposure}
        min={-2}
        max={2}
        step={0.1}
      />
    </div>
  );
}

export function ColorPickerDemo() {
  const [color, setColor] = React.useState("#0066FF");

  return (
    <div className="max-w-xs space-y-4">
      <ColorPicker label="Accent color" value={color} onValueChange={setColor} />
      <div
        className="h-16 rounded-xl flex items-center justify-center font-mono text-[10px] uppercase"
        style={{
          background: color,
          color: color === "#FFFFFF" || color === "#E0E0E0" ? "#111" : "#fff",
          fontFamily: "var(--mk-font-mono)",
        }}
      >
        Preview
      </div>
    </div>
  );
}

export function ToolbarDemo() {
  const [active, setActive] = React.useState("select");

  return (
    <div className="flex flex-col gap-5 max-w-md">
      <p className="text-sm leading-relaxed m-0" style={{ color: "var(--mk-text-muted)" }}>
        A strip of tool-mode buttons — like the left rail in Figma or an annotator. Pass{" "}
        <code className="text-xs">icon</code> nodes, or a single-key{" "}
        <code className="text-xs">shortcut</code> shows on the button. Hover for the full label.
      </p>

      <div className="flex flex-col gap-1.5">
        <span
          className="font-mono text-[9px] uppercase tracking-wider"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          Tool modes
        </span>
        <Toolbar
          items={[
            { id: "select", label: "Select", icon: "↖", shortcut: "V", active: active === "select", onClick: () => setActive("select") },
            { id: "draw", label: "Draw", icon: "✎", shortcut: "B", active: active === "draw", onClick: () => setActive("draw") },
            { id: "text", label: "Text", icon: "T", shortcut: "T", active: active === "text", onClick: () => setActive("text") },
            { id: "crop", label: "Crop", icon: "⊡", shortcut: "C", active: active === "crop", onClick: () => setActive("crop") },
          ]}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          className="font-mono text-[9px] uppercase tracking-wider"
          style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
        >
          Vertical · history
        </span>
        <Toolbar
          orientation="vertical"
          items={[
            { id: "undo", label: "Undo", icon: "↩", shortcut: "⌘Z", onClick: () => {} },
            { id: "redo", label: "Redo", icon: "↪", shortcut: "⇧⌘Z", onClick: () => {} },
          ]}
        />
      </div>
    </div>
  );
}

export function DropzoneDemo() {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="max-w-sm">
      <Dropzone
        preview={preview}
        onFileAccept={(file) => {
          if (preview) URL.revokeObjectURL(preview);
          setPreview(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}

export function CompareSliderDemo() {
  return (
    <div className="max-w-lg">
      <CompareSlider
        beforeSrc="https://picsum.photos/seed/minikit-before/800/450"
        afterSrc="https://picsum.photos/seed/minikit-after/800/450"
        beforeLabel="Original"
        afterLabel="Processed"
      />
    </div>
  );
}

export function CanvasFrameDemo() {
  const [zoom, setZoom] = React.useState(1);
  const [bg, setBg] = React.useState<"transparent" | "white" | "custom">("transparent");

  return (
    <div className="max-w-lg space-y-3">
      <SegmentedControl
        items={[
          { value: "transparent", label: "Alpha" },
          { value: "white", label: "White" },
          { value: "custom", label: "Custom" },
        ]}
        value={bg}
        onValueChange={setBg}
      />
      <CanvasFrame zoom={zoom} onZoomChange={setZoom} background={bg} backgroundColor="#1a1a2e">
        <div
          className="w-32 h-32 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0066FF, #9933FF)",
            boxShadow: "0 8px 32px rgba(0,102,255,0.3)",
          }}
        >
          <span className="font-mono text-[10px] text-white uppercase">Output</span>
        </div>
      </CanvasFrame>
    </div>
  );
}

export function ExportButtonDemo() {
  return (
    <ExportButton
      onExport={async (format: ExportFormat) => {
        await new Promise((r) => setTimeout(r, 800));
        if (format === "clipboard") {
          // demo only
          return;
        }
      }}
    />
  );
}

export function ImageToolDemo() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div
      className="flex rounded-xl overflow-hidden w-full max-w-2xl"
      style={{ border: "1px solid var(--mk-border)", height: 420 }}
    >
      <Sidebar title="Image Tool" width={194}>
        <Dropzone
          preview={preview}
          onFileAccept={(file) => {
            if (preview) URL.revokeObjectURL(preview);
            setPreview(URL.createObjectURL(file));
          }}
        />
        <Slider
          label="Bright"
          value={brightness}
          onValueChange={setBrightness}
          min={0}
          max={200}
        />
        <Slider
          label="Contrast"
          value={contrast}
          onValueChange={setContrast}
          min={0}
          max={200}
        />
        <ExportButton
          formats={["png", "clipboard"]}
          onExport={async () => {
            await new Promise((r) => setTimeout(r, 600));
          }}
        />
      </Sidebar>

      <div className="flex-1 p-4 min-w-0" style={{ background: "var(--mk-bg)" }}>
        <CanvasFrame zoom={zoom} onZoomChange={setZoom} label="Output">
          {preview ? (
            <img
              src={preview}
              alt="Edited"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            />
          ) : undefined}
        </CanvasFrame>
      </div>
    </div>
  );
}

const INITIAL_KEYFRAMES: TimelineKeyframe[] = [
  { id: "kf-0", time: 0 },
  { id: "kf-1", time: 1.1 },
  { id: "kf-2", time: 2.4 },
  { id: "kf-3", time: 3.2 },
  { id: "kf-4", time: 4 },
];

export function TimelineDemo() {
  const duration = 4;
  const [currentTime, setCurrentTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [looping, setLooping] = React.useState(true);
  const [keyframes, setKeyframes] = React.useState<TimelineKeyframe[]>(INITIAL_KEYFRAMES);
  const [shots, setShots] = React.useState<TimelineShot[]>([{ id: "1", label: "1" }]);
  const [activeShotId, setActiveShotId] = React.useState("1");
  const rafRef = React.useRef<number | null>(null);
  const lastTickRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current == null) lastTickRef.current = now;
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setCurrentTime((t) => {
        let next = t + delta;
        if (next >= duration) {
          if (looping) next = 0;
          else {
            setPlaying(false);
            return duration;
          }
        }
        return Number(next.toFixed(2));
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, looping, duration]);

  const addKeyframe = () => {
    const exists = keyframes.some((kf) => Math.abs(kf.time - currentTime) < 0.05);
    if (exists) return;
    setKeyframes((prev) =>
      [...prev, { id: `kf-${Date.now()}`, time: currentTime }].sort((a, b) => a.time - b.time),
    );
  };

  return (
    <div className="w-full max-w-3xl">
      <Timeline
        duration={duration}
        currentTime={currentTime}
        onCurrentTimeChange={setCurrentTime}
        keyframes={keyframes}
        onKeyframesChange={setKeyframes}
        shots={shots}
        activeShotId={activeShotId}
        onActiveShotChange={setActiveShotId}
        playing={playing}
        onPlayingChange={setPlaying}
        looping={looping}
        onLoopingChange={setLooping}
        onAddShot={() => {
          const id = String(shots.length + 1);
          setShots((prev) => [...prev, { id, label: id }]);
          setActiveShotId(id);
        }}
        onAddKeyframe={addKeyframe}
        onClearKeyframes={() => setKeyframes([{ id: "kf-0", time: 0 }])}
        onPresets={() => {}}
        onEasing={() => {}}
      />
    </div>
  );
}
