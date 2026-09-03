"use client";

import * as React from "react";
import { cn, clamp } from "@/lib/utils";

export interface TimelineKeyframe {
  id: string;
  time: number;
}

export interface TimelineShot {
  id: string;
  label: string;
}

export interface TimelineProps {
  duration?: number;
  currentTime: number;
  onCurrentTimeChange: (time: number) => void;
  keyframes?: TimelineKeyframe[];
  onKeyframesChange?: (keyframes: TimelineKeyframe[]) => void;
  shots?: TimelineShot[];
  activeShotId?: string;
  onActiveShotChange?: (id: string) => void;
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  looping?: boolean;
  onLoopingChange?: (looping: boolean) => void;
  onAddShot?: () => void;
  onAddKeyframe?: () => void;
  onClearKeyframes?: () => void;
  onPresets?: () => void;
  onEasing?: () => void;
  showControls?: boolean;
  className?: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const whole = Math.floor(secs);
  const frac = Math.round((secs - whole) * 100);
  return `${String(mins).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${String(frac).padStart(2, "0")}`;
}

function timeToPct(time: number, duration: number) {
  if (duration <= 0) return 0;
  return clamp((time / duration) * 100, 0, 100);
}

function pctToTime(pct: number, duration: number) {
  return clamp((pct / 100) * duration, 0, duration);
}

function ToolbarBtn({
  children,
  onClick,
  active,
  accent,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  accent?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-7 px-2.5 rounded-md font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-85 shrink-0",
        className,
      )}
      style={{
        fontFamily: "var(--mk-font-mono)",
        background: accent
          ? "var(--mk-timeline-accent, #e8722a)"
          : active
            ? "color-mix(in srgb, var(--mk-text) 12%, transparent)"
            : "color-mix(in srgb, var(--mk-text) 6%, transparent)",
        color: accent ? "#111" : active ? "var(--mk-text)" : "var(--mk-text-muted)",
        border: active && !accent ? "1px solid var(--mk-timeline-accent, #e8722a)" : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

function IconBtn({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-7 w-7 flex items-center justify-center rounded-md cursor-pointer transition-opacity hover:opacity-85 shrink-0"
      style={{
        background: active ? "color-mix(in srgb, var(--mk-text) 12%, transparent)" : "color-mix(in srgb, var(--mk-text) 6%, transparent)",
        color: active ? "var(--mk-text)" : "var(--mk-text-muted)",
      }}
    >
      {children}
    </button>
  );
}

export function Timeline({
  duration = 4,
  currentTime,
  onCurrentTimeChange,
  keyframes = [],
  onKeyframesChange,
  shots = [{ id: "1", label: "1" }],
  activeShotId,
  onActiveShotChange,
  playing = false,
  onPlayingChange,
  looping = false,
  onLoopingChange,
  onAddShot,
  onAddKeyframe,
  onClearKeyframes,
  onPresets,
  onEasing,
  showControls = true,
  className,
}: TimelineProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef<"playhead" | string | null>(null);
  const keyframesRef = React.useRef(keyframes);
  const onKeyframesChangeRef = React.useRef(onKeyframesChange);
  keyframesRef.current = keyframes;
  onKeyframesChangeRef.current = onKeyframesChange;
  const activeShot = activeShotId ?? shots[0]?.id;

  const seekFromClientX = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current || duration <= 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      onCurrentTimeChange(Number(pctToTime((x / rect.width) * 100, duration).toFixed(2)));
    },
    [duration, onCurrentTimeChange],
  );

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (draggingRef.current === "playhead") {
        seekFromClientX(e.clientX);
        return;
      }
      if (!trackRef.current || duration <= 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left, 0, rect.width);
      const time = Number(pctToTime((x / rect.width) * 100, duration).toFixed(2));
      const id = draggingRef.current;
      const onChange = onKeyframesChangeRef.current;
      if (!onChange) return;
      onChange(
        keyframesRef.current
          .map((kf) => (kf.id === id ? { ...kf, time } : kf))
          .sort((a, b) => a.time - b.time),
      );
    };

    const onUp = () => {
      draggingRef.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [duration, seekFromClientX]);

  const playheadPct = timeToPct(currentTime, duration);
  const tickCount = Math.min(Math.ceil(duration), 12);

  return (
    <div
      className={cn("rounded-xl border overflow-hidden select-none", className)}
      style={{
        background: "var(--mk-surface)",
        borderColor: "var(--mk-border)",
        ["--mk-timeline-accent" as string]: "#e8722a",
      }}
    >
      {showControls && (
        <div
          className="flex items-center gap-2 px-3 py-2 border-b overflow-x-auto"
          style={{ borderColor: "var(--mk-border)", background: "color-mix(in srgb, var(--mk-text) 3%, transparent)" }}
        >
          <ToolbarBtn onClick={() => {}}>&lt; Sequence</ToolbarBtn>

          <div className="flex items-center gap-1">
            {shots.map((shot) => (
              <ToolbarBtn
                key={shot.id}
                active={shot.id === activeShot}
                onClick={() => onActiveShotChange?.(shot.id)}
              >
                {shot.label}
              </ToolbarBtn>
            ))}
            {onAddShot && <ToolbarBtn onClick={onAddShot}>+ Add shot</ToolbarBtn>}
          </div>

          <div
            className="w-px h-5 shrink-0 mx-0.5"
            style={{ background: "var(--mk-border)" }}
          />

          <span
            className="font-mono text-[10px] tabular-nums shrink-0"
            style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <span
            className="inline-flex items-center gap-1 font-mono text-[10px] shrink-0 px-2 py-1 rounded-md"
            style={{
              color: "var(--mk-text-faint)",
              background: "color-mix(in srgb, var(--mk-text) 5%, transparent)",
              fontFamily: "var(--mk-font-mono)",
            }}
          >
            <ClockIcon />
            {duration}s
          </span>

          <div className="flex items-center gap-0.5">
            <IconBtn label="Go to start" onClick={() => onCurrentTimeChange(0)}>
              <SkipStartIcon />
            </IconBtn>
            <IconBtn label={playing ? "Pause" : "Play"} active={playing} onClick={() => onPlayingChange?.(!playing)}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </IconBtn>
            <IconBtn label="Loop" active={looping} onClick={() => onLoopingChange?.(!looping)}>
              <LoopIcon />
            </IconBtn>
          </div>

          <div
            className="w-px h-5 shrink-0 mx-0.5"
            style={{ background: "var(--mk-border)" }}
          />

          {onPresets && <ToolbarBtn onClick={onPresets}>Presets ▾</ToolbarBtn>}
          {onEasing && (
            <ToolbarBtn onClick={onEasing}>
              <span className="inline-flex items-center gap-1">
                <EasingIcon />
                Easing
              </span>
            </ToolbarBtn>
          )}
          {onAddKeyframe && (
            <ToolbarBtn accent onClick={onAddKeyframe}>
              + Add KF
            </ToolbarBtn>
          )}

          <div className="flex-1 min-w-2" />

          {onClearKeyframes && <ToolbarBtn onClick={onClearKeyframes}>Clear all KF</ToolbarBtn>}
        </div>
      )}

      <div className="px-4 pt-3 pb-4">
        {/* Ruler */}
        <div className="relative h-5 mb-1">
          <div className="absolute inset-x-0 bottom-0 flex justify-between pointer-events-none">
            {Array.from({ length: tickCount + 1 }, (_, i) => {
              const t = (i / tickCount) * duration;
              return (
                <span
                  key={i}
                  className="font-mono text-[9px] -translate-x-1/2 first:translate-x-0 last:translate-x-[-100%]"
                  style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
                >
                  {Number.isInteger(t) ? `${t}s` : `${t.toFixed(1)}s`}
                </span>
              );
            })}
          </div>

          {/* Playhead marker on ruler */}
          <div
            className="absolute top-0 bottom-0 w-0 pointer-events-none"
            style={{ left: `${playheadPct}%`, transform: "translateX(-50%)" }}
          >
            <div
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "5px solid var(--mk-timeline-accent, #e8722a)",
              }}
            />
          </div>
        </div>

        {/* Sub ticks */}
        <div className="relative h-2 mb-2 flex items-end">
          {Array.from({ length: tickCount * 4 + 1 }, (_, i) => (
            <div
              key={i}
              className="flex-1 flex justify-center"
            >
              <div
                className="w-px"
                style={{
                  height: i % 4 === 0 ? 0 : 4,
                  background: "color-mix(in srgb, var(--mk-text) 15%, transparent)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-9 rounded-full cursor-pointer"
          style={{ background: "color-mix(in srgb, var(--mk-text) 8%, transparent)" }}
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).dataset.keyframe) return;
            draggingRef.current = "playhead";
            seekFromClientX(e.clientX);
          }}
        >
          {/* Path line */}
          <div
            className="absolute top-1/2 left-3 right-3 h-0.5 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ background: "var(--mk-timeline-accent, #e8722a)" }}
          />

          {/* Playhead line */}
          <div
            className="absolute top-0 bottom-0 w-px pointer-events-none"
            style={{
              left: `${playheadPct}%`,
              background: "var(--mk-timeline-accent, #e8722a)",
              opacity: 0.5,
            }}
          />

          {/* Keyframes */}
          {keyframes.map((kf) => {
            const pct = timeToPct(kf.time, duration);
            return (
              <button
                key={kf.id}
                type="button"
                data-keyframe={kf.id}
                aria-label={`Keyframe at ${formatTime(kf.time)}`}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 rounded-[1px] cursor-grab active:cursor-grabbing border z-10"
                style={{
                  left: `${pct}%`,
                  background: "var(--mk-text)",
                  borderColor: "color-mix(in srgb, var(--mk-text) 30%, transparent)",
                  boxShadow: "0 0 0 1px color-mix(in srgb, var(--mk-text) 20%, transparent)",
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  draggingRef.current = kf.id;
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <path d="M2 1.5L8.5 5 2 8.5V1.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <rect x="2" y="1.5" width="2" height="7" rx="0.5" />
      <rect x="6" y="1.5" width="2" height="7" rx="0.5" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M3.5 4H2.5a3.5 3.5 0 0 0 0 7h1" strokeLinecap="round" />
      <path d="M8.5 8H9.5a3.5 3.5 0 0 0 0-7h-1" strokeLinecap="round" />
      <path d="M2 2.5L2.5 4 4 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9.5L9.5 8 8 8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkipStartIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <rect x="1.5" y="1.5" width="1.5" height="7" rx="0.3" />
      <path d="M4 1.5L8.5 5 4 8.5V1.5Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <circle cx="5" cy="5" r="3.5" />
      <path d="M5 3.2V5l1.4 1.4" strokeLinecap="round" />
    </svg>
  );
}

function EasingIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M1.5 8.5C1.5 8.5 3 3 5 3s3.5 5.5 3.5 5.5" strokeLinecap="round" />
    </svg>
  );
}
