"use client";

import { useEffect } from "react";
import { SECTION_COUNT } from "./config";
import { canInnerScroll } from "./scroll-guard";
import { useStage } from "./stage-context";

type KeyIntent =
  | { type: "step"; delta: 1 | -1; scroll?: 1 | -1 }
  | { type: "goTo"; index: number; scroll?: 1 | -1 };

// Key -> what it asks for. `scroll` marks keys that a focused inner scroller owns first.
function resolveKey(key: string): KeyIntent | null {
  switch (key) {
    case "ArrowRight":
      return { type: "step", delta: 1 };
    case "ArrowLeft":
      return { type: "step", delta: -1 };
    case "PageDown":
      return { type: "step", delta: 1, scroll: 1 };
    case "PageUp":
      return { type: "step", delta: -1, scroll: -1 };
    case "Home":
      return { type: "goTo", index: 0, scroll: -1 };
    case "End":
      return { type: "goTo", index: SECTION_COUNT - 1, scroll: 1 };
  }
  // 1-5 jump straight to a page
  if (/^[1-9]$/.test(key)) {
    const index = Number(key) - 1;
    if (index < SECTION_COUNT) return { type: "goTo", index };
  }
  return null;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

// Keyboard paging: arrows, PageUp/Down, Home/End, 1-5 (spec §4.2.1).
export function useStageKeys(): void {
  const { goTo, step } = useStage();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Held keys must not race through pages
      if (e.defaultPrevented || e.repeat) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditable(e.target)) return;

      const intent = resolveKey(e.key);
      if (!intent) return;
      if (intent.scroll && canInnerScroll(e.target, intent.scroll)) return;

      e.preventDefault();
      if (intent.type === "step") step(intent.delta, "keyboard");
      else goTo(intent.index, "keyboard");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, step]);
}
