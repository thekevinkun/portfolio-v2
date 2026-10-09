import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SkillGroup } from "@/types/skills";
import { TECH_ICONS } from "./tech-icons";

interface SkillGroupCardProps {
  group: SkillGroup;
}

// One layer of the stack. Everything always shows; short panels only tighten
// padding and gaps. Highlights are written to fit one line.
const SkillGroupCard = ({ group }: SkillGroupCardProps) => {
  const GroupIcon = TECH_ICONS[group.iconKey];

  return (
    <GlassCard className="flex w-full flex-col justify-between gap-2 p-3 tier-regular:gap-4 tier-regular:p-4">
      <div className="flex flex-col gap-2 tier-regular:gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-fg-low uppercase">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            {group.indexLabel}
          </span>
          <span className="rounded-sm bg-accent px-2 py-0.5 text-[9px] font-bold text-on-accent">
            {group.badge}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-glass-border bg-glass-fill text-fg-high"
          >
            <GroupIcon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-fg-high">
              {group.title}
            </h3>
            <p className="font-mono text-[11px] text-fg-low">
              {group.subtitle}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-1 tier-regular:gap-1.5">
          {group.items.map((item) => {
            const Icon = TECH_ICONS[item.iconKey];
            return (
              <li
                key={item.name}
                title={item.status === "learning" ? "Learning" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-1.5 rounded-md border border-glass-border bg-glass-fill px-2 py-1 font-mono text-[10px] text-fg-medium last:odd:col-span-2 tier-regular:py-1.5",
                  item.status === "learning" && "text-fg-low",
                )}
              >
                <Icon className="size-3.5 shrink-0 text-fg-high" aria-hidden />
                <span className="truncate">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="flex flex-col gap-1 border-t border-glass-border pt-2 tier-regular:gap-1.5 tier-regular:pt-3">
        {group.highlights.map((text) => (
          <li
            key={text}
            className="flex items-center gap-1.5 text-[11px] leading-snug text-fg-medium"
          >
            <Check className="size-3 shrink-0 text-fg-high" aria-hidden />
            <span className="truncate" title={text}>
              {text}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default SkillGroupCard;
