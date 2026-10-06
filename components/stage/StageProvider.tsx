"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { COOLDOWN_MS, FALLBACK_PADDING_MS } from "@/lib/stage/config";
import { readPageDurationMs } from "@/lib/stage/motion";
import { createInitialState, stageReducer } from "@/lib/stage/reducer";
import { StageContext } from "@/lib/stage/stage-context";
import type { StageSource } from "@/types/stage";

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

  // Cooldown always needs a timer. The transition timer is only a fallback for
  // when transitionend never fires (hidden tab). Re-arms on retarget (index change).
  useEffect(() => {
    if (state.phase === "idle") return;
    const isTransition = state.phase === "transitioning";
    const delay = isTransition
      ? readPageDurationMs() + FALLBACK_PADDING_MS
      : COOLDOWN_MS;
    const id = window.setTimeout(
      () =>
        dispatch({ type: isTransition ? "TRANSITION_END" : "COOLDOWN_END" }),
      delay,
    );
    return () => window.clearTimeout(id);
  }, [state.phase, state.index]);

  const value = useMemo(
    () => ({ state, goTo, step, endTransition }),
    [state, goTo, step, endTransition],
  );

  return <StageContext value={value}>{children}</StageContext>;
};

export default StageProvider;
