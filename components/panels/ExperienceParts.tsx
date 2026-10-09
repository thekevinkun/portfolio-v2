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

// compactCount: from 1280 px only the first N bullets show (the rest are
// for the narrower, taller carousel cards)
export const BulletList = ({
  items,
  compactCount,
}: {
  items: string[];
  compactCount?: number;
}) => (
  <ul className="flex flex-col gap-1.5 tier-regular:gap-2">
    {items.map((text, i) => (
      <li
        key={text}
        className={cn(
          "flex items-start gap-1.5 text-[11px] leading-snug text-fg-medium",
          compactCount !== undefined && i >= compactCount && "xl:hidden",
        )}
      >
        <Check className="mt-0.5 size-3 shrink-0 text-fg-high" aria-hidden />
        <span>{text}</span>
      </li>
    ))}
  </ul>
);

export const TagList = ({ tags }: { tags: string[] }) => (
  <ul className="flex flex-wrap gap-1">
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
