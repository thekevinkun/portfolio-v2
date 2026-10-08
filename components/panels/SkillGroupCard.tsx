import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SkillGroup } from "@/types/skills";
import { TECH_ICONS } from "./tech-icons";

interface SkillGroupCardProps {
  group: SkillGroup;
}

// One layer of the stack. Phones keep title + name-only chips; the highlights
// need 4 columns (lg) and then show 2 (regular tier) or all (spacious tier).
const SkillGroupCard = ({ group }: SkillGroupCardProps) => {
  const GroupIcon = TECH_ICONS[group.iconKey];

  return (
    <GlassCard className="flex flex-col justify-between gap-3 p-3 md:p-4">
      <div className="flex flex-col gap-3">
        <div className="hidden items-center justify-between font-mono text-[10px] tracking-wider text-fg-low uppercase md:flex">
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
            className="hidden size-8 shrink-0 items-center justify-center rounded-lg border border-glass-border bg-glass-fill text-fg-high md:flex"
          >
            <GroupIcon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-fg-high">
              {group.title}
            </h3>
            <p className="hidden font-mono text-[11px] text-fg-low md:block">
              {group.subtitle}
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-1.5 md:grid md:grid-cols-2">
          {group.items.map((item) => {
            const Icon = TECH_ICONS[item.iconKey];
            return (
              <li
                key={item.name}
                title={item.status === "learning" ? "Learning" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-1.5 rounded-sm border border-glass-border bg-glass-fill px-1.5 py-0.5 font-mono text-[10px] text-fg-medium md:rounded-md md:px-2 md:py-1.5 md:last:odd:col-span-2",
                  item.status === "learning" && "text-fg-low",
                )}
              >
                <Icon
                  className="hidden size-3.5 shrink-0 text-fg-high md:block"
                  aria-hidden
                />
                <span className="truncate">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="hidden flex-col gap-1.5 border-t border-glass-border pt-3 lg:tier-regular:flex">
        {group.highlights.map((text, i) => (
          <li
            key={text}
            className={cn(
              "items-start gap-1.5 text-[11px] leading-snug text-fg-medium",
              i < 2 ? "flex" : "hidden lg:tier-spacious:flex",
            )}
          >
            <Check
              className="mt-0.5 size-3 shrink-0 text-fg-high"
              aria-hidden
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default SkillGroupCard;
