"use client";

import { useStageWheel } from "@/lib/stage/useStageWheel";

// Mounts every Stage input hook in one place; keys and swipe join in P2.4.
const StageInputs = () => {
  useStageWheel();
  return null;
};

export default StageInputs;
