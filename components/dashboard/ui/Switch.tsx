import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface SwitchProps extends Omit<ComponentProps<"input">, "type"> {
  // Visible text beside the switch; without it, pass aria-label
  label?: string;
}

// A visually hidden checkbox (keeps native focus, keys and form value) with a
// styled track. The track and thumb react to the checkbox through "peer".
const Switch = ({ label, className, ...props }: SwitchProps) => {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 text-sm text-fg-medium has-disabled:cursor-not-allowed",
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-pill border border-glass-border bg-glass-fill transition-colors duration-(--duration-micro) peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:opacity-50 peer-checked:*:translate-x-5 peer-checked:*:bg-on-accent"
      >
        <span className="absolute top-0.5 left-0.5 size-4.5 rounded-full bg-fg-high transition-transform duration-(--duration-micro) ease-out-expo" />
      </span>
      {label}
    </label>
  );
};

export default Switch;
