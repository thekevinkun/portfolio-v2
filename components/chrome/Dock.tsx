"use client";

import { DockTile } from "@/components/chrome";
import { SECTIONS } from "@/lib/stage/sections";
import { useActiveSection } from "@/lib/stage/useActiveSection";
import { useStageNav } from "@/lib/stage/useStageNav";

// Desktop and tablet navigation. Phones use the TabBar instead.
const Dock = () => {
  const activeId = useActiveSection();
  const navHandler = useStageNav();

  return (
    <nav
      aria-label="Primary"
      className="hidden shrink-0 px-14 pt-2 pb-3 md:block"
    >
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
    </nav>
  );
};

export default Dock;
