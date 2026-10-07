import { SECTIONS } from "./sections";

// Every Stage number lives here.
export const SECTION_COUNT = SECTIONS.length;

// Minimum quiet time after a transition before the next gesture (spec §4.2.1)
export const COOLDOWN_MS = 120;

// Extra wait on top of the page duration before the fallback timer ends a transition
export const FALLBACK_PADDING_MS = 100;

// Used only when --duration-page cannot be read
export const DEFAULT_PAGE_DURATION_MS = 650;

// Used only when --duration-bounce cannot be read (CSS owns the real value)
export const DEFAULT_BOUNCE_DURATION_MS = 420;

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

// --- Touch swipe (spec §4.2.1) ---
// Finger travel before the gesture is called horizontal or vertical
export const SWIPE_AXIS_LOCK_PX = 10;
// A slow drag commits at this horizontal distance...
export const SWIPE_DISTANCE_PX = 60;
// ...or a fast flick at this speed (px per ms)...
export const SWIPE_VELOCITY = 0.4;
// ...as long as it travelled at least this far, so tiny twitches don't count
export const SWIPE_FLICK_MIN_PX = 24;

// --- Dock ring (P2.7): spring for the shared-layout glide between tiles ---
export const DOCK_RING_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
} as const;

// --- A11y (P2.8) ---
// Wait this long before announcing a page, so a burst of key presses speaks once
export const ANNOUNCE_DEBOUNCE_MS = 150;
