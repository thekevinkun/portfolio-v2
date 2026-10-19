// The key added to history.state while the overlay is open (D116). The old
// state is kept, so Next's own history bookkeeping survives.
const MARKER_KEY = "projectDetails";

type HistoryState = Record<string, unknown>;

function currentState(): HistoryState {
  const state: unknown = window.history.state;
  return state && typeof state === "object" ? (state as HistoryState) : {};
}

// The slug of the overlay this history entry was made for, if any
export function readDetailsMarker(): string | null {
  const value = currentState()[MARKER_KEY];
  return typeof value === "string" ? value : null;
}

// Same URL, new entry: Back closes the overlay
export function pushDetailsMarker(slug: string): void {
  try {
    window.history.pushState({ ...currentState(), [MARKER_KEY]: slug }, "");
  } catch {
    // Safari rate-limits history calls; the overlay then closes without Back
  }
}

// Removes a leftover marker (a reload while the overlay was open keeps it), so
// closing a later overlay can't reopen this one
export function clearDetailsMarker(): void {
  if (readDetailsMarker() === null) return;
  const { [MARKER_KEY]: removed, ...rest } = currentState();
  void removed;
  try {
    window.history.replaceState(rest, "");
  } catch {
    // Same rate limit; the marker then stays until the next call
  }
}
