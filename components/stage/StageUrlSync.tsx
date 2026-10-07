"use client";

import { useStageUrl } from "@/lib/stage/useStageUrl";

// Mounts the URL sync once, inside the provider
const StageUrlSync = () => {
  useStageUrl();
  return null;
};

export default StageUrlSync;
