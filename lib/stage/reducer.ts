import type { StageAction, StageSource, StageState } from "@/types/stage";
import { SECTION_COUNT } from "./config";

const GESTURE_SOURCES: readonly StageSource[] = ["wheel", "swipe"];

export function createInitialState(index: number): StageState {
  return {
    index,
    from: index,
    direction: 0,
    phase: "idle",
    source: "initial",
    bounce: 0,
    seen: [],
  };
}

function moveTo(
  state: StageState,
  target: number,
  source: StageSource,
): StageState {
  // D23: gestures wait for idle; keyboard and dock may retarget mid-flight
  if (GESTURE_SOURCES.includes(source) && state.phase !== "idle") return state;

  const index = Math.min(Math.max(target, 0), SECTION_COUNT - 1);
  if (index === state.index) return state;

  // The page being left has had its entrance (D58)
  const seen = state.seen.includes(state.index)
    ? state.seen
    : [...state.seen, state.index];

  return {
    index,
    from: state.index,
    direction: index > state.index ? 1 : -1,
    phase: "transitioning",
    source,
    bounce: 0,
    seen,
  };
}

// Pushing past the first or last page springs back instead of moving.
// Only while the track is still, so it never fights a running transition.
function bounceAtEdge(state: StageState, delta: 1 | -1): StageState {
  if (state.phase !== "idle") return state;
  return { ...state, phase: "bouncing", bounce: delta };
}

export function stageReducer(
  state: StageState,
  action: StageAction,
): StageState {
  switch (action.type) {
    case "GO_TO":
      return moveTo(state, action.index, action.source);
    case "STEP": {
      const target = state.index + action.delta;
      if (target < 0 || target > SECTION_COUNT - 1) {
        return bounceAtEdge(state, action.delta);
      }
      return moveTo(state, target, action.source);
    }
    case "TRANSITION_END":
      return state.phase === "transitioning"
        ? { ...state, phase: "cooldown" }
        : state;
    case "BOUNCE_END":
      return state.phase === "bouncing"
        ? { ...state, phase: "cooldown", bounce: 0 }
        : state;
    case "COOLDOWN_END":
      return state.phase === "cooldown" ? { ...state, phase: "idle" } : state;
  }
}
