import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type PillVariant = "solid" | "glass";
type PillDot = "static" | "pulse";

interface PillProps extends ComponentPropsWithoutRef<"span"> {
  variant?: PillVariant;
  dot?: PillDot;
}

const variants: Record<PillVariant, string> = {
  solid: "bg-accent font-bold text-on-accent",
  glass:
    "border border-glass-border bg-linear-to-br from-glass-from to-glass-to text-fg-medium",
};

// Status capsule, optionally with a leading dot (pulse = ambient CSS loop)
const Pill = ({
  variant = "glass",
  dot,
  className,
  children,
  ...props
}: PillProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            variant === "solid" ? "bg-on-accent" : "bg-accent shadow-dot-glow",
            dot === "pulse" && "animate-pulse",
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Pill;
