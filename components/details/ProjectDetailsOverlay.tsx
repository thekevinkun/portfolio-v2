import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useId, type RefObject } from "react";
import { Button } from "@/components/ui";
import type { OverlayPhase } from "@/types/overlay";
import type { ProjectDetailsEntry } from "@/types/projects";

// The content (screenshots, viewer, video) is not needed to show the pages, so
// it loads as its own chunk; the provider fetches it when the browser is idle
const ProjectDetailsContent = dynamic(() => import("./ProjectDetailsContent"));

interface ProjectDetailsOverlayProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  // Null while closed
  entry: ProjectDetailsEntry | null;
  phase: OverlayPhase;
  onClose: () => void;
}

// The native <dialog>: top layer, focus trap and inert page come from the
// browser. No display utility on it, or it would stay visible when closed.
// The scroller carries data-stage-scroll (D117) and takes focus so the
// keyboard can scroll it.
const ProjectDetailsOverlay = ({
  dialogRef,
  entry,
  phase,
  onClose,
}: ProjectDetailsOverlayProps) => {
  const titleId = useId();

  return (
    <dialog
      ref={dialogRef}
      data-details-overlay
      data-state={phase}
      aria-labelledby={titleId}
      // Esc goes through our close so the history entry is handled (D116).
      // A dialog inside this one (the screenshot viewer) handles its own Esc.
      onCancel={(event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-obsidian p-0 text-fg-high outline-none"
    >
      {entry ? (
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-glass-border px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:px-12">
            <p className="font-mono text-[11px] tracking-widest text-fg-low uppercase">
              Project details
            </p>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Close project details"
              className="gap-1.5"
              onClick={onClose}
            >
              <X className="size-4" aria-hidden />
              Close
            </Button>
          </header>
          <div
            data-stage-scroll
            tabIndex={0}
            aria-label={`${entry.title} details`}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:px-12 md:py-10"
          >
            <ProjectDetailsContent
              key={entry.slug}
              entry={entry}
              titleId={titleId}
              active={phase === "opening" || phase === "open"}
            />
          </div>
        </div>
      ) : null}
    </dialog>
  );
};

export default ProjectDetailsOverlay;
