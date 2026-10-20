"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { Carousel } from "@/components/ui";
import { useLightbox } from "@/lib/details/useLightbox";
import type { ProjectScreenshot } from "@/types/details";
import DetailsSection from "./DetailsSection";
import ScreenshotLightbox from "./ScreenshotLightbox";

interface DetailsScreenshotsProps {
  title: string;
  screenshots: ProjectScreenshot[];
  // False while the details overlay is closing (the viewer closes with it)
  active: boolean;
}

const SIZES = "(min-width: 1024px) 40vw, 100vw";

// One screenshot per view in a 16:10 frame cropped from the top (D120). Each
// frame is a button that opens the full-size viewer. The Carousel shows its
// controls only when there is more than one.
const DetailsScreenshots = ({
  title,
  screenshots,
  active,
}: DetailsScreenshotsProps) => {
  const openers = useRef<(HTMLButtonElement | null)[]>([]);

  // After the viewer closes, show the slide it ended on and focus its button
  const handleClosed = useCallback((index: number) => {
    const button = openers.current[index];
    if (!button) return;
    button.scrollIntoView({ inline: "start", block: "nearest" });
    button.focus({ preventScroll: true });
  }, []);

  const lightbox = useLightbox({
    count: screenshots.length,
    active,
    onClosed: handleClosed,
  });

  return (
    <DetailsSection title="Screenshots">
      <Carousel
        label={`${title} screenshots`}
        className="gap-3"
        slideClassName="basis-full snap-start"
        controlsClassName="mt-3"
      >
        {screenshots.map((shot, index) => (
          <figure key={shot.url} className="w-full">
            <button
              type="button"
              ref={(element) => {
                openers.current[index] = element;
              }}
              aria-label={`Enlarge screenshot ${index + 1} of ${screenshots.length}: ${shot.alt}`}
              onClick={() => lightbox.openAt(index)}
              className="group relative block aspect-16/10 w-full cursor-zoom-in overflow-hidden rounded-xl border border-glass-border bg-glass-fill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={shot.url}
                alt=""
                fill
                sizes={SIZES}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover object-top"
              />
              <span
                aria-hidden="true"
                className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-canvas/70 text-fg-high ring-1 ring-glass-border ring-inset transition-transform duration-(--duration-micro) ease-out-expo group-hover:scale-110"
              >
                <Maximize2 className="size-4" />
              </span>
            </button>
            {shot.caption ? (
              <figcaption className="mt-2 text-xs leading-relaxed text-fg-low">
                {shot.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </Carousel>

      <ScreenshotLightbox
        dialogRef={lightbox.dialogRef}
        title={title}
        screenshots={screenshots}
        index={lightbox.index}
        phase={lightbox.phase}
        onIndexChange={lightbox.goTo}
        onClose={lightbox.close}
      />
    </DetailsSection>
  );
};

export default DetailsScreenshots;
