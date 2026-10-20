import Image from "next/image";
import { Carousel } from "@/components/ui";
import DetailsSection from "./DetailsSection";
import type { ProjectScreenshot } from "@/types/details";

interface DetailsScreenshotsProps {
  title: string;
  screenshots: ProjectScreenshot[];
}

const SIZES = "(min-width: 1024px) 40vw, 100vw";

// One screenshot per view in a 16:10 frame cropped from the top (D120). The
// Carousel shows its controls only when there is more than one.
const DetailsScreenshots = ({
  title,
  screenshots,
}: DetailsScreenshotsProps) => (
  <DetailsSection title="Screenshots">
    <Carousel
      label={`${title} screenshots`}
      className="gap-3"
      slideClassName="basis-full snap-start"
      controlsClassName="mt-3"
    >
      {screenshots.map((shot, index) => (
        <figure key={shot.url} className="w-full">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-glass-border bg-glass-fill">
            <Image
              src={shot.url}
              alt={shot.alt}
              fill
              sizes={SIZES}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover object-top"
            />
          </div>
          {shot.caption ? (
            <figcaption className="mt-2 text-xs leading-relaxed text-fg-low">
              {shot.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </Carousel>
  </DetailsSection>
);

export default DetailsScreenshots;
