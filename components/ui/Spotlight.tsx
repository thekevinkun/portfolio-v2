"use client";

import { useEffect } from "react";

// One delegated listener for every [data-spotlight] card. It only writes the
// pointer position into --mx / --my (once per frame); the glow itself is CSS.
// Mouse and pen only: touch has no hover, so nothing is registered there.
const Spotlight = () => {
  useEffect(() => {
    const hoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!hoverDevice.matches) return;

    let frame = 0;
    let card: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${x - rect.left}px`);
      card.style.setProperty("--my", `${y - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-spotlight]")
          : null;
      if (!target) return;
      card = target;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
};

export default Spotlight;
