import { DEFAULT_PAGE_DURATION_MS } from "./config";

// "650ms" -> 650, "0.65s" -> 650
const toMs = (value: string): number => {
  const v = value.trim();
  if (v.endsWith("ms")) return parseFloat(v);
  if (v.endsWith("s")) return parseFloat(v) * 1000;
  return Number.NaN;
};

// The CSS token is the single source of truth (reduced motion overrides it in P2.8)
export function readPageDurationMs(): number {
  if (typeof window === "undefined") return DEFAULT_PAGE_DURATION_MS;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--duration-page",
  );
  const ms = toMs(raw);
  return Number.isFinite(ms) ? ms : DEFAULT_PAGE_DURATION_MS;
}
