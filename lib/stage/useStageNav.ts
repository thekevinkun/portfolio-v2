"use client";

import { useCallback, type MouseEvent, type MouseEventHandler } from "react";
import { useStage } from "./stage-context";

// Dock and TabBar keep real hrefs (crawlable, open in a new tab). A plain click
// drives the Stage instead of the router, which would remount the layout.
export function useStageNav(): (
  index: number,
) => MouseEventHandler<HTMLAnchorElement> {
  const { goTo } = useStage();

  return useCallback(
    (index: number) => (e: MouseEvent<HTMLAnchorElement>) => {
      // New tab / window clicks belong to the browser
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      e.preventDefault();
      goTo(index, "dock");
    },
    [goTo],
  );
}
