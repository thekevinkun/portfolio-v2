import {
  DEFAULT_LIGHTBOX_DURATION_MS,
  DEFAULT_OVERLAY_DURATION_MS,
} from "./config";

// Reads a duration token (e.g. "400ms" or "0.4s") from the CSS variables
function readDurationMs(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  if (raw.endsWith("ms")) return value;
  if (raw.endsWith("s")) return value * 1000;
  return fallback;
}

export function readOverlayDurationMs(): number {
  return readDurationMs("--duration-overlay", DEFAULT_OVERLAY_DURATION_MS);
}

export function readLightboxDurationMs(): number {
  return readDurationMs("--duration-lightbox", DEFAULT_LIGHTBOX_DURATION_MS);
}
