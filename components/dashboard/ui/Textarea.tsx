import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldBase } from "./field-styles";

const Textarea = ({ className, ...props }: ComponentProps<"textarea">) => {
  return (
    <textarea
      className={cn(fieldBase, "min-h-24 resize-y", className)}
      {...props}
    />
  );
};

export default Textarea;
