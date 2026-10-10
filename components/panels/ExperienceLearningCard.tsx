import { GlassCard } from "@/components/ui";
import { BulletList, CardLabel, TagList } from "./ExperienceParts";
import { formatRange } from "@/lib/experience/format";
import type { ExperienceItem } from "@/types/experience";

interface ExperienceLearningCardProps {
  item: ExperienceItem;
}

// Stacked in the carousel; in the wide layout a full-width band with the
// intro on the left and the courses + tags on the right
const ExperienceLearningCard = ({ item }: ExperienceLearningCardProps) => (
  <GlassCard className="flex w-full flex-col gap-2 p-3 tier-roomy:gap-3 tier-roomy:p-4">
    <CardLabel
      label="Learning"
      badge={formatRange(item.startDate, item.endDate)}
    />
    <div className="flex flex-col gap-2 tier-roomy:gap-3 tier-wide:grid tier-wide:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] tier-wide:gap-6">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-sm lg:text-base font-bold tracking-tight text-fg-high">
            {item.title}
          </h3>
          <p className="font-mono text-[11px] text-fg-low">
            {item.organization}
          </p>
        </div>
        <p className="text-[11px] lg:text-[11.5px] leading-snug text-fg-medium">
          {item.summary}
        </p>
      </div>
      <div className="flex flex-col gap-2 tier-roomy:gap-3">
        <BulletList items={item.bullets} />
        <TagList tags={item.tags} className="max-sm:tier-tight:hidden" />
      </div>
    </div>
  </GlassCard>
);

export default ExperienceLearningCard;
