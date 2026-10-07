"use client";

import type { ReactNode, TransitionEvent } from "react";
import { useStage } from "@/lib/stage/stage-context";

interface StageTrackProps {
  children: ReactNode;
}

// Five panels side by side; a page change is one translate3d on this element.
// The edge bounce animates the separate `translate` property (see globals.css),
// so it never fights the page-turn transition.
const StageTrack = ({ children }: StageTrackProps) => {
  const { state, endTransition } = useStage();

  // Ignore bubbled events from children; only the track's own transform counts
  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === "transform") {
      endTransition();
    }
  };

  const bounce =
    state.phase === "bouncing"
      ? state.bounce === 1
        ? "next"
        : "prev"
      : undefined;

  return (
    <div
      data-stage-track
      data-phase={state.phase}
      data-bounce={bounce}
      className="flex h-full w-full transition-transform duration-(--duration-page) ease-out-expo data-[phase=transitioning]:will-change-transform"
      style={{ transform: `translate3d(${-state.index * 100}%, 0, 0)` }}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
};

export default StageTrack;
