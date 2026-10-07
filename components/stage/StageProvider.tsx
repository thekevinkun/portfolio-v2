"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { COOLDOWN_MS, FALLBACK_PADDING_MS } from "@/lib/stage/config";
import { readBounceDurationMs, readPageDurationMs } from "@/lib/stage/motion";
import { createInitialState, stageReducer } from "@/lib/stage/reducer";
import { StageContext } from "@/lib/stage/stage-context";
import type { StageAction, StagePhase, StageSource } from "@/types/stage";

// What ends each busy phase, and when. A transition normally ends on transitionend,
// so its timer is only the fallback; a bounce has no DOM event, so its timer is the end.
function getPhaseTimer(
  phase: StagePhase,
): { delay: number; action: StageAction } | null {
  switch (phase) {
    case "transitioning":
      return {
        delay: readPageDurationMs() + FALLBACK_PADDING_MS,
        action: { type: "TRANSITION_END" },
      };
    case "bouncing":
      return { delay: readBounceDurationMs(), action: { type: "BOUNCE_END" } };
    case "cooldown":
      return { delay: COOLDOWN_MS, action: { type: "COOLDOWN_END" } };
    case "idle":
      return null;
  }
}

interface StageProviderProps {
  initialIndex: number;
  children: ReactNode;
}

const StageProvider = ({ initialIndex, children }: StageProviderProps) => {
  const [state, dispatch] = useReducer(
    stageReducer,
    initialIndex,
    createInitialState,
  );

  const goTo = useCallback(
    (index: number, source: StageSource) =>
      dispatch({ type: "GO_TO", index, source }),
    [],
  );
  const step = useCallback(
    (delta: 1 | -1, source: StageSource) =>
      dispatch({ type: "STEP", delta, source }),
    [],
  );
  const endTransition = useCallback(
    () => dispatch({ type: "TRANSITION_END" }),
    [],
  );

  // Re-arms on retarget (index change) as well as on every phase change
  useEffect(() => {
    const timer = getPhaseTimer(state.phase);
    if (!timer) return;
    const id = window.setTimeout(() => dispatch(timer.action), timer.delay);
    return () => window.clearTimeout(id);
  }, [state.phase, state.index]);

  const value = useMemo(
    () => ({ state, goTo, step, endTransition }),
    [state, goTo, step, endTransition],
  );

  return <StageContext value={value}>{children}</StageContext>;
};

export default StageProvider;
