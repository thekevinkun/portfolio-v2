"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useProjectDetails } from "@/lib/details/details-context";

interface ProjectTitleTriggerProps {
  slug: string;
  title: string;
  // A small arrow that signals the title opens something (Overview cards)
  arrow?: boolean;
  className?: string;
}

// A project title that opens its details (D114). It goes inside the card's
// heading; callers show it only when the project has details.
const ProjectTitleTrigger = ({
  slug,
  title,
  arrow = false,
  className,
}: ProjectTitleTriggerProps) => {
  const { open } = useProjectDetails();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={`Open details: ${title}`}
      onClick={() => open(slug)}
      className={cn(
        "group/title inline-flex max-w-full items-center gap-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <span className="underline-offset-4 group-hover/title:underline">
        {title}
      </span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 text-fg-low transition-transform duration-(--duration-micro) ease-out-expo group-hover/title:translate-x-0.5 group-hover/title:text-fg-high"
        />
      ) : null}
    </button>
  );
};

export default ProjectTitleTrigger;
