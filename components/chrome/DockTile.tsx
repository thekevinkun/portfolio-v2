import Link from "next/link";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import type { Section } from "@/types/stage";
import { DOCK_ICONS } from "./dock-icons";

interface DockTileProps {
  section: Section;
  active: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

// All tiles share one size; the active one scales up (transform only, no layout shift)
const DockTile = ({ section, active, onClick }: DockTileProps) => {
  const Icon = DOCK_ICONS[section.id];

  return (
    <Link
      href={section.path}
      prefetch={false}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="group flex flex-col items-center rounded-tile focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span
        className={cn(
          "relative flex size-20 items-center justify-center rounded-tile transition-transform duration-(--duration-micro) ease-out-expo motion-reduce:transition-none group-hover:-translate-y-1",
          active
            ? "scale-115 border-2 border-accent bg-linear-to-b from-charcoal to-obsidian shadow-tile-active"
            : "border border-glass-border bg-linear-to-br from-glass-from to-glass-to group-hover:scale-105 group-hover:border-glass-border-hover",
        )}
      >
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border transition-transform duration-(--duration-micro) ease-out-expo motion-reduce:transition-none group-hover:scale-110",
            active
              ? "border-glass-border-hover bg-glass-active text-fg-high"
              : "border-glass-border bg-glass-fill text-fg-medium group-hover:bg-glass-fill-hover group-hover:text-fg-high",
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>

        {active && (
          <>
            <span
              aria-hidden="true"
              className="absolute -top-1.5 -right-1.5 size-3 animate-arrive rounded-full bg-accent motion-reduce:animate-none"
            />
            <span
              aria-hidden="true"
              className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-accent shadow-dot-glow"
            />
          </>
        )}
      </span>

      <span
        className={cn(
          "mt-3 flex items-center gap-1.5 tracking-wide transition-colors",
          active
            ? "text-xs font-semibold text-fg-high"
            : "text-[11px] font-medium text-fg-low group-hover:text-fg-high",
        )}
      >
        {active && (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-accent shadow-dot-glow"
          />
        )}
        {section.label}
      </span>
    </Link>
  );
};

export default DockTile;
