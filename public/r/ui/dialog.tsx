"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { mk } from "@/lib/mk-styles";
import { ChromeIconButton } from "@/components/chrome-icon-button";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-4 mk-ring-float"
          style={{ background: "var(--mk-surface)", borderColor: "var(--mk-border)" }}
        >
          <DialogPrimitive.Title className="font-mono text-sm font-semibold m-0" style={mk.mono}>
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="text-xs mt-1.5 mb-3" style={{ color: "var(--mk-text-muted)" }}>
              {description}
            </DialogPrimitive.Description>
          )}
          {children && <div className="my-3">{children}</div>}
          {footer && <div className="flex justify-end gap-2 mt-4">{footer}</div>}
          <DialogPrimitive.Close asChild>
            <ChromeIconButton aria-label="Close dialog" className="absolute top-2 right-2">
              ✕
            </ChromeIconButton>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
