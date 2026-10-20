"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import DetailsSection from "./DetailsSection";

interface DetailsVideoProps {
  title: string;
  videoId: string;
  // False while the overlay is closing, so the video stops at once
  active: boolean;
}

type Cover = "maxres" | "hq" | "none";

// YouTube's own cover images. maxresdefault is 1280×720 but missing for some
// videos; hqdefault is 4:3 with black bars, which object-cover crops to a clean
// 16:9 inside the frame.
const coverUrl = (videoId: string, cover: Exclude<Cover, "none">) =>
  `https://i.ytimg.com/vi/${videoId}/${cover === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;

// A missing image can come back as a tiny grey placeholder instead of an error
const MIN_COVER_WIDTH = 400;

// Click-to-load (D119): the player is not requested until the click. Only the
// cover image comes from YouTube when the overlay opens. youtube-nocookie for
// the player, no sandbox (it can break playback).
const DetailsVideo = ({ title, videoId, active }: DetailsVideoProps) => {
  const [started, setStarted] = useState(false);
  const [cover, setCover] = useState<Cover>("maxres");
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

  const nextCover = () =>
    setCover((current) => (current === "maxres" ? "hq" : "none"));

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
              className="group absolute inset-0 flex items-center justify-center hover:cursor-pointer 
                focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
            >
              {cover !== "none" ? (
                // A plain img: the image is YouTube's, so next/image would only
                // add a proxy. No referrer is sent.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl(videoId, cover)}
                  alt=""
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onLoad={(event) => {
                    if (event.currentTarget.naturalWidth < MIN_COVER_WIDTH) {
                      nextCover();
                    }
                  }}
                  onError={nextCover}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-canvas/50 via-transparent to-transparent"
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
