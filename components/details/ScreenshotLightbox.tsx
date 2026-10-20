"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ProjectScreenshot } from "@/types/details";
import type { OverlayPhase } from "@/types/overlay";

interface ScreenshotLightboxProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  screenshots: ProjectScreenshot[];
  index: number;
  phase: OverlayPhase;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

// A horizontal swipe at least this long moves to the next or previous image
const SWIPE_MIN_PX = 50;

const pad = (n: number) => String(n).padStart(2, "0");

const arrowClass =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/60 text-fg-high ring-1 ring-glass-border ring-inset transition-transform duration-(--duration-micro) ease-out-expo hover:ring-glass-border-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:size-12";

// The full-screen screenshot viewer: the original image as large as it fits,
// a counter, arrows, swipe, keys and a thumbnail strip. Nothing inside renders
// while it is closed, so no image loads before the first click.
const ScreenshotLightbox = ({
  dialogRef,
  title,
  screenshots,
  index,
  phase,
  onIndexChange,
  onClose,
}: ScreenshotLightboxProps) => {
  const [loadedIndex, setLoadedIndex] = useState(-1);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = screenshots.length;
  const shot = screenshots[index];
  const visible = phase !== "closed";

  // ← → move between images. On the document, so they still work when focus
  // sits on a button that just became disabled at the first or last image.
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange(index + 1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible, index, onIndexChange]);

  // Keep the current thumbnail in view
  useEffect(() => {
    if (!visible) return;
    thumbs.current[index]?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, [visible, index]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) {
      return;
    }
    onIndexChange(dx < 0 ? index + 1 : index - 1);
  };

  return (
    <dialog
      ref={dialogRef}
      data-lightbox
      data-state={phase}
      aria-label={`${title} screenshots`}
      // Esc closes only the viewer (the details overlay handles its own)
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-canvas/95 p-0 text-fg-high outline-none"
    >
      {visible && shot ? (
        <div className="flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="font-mono text-xs font-semibold tracking-wider text-fg-medium">
              {pad(index + 1)} / {pad(count)}
            </p>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Close screenshot viewer"
              className="gap-1.5"
              onClick={onClose}
            >
              <X className="size-4" aria-hidden />
              Close
            </Button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y px-2 sm:px-20"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            <div className="relative size-full">
              <Image
                key={index}
                src={shot.url}
                alt={shot.alt}
                fill
                unoptimized
                sizes="100vw"
                onLoad={() => setLoadedIndex(index)}
                onError={() => setLoadedIndex(index)}
                className={cn(
                  "object-contain transition-opacity duration-(--duration-lightbox)",
                  loadedIndex === index ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
            {count > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  disabled={index === 0}
                  onClick={() => onIndexChange(index - 1)}
                  className={cn(arrowClass, "left-2 sm:left-5")}
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  disabled={index === count - 1}
                  onClick={() => onIndexChange(index + 1)}
                  className={cn(arrowClass, "right-2 sm:right-5")}
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3 px-4 pt-3 pb-4 sm:px-6">
            <p className="sr-only" aria-live="polite">
              {`Screenshot ${index + 1} of ${count}: ${shot.alt}`}
            </p>
            {shot.caption ? (
              <p className="max-w-3xl text-center text-sm leading-relaxed text-fg-medium">
                {shot.caption}
              </p>
            ) : null}
            {count > 1 ? (
              <ul
                aria-label="Screenshots"
                className="no-scrollbar mx-auto hidden max-w-full gap-2 overflow-x-auto px-1 py-1 sm:flex"
              >
                {screenshots.map((item, i) => (
                  <li key={item.url} className="shrink-0">
                    <button
                      type="button"
                      ref={(element) => {
                        thumbs.current[i] = element;
                      }}
                      aria-label={`Show screenshot ${i + 1}: ${item.alt}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => onIndexChange(i)}
                      className={cn(
                        "relative block aspect-16/10 h-12 overflow-hidden rounded-md ring-1 ring-glass-border ring-inset transition-opacity duration-(--duration-micro) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                        i === index
                          ? "opacity-100 ring-2 ring-accent"
                          : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
};

export default ScreenshotLightbox;
