"use client";

import { useEffect, useRef } from "react";
import { WHEEL_LINE_PX, WHEEL_QUIET_MS } from "./config";
import { canInnerScroll } from "./scroll-guard";
import { useStage } from "./stage-context";
import {
  createWheelState,
  isVerticalIntent,
  wheelStep,
  type WheelState,
} from "./wheel-intent";

// Turns wheel events anywhere in the window into Stage steps (one page per gesture).
export function useStageWheel(): void {
  const { state, step } = useStage();

  // Mirrors of Stage state, so the listener is attached once
  const phaseRef = useRef(state.phase);
  const settledAtRef = useRef<number | null>(null);

  const machineRef = useRef<WheelState>(createWheelState());
  const lastTimeRef = useRef(-Infinity);
  const exemptRef = useRef(false);

  useEffect(() => {
    phaseRef.current = state.phase;
    if (state.phase === "transitioning") settledAtRef.current = null;
    else if (settledAtRef.current === null) {
      settledAtRef.current = performance.now(); // first moment after the move ended
    }
  }, [state.phase]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom arrives as ctrl+wheel

      const factor =
        e.deltaMode === 1
          ? WHEEL_LINE_PX
          : e.deltaMode === 2
            ? window.innerHeight
            : 1;
      const dx = e.deltaX * factor;
      const dy = e.deltaY * factor;
      if (!isVerticalIntent(dx, dy)) return;

      // Decide once per gesture whether an inner scroller owns it
      const time = e.timeStamp;
      if (time - lastTimeRef.current >= WHEEL_QUIET_MS) {
        exemptRef.current = canInnerScroll(e.target, dy);
      }
      lastTimeRef.current = time;
      if (exemptRef.current) return;

      const result = wheelStep(machineRef.current, {
        dx,
        dy,
        time,
        discrete: e.deltaMode !== 0,
        canAct: phaseRef.current === "idle",
        settledAt: settledAtRef.current,
      });
      machineRef.current = result.state;
      if (result.intent) step(result.intent, "wheel");
    };

    // Passive is enough: the page itself never scrolls (overflow hidden + overscroll none)
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);
}
