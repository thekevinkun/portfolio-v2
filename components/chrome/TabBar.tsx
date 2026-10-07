"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { SECTIONS } from "@/lib/stage/sections";
import { useActiveSection } from "@/lib/stage/useActiveSection";
import { useStageNav } from "@/lib/stage/useStageNav";
import { DOCK_ICONS } from "./dock-icons";

// Phone navigation: bottom bar, five equal targets of at least 56px
const TabBar = () => {
  const activeId = useActiveSection();
  const navHandler = useStageNav();

  return (
    <nav
      aria-label="Primary"
      className="shrink-0 border-t border-glass-border bg-canvas/90 md:hidden"
    >
      <ul className="grid grid-cols-5">
        {SECTIONS.map((section, index) => {
          const Icon = DOCK_ICONS[section.id];
          const active = section.id === activeId;

          return (
            <li key={section.id}>
              <Link
                href={section.path}
                prefetch={false}
                onClick={navHandler(index)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-center text-[10px] leading-tight font-medium tracking-wide focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                  active ? "text-fg-high" : "text-fg-low",
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-0.5 w-8 rounded-pill bg-accent shadow-dot-glow"
                  />
                )}
                <Icon className="size-5" aria-hidden="true" />
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabBar;
