import { BulletList, CardLabel } from "./ExperienceParts";
import { GlassCard } from "@/components/ui";
import type { ExperienceProject } from "@/types/experience";

interface ExperienceShippedCardProps {
  project: ExperienceProject;
}

// What was done on one project
const ExperienceShippedCard = ({ project }: ExperienceShippedCardProps) => (
  <GlassCard className="flex w-full flex-col gap-2 p-3 tier-regular:gap-3 tier-regular:p-4">
    <CardLabel label="Shipped" />
    <h3 className="text-sm font-bold tracking-tight text-fg-high">
      {project.name}
    </h3>
    <BulletList items={project.bullets} />
  </GlassCard>
);

export default ExperienceShippedCard;
