import DetailsFacts from "./DetailsFacts";
import DetailsHeader from "./DetailsHeader";
import DetailsScreenshots from "./DetailsScreenshots";
import DetailsStory from "./DetailsStory";
import DetailsVideo from "./DetailsVideo";
import { cn } from "@/lib/cn";
import type { ProjectDetailsEntry } from "@/types/projects";

interface ProjectDetailsContentProps {
  entry: ProjectDetailsEntry;
  titleId: string;
  // False while the overlay is closing: the video stops and the screenshot
  // viewer closes with it
  active: boolean;
}

// The overlay body (D118). The DOM order is the phone order: header, links,
// video, screenshots, at a glance, technologies, then the written part. From
// 1024px the written part moves to the left column (lg:order) and the rest to
// the right. Without a written part the right column takes the width on its
// own.
const ProjectDetailsContent = ({
  entry,
  titleId,
  active,
}: ProjectDetailsContentProps) => {
  const { details } = entry;
  const hasStory =
    Boolean(details.problem) ||
    details.features.length > 0 ||
    details.notes.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 md:space-y-10">
      <DetailsHeader entry={entry} titleId={titleId} />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div
          className={cn(
            "min-w-0 space-y-6 lg:order-2",
            hasStory ? "lg:col-span-5" : "lg:col-span-12 lg:max-w-3xl",
          )}
        >
          {details.videoId ? (
            <DetailsVideo
              title={entry.title}
              videoId={details.videoId}
              active={active}
            />
          ) : null}
          {details.screenshots.length > 0 ? (
            <DetailsScreenshots
              title={entry.title}
              screenshots={details.screenshots}
              active={active}
            />
          ) : null}
          <DetailsFacts entry={entry} />
        </div>

        {hasStory ? (
          <div className="min-w-0 space-y-10 lg:order-1 lg:col-span-7">
            <DetailsStory details={details} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectDetailsContent;
