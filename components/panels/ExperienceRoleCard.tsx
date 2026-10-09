import { BulletList, CardLabel, TagList } from "./ExperienceParts";
import { GlassCard } from "@/components/ui";
import { formatRange } from "@/lib/experience/format";
import type { ExperienceItem } from "@/types/experience";

interface ExperienceRoleCardProps {
  item: ExperienceItem;
}

// The role itself: title, organization, summary, stack tags
const ExperienceRoleCard = ({ item }: ExperienceRoleCardProps) => (
  <GlassCard className="flex w-full flex-col gap-2 p-3 tier-regular:gap-3 tier-regular:p-4">
    <CardLabel label="Work" badge={formatRange(item.startDate, item.endDate)} />
    <div>
      <h3 className="text-sm font-bold tracking-tight text-fg-high">
        {item.title}
      </h3>
      <p className="font-mono text-[11px] text-fg-low">{item.organization}</p>
    </div>
    <p className="text-[11px] leading-snug text-fg-medium">
      {item.summaryShort ? (
        <>
          <span className="xl:hidden">{item.summary}</span>
          <span className="hidden xl:inline">{item.summaryShort}</span>
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
