import { SECTIONS } from "./sections";

// Every Stage number lives here. Swipe thresholds join in P2.4.
export const SECTION_COUNT = SECTIONS.length;

// Minimum quiet time after a transition before the next gesture (spec §4.2.1)
export const COOLDOWN_MS = 120;

// Extra wait on top of the page duration before the fallback timer ends a transition
export const FALLBACK_PADDING_MS = 100;

// Used only when --duration-page cannot be read
export const DEFAULT_PAGE_DURATION_MS = 650;

// --- Wheel (spec §4.2.1) ---
// deltaMode "lines" are converted to pixels with this factor
export const WHEEL_LINE_PX = 16;
// Ignore tiny deltas
export const WHEEL_NOISE = 2;
// Accumulator resets after this much silence
export const WHEEL_RESET_MS = 100;
// Accumulated |dy| that fires one page turn
export const WHEEL_TRIGGER = 40;
// A gesture-starting event this big is a mouse notch, not a trackpad stream
export const WHEEL_NOTCH_MIN = 80;
// A locked trackpad stream is released after this much silence
export const WHEEL_QUIET_MS = 120;
// A bigger delta after the transition is a new flick, not inertia
export const WHEEL_NEW_GESTURE_MIN = 30;
export const WHEEL_NEW_GESTURE_RATIO = 1.3;
// A lock never outlives this, even if the stream never goes quiet
export const WHEEL_LOCK_CAP_MS = 2000;
