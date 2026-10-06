import type { StageAction, StageSource, StageState } from "@/types/stage";
import { SECTION_COUNT } from "./config";

const GESTURE_SOURCES: readonly StageSource[] = ["wheel", "swipe"];

export function createInitialState(index: number): StageState {
  return { index, from: index, direction: 0, phase: "idle", source: "initial" };
}

function moveTo(
  state: StageState,
  target: number,
  source: StageSource,
): StageState {
  // D23: gestures wait for idle; keyboard and dock may retarget mid-flight
  if (GESTURE_SOURCES.includes(source) && state.phase !== "idle") return state;

  const index = Math.min(Math.max(target, 0), SECTION_COUNT - 1);
  if (index === state.index) return state; // edge or same page: bounce comes in P2.6

  return {
    index,
    from: state.index,
    direction: index > state.index ? 1 : -1,
    phase: "transitioning",
    source,
  };
}

export function stageReducer(
  state: StageState,
  action: StageAction,
): StageState {
  switch (action.type) {
    case "GO_TO":
      return moveTo(state, action.index, action.source);
    case "STEP":
      return moveTo(state, state.index + action.delta, action.source);
    case "TRANSITION_END":
      return state.phase === "transitioning"
        ? { ...state, phase: "cooldown" }
        : state;
    case "COOLDOWN_END":
      return state.phase === "cooldown" ? { ...state, phase: "idle" } : state;
  }
}
