import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldBase } from "./field-styles";

// Native <select>: free keyboard support and mobile pickers
const Select = ({ className, ...props }: ComponentProps<"select">) => {
  // The open list is drawn by the browser, so the options get their own colors
  return (
    <select
      className={cn(fieldBase, "pr-8 *:bg-obsidian *:text-fg-high", className)}
      {...props}
    />
  );
};

export default Select;
