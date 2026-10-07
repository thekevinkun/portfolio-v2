import {
  WHEEL_LOCK_CAP_MS,
  WHEEL_NEW_GESTURE_MIN,
  WHEEL_NEW_GESTURE_RATIO,
  WHEEL_NOISE,
  WHEEL_NOTCH_MIN,
  WHEEL_QUIET_MS,
  WHEEL_RESET_MS,
  WHEEL_TRIGGER,
} from "./config";

// Pure state machine: no DOM, no timers. It is fed one wheel event at a time and
// answers "turn the page?" (1 = next, -1 = prev, null = no).

export type WheelIntent = 1 | -1;

interface WheelLock {
  // notch: a discrete mouse click, free again as soon as the stage is idle
  // stream: a trackpad flick with inertia, free only after it dies down
  kind: "notch" | "stream";
  since: number;
}

export interface WheelState {
  acc: number;
  lastTime: number;
  lastDy: number;
  lock: WheelLock | null;
}

export interface WheelInput {
  dx: number;
  dy: number;
  /** event.timeStamp, in ms */
  time: number;
  /** Line/page deltaMode events are always discrete mouse notches */
  discrete: boolean;
  /** Stage phase is idle, so a gesture may start a move */
  canAct: boolean;
  /** When the last transition ended; null while one is running */
  settledAt: number | null;
}

export interface WheelResult {
  state: WheelState;
  intent: WheelIntent | null;
}

export const createWheelState = (): WheelState => ({
  acc: 0,
  lastTime: -Infinity,
  lastDy: 0,
  lock: null,
});

// Vertical wins only when it clearly dominates; horizontal belongs to carousels
export function isVerticalIntent(dx: number, dy: number): boolean {
  return Math.abs(dy) >= WHEEL_NOISE && Math.abs(dy) > Math.abs(dx);
}

// Inertia decays steadily, so a growing or reversed delta is a fresh flick
function startsNewGesture(dy: number, prevDy: number): boolean {
  const abs = Math.abs(dy);
  if (abs < WHEEL_NEW_GESTURE_MIN) return false;
  const flipped = prevDy !== 0 && Math.sign(dy) !== Math.sign(prevDy);
  return flipped || abs >= Math.abs(prevDy) * WHEEL_NEW_GESTURE_RATIO;
}

function isLockReleased(
  lock: WheelLock,
  input: WheelInput,
  gap: number,
  prevDy: number,
): boolean {
  if (input.time - lock.since >= WHEEL_LOCK_CAP_MS) return true;
  if (lock.kind === "notch") return input.canAct;
  if (input.settledAt === null) return false; // still moving
  return gap >= WHEEL_QUIET_MS || startsNewGesture(input.dy, prevDy);
}

export function wheelStep(prev: WheelState, input: WheelInput): WheelResult {
  const { dx, dy, time } = input;
  if (!isVerticalIntent(dx, dy)) return { state: prev, intent: null };

  const gap = time - prev.lastTime;
  const lock =
    prev.lock && !isLockReleased(prev.lock, input, gap, prev.lastDy)
      ? prev.lock
      : null;
  const base = { lastTime: time, lastDy: dy };

  // Still locked: keep tracking deltas so inertia can be told from a new flick
  if (lock) return { state: { ...base, acc: 0, lock }, intent: null };

  // Stage is busy (e.g. a dock click): lock as a stream so a leftover tail
  // cannot trigger a turn the moment the stage frees up
  if (!input.canAct) {
    return {
      state: { ...base, acc: 0, lock: { kind: "stream", since: time } },
      intent: null,
    };
  }

  // Accumulate within one run of same-direction events
  const sameRun = gap < WHEEL_RESET_MS && Math.sign(dy) === Math.sign(prev.acc);
  const acc = sameRun ? prev.acc + dy : dy;
  if (Math.abs(acc) < WHEEL_TRIGGER) {
    return { state: { ...base, acc, lock: null }, intent: null };
  }

  const isNotch =
    !sameRun && (input.discrete || Math.abs(dy) >= WHEEL_NOTCH_MIN);
  return {
    state: {
      ...base,
      acc: 0,
      lock: { kind: isNotch ? "notch" : "stream", since: time },
    },
    intent: dy > 0 ? 1 : -1,
  };
}
