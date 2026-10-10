"use client";

import { useState } from "react";
import { Button, Carousel, SectionHeader } from "@/components/ui";
import { ProjectCard } from "./";
import { cn } from "@/lib/cn";
import { PROJECT_FILTERS } from "@/lib/projects/filters";
import { reveal } from "@/lib/reveal";
import type { Project, ProjectFilter } from "@/types/projects";

interface ProjectsPanelProps {
  projects: Project[];
}

// Paging by width (gap-3 = 0.75rem); snap points sit on the first card of
// each page so a swipe or an arrow always lands on a whole page:
//   ≥1280  3 cards, snap on cards 1, 4, 7…
//   640+   2 cards, snap on cards 1, 3, 5…
//   <640   1 card, snap on every card, next card peeking in
// overflow-clip: an entrance transform must not count as track scroll size.
const SLIDE =
  "max-sm:basis-[calc(100%-2.5rem)] max-sm:snap-start sm:basis-[calc((100%-0.75rem)/2)] sm:max-xl:odd:snap-start xl:basis-[calc((100%-1.5rem)/3)] xl:nth-[3n+1]:snap-start overflow-clip";

// From 768 to 1023px header, filters and cards are one group centered in the
// panel (my-auto, which falls back to top-aligned if the group is too tall).
// On phones and from 1024px the group fills the panel: header on top, cards
// centered in the space below.
const ProjectsPanel = ({ projects }: ProjectsPanelProps) => {
  // Only filters that have projects, in the canonical order
  const filters = PROJECT_FILTERS.filter((filter) =>
    projects.some((project) => project.filter === filter.id),
  );
  const [active, setActive] = useState<ProjectFilter>(
    filters[0]?.id ?? "full-stack",
  );
  // After the first filter click the new cards cascade in with no wait
  const [switched, setSwitched] = useState(false);

  const visible = projects.filter((project) => project.filter === active);
  const activeLabel =
    filters.find((filter) => filter.id === active)?.label ?? "";

  return (
    <div className="tier-container h-full">
      <div className="flex h-full flex-col px-5 pt-2 pb-4 md:px-12">
        <div className="flex min-h-0 flex-1 flex-col gap-2 md:max-lg:my-auto md:max-lg:flex-none tier-regular:gap-4">
          <SectionHeader
            title="Projects"
            subtitle="Selected work, from AI SaaS to command-line tools. Pick a category, then open the demo or the code."
            subtitleClassName="hidden tier-regular:block"
            titleId="heading-projects"
            className="shrink-0"
          />

          <div
            role="group"
            aria-label="Filter projects"
            {...reveal("rise", 2)}
            className="flex shrink-0 flex-wrap items-center gap-1.5 tier-regular:gap-2"
          >
            {filters.map((filter) => {
              const selected = filter.id === active;
              return (
                <Button
                  key={filter.id}
                  variant={selected ? "primary" : "secondary"}
                  size="sm"
                  aria-pressed={selected}
                  onClick={() => {
                    setActive(filter.id);
                    setSwitched(true);
                  }}
                  className={cn(
                    "gap-1.5 px-3 py-1 text-[11px] uppercase tier-regular:px-4 tier-regular:py-1.5 tier-regular:text-xs",
                    !selected && "font-medium",
                  )}
                >
                  {selected && (
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-on-accent"
                    />
                  )}
                  {filter.label}
                </Button>
              );
            })}
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-center">
            {/* key: a new filter starts again from the first page */}
            <Carousel
              key={active}
              label={`${activeLabel} projects`}
              indicator="counter"
              className="gap-3"
              slideClassName={SLIDE}
              controlsClassName="mt-2 h-8 justify-end tier-regular:mt-3 tier-regular:h-9"
            >
              {visible.map((project, i) => (
                <div
                  key={project.slug}
                  {...reveal(
                    "from-right",
                    switched ? i : 3 + i,
                    switched ? { delay: "0ms" } : undefined,
                  )}
                  className="flex w-full"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </Carousel>
          </div>

          <p className="sr-only" aria-live="polite">
            {`${visible.length} ${activeLabel} projects`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPanel;
