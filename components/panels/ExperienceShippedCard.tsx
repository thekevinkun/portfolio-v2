import { GlassCard } from "@/components/ui";
import { BulletList, CardLabel } from "./ExperienceParts";
import type { ExperienceProject } from "@/types/experience";

interface ExperienceShippedCardProps {
  project: ExperienceProject;
}

// What was done on one project
const ExperienceShippedCard = ({ project }: ExperienceShippedCardProps) => (
  <GlassCard className="flex w-full flex-col gap-2 p-3 tier-roomy:gap-3 tier-roomy:p-4">
    <CardLabel label="Shipped" />
    <h3 className="text-sm font-bold tracking-tight text-fg-high">
      {project.name}
    </h3>
    <BulletList items={project.bullets} compactCount={3} />
  </GlassCard>
);

export default ExperienceShippedCard;
