import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  as?: "h1" | "h2";
  titleId?: string; // used later for aria-labelledby and focus after a page change
  actions?: ReactNode;
  className?: string;
}

const SectionHeader = ({
  title,
  subtitle,
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
          <p className="font-mono text-[11px] tracking-widest text-fg-low uppercase">
            {eyebrow}
          </p>
        )}
        <Heading
          id={titleId}
          className="mt-1 text-2xl font-bold tracking-tight text-fg-high md:text-3xl"
        >
          {title}
        </Heading>
        {subtitle && (
          <p className="mt-1 text-xs leading-normal text-fg-low md:text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export default SectionHeader;
