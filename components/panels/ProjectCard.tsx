import Image from "next/image";
import { ButtonLink, Chip, GlassCard, Pill } from "@/components/ui";
import {
  ProjectDetailsButton,
  ProjectTitleTrigger,
} from "@/components/details";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import { MAX_CARD_TECH } from "@/types/limits";
import type { Project } from "@/types/projects";

interface ProjectCardProps {
  project: Project;
}

// One project in the carousel: status, summary, the first tech tags and its
// links. No hover lift: the carousel track clips anything that moves outside it.
const ProjectCard = ({ project }: ProjectCardProps) => {
  const live = project.links.find((link) => link.kind === "live");
  const repo = project.links.find((link) => link.kind === "repo");
  const isLive = project.status === "live";
  const hiddenTech = project.tech.length - MAX_CARD_TECH;

  return (
    <GlassCard className="flex h-full w-full flex-col justify-between gap-3 p-3 transition-colors hover:border-glass-border-hover tier-regular:min-h-56 tier-regular:p-4 tier-spacious:min-h-72 tier-spacious:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] tracking-wider text-fg-low uppercase">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-accent"
            />
            <span className="truncate">{project.kicker}</span>
          </span>
          <Pill
            variant={isLive ? "solid" : "glass"}
            dot={isLive ? "static" : undefined}
            className="shrink-0 px-2 py-0.5 font-mono text-[10px] uppercase"
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </Pill>
        </div>

        <div className="flex items-start gap-3">
          {project.iconUrl ? (
            <Image
              src={project.iconUrl}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-xl border border-glass-border bg-glass-fill object-contain"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass-fill text-lg font-bold text-fg-high"
            >
              {project.title.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-fg-high">
              {project.hasDetails ? (
                <ProjectTitleTrigger
                  slug={project.slug}
                  title={project.title}
                />
              ) : (
                project.title
              )}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-fg-low">
              {project.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Tags and links share the bottom, so they line up across cards
          whatever the summary length */}
      <div className="flex flex-col gap-3">
        <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, MAX_CARD_TECH).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
          {hiddenTech > 0 && (
            <li>
              <Chip>
                +{hiddenTech}
                <span className="sr-only"> more technologies</span>
              </Chip>
            </li>
          )}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          {live && (
            <ButtonLink
              href={live.url}
              size="sm"
              aria-label={`${live.label}: ${project.title}`}
            >
              {live.label} ↗
            </ButtonLink>
          )}
          {repo && (
            <ButtonLink
              href={repo.url}
              variant={live ? "secondary" : "primary"}
              size="sm"
              aria-label={`${repo.label}: ${project.title}`}
            >
              {repo.label} ↗
            </ButtonLink>
          )}
          {project.hasDetails && (
            <ProjectDetailsButton slug={project.slug} title={project.title} />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default ProjectCard;
