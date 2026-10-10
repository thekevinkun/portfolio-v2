import type { ReactNode } from "react";
import { Carousel, SectionHeader } from "@/components/ui";
import {
  ExperienceLearningCard,
  ExperienceRoleCard,
  ExperienceShippedCard,
} from "./";
import { reveal } from "@/lib/reveal";
import type { ExperienceItem } from "@/types/experience";

interface ExperiencePanelProps {
  items: ExperienceItem[];
}

interface ExperienceEntry {
  key: string;
  node: ReactNode;
}

// Carousel order is Learning, Work, Shipped… (DOM order). The wide layout
// (tier-wide: ≥1280px wide and ≥500px tall panel) moves the 1st card
// (Learning) last and makes it full width, so the row is Work + 3 Shipped
// with Learning as a band below. A panel that is wide but short gets the
// carousel instead:
//   wide   row of 4, Learning wraps to a full-width band; no carousel
//   640+   2 cards, slide 2 (snap on every odd card)
//   <640   1 card, slide 1, next card peeking in
// nth-1 assumes one learning item, placed before the work items.
// overflow-clip: an entrance transform must not count as track scroll size.
const SLIDE =
  "max-sm:basis-[calc(100%-2.5rem)] max-sm:snap-start sm:basis-[calc((100%-0.75rem)/2)] sm:odd:snap-start tier-wide:basis-[calc((100%-2.25rem)/4)] tier-wide:nth-1:order-last tier-wide:nth-1:basis-full overflow-clip";

// The header uses entrance slots 0–1; cards start at 2
const FIRST_CARD = 2;

const ExperiencePanel = ({ items }: ExperiencePanelProps) => {
  const work = items.filter(
    (item) => item.kind === "work" || item.kind === "freelance",
  );
  const learning = items.filter((item) => item.kind === "education");

  const learnings: ExperienceEntry[] = learning.map((item) => ({
    key: `learning-${item.sort}`,
    node: <ExperienceLearningCard item={item} />,
  }));
  const roles: ExperienceEntry[] = work.map((item) => ({
    key: `role-${item.sort}`,
    node: <ExperienceRoleCard item={item} />,
  }));
  const shipped: ExperienceEntry[] = work.flatMap((item) =>
    (item.shipped ?? []).map((project) => ({
      key: `shipped-${item.sort}-${project.name}`,
      node: <ExperienceShippedCard project={project} />,
    })),
  );

  // Entrance order follows what the eye sees: DOM order in the carousel,
  // Work → Shipped → Learning in the wide layout (--i-wide)
  const wideOrder = [...roles, ...shipped, ...learnings];
  const cards = [...learnings, ...roles, ...shipped].map((card, i) => (
    <div
      key={card.key}
      {...reveal(
        "unfold",
        FIRST_CARD + i,
        FIRST_CARD + wideOrder.indexOf(card),
      )}
      className="flex w-full"
    >
      {card.node}
    </div>
  ));

  // From 768 to 1023px the header and the cards are one group centered in the
  // panel (my-auto, which falls back to top-aligned if the group is too tall).
  // On phones and from 1024px the group fills the panel: header on top, cards
  // centered in the space below.
  return (
    <div className="tier-container h-full">
      <div className="flex h-full flex-col px-5 pt-2 pb-3 md:px-12 tier-roomy:pb-4">
        <div className="flex min-h-0 flex-1 flex-col gap-2 md:max-lg:my-auto md:max-lg:flex-none tier-roomy:gap-4">
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
              className="gap-3 tier-wide:flex-wrap tier-wide:overflow-visible"
              slideClassName={SLIDE}
              controlsClassName="mt-2 h-8 tier-regular:mt-3 tier-regular:h-9 tier-wide:hidden"
            >
              {cards}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePanel;
