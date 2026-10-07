"use client";

import { useStageKeys } from "@/lib/stage/useStageKeys";
import { useStageWheel } from "@/lib/stage/useStageWheel";

// Mounts every Stage input hook in one place; swipe joins in the next commit.
const StageInputs = () => {
  useStageWheel();
  useStageKeys();
  return null;
};

export default StageInputs;
