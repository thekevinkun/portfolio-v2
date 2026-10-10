import Image from "next/image";
import { ButtonLink, Chip, Pill } from "@/components/ui";
import { FeaturedProjectCard } from "./";
import { reveal } from "@/lib/reveal";
import type { Profile } from "@/types/profile";
import type { Project } from "@/types/projects";

interface OverviewPanelProps {
  profile: Profile;
  featured: Project[];
}

// Density (panel height): the text column is complete from tier-snug (350px)
// up on tablet and desktop, with tighter sizes below 500. Phones keep their
// own rules (intro and chips from 500, focus areas from 640). The featured
// cards are compact (no summary) from 500, show the summary from 580 and the
// tech line from 640; below 500 or below 768 wide they are hidden (Projects
// shows them). The hero row takes the leftover height.
// Entrance slots: text 0–3 (same as every page), chips/pills/button 4–6,
// portrait 2 (slow fade), featured cards in their own slow one-by-one sequence.
const OverviewPanel = ({ profile, featured }: OverviewPanelProps) => (
  <div className="tier-container h-full">
    <div className="flex h-full flex-col gap-4 px-5 pt-3 pb-4 md:px-12 tier-regular:gap-6 tier-spacious:gap-7">
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-2 lg:col-span-7 tier-regular:gap-3 tier-spacious:gap-4">
          <p
            {...reveal("fade", 0)}
            className="font-mono text-[11px] tracking-widest text-fg-low uppercase"
          >
            <span className="text-fg-medium">{profile.roleLabel}</span>
            {" • "}
            {profile.locationLabel}
          </p>
          <h1
            id="heading-overview"
            className="-mb-1 overflow-hidden pb-1 text-3xl font-extrabold tracking-tight text-fg-high tier-regular:text-4xl tier-spacious:text-5xl"
          >
            <span {...reveal("mask", 1)} className="block">
              {profile.name}
            </span>
          </h1>
          <p
            {...reveal("fade", 2)}
            className="text-base font-medium text-fg-medium tier-regular:text-xl tier-spacious:text-2xl"
          >
            {profile.headline}
          </p>
          <p
            {...reveal("fade", 3)}
            className="hidden max-w-2xl text-sm leading-relaxed text-fg-medium tier-regular:block tier-regular:text-base md:tier-snug:block"
          >
            {profile.intro}
          </p>
          <div
            {...reveal("rise", 4)}
            className="hidden flex-wrap items-center gap-1.5 tier-regular:flex md:tier-snug:flex"
          >
            {profile.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
          <div
            {...reveal("rise", 5)}
            className="hidden flex-wrap items-center gap-2 tier-spacious:flex md:tier-snug:flex"
          >
            {profile.focusAreas.map((area) => (
              <Pill key={area} dot="static" className="font-mono text-[11px]">
                {area}
              </Pill>
            ))}
          </div>
          {profile.resumeUrl && (
            <div {...reveal("rise", 6)} className="pt-1">
              <ButtonLink
                href={profile.resumeUrl}
                download
                className="py-2.5 tier-regular:py-3.5"
              >
                Download Resume ↗
              </ButtonLink>
            </div>
          )}
        </div>

        {profile.portraitUrl && (
          <div
            {...reveal("appear", 2, { duration: "1600ms" })}
            className="relative hidden h-full min-h-0 lg:col-span-5 lg:block"
          >
            <div
              aria-hidden="true"
              className="bg-portrait-glow absolute inset-0"
            />
            <Image
              src={profile.portraitUrl}
              alt={`${profile.name} portrait`}
              fill
              sizes="40vw"
              className="portrait-fade object-contain"
            />
          </div>
        )}
      </div>

      <section
        aria-label="Featured projects"
        className="hidden shrink-0 gap-4 md:grid-cols-3 md:tier-regular:grid md:tier-roomy:min-h-[min(30cqh,12rem)]"
      >
        {featured.map((project, i) => (
          <div
            key={project.slug}
            {...reveal("rise", i, {
              offset: "850ms",
              step: "220ms",
              duration: "900ms",
              distance: "44px",
            })}
            className="grid min-w-0 grid-cols-1"
          >
            <FeaturedProjectCard project={project} />
          </div>
        ))}
      </section>
    </div>
  </div>
);

export default OverviewPanel;
