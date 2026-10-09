import type { CSSProperties } from "react";
import type { RevealEffect } from "@/types/reveal";

interface RevealProps {
  "data-reveal": RevealEffect;
  style: CSSProperties;
}

// Spread onto an element: <p {...reveal("fade", 1)}>. The CSS does the rest.
// index = stagger slot (the CSS caps it at 8); wideIndex = a different slot
// from 1280 px up, for layouts that reorder cards there.
export function reveal(
  effect: RevealEffect,
  index = 0,
  wideIndex?: number,
): RevealProps {
  const style = {
    "--i": index,
    ...(wideIndex !== undefined && { "--i-wide": wideIndex }),
  } as CSSProperties;
  return { "data-reveal": effect, style };
}
