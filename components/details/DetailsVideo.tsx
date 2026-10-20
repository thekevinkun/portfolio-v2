"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DETAILS_IMAGE_SIZES } from "@/lib/details/config";
import DetailsSection from "./DetailsSection";

interface DetailsVideoProps {
  title: string;
  videoId: string;
  // The first screenshot, from our own Blob; none = a plain panel
  posterUrl?: string;
  // False while the overlay is closing, so the video stops at once
  active: boolean;
}

// Click-to-load (D119): nothing is requested from YouTube until the click.
// youtube-nocookie, no sandbox (it can break playback).
const DetailsVideo = ({
  title,
  videoId,
  posterUrl,
  active,
}: DetailsVideoProps) => {
  const [started, setStarted] = useState(false);
  const [wasActive, setWasActive] = useState(active);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // When the overlay starts closing, drop back to the cover (stops the video)
  if (wasActive !== active) {
    setWasActive(active);
    if (!active) setStarted(false);
  }

  // The button is gone after the click; keep keyboard focus in the player
  useEffect(() => {
    if (started) frameRef.current?.focus();
  }, [started]);

  return (
    <DetailsSection title="Demo video">
      <div className="space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-glass-border bg-glass-fill">
          {started ? (
            <iframe
              ref={frameRef}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
              title={`${title} demo video`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <button
              type="button"
              aria-label={`Play the ${title} demo video`}
              onClick={() => setStarted(true)}
              className="group absolute inset-0 flex items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
            >
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt=""
                  fill
                  sizes={DETAILS_IMAGE_SIZES}
                  loading="eager"
                  className="object-cover object-top"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-canvas/70 via-canvas/20 to-canvas/30"
              />
              <span
                aria-hidden="true"
                className="relative flex size-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-glow-white transition-transform duration-(--duration-micro) ease-out-expo group-hover:scale-110"
              >
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-4 font-mono text-[11px] tracking-wider text-fg-high uppercase"
              >
                Play video
              </span>
            </button>
          )}
        </div>
        {/* Also the way out when the video does not allow embedding */}
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-fg-low underline-offset-4 hover:text-fg-high hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </DetailsSection>
  );
};

export default DetailsVideo;
