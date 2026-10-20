"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OverlayPhase } from "@/types/overlay";
import { OVERLAY_CLOSE_PADDING_MS } from "./config";
import { readLightboxDurationMs } from "./motion";

interface UseLightboxOptions {
  count: number;
  // False while the details overlay itself is closing: the viewer closes with it
  active: boolean;
  // Called after the viewer closed, with the screenshot it ended on
  onClosed: (index: number) => void;
}

// State of the screenshot viewer, a second native <dialog> above the details
// overlay. Same phases as the overlay: only "open" is visible, so opening and
// closing play one CSS transition. It adds no history entry: Back closes the
// details overlay and the viewer with it.
export function useLightbox({ count, active, onClosed }: UseLightboxOptions) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<OverlayPhase>("closed");
  // Mirrors for the effect and the timer, so they never read stale state
  const indexRef = useRef(0);
  const shown = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), count - 1);
      indexRef.current = clamped;
      setIndex(clamped);
    },
    [count],
  );

  const openAt = useCallback((at: number) => {
    window.clearTimeout(timer.current);
    shown.current = true;
    indexRef.current = at;
    setIndex(at);
    setPhase("opening");
  }, []);

  const close = useCallback(() => {
    if (!shown.current) return;
    setPhase("closing");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      shown.current = false;
      setPhase("closed");
    }, readLightboxDurationMs() + OVERLAY_CLOSE_PADDING_MS);
  }, []);

  // When the details overlay closes, the viewer closes at once with it
  const shownPhase: OverlayPhase = active ? phase : "closed";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (shownPhase === "opening") {
      if (!dialog.open) dialog.showModal();
      // One layout read, so the closed styles are computed before "open"
      void dialog.offsetWidth;
      const frame = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(frame);
    }

    if (shownPhase === "closed" && dialog.open) {
      dialog.close();
      if (active) onClosed(indexRef.current);
    }
  }, [shownPhase, active, onClosed]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { dialogRef, index, phase: shownPhase, openAt, close, goTo };
}
