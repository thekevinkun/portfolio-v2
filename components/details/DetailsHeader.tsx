import Image from "next/image";
import { ButtonLink, Pill } from "@/components/ui";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { ProjectDetailsEntry } from "@/types/projects";

interface DetailsHeaderProps {
  entry: ProjectDetailsEntry;
  titleId: string;
}

const pillClass = "px-2 py-0.5 font-mono text-[10px] uppercase";

// Logo, kicker, status, title, summary and the link buttons. Without a logo
// there is no image at all.
const DetailsHeader = ({ entry, titleId }: DetailsHeaderProps) => {
  const live = entry.links.find((link) => link.kind === "live");
  const repo = entry.links.find((link) => link.kind === "repo");
  const isLive = entry.status === "live";

  return (
    <header className="space-y-5">
      <div className="flex items-start gap-4 md:gap-5">
        {entry.logoUrl ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-glass-border bg-glass-fill md:size-20">
            <Image
              src={entry.logoUrl}
              alt=""
              fill
              sizes="80px"
              className="object-contain p-1.5"
            />
          </div>
        ) : null}
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-wider text-fg-low uppercase">
              {entry.kicker}
            </span>
            <Pill
              variant={isLive ? "solid" : "glass"}
              dot={isLive ? "static" : undefined}
              className={pillClass}
            >
              {PROJECT_STATUS_LABELS[entry.status]}
            </Pill>
            <Pill className={pillClass}>{entry.categoryLabel}</Pill>
          </div>
          <h2
            id={titleId}
            className="text-3xl font-extrabold tracking-tight text-fg-high md:text-4xl"
          >
            {entry.title}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-fg-medium md:text-lg">
            {entry.summary}
          </p>
        </div>
      </div>

      {live || repo ? (
        <div className="flex flex-wrap items-center gap-3">
          {live ? (
            <ButtonLink
              href={live.url}
              aria-label={`${live.label}: ${entry.title}`}
            >
              {live.label} ↗
            </ButtonLink>
          ) : null}
          {repo ? (
            <ButtonLink
              href={repo.url}
              variant={live ? "secondary" : "primary"}
              aria-label={`${repo.label}: ${entry.title}`}
            >
              {repo.label} ↗
            </ButtonLink>
          ) : null}
        </div>
      ) : null}
    </header>
  );
};

export default DetailsHeader;
