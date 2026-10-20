import Image from "next/image";
import { ButtonLink, Pill } from "@/components/ui";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { ProjectDetailsEntry } from "@/types/projects";

interface DetailsHeaderProps {
  entry: ProjectDetailsEntry;
  titleId: string;
}

const pillClass = "px-2 py-0.5 font-mono text-[10px] uppercase";

// The logo is wide (icon and name), shown plain on the page with no box.
// Height grows with the width; the width is only a cap, so a wider logo
// shrinks to fit and a squarer one stays at full height.
const LOGO_BOX = "relative h-10 w-44 shrink-0 md:h-14 md:w-56 lg:h-20 lg:w-64";

// Kicker, status, title and summary on the left; the logo at the top right
// from 768px and above the title on phones; then the link buttons.
const DetailsHeader = ({ entry, titleId }: DetailsHeaderProps) => {
  const live = entry.links.find((link) => link.kind === "live");
  const repo = entry.links.find((link) => link.kind === "repo");
  const isLive = entry.status === "live";

  return (
    <header className="space-y-5">
      {/* The logo comes second in the DOM so the title is read first; it is
          moved above on phones and to the right from md with flex order */}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="min-w-0 flex-1 space-y-3">
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

        {entry.logoUrl ? (
          // Decorative: the name is already the title
          <div aria-hidden="true" className={LOGO_BOX}>
            <Image
              src={entry.logoUrl}
              alt=""
              fill
              sizes="256px"
              className="object-contain object-left md:object-right"
            />
          </div>
        ) : null}
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
