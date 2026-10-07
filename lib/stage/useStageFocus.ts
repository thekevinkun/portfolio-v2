"use client";

import { useEffect, useRef } from "react";
import type { StageSource } from "@/types/stage";
import { SECTIONS } from "./sections";
import { useStage } from "./stage-context";

// Inputs that are about the keyboard or an explicit pick always bring focus along
const FOCUS_SOURCES: readonly StageSource[] = ["keyboard", "dock"];

// After a page turn, focus moves to the new page's heading. Wheel and swipe leave
// focus alone, unless it sits inside a page (the page we leave becomes inert, which
// would drop focus to <body>). Panels give their heading the id heading-<section id>.
export function useStageFocus(): void {
  const { state } = useStage();
  const { index, source, phase } = state;

  const pendingRef = useRef(false);
  const prevPhaseRef = useRef(phase);

  // A move started or retargeted: decide now, while the old page is still live
  useEffect(() => {
    if (source === "initial") return;
    const active = document.activeElement;
    const insidePage =
      active instanceof Element &&
      active.closest("[data-stage-panel]") !== null;
    if (insidePage || FOCUS_SOURCES.includes(source)) pendingRef.current = true;
  }, [index, source]);

  // The move ended: focus the heading of the page we landed on
  useEffect(() => {
    const wasPhase = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (wasPhase !== "transitioning" || phase !== "cooldown") return;
    if (!pendingRef.current) return;
    pendingRef.current = false;

    const section = SECTIONS[index];
    const heading = section
      ? document.getElementById(`heading-${section.id}`)
      : null;
    if (!heading) return;

    // Headings are not focusable by default; -1 makes them a programmatic target only
    if (!heading.hasAttribute("tabindex"))
      heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }, [phase, index]);
}
