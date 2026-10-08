import Image from "next/image";
import { ButtonLink, Chip, Pill } from "@/components/ui";
import type { Profile } from "@/types/profile";
import type { Project } from "@/types/projects";
import FeaturedProjectCard from "./FeaturedProjectCard";

interface OverviewPanelProps {
  profile: Profile;
  featured: Project[];
}

// Base styles are the compact tier; tier-regular and tier-spacious add detail
// as the panel gets taller (see globals.css). The page always fits one screen:
// below 768px the featured cards are hidden (they live on the Projects page),
// so nothing scrolls. The hero row takes the leftover height, so the portrait
// scales to the room the text and cards leave.
const OverviewPanel = ({ profile, featured }: OverviewPanelProps) => (
  <div className="tier-container h-full">
    <div className="flex h-full flex-col gap-4 px-5 pt-3 pb-4 md:px-12 tier-regular:gap-6 tier-spacious:gap-7">
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-7 tier-spacious:gap-4">
          <p className="font-mono text-[11px] tracking-widest text-fg-low uppercase">
            <span className="text-fg-medium">{profile.roleLabel}</span>
            {" • "}
            {profile.locationLabel}
          </p>
          <h1
            id="heading-overview"
            className="text-3xl font-extrabold tracking-tight text-fg-high tier-regular:text-4xl tier-spacious:text-5xl"
          >
            {profile.name}
          </h1>
          <p className="text-base font-medium text-fg-medium tier-regular:text-xl tier-spacious:text-2xl">
            {profile.headline}
          </p>
          <p className="hidden max-w-2xl text-base leading-relaxed text-fg-medium tier-regular:block">
            {profile.intro}
          </p>
          <div className="hidden flex-wrap items-center gap-1.5 tier-regular:flex">
            {profile.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
          <div className="hidden flex-wrap items-center gap-2 tier-spacious:flex">
            {profile.focusAreas.map((area) => (
              <Pill key={area} dot="static" className="font-mono text-[11px]">
                {area}
              </Pill>
            ))}
          </div>
          {profile.resumeUrl && (
            <div className="pt-1">
              <ButtonLink href={profile.resumeUrl} download>
                Download Resume ↗
              </ButtonLink>
            </div>
          )}
        </div>

        {profile.portraitUrl && (
          <div className="relative hidden h-full min-h-0 lg:col-span-5 lg:block">
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
        className="hidden shrink-0 gap-4 md:grid md:min-h-[min(30cqh,12rem)] md:grid-cols-3"
      >
        {featured.map((project) => (
          <FeaturedProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </div>
  </div>
);

export default OverviewPanel;
