"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mk } from "@/lib/mk-styles";

export interface LayerItem {
  id: string;
  name: string;
  visible?: boolean;
  locked?: boolean;
}

export interface LayerListProps {
  layers: LayerItem[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  onToggleVisible?: (id: string) => void;
  onToggleLocked?: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

export function LayerList({
  layers,
  activeId,
  onActiveChange,
  onToggleVisible,
  onToggleLocked,
  onReorder,
  className,
}: LayerListProps) {
  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= layers.length) return;
    onReorder?.(index, next);
  };

  return (
    <div className={cn("mk-layer-list flex flex-col gap-0.5", className)}>
      {layers.map((layer, index) => {
        const active = activeId === layer.id;
        return (
          <div
            key={layer.id}
            role="button"
            tabIndex={0}
            onClick={() => onActiveChange?.(layer.id)}
            onKeyDown={(e) => e.key === "Enter" && onActiveChange?.(layer.id)}
            className={cn(
              "flex items-center gap-1.5 h-8 px-2 rounded-lg cursor-pointer transition-colors",
              active && "ring-1 ring-inset",
            )}
            style={{
              ...mk.surface(active ? 10 : 4),
              boxShadow: active ? "inset 0 0 0 1px var(--mk-text-faint)" : undefined,
            }}
          >
            <button
              type="button"
              className="text-[10px] opacity-50 hover:opacity-80 w-4"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisible?.(layer.id);
              }}
            >
              {layer.visible !== false ? "◉" : "○"}
            </button>
            <span className="flex-1 truncate font-mono text-[10px] uppercase tracking-wide" style={mk.label}>
              {layer.name}
            </span>
            {onToggleLocked && (
              <button
                type="button"
                className="text-[9px] opacity-40 hover:opacity-70"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLocked(layer.id);
                }}
              >
                {layer.locked ? "🔒" : "🔓"}
              </button>
            )}
            {onReorder && (
              <div className="flex flex-col -my-1">
                <button type="button" className="text-[8px] leading-none opacity-40 hover:opacity-70" onClick={(e) => { e.stopPropagation(); move(index, -1); }}>▲</button>
                <button type="button" className="text-[8px] leading-none opacity-40 hover:opacity-70" onClick={(e) => { e.stopPropagation(); move(index, 1); }}>▼</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
