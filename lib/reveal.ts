import type { CSSProperties } from "react";
import type { RevealEffect } from "@/types/reveal";

interface RevealProps {
  "data-reveal": RevealEffect;
  style: CSSProperties;
}

// Everything is optional; unset values fall back to the page's own timing
export interface RevealOptions {
  /** Slot to use from 1280 px up, for layouts that reorder cards */
  wide?: number;
  /** Extra wait before this element starts, e.g. "850ms" */
  offset?: string;
  /** Spacing between slots for this element, e.g. "220ms" */
  step?: string;
  duration?: string;
  /** How far a rise / drop travels, e.g. "44px" */
  distance?: string;
  /** Replaces the page's own start wait, e.g. "0ms" */
  delay?: string;
}

// Spread onto an element: <p {...reveal("fade", 1)}>. The CSS does the rest.
// index = stagger slot (the CSS caps it at 8). A plain number as the third
// argument is the wide slot (kept for the Experience page).
export function reveal(
  effect: RevealEffect,
  index = 0,
  options?: number | RevealOptions,
): RevealProps {
  const o: RevealOptions =
    typeof options === "number" ? { wide: options } : (options ?? {});

  const style = {
    "--i": index,
    ...(o.wide !== undefined && { "--i-wide": o.wide }),
    ...(o.offset !== undefined && { "--reveal-offset": o.offset }),
    ...(o.step !== undefined && { "--reveal-step": o.step }),
    ...(o.duration !== undefined && { "--reveal-duration": o.duration }),
    ...(o.distance !== undefined && { "--reveal-distance": o.distance }),
    ...(o.delay !== undefined && { "--reveal-delay": o.delay }),
  } as CSSProperties;

  return { "data-reveal": effect, style };
}
