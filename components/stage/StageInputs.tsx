"use client";

import { useStageKeys } from "@/lib/stage/useStageKeys";
import { useStageSwipe } from "@/lib/stage/useStageSwipe";
import { useStageWheel } from "@/lib/stage/useStageWheel";

// Mounts every Stage input hook in one place.
const StageInputs = () => {
  useStageWheel();
  useStageKeys();
  useStageSwipe();
  return null;
};

export default StageInputs;
