"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogContent({
  className,
  children,
  side = "center",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "center" | "right" | "top" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-[fade-in_120ms_ease-out]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 rounded-xl border border-line-strong bg-surface shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] focus:outline-none",
          side === "center" && "left-1/2 top-[12vh] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2",
          side === "top" && "inset-x-3 top-3 sm:left-1/2 sm:top-[10vh] sm:w-[640px] sm:-translate-x-1/2",
          side === "right" && "inset-y-0 right-0 w-[min(380px,100vw)] rounded-none border-y-0 border-r-0",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-2 top-2 grid size-9 place-items-center rounded-md text-fg-2 hover:bg-surface-2 hover:text-fg" aria-label="Cerrar">
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
