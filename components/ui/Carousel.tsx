"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CarouselProps {
  /** Accessible name of the whole carousel */
  label: string;
  /** Each child is one slide */
  children: ReactNode;
  /** Classes for the scrolling track (gap, padding) */
  className?: string;
  /** Classes for every slide: width and snap points decide the paging */
  slideClassName?: string;
  /** Classes for the controls row (spacing, or hide it at a breakpoint) */
  controlsClassName?: string;
}

interface View {
  page: number;
  pages: number;
  /** Scroll distance between two pages */
  stride: number;
}

const buttonClass =
  "flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-glass-from to-glass-to text-fg-high ring-1 ring-glass-border ring-inset transition-transform duration-(--duration-micro) ease-out-expo hover:ring-glass-border-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 disabled:pointer-events-none disabled:opacity-40";

// Native scroll-snap carousel: touch and trackpad scrolling come from the
// browser, the buttons and dots call scrollTo. Pages are measured from the
// layout, so the consumer only sets slide widths and snap points in CSS.
// Controls show only when there is more than one page.
const Carousel = ({
  label,
  children,
  className,
  slideClassName,
  controlsClassName,
}: CarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ page: 0, pages: 1, stride: 0 });
  const slides = Children.toArray(children);
  const count = slides.length;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const max = track.scrollWidth - track.clientWidth;

    if (items.length === 0 || max <= 1) {
      setView((prev) =>
        prev.pages === 1 && prev.page === 0
          ? prev
          : { page: 0, pages: 1, stride: 0 },
      );
      return;
    }

    // One page = the slides that fit whole in the viewport at scroll 0
    const first = items[0];
    if (!first) return;

    const origin = first.offsetLeft;

    let perView = 1;

    while (perView < items.length) {
      const item = items[perView];
      if (!item) break;

      if (item.offsetLeft - origin + item.offsetWidth > track.clientWidth + 1) {
        break;
      }

      perView += 1;
    }
    const next = items[Math.min(perView, items.length - 1)];
    if (!next) return;

    const stride = next.offsetLeft - origin;
    const pages = Math.max(1, Math.ceil(items.length / perView));
    const page =
      track.scrollLeft >= max - 1
        ? pages - 1
        : Math.min(pages - 1, Math.round(track.scrollLeft / stride));

    setView((prev) =>
      prev.page === page && prev.pages === pages && prev.stride === stride
        ? prev
        : { page, pages, stride },
    );
  }, []);

  // The resize observer also reports once on mount, so no state is set
  // synchronously in the effect.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    track.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      observer.disconnect();
    };
  }, [measure, count]);

  const goTo = (page: number) => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: page >= view.pages - 1 ? max : Math.min(page * view.stride, max),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const scrollable = view.pages > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="w-full"
    >
      {/* Touch swipes that start on the track belong to it, not to the Stage.
          Only while it can scroll, so a fully visible row still turns pages.
          tabIndex -1 keeps it out of the tab order, so ← → still turn pages. */}
      <div
        ref={trackRef}
        tabIndex={-1}
        data-stage-swipe-ignore={scrollable ? "" : undefined}
        className={cn(
          "no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          className,
        )}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className={cn("flex shrink-0", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Row height is reserved from the first render so the controls
          appearing after measurement never shift the layout */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center gap-3",
          controlsClassName,
        )}
      >
        {scrollable && (
          <>
            <button
              type="button"
              aria-label="Previous"
              disabled={view.page === 0}
              onClick={() => goTo(view.page - 1)}
              className={buttonClass}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <div className="flex items-center">
              {Array.from({ length: view.pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to page ${i + 1} of ${view.pages}`}
                  aria-current={i === view.page ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className="group flex h-6 items-center px-1 focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-(--duration-micro)",
                      i === view.page
                        ? "w-5 bg-accent"
                        : "w-1.5 bg-fg-faint group-hover:bg-fg-low",
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next"
              disabled={view.page >= view.pages - 1}
              onClick={() => goTo(view.page + 1)}
              className={buttonClass}
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
