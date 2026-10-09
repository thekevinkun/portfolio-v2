import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { reveal } from "@/lib/reveal";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  eyebrow?: string;
  as?: "h1" | "h2";
  titleId?: string; // used later for aria-labelledby and focus after a page change
  actions?: ReactNode;
  className?: string;
}

// The entrance here is the same on every page: title mask-reveal, text fade
const SectionHeader = ({
  title,
  subtitle,
  subtitleClassName,
  eyebrow,
  as: Heading = "h2",
  titleId,
  actions,
  className,
}: SectionHeaderProps) => {
  return (
    <header
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p
            {...reveal("fade", 0)}
            className="font-mono text-[11px] tracking-widest text-fg-low uppercase"
          >
            {eyebrow}
          </p>
        )}
        {/* overflow-hidden is the mask; pb-1 + -mb-1 keep descenders visible */}
        <Heading
          id={titleId}
          className="mt-1 -mb-1 overflow-hidden pb-1 text-2xl font-bold tracking-tight text-fg-high md:text-3xl"
        >
          <span {...reveal("mask", 0)} className="block">
            {title}
          </span>
        </Heading>
        {subtitle && (
          <p
            {...reveal("fade", 1)}
            className={cn(
              "mt-1 text-xs leading-normal text-fg-low md:text-sm",
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export default SectionHeader;
