import {
  WHEEL_LOCK_CAP_MS,
  WHEEL_NOISE,
  WHEEL_RELEASE_QUIET_MS,
  WHEEL_RESET_MS,
  WHEEL_TRIGGER,
} from "./config";

// Pure state machine: no DOM, no timers. It is fed one wheel event at a time and
// answers "turn the page?" (1 = next, -1 = prev, null = no).
//
// One turn per burst (D134): after a turn the wheel is ignored until the stage
// is idle and the wheel has been silent for WHEEL_RELEASE_QUIET_MS, however
// hard the swipe, for trackpads and mice alike.

export type WheelIntent = 1 | -1;

interface WheelLock {
  since: number;
}

export interface WheelState {
  acc: number;
  lastTime: number;
  lock: WheelLock | null;
}

export interface WheelInput {
  dx: number;
  dy: number;
  /** event.timeStamp, in ms */
  time: number;
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
  lock: null,
});

// Vertical wins only when it clearly dominates; horizontal belongs to carousels
export function isVerticalIntent(dx: number, dy: number): boolean {
  return Math.abs(dy) >= WHEEL_NOISE && Math.abs(dy) > Math.abs(dx);
}

// gap = time since the previous vertical wheel event, so a burst of events
// closer together than the quiet time keeps the lock, even a big delta in it
function isLockReleased(lock: WheelLock, input: WheelInput, gap: number) {
  if (input.time - lock.since >= WHEEL_LOCK_CAP_MS) return true;
  if (!input.canAct || input.settledAt === null) return false; // still moving
  return gap >= WHEEL_RELEASE_QUIET_MS;
}

export function wheelStep(prev: WheelState, input: WheelInput): WheelResult {
  const { dx, dy, time } = input;
  if (!isVerticalIntent(dx, dy)) return { state: prev, intent: null };

  const gap = time - prev.lastTime;
  const lock =
    prev.lock && !isLockReleased(prev.lock, input, gap) ? prev.lock : null;

  // Still locked: keep the clock moving so the quiet time is measured from
  // the last event of the burst
  if (lock) return { state: { lastTime: time, acc: 0, lock }, intent: null };

  // Stage is busy (e.g. a dock click): lock so a leftover tail cannot trigger
  // a turn the moment the stage frees up
  if (!input.canAct) {
    return {
      state: { lastTime: time, acc: 0, lock: { since: time } },
      intent: null,
    };
  }

  // Accumulate within one run of same-direction events
  const sameRun = gap < WHEEL_RESET_MS && Math.sign(dy) === Math.sign(prev.acc);
  const acc = sameRun ? prev.acc + dy : dy;
  if (Math.abs(acc) < WHEEL_TRIGGER) {
    return { state: { lastTime: time, acc, lock: null }, intent: null };
  }

  return {
    state: { lastTime: time, acc: 0, lock: { since: time } },
    intent: dy > 0 ? 1 : -1,
  };
}
