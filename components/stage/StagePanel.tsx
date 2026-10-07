"use client";

import type { ReactNode } from "react";
import { useStage } from "@/lib/stage/stage-context";

interface StagePanelProps {
  id: string;
  index: number;
  children: ReactNode;
}

// Attributes are the only contract with the CSS in globals.css:
//   data-state     active (target) | outgoing (page being left) | idle
//   data-side      the side this page arrives from (or would arrive from)
//   data-direction travel direction of the last move
//   data-animate   present once the first move happened (no effects on page load)
const StagePanel = ({ id, index, children }: StagePanelProps) => {
  const { state } = useStage();

  // Target is interactive at once; the page we leave stays live until the move ends
  const isTarget = index === state.index;
  const isLeaving = state.phase === "transitioning" && index === state.from;
  const panelState = isTarget ? "active" : isLeaving ? "outgoing" : "idle";

  // The target keeps the side of the move that brought it here, so the shadow
  // stays on one edge while it fades. Other pages sit on their natural side.
  const side = isTarget
    ? state.direction === -1
      ? "before"
      : "after"
    : index > state.index
      ? "after"
      : "before";

  const direction =
    state.direction === 1 ? "next" : state.direction === -1 ? "prev" : "none";

  return (
    <section
      id={`panel-${id}`}
      aria-labelledby={`heading-${id}`}
      inert={!isTarget && !isLeaving}
      data-stage-panel
      data-state={panelState}
      data-side={side}
      data-direction={direction}
      data-animate={state.source === "initial" ? undefined : ""}
      className="group relative h-full w-full shrink-0 data-[state=active]:z-10"
    >
      <div data-stage-layer className="h-full w-full">
        {children}
      </div>
      {/* Soft shadow on the leading edge; invisible at rest, animated in globals.css */}
      <span
        aria-hidden="true"
        data-stage-shadow
        className="pointer-events-none absolute inset-y-0 w-24 from-canvas to-transparent opacity-0 group-data-[side=after]:right-full group-data-[side=after]:bg-linear-to-l group-data-[side=before]:left-full group-data-[side=before]:bg-linear-to-r"
      />
    </section>
  );
};

export default StagePanel;
