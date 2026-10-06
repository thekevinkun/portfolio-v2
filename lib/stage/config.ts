import { SECTIONS } from "./sections";

// Every Stage number lives here. Wheel and swipe thresholds join in P2.3 / P2.4.
export const SECTION_COUNT = SECTIONS.length;

// Minimum quiet time after a transition before the next gesture (spec §4.2.1)
export const COOLDOWN_MS = 120;

// Extra wait on top of the page duration before the fallback timer ends a transition
export const FALLBACK_PADDING_MS = 100;

// Used only when --duration-page cannot be read
export const DEFAULT_PAGE_DURATION_MS = 650;
