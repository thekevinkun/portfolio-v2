import type { ReactNode } from "react";
import { Carousel, SectionHeader } from "@/components/ui";
import {
  ExperienceLearningCard,
  ExperienceRoleCard,
  ExperienceShippedCard,
} from "./";
import type { ExperienceItem } from "@/types/experience";
interface ExperiencePanelProps {
  items: ExperienceItem[];
}
// Carousel order is Learning, Work, Shipped… (DOM order). From 1280 px the
// 1st card (Learning) is moved last and made full width, so the row is
// Work + 3 Shipped with Learning as a band below:
//   ≥1280  row of 4, Learning wraps to a full-width band; no carousel
//   640+   2 cards, slide 2 (snap on every odd card)
//   <640   1 card, slide 1, next card peeking in
// nth-1 assumes one learning item, placed before the work items.
const SLIDE =
  "max-sm:basis-[calc(100%-2.5rem)] max-sm:snap-start sm:basis-[calc((100%-0.75rem)/2)] sm:max-xl:odd:snap-start xl:basis-[calc((100%-2.25rem)/4)] xl:nth-1:order-last xl:nth-1:basis-full";

const ExperiencePanel = ({ items }: ExperiencePanelProps) => {
  const work = items.filter(
    (item) => item.kind === "work" || item.kind === "freelance",
  );
  const learning = items.filter((item) => item.kind === "education");

  const cards: ReactNode[] = [
    ...learning.map((item) => (
      <ExperienceLearningCard key={`learning-${item.sort}`} item={item} />
    )),
    ...work.map((item) => (
      <ExperienceRoleCard key={`role-${item.sort}`} item={item} />
    )),
    ...work.flatMap((item) =>
      (item.shipped ?? []).map((project) => (
        <ExperienceShippedCard
          key={`shipped-${item.sort}-${project.name}`}
          project={project}
        />
      )),
    ),
  ];

  return (
    <div className="tier-container h-full">
      <div className="flex h-full flex-col gap-2 px-5 pt-2 pb-4 md:px-12 tier-regular:gap-4">
        <SectionHeader
          title="Experience"
          subtitle="Independent work and self-directed study, with what I did on each project."
          subtitleClassName="hidden tier-regular:block"
          titleId="heading-experience"
          className="shrink-0"
        />

        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <Carousel
            label="Experience"
            className="gap-3 xl:flex-wrap xl:overflow-visible"
            slideClassName={SLIDE}
            controlsClassName="mt-2 h-8 tier-regular:mt-3 tier-regular:h-9 xl:hidden"
          >
            {cards}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePanel;
