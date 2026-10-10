import { ButtonLink, GlassCard } from "@/components/ui";
import type { Project } from "@/types/projects";

interface FeaturedProjectCardProps {
  project: Project;
}

const linkClass = "gap-1 px-2.5 py-0.5 text-[10px]";

// One featured project on the Overview: kicker, links, logo, title and summary.
// The card only exists from 500px of panel height (see OverviewPanel).
const FeaturedProjectCard = ({ project }: FeaturedProjectCardProps) => {
  const live = project.links.find((link) => link.kind === "live");
  const repo = project.links.find((link) => link.kind === "repo");

  return (
    <GlassCard
      interactive
      className="flex min-w-0 flex-col justify-between gap-3 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-fg-low uppercase">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-accent"
          />
          {project.kicker}
        </span>
        <div className="flex items-center gap-1.5">
          {live && (
            <ButtonLink
              href={live.url}
              size="sm"
              className={linkClass}
              aria-label={`${live.label}: ${project.title}`}
            >
              {live.label} ↗
            </ButtonLink>
          )}
          {repo && (
            <ButtonLink
              href={repo.url}
              variant="secondary"
              size="sm"
              className={linkClass}
              aria-label={`${repo.label}: ${project.title}`}
            >
              {repo.label} ↗
            </ButtonLink>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        {/* logoUrl renders here in P5 (Blob uploads); initial until then */}
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass-fill text-base font-bold text-fg-high"
        >
          {project.title.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-fg-high">
            {project.title}
          </h2>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-fg-low">
            {project.summary}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default FeaturedProjectCard;
