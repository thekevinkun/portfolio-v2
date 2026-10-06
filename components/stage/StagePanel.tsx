"use client";

import type { ReactNode } from "react";
import { useStage } from "@/lib/stage/stage-context";

interface StagePanelProps {
  id: string;
  index: number;
  children: ReactNode;
}

const StagePanel = ({ id, index, children }: StagePanelProps) => {
  const { state } = useStage();

  // Target is interactive at once; the page we leave stays live until the move ends
  const isTarget = index === state.index;
  const isLeaving = state.phase === "transitioning" && index === state.from;

  return (
    <section
      id={`panel-${id}`}
      aria-labelledby={`heading-${id}`}
      inert={!isTarget && !isLeaving}
      className="h-full w-full shrink-0"
    >
      {children}
    </section>
  );
};

export default StagePanel;
