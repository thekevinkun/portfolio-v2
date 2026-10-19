import { DEFAULT_OVERLAY_DURATION_MS } from "./config";

// Reads --duration-overlay (e.g. "400ms" or "0.4s") from the CSS tokens
export function readOverlayDurationMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--duration-overlay")
    .trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return DEFAULT_OVERLAY_DURATION_MS;
  if (raw.endsWith("ms")) return value;
  if (raw.endsWith("s")) return value * 1000;
  return DEFAULT_OVERLAY_DURATION_MS;
}
