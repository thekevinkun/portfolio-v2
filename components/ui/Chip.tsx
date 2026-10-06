import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// Small mono tag, used for tech names
const Chip = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-glass-border bg-glass-fill px-2 py-0.5 font-mono text-[11px] text-fg-medium",
        className,
      )}
      {...props}
    />
  );
};

export default Chip;
