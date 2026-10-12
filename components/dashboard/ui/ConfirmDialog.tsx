"use client";

import { useId, useRef, type MouseEvent, type ReactNode } from "react";
import { Button } from "@/components/ui";

interface ConfirmDialogProps {
  triggerLabel: string;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void | Promise<void>;
}

// Delete confirmation on the native <dialog>: focus trap, Esc and focus
// return come from the browser. m-auto because preflight zeroes dialog margins.
const ConfirmDialog = ({
  triggerLabel,
  title,
  description,
  confirmLabel = "Delete",
  pending = false,
  onConfirm,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const close = () => dialogRef.current?.close();

  // The dialog has no padding of its own, so a click that lands on the
  // dialog element itself is a click on the backdrop
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const confirm = async () => {
    try {
      await onConfirm();
    } finally {
      close();
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="border-danger/40 text-danger hover:border-danger"
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={handleBackdropClick}
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-card border border-glass-border bg-obsidian p-0 text-fg-high shadow-glass-card backdrop:bg-black/70"
      >
        <div className="space-y-4 p-6">
          <h2 id={titleId} className="text-lg font-bold text-fg-high">
            {title}
          </h2>
          <div className="text-sm text-fg-low">{description}</div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-danger hover:shadow-none"
              disabled={pending}
              onClick={confirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmDialog;
