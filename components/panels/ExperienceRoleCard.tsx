import { GlassCard } from "@/components/ui";
import { BulletList, CardLabel, TagList } from "./ExperienceParts";
import { formatRange } from "@/lib/experience/format";
import type { ExperienceItem } from "@/types/experience";

interface ExperienceRoleCardProps {
  item: ExperienceItem;
}

// The role itself: title, organization, summary, stack tags. The wide layout
// shows the shorter summary; the carousel shows the full one.
const ExperienceRoleCard = ({ item }: ExperienceRoleCardProps) => (
  <GlassCard className="flex w-full flex-col gap-2 p-3 tier-roomy:gap-3 tier-roomy:p-4">
    <CardLabel label="Work" badge={formatRange(item.startDate, item.endDate)} />
    <div>
      <h3 className="text-sm lg:text-base font-bold tracking-tight text-fg-high">
        {item.title}
      </h3>
      <p className="font-mono text-[11px] text-fg-low">{item.organization}</p>
    </div>
    <p className="text-[11px] lg:text-[11.5px] leading-snug text-fg-medium">
      {item.summaryShort ? (
        <>
          <span className="tier-wide:hidden max-sm:tier-tight:hidden">
            {item.summary}
          </span>
          <span className="hidden tier-wide:inline max-sm:tier-tight:inline">
            {item.summaryShort}
          </span>
        </>
      ) : (
        item.summary
      )}
    </p>
    {item.bullets.length > 0 && <BulletList items={item.bullets} />}
    <div className="mt-auto">
      <TagList tags={item.tags} />
    </div>
  </GlassCard>
);

export default ExperienceRoleCard;
