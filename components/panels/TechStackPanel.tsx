import { Carousel, SectionHeader } from "@/components/ui";
import { SkillGroupCard } from "./";
import { reveal } from "@/lib/reveal";
import type { SkillGroup } from "@/types/skills";

interface TechStackPanelProps {
  groups: SkillGroup[];
}

// Paging by width (gap-3 = 0.75rem). A card needs about 280px for its
// one-line highlights, which sets the breakpoints:
//   ≥1280  4 cards, no carousel
//   640+   2 cards, slide 2 (snap on every odd card)
//   <640   1 card, slide 1, with the next card peeking in
// overflow-clip: an entrance transform must not count as track scroll size.
const SLIDE =
  "max-sm:basis-[calc(100%-2.5rem)] max-sm:snap-start sm:basis-[calc((100%-0.75rem)/2)] sm:snap-align-none sm:odd:snap-start xl:basis-[calc((100%-2.25rem)/4)] overflow-clip";

// From 768 to 1023px the header and the cards are one group centered in the
// panel (my-auto, which falls back to top-aligned if the group is too tall).
// On phones and from 1024px the group fills the panel: header on top, cards
// centered in the space below.
const TechStackPanel = ({ groups }: TechStackPanelProps) => (
  <div className="tier-container h-full">
    <div className="flex h-full flex-col px-5 pt-2 pb-4 md:px-12">
      <div className="flex min-h-0 flex-1 flex-col gap-2 md:max-lg:my-auto md:max-lg:flex-none tier-regular:gap-4">
        <SectionHeader
          title="Tech Stack"
          subtitle="Grouped by layer. Everything here has shipped in a real project."
          subtitleClassName="hidden tier-regular:block"
          titleId="heading-tech-stack"
          className="shrink-0"
        />

        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <Carousel
            label="Tech stack by layer"
            className="gap-3"
            slideClassName={SLIDE}
            controlsClassName="mt-2 h-8 tier-regular:mt-3 tier-regular:h-9 xl:hidden"
          >
            {groups.map((group, i) => (
              <div
                key={group.indexLabel}
                {...reveal("from-left", 2 + i)}
                className="flex w-full"
              >
                <SkillGroupCard group={group} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  </div>
);

export default TechStackPanel;
