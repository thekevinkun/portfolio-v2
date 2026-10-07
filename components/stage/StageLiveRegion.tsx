"use client";

import { useEffect, useState } from "react";
import { ANNOUNCE_DEBOUNCE_MS } from "@/lib/stage/config";
import { getSectionAnnouncement } from "@/lib/stage/section-title";
import { SECTIONS } from "@/lib/stage/sections";
import { useStage } from "@/lib/stage/stage-context";

// One polite live region for the whole Stage. It exists empty from the first render
// (so screen readers register it) and speaks only after a page turn.
const StageLiveRegion = () => {
  const { state } = useStage();
  const { index, source } = state;
  const [message, setMessage] = useState("");

  useEffect(() => {
    // The page the visitor landed on is not announced
    if (source === "initial") return;
    const section = SECTIONS[index];
    if (!section) return;

    // Debounced: a burst of moves speaks only the page it lands on
    const id = window.setTimeout(
      () => setMessage(getSectionAnnouncement(section, index, SECTIONS.length)),
      ANNOUNCE_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [index, source]);

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
};

export default StageLiveRegion;
