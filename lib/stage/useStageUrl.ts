"use client";

import { useEffect } from "react";
import { SECTIONS } from "./sections";
import { useStage } from "./stage-context";

// Keeps the address bar and tab title in step with the Stage, whichever input moved it.
// replaceState, not pushState: Back leaves the site (D22). It runs when a move starts,
// because `index` is already the target. Reads Stage state, never usePathname().
// The titles come from the server (profile-based), one per section.
export function useStageUrl(titles: readonly string[]): void {
  const { state } = useStage();
  const { index, source } = state;

  useEffect(() => {
    // The server already rendered the right URL and title
    if (source === "initial") return;

    const section = SECTIONS[index];
    if (!section) return;

    const title = titles[index];
    if (title) document.title = title;
    try {
      window.history.replaceState(window.history.state, "", section.path);
    } catch {
      // Safari rate-limits history calls; the page still turns, only the URL lags
    }
  }, [index, source, titles]);
}
