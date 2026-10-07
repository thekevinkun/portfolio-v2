"use client";

import type { SectionId } from "@/types/stage";
import { SECTIONS } from "./sections";
import { useStage } from "./stage-context";

// The Stage decides the active page, so the dock follows every input
// (wheel, keys, swipe, click). Must be used inside <StageProvider>.
export function useActiveSection(): SectionId {
  const { state } = useStage();
  return SECTIONS[state.index]?.id ?? "overview";
}
