"use client";

import { useSyncExternalStore } from "react";
import { RollingText } from "@/components/ui";
import { cn } from "@/lib/cn";

interface LiveClockProps {
  /** IANA zone to show; leave it out to follow the visitor's own zone (D133) */
  timeZone?: string;
  className?: string;
}

const formatTime = (timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(new Date());

// Wakes up once per minute (right after the minute changes), not every second
const subscribe = (onChange: () => void) => {
  let timer: ReturnType<typeof setTimeout>;

  const schedule = () => {
    timer = setTimeout(
      () => {
        onChange();
        schedule();
      },
      60_000 - (Date.now() % 60_000) + 50,
    );
  };

  // Browsers throttle timers in background tabs; refresh when the tab returns
  const onVisible = () => {
    if (document.visibilityState === "visible") onChange();
  };

  schedule();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
};

const LiveClock = ({ timeZone, className }: LiveClockProps) => {
  // Server snapshot is null, so server and first client render match (no hydration mismatch).
  // With no timeZone the time is the visitor's own, known only in the browser.
  const time = useSyncExternalStore(
    subscribe,
    () => formatTime(timeZone),
    () => null,
  );

  return (
    <RollingText
      value={time ?? "--:-- --"}
      className={cn("font-mono tabular-nums", className)}
    />
  );
};

export default LiveClock;
