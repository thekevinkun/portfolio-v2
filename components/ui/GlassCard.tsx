import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps extends ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
  // Cursor-following highlight on mouse devices (P3.8); on unless disabled
  spotlight?: boolean;
}

// Faked glass (translucent gradient + 1px border), no backdrop-filter (cheap)
const GlassCard = ({
  interactive = false,
  spotlight = true,
  className,
  ...props
}: GlassCardProps) => {
  return (
    <div
      data-spotlight={spotlight ? "" : undefined}
      className={cn(
        "rounded-card border border-glass-border bg-linear-to-br from-glass-from to-glass-to p-4",
        interactive &&
          "transition-transform duration-(--duration-micro) ease-out-expo hover:-translate-y-1 hover:border-glass-border-hover hover:shadow-glass-card",
        className,
      )}
      {...props}
    />
  );
};

export default GlassCard;
