"use client";

import { useStageUrl } from "@/lib/stage/useStageUrl";

interface StageUrlSyncProps {
  titles: readonly string[];
}

// Mounts the URL sync once, inside the provider
const StageUrlSync = ({ titles }: StageUrlSyncProps) => {
  useStageUrl(titles);
  return null;
};

export default StageUrlSync;
