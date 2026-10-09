import { BulletList, CardLabel, TagList } from "./ExperienceParts";
import { GlassCard } from "@/components/ui";
import { formatRange } from "@/lib/experience/format";
import type { ExperienceItem } from "@/types/experience";

interface ExperienceLearningCardProps {
  item: ExperienceItem;
}

// Stacked on narrow screens; from 1280 px a full-width band with the intro
// on the left and the courses + tags on the right
const ExperienceLearningCard = ({ item }: ExperienceLearningCardProps) => (
  <GlassCard className="flex w-full flex-col gap-2 p-3 tier-regular:gap-3 tier-regular:p-4">
    <CardLabel
      label="Learning"
      badge={formatRange(item.startDate, item.endDate)}
    />
    <div className="flex flex-col gap-2 tier-regular:gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-6">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-fg-high">
            {item.title}
          </h3>
          <p className="font-mono text-[11px] text-fg-low">
            {item.organization}
          </p>
        </div>
        <p className="text-[11px] leading-snug text-fg-medium">
          {item.summary}
        </p>
      </div>
      <div className="flex flex-col gap-2 tier-regular:gap-3">
        <BulletList items={item.bullets} />
        <TagList tags={item.tags} />
      </div>
    </div>
  </GlassCard>
);

export default ExperienceLearningCard;
