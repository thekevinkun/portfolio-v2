import { DEFAULT_BOUNCE_DURATION_MS, DEFAULT_PAGE_DURATION_MS } from "./config";

// "650ms" -> 650, "0.65s" -> 650
const toMs = (value: string): number => {
  const v = value.trim();
  if (v.endsWith("ms")) return parseFloat(v);
  if (v.endsWith("s")) return parseFloat(v) * 1000;
  return Number.NaN;
};

// The CSS tokens are the single source of truth (reduced motion overrides them)
function readDurationMs(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const ms = toMs(raw);
  return Number.isFinite(ms) ? ms : fallback;
}

export function readPageDurationMs(): number {
  return readDurationMs("--duration-page", DEFAULT_PAGE_DURATION_MS);
}

export function readBounceDurationMs(): number {
  return readDurationMs("--duration-bounce", DEFAULT_BOUNCE_DURATION_MS);
}
