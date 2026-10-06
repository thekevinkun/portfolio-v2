"use client";

import { DockTile } from "@/components/chrome";
import { SECTIONS } from "@/lib/stage/sections";
import { useActiveSection } from "@/lib/stage/useActiveSection";

// Desktop and tablet navigation. Phones use the TabBar instead.
const Dock = () => {
  const activeId = useActiveSection();

  return (
    <nav
      aria-label="Primary"
      className="hidden shrink-0 px-14 pt-2 pb-3 md:block"
    >
      <ul className="flex items-end gap-5 py-2">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <DockTile section={section} active={section.id === activeId} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Dock;
