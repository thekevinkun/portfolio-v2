import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

// Small pieces shared by the three Experience cards

export const CardLabel = ({
  label,
  badge,
}: {
  label: string;
  badge?: string;
}) => (
  <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-fg-low uppercase">
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {label}
    </span>
    {badge && (
      <span className="rounded-sm bg-accent px-2 py-0.5 text-[9px] font-bold text-on-accent">
        {badge}
      </span>
    )}
  </div>
);

// compactCount: only the first N bullets show in the wide layout and on
// phones shorter than 580px (the rest are for the roomier carousel cards)
export const BulletList = ({
  items,
  compactCount,
}: {
  items: string[];
  compactCount?: number;
}) => (
  <ul className="flex flex-col gap-1.5 tier-roomy:gap-2">
    {items.map((text, i) => (
      <li
        key={text}
        className={cn(
          "flex items-start gap-1.5 text-[11px] lg:text-[11.5px] leading-snug text-fg-medium",
          compactCount !== undefined &&
            i >= compactCount &&
            "tier-wide:hidden max-sm:tier-tight:hidden",
        )}
      >
        <Check className="mt-0.5 size-3 shrink-0 text-fg-high" aria-hidden />
        <span>{text}</span>
      </li>
    ))}
  </ul>
);

export const TagList = ({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) => (
  <ul className={cn("flex flex-wrap gap-1", className)}>
    {tags.map((tag) => (
      <li
        key={tag}
        className="rounded-md border border-glass-border bg-glass-fill px-2 py-0.5 font-mono text-[10px] text-fg-medium"
      >
        {tag}
      </li>
    ))}
  </ul>
);
