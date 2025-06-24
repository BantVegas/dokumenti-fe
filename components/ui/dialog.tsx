"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

// Forwarduj className a ostatné HTML props
interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({ children, className = "", ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-white rounded-2xl shadow-xl max-w-2xl w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6",
          className
        )}
        {...props}
      >
        {/* Povinný nadpis pre prístupnosť */}
        <DialogPrimitive.Title className="sr-only">
          Detail analýzy
        </DialogPrimitive.Title>

        {children}

        <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X className="w-5 h-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-xl font-bold text-gray-900">{children}</h2>
);
