import type { ReactNode } from "react";

interface DetailsSectionProps {
  title: string;
  // A small count or note next to the title
  meta?: string;
  children: ReactNode;
}

// A titled block of the overlay
const DetailsSection = ({ title, meta, children }: DetailsSectionProps) => (
  <section className="space-y-3">
    <h3 className="flex items-baseline gap-2 text-lg font-bold tracking-tight text-fg-high">
      {title}
      {meta ? (
        <span className="font-mono text-xs font-normal text-fg-low">
          {meta}
        </span>
      ) : null}
    </h3>
    {children}
  </section>
);

export default DetailsSection;
