import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldBase } from "./field-styles";

// Native <select>: free keyboard support and mobile pickers
const Select = ({ className, ...props }: ComponentProps<"select">) => {
  return <select className={cn(fieldBase, "pr-8", className)} {...props} />;
};

export default Select;
