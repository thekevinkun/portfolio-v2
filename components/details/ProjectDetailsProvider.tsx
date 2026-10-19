"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ProjectDetailsOverlay from "./ProjectDetailsOverlay";
import {
  HISTORY_BACK_FALLBACK_MS,
  OVERLAY_CLOSE_PADDING_MS,
} from "@/lib/details/config";
import { DetailsContext } from "@/lib/details/details-context";
import {
  clearDetailsMarker,
  pushDetailsMarker,
  readDetailsMarker,
} from "@/lib/details/history";
import { readOverlayDurationMs } from "@/lib/details/motion";
import { lockStage, unlockStage } from "@/lib/stage/modal-guard";
import type { OverlayPhase } from "@/types/overlay";
import type { ProjectDetailsEntry } from "@/types/projects";

interface ProjectDetailsProviderProps {
  entries: ProjectDetailsEntry[];
  children: ReactNode;
}

// Owns the project details overlay (D114): the open slug, the animation phase,
// the history entry (D116) and the Stage lock (D117). Anything inside can open
// it through useProjectDetails().
const ProjectDetailsProvider = ({
  entries,
  children,
}: ProjectDetailsProviderProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [phase, setPhase] = useState<OverlayPhase>("closed");
  const closeTimer = useRef<number | undefined>(undefined);
  // True from show() until the close has finished
  const shown = useRef(false);
  // Mirror of the entries, so the popstate listener is attached once
  const slugs = useRef<ReadonlySet<string>>(new Set());

  useEffect(() => {
    slugs.current = new Set(entries.map((entry) => entry.slug));
  }, [entries]);

  const show = useCallback((next: string) => {
    window.clearTimeout(closeTimer.current);
    shown.current = true;
    setSlug(next);
    setPhase("opening");
  }, []);

  // Fades out, then lets the lifecycle effect close the dialog
  const hide = useCallback(() => {
    if (!shown.current) return;
    setPhase("closing");
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      shown.current = false;
      setPhase("closed");
      setSlug(null);
    }, readOverlayDurationMs() + OVERLAY_CLOSE_PADDING_MS);
  }, []);

  const open = useCallback(
    (next: string) => {
      if (!slugs.current.has(next)) return;
      pushDetailsMarker(next);
      show(next);
    },
    [show],
  );

  const close = useCallback(() => {
    // Without a history entry there is nothing to go back to
    if (readDetailsMarker() === null) {
      hide();
      return;
    }
    // Back fires popstate, which closes the overlay. If it never does, close
    // anyway so the buttons can't be dead.
    window.history.back();
    window.setTimeout(() => {
      if (readDetailsMarker() === null) return;
      clearDetailsMarker();
      hide();
    }, HISTORY_BACK_FALLBACK_MS);
  }, [hide]);

  // Back closes the overlay; Forward opens it again while its marker is there
  useEffect(() => {
    const onPopState = () => {
      const marked = readDetailsMarker();
      if (marked !== null && slugs.current.has(marked)) show(marked);
      else hide();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [show, hide]);

  // A reload while the overlay was open keeps its marker on this entry
  useEffect(() => {
    clearDetailsMarker();
  }, []);

  // The dialog follows the phase: opening shows it (after one layout read, so
  // the closed styles are computed first), closed hides it and frees the Stage
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (phase === "opening") {
      lockStage();
      if (!dialog.open) dialog.showModal();
      void dialog.offsetWidth;
      const frame = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(frame);
    }

    if (phase === "closed") {
      if (dialog.open) dialog.close();
      unlockStage();
    }
  }, [phase]);

  const value = useMemo(() => ({ open, close }), [open, close]);
  const entry = entries.find((item) => item.slug === slug) ?? null;

  return (
    <DetailsContext value={value}>
      {children}
      <ProjectDetailsOverlay
        dialogRef={dialogRef}
        entry={entry}
        phase={phase}
        onClose={close}
      />
    </DetailsContext>
  );
};

export default ProjectDetailsProvider;
