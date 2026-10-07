"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { DockTile } from "@/components/chrome";
import { SECTIONS } from "@/lib/stage/sections";
import { useActiveSection } from "@/lib/stage/useActiveSection";
import { useStageNav } from "@/lib/stage/useStageNav";

// Loaded on demand so the first bundle stays small
const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

// Desktop and tablet navigation. Phones use the TabBar instead.
const Dock = () => {
  const activeId = useActiveSection();
  const navHandler = useStageNav();

  return (
    <nav
      aria-label="Primary"
      className="hidden shrink-0 px-14 pt-2 pb-3 md:block"
    >
      <LazyMotion features={loadFeatures} strict>
        {/* Reduced motion: the ring jumps instead of gliding */}
        <MotionConfig reducedMotion="user">
          <ul className="flex items-end gap-5 py-2">
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <DockTile
                  section={section}
                  active={section.id === activeId}
                  onClick={navHandler(index)}
                />
              </li>
            ))}
          </ul>
        </MotionConfig>
      </LazyMotion>
    </nav>
  );
};

export default Dock;
