"use client";

import { useEffect, useRef } from "react";
import {
  SWIPE_AXIS_LOCK_PX,
  SWIPE_DISTANCE_PX,
  SWIPE_FLICK_MIN_PX,
  SWIPE_VELOCITY,
} from "./config";
import { useStage } from "./stage-context";

interface Tracking {
  pointerId: number;
  startX: number;
  startY: number;
  startTime: number;
  /** True once the gesture is clearly horizontal */
  horizontal: boolean;
}

// Horizontal touch swipes on the stage turn pages. Vertical drags are left to the
// browser (touch-action: pan-y), so inner scrolling still works on phones.
export function useStageSwipe(): void {
  const { step } = useStage();
  const trackingRef = useRef<Tracking | null>(null);

  useEffect(() => {
    const reset = () => {
      trackingRef.current = null;
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      // A second finger means pinch or multi-touch: not a swipe
      if (!e.isPrimary) return reset();

      const target = e.target instanceof Element ? e.target : null;
      const inStage = target?.closest("[data-stage-viewport]");
      const ignored = target?.closest("[data-stage-swipe-ignore]");
      if (!inStage || ignored) return reset();

      trackingRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTime: e.timeStamp,
        horizontal: false,
      };
    };

    const onMove = (e: PointerEvent) => {
      const t = trackingRef.current;
      if (!t || e.pointerId !== t.pointerId || t.horizontal) return;

      const dx = Math.abs(e.clientX - t.startX);
      const dy = Math.abs(e.clientY - t.startY);
      if (Math.max(dx, dy) < SWIPE_AXIS_LOCK_PX) return;

      // Decide once: horizontal is ours, vertical goes back to the browser
      if (dx > dy) t.horizontal = true;
      else reset();
    };

    const onUp = (e: PointerEvent) => {
      const t = trackingRef.current;
      if (!t || e.pointerId !== t.pointerId) return;
      reset();
      if (!t.horizontal) return; // a tap or a tiny movement

      const dx = e.clientX - t.startX;
      const distance = Math.abs(dx);
      const elapsed = Math.max(e.timeStamp - t.startTime, 1);
      const isFlick =
        distance >= SWIPE_FLICK_MIN_PX && distance / elapsed >= SWIPE_VELOCITY;
      if (distance < SWIPE_DISTANCE_PX && !isFlick) return;

      // Swiping left pulls the next page in from the right
      step(dx < 0 ? 1 : -1, "swipe");
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    // The browser fires cancel when it takes over a vertical pan
    window.addEventListener("pointercancel", reset, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", reset);
    };
  }, [step]);
}
