import { ButtonLink, Chip, GlassCard, Pill } from "@/components/ui";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { Project } from "@/types/projects";

interface ProjectCardProps {
  project: Project;
}

// One project in the carousel: status, summary, every tech tag and its links.
// No hover lift: the carousel track clips anything that moves outside it.
const ProjectCard = ({ project }: ProjectCardProps) => {
  const live = project.links.find((link) => link.kind === "live");
  const repo = project.links.find((link) => link.kind === "repo");
  const isLive = project.status === "live";

  return (
    <GlassCard className="flex w-full flex-col justify-between gap-3 p-3 transition-colors hover:border-glass-border-hover tier-regular:min-h-56 tier-regular:p-4 tier-spacious:min-h-72 tier-spacious:p-5">
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
          {/* logoUrl renders here in P5 (Blob uploads); initial until then */}
          <div
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass-fill text-lg font-bold text-fg-high"
          >
            {project.title.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-fg-high">
              {project.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-fg-low">
              {project.summary}
            </p>
          </div>
        </div>

        <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
      </div>

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
      </div>
    </GlassCard>
  );
};

export default ProjectCard;
